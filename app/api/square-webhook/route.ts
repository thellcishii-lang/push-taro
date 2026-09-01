// app/api/square-webhook/route.ts
import { NextResponse } from 'next/server';
import { db, authAdmin } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendEmail } from '../../../lib/mailer'; // ← 新規追加（メール送信に必要）

/**
 * 代理店の有効紹介数に応じて、超過累進方式で1件あたりの還元額を算出するヘルパー関数
 */
function calculateTieredReward(activeCount: number, monthlyFee: number = 10000): number {
  if (activeCount <= 100) {
    return Math.floor(monthlyFee * 0.30); // 3,000円
  } else if (activeCount <= 200) {
    return Math.floor(monthlyFee * 0.36); // 3,600円
  } else {
    return Math.floor(monthlyFee * 0.45); // 4,500円
  }
}

/**
 * 管理者宛に1万円到達時の手動振込依頼メールを送るヘルパー関数
 */
async function sendAdminPayoutNotification(referrerData: any, referrerId: string, totalAmount: number) {
  const adminEmail = 'pushtaro.info@gmail.com';

  const emailBody = `
【要対応】紹介報酬 10,000円到達のお知らせ

ユーザーの紹介報酬累計額が10,000円に達しました。
口座情報をご確認の上、手動でお振り込み（PayPay銀行等）をお願いいたします。

----------------------------------------
■ ユーザー情報
ユーザーID: ${referrerId}
メールアドレス: ${referrerData.email}
現在の未払い累計額: ¥${totalAmount.toLocaleString()}

■ 振込先口座情報
金融機関名: ${referrerData.bankAccount?.bankName || '未登録'}
支店名: ${referrerData.bankAccount?.branchName || '未登録'}
口座種別: ${referrerData.bankAccount?.accountType === 'savings' ? '普通' : '当座'}
口座番号: ${referrerData.bankAccount?.accountNumber || '未登録'}
口座名義: ${referrerData.bankAccount?.accountHolder || '未登録'}
----------------------------------------
`;

  // コンソールへのログ出力
  console.log(`[管理者通知] 送信先: ${adminEmail}`);
  console.log(emailBody);

  // ✅ 実際にメールを送信する場合は、以下のコメントを外して sendEmail を呼び出す
  // await sendEmail({
  //   to: adminEmail,
  //   subject: `【要対応】紹介報酬の振込リクエストが発生しました（${referrerData.email}）`,
  //   html: emailBody.replace(/\n/g, '<br>'),
  // });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const eventType = body?.type;
    const dataObject = body?.data?.object;

    console.log(`[Square Webhook 受信] イベント種別: ${eventType}`);

    // =========================================================================
    // 1. 引き落とし失敗（1回目警告 or 送信停止中の次回失敗による強制退会）
    // =========================================================================
    if (eventType === 'invoice.payment_failed') {
      // ...（既存のコードはそのまま。変更なし）
      // 省略しますが、完全なファイルには含めてください
    }

    // =========================================================================
    // 2. 決済成功・新規購入・次回自動引き落とし成功時
    // =========================================================================
    if (eventType === 'payment.updated' || eventType === 'order.fulfillment.updated' || eventType === 'invoice.payment_made') {
      const payment = dataObject?.payment || dataObject?.invoice;
      const paymentStatus = payment?.status;

      // payment.updated で完了以外は無視
      if (eventType === 'payment.updated' && paymentStatus !== 'COMPLETED') {
        return NextResponse.json({ received: true }, { status: 200 });
      }

      const customerEmail = payment?.buyer_email_address || payment?.primary_recipient?.email_address || body?.related_customer_email;
      const customerId = payment?.customer_id;
      const note = payment?.note || '';
      const paidAmount = payment?.amount_money?.amount || 10000;
      const referralCode = payment?.reference_id || '';

      if (!customerEmail) {
        return NextResponse.json({ error: '顧客のメールアドレスが見つかりません' }, { status: 400 });
      }

      // ------------------------------------------------------------------
      // 【追加】① 仮登録店舗（status: pending_payment）を検索
      // ------------------------------------------------------------------
      const pendingShopSnap = await db.collection('shops')
        .where('email', '==', customerEmail)
        .where('status', '==', 'pending_payment')
        .limit(1)
        .get();

      if (!pendingShopSnap.empty) {
        // pending が見つかった → 本登録処理
        const pendingShopDoc = pendingShopSnap.docs[0];
        const pendingShopData = pendingShopDoc.data();
        const shopId = pendingShopDoc.id;

        // パスワードを自動生成
        const generatedPassword = 'Pass-' + Math.random().toString(36).slice(-8) + 'A1!';

        // Firebase Auth ユーザーを作成
        let userRecord;
        try {
          userRecord = await authAdmin.createUser({
            email: customerEmail,
            password: generatedPassword,
            emailVerified: true,
          });
        } catch (err: any) {
          if (err.code === 'auth/email-already-exists') {
            userRecord = await authAdmin.getUserByEmail(customerEmail);
            await authAdmin.updateUser(userRecord.uid, { password: generatedPassword });
          } else {
            throw err;
          }
        }

        // Firestore 店舗を本登録（status: active, ownerUid 追加）
        await pendingShopDoc.ref.update({
          status: 'active',
          ownerUid: userRecord.uid,
          squareCustomerId: customerId || '',
          plan: pendingShopData.plan || 'light',
          updatedAt: FieldValue.serverTimestamp(),
        });

        // 本登録完了メール（パスワード記載）
        await sendEmail({
          to: customerEmail,
          subject: '【プッシュ太郎】決済完了・本登録完了のお知らせ',
          html: `
            <h2>${pendingShopData.name || '店舗'} 様</h2>
            <p>決済が完了いたしました。ご登録ありがとうございます。</p>
            <p>以下のリンクより管理画面にログインし、店舗設定をお進めください。</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" style="display:inline-block;padding:12px 24px;background:#ff4500;color:#fff;border-radius:6px;text-decoration:none;">店舗画面へログイン</a></p>
            <hr />
            <p><strong>ログイン情報</strong></p>
            <p>メールアドレス: ${customerEmail}</p>
            <p>パスワード: <code style="background:#f0f0f0;padding:4px 8px;border-radius:4px;">${generatedPassword}</code></p>
            <p style="font-size:12px;color:#888;">※初回ログイン後にパスワードの変更を推奨いたします。</p>
          `,
        });

        // 紹介コードがあれば、紹介関係を作成し報酬を計算する
        if (referralCode) {
          try {
            const referrerSnapshot = await db.collection('shops')
              .where('referralCode', '==', referralCode)
              .limit(1)
              .get();

            if (!referrerSnapshot.empty) {
              const referrerDoc = referrerSnapshot.docs[0];
              const referrerData = referrerDoc.data();
              const referrerId = referrerDoc.id;

              const isAgency = referrerData.role === 'agency';
              let rewardAmount = 0;
              let effectiveRate = 0.10;

              if (isAgency) {
                const activeRelationsSnapshot = await db.collection('referral_relations')
                  .where('referrerId', '==', referrerId)
                  .where('status', '==', 'active')
                  .get();
                const currentActiveCount = activeRelationsSnapshot.size;
                rewardAmount = calculateTieredReward(currentActiveCount + 1, 10000);
                effectiveRate = rewardAmount / 10000;
              } else {
                effectiveRate = 0.10;
                rewardAmount = Math.floor(paidAmount * effectiveRate);
                // Proプラン通常ユーザーの1万円到達判定（既存ロジックと同じ）
                const currentUnpaid = (referrerData.unpaidRewardTotal || 0) + rewardAmount;
                if (currentUnpaid >= 10000) {
                  await referrerDoc.ref.update({
                    unpaidRewardTotal: currentUnpaid,
                    payoutStatus: 'pending',
                    updatedAt: FieldValue.serverTimestamp(),
                  });
                  await sendAdminPayoutNotification(referrerData, referrerId, currentUnpaid);
                } else {
                  await referrerDoc.ref.update({
                    unpaidRewardTotal: currentUnpaid,
                    updatedAt: FieldValue.serverTimestamp(),
                  });
                }
              }

              const currentMonth = new Date().toISOString().slice(0, 7);

              await db.collection('referral_relations').add({
                referrerId: referrerId,
                referredTenantId: shopId,
                rewardRate: effectiveRate,
                status: 'active',
                createdAt: FieldValue.serverTimestamp(),
              });

              await db.collection('monthly_rewards').add({
                userId: referrerId,
                sourceTenantId: shopId,
                amount: rewardAmount,
                billingMonth: currentMonth,
                status: 'unpaid',
                createdAt: FieldValue.serverTimestamp(),
              });
            }
          } catch (refError) {
            console.error('[square-webhook] 紹介報酬の処理エラー:', refError);
          }
        }

        console.log(`[決済完了・本登録] 店舗ID: ${shopId}, メール: ${customerEmail}`);
        return NextResponse.json({ success: true, message: '本登録完了しました' }, { status: 200 });
      }

// ============================================================================
// 【追加】アップグレード決済の処理（upgradeStatus: 'pending_payment' を検索）
// ============================================================================
const upgradeShopSnap = await db.collection('shops')
  .where('email', '==', customerEmail)
  .where('upgradeStatus', '==', 'pending_payment')
  .limit(1)
  .get();

if (!upgradeShopSnap.empty) {
  const upgradeDoc = upgradeShopSnap.docs[0];
  const upgradeData = upgradeDoc.data();
  const targetPlan = upgradeData.upgradeTargetPlan || 'standard';

  // アップグレード情報を確定
  const updateData: any = {
    plan: targetPlan,
    upgradeStatus: 'completed',
    upgradeCompletedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  // PROアップグレードの場合は口座情報も保存
  if (targetPlan === 'pro' && upgradeData.upgradeData?.bankAccount) {
    updateData.bankAccount = upgradeData.upgradeData.bankAccount;
    updateData.unpaidRewardTotal = 0;
    updateData.payoutStatus = 'none';
    // 会社情報も更新
    if (upgradeData.upgradeData.companyName) {
      updateData.name = upgradeData.upgradeData.companyName;
    }
    if (upgradeData.upgradeData.address) {
      updateData.address = upgradeData.upgradeData.address;
    }
    if (upgradeData.upgradeData.phone) {
      updateData.phone = upgradeData.upgradeData.phone;
    }
    if (upgradeData.upgradeData.invoiceNumber) {
      updateData.invoiceNumber = upgradeData.upgradeData.invoiceNumber;
    }
  }

  await upgradeDoc.ref.update(updateData);

  // アップグレード完了メールを送信
  const planName = targetPlan === 'pro' ? 'PRO' : 'スタンダード';
  await sendEmail({
    to: customerEmail,
    subject: `【プッシュ太郎】${planName}プランへのアップグレードが完了しました`,
    html: `
      <h2>${upgradeData.name || '店舗'} 様</h2>
      <p>${planName}プランへのアップグレードが完了しました。</p>
      <p>新プランの全機能をご利用いただけます。</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin">管理画面へログイン</a></p>
      ${targetPlan === 'pro' ? '<p>紹介報酬機能も有効になりました。ぜひご活用ください。</p>' : ''}
    `,
  });

  console.log(`[アップグレード完了] 店舗: ${upgradeData.name}, プラン: ${targetPlan}`);
  return NextResponse.json({ success: true, message: 'アップグレード完了しました' }, { status: 200 });
}


      // ------------------------------------------------------------------
      // ② pending が見つからなかった場合 → 既存の処理（既存アカウント or 新規（※通常は発生しない））
      // ------------------------------------------------------------------
      const existingShopSnap = await db.collection('shops').where('email', '==', customerEmail).get();

      if (!existingShopSnap.empty) {
        // --- A. 既存アカウントの継続引き落とし成功（復活＆継続報酬計算） ---
        const shopDoc = existingShopSnap.docs[0];
        await shopDoc.ref.update({
          status: 'active',
          squareCustomerId: customerId || shopDoc.data().squareCustomerId || '',
          failedAt: null,
          gracePeriodUntil: null,
          updatedAt: FieldValue.serverTimestamp(),
        });

        // 継続課金に伴う紹介報酬の加算処理（既存コード）
        const relSnap = await db.collection('referral_relations')
          .where('referredTenantId', '==', shopDoc.id)
          .where('status', '==', 'active')
          .limit(1)
          .get();

        if (!relSnap.empty) {
          const relData = relSnap.docs[0].data();
          const referrerRef = db.collection('shops').doc(relData.referrerId);
          const referrerDoc = await referrerRef.get();

          if (referrerDoc.exists) {
            const referrerData = referrerDoc.data();
            if (referrerData?.plan === 'pro' && referrerData?.role !== 'agency') {
              const rewardAmount = Math.floor(paidAmount * 0.10);
              const currentUnpaid = (referrerData.unpaidRewardTotal || 0) + rewardAmount;
              if (currentUnpaid >= 10000) {
                await referrerRef.update({
                  unpaidRewardTotal: currentUnpaid,
                  payoutStatus: 'pending',
                  updatedAt: FieldValue.serverTimestamp(),
                });
                await sendAdminPayoutNotification(referrerData, referrerDoc.id, currentUnpaid);
              } else {
                await referrerRef.update({
                  unpaidRewardTotal: currentUnpaid,
                  updatedAt: FieldValue.serverTimestamp(),
                });
              }
            }
          }
        }

        console.log(`[アカウント自動復活/更新] 店舗: ${shopDoc.data().name} (${customerEmail})`);
        return NextResponse.json({ success: true, message: '契約ステータスおよび報酬を更新しました' }, { status: 200 });

      } else {
        // --- B. 新規購入（pending も見つからず、既存もない） → 緊急用フォールバック（基本的には発生しない） ---
        // この部分は本来は不要ですが、念のため残します
        const temporaryPassword = Math.random().toString(36).slice(-8) + 'A1!';
        const userRecord = await authAdmin.createUser({
          email: customerEmail,
          password: temporaryPassword,
          emailVerified: true,
        });
        const uid = userRecord.uid;
        const shopRef = db.collection('shops').doc();
        await shopRef.set({
          name: note || '未設定の店舗',
          email: customerEmail,
          ownerUid: uid,
          squareCustomerId: customerId || '',
          plan: 'pro',
          status: 'active',
          createdAt: FieldValue.serverTimestamp(),
          coupon: { enabled: false, title: '', description: '', discountRate: 0 },
          linkUrl: '',
          iconUrl: '',
        });
        // 紹介コードがあれば処理（簡略化のため省略）
        console.log(`[緊急フォールバック] 新規アカウント作成: ${customerEmail}`);
        return NextResponse.json({ success: true, message: 'アカウントを自動発行しました（フォールバック）' }, { status: 200 });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error('[square-webhook] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
