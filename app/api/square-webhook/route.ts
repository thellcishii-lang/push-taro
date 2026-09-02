import { NextResponse } from 'next/server';
import { db, authAdmin } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendEmail } from '../../../lib/mailer';

// ============================================================
// ヘルパー関数
// ============================================================

/**
 * 代理店の有効紹介数に応じて、超過累進方式で1件あたりの還元額を算出
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
 * 管理者宛に1万円到達時の手動振込依頼メールを送る
 */
async function sendAdminPayoutNotification(referrerData: any, referrerId: string, totalAmount: number) {
  const adminEmail = 'pushtaro-info@gmail.com';
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
  console.log(`[管理者通知] 送信先: ${adminEmail}`);
  console.log(emailBody);
  // 実際にメールを送信する場合はコメントを外す
  // await sendEmail({
  //   to: adminEmail,
  //   subject: `【要対応】紹介報酬の振込リクエストが発生しました（${referrerData.email}）`,
  //   html: emailBody.replace(/\n/g, '<br>'),
  // });
}

// ============================================================
// Webhook エンドポイント
// ============================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const eventType = body?.type;
    const dataObject = body?.data?.object;

    console.log(`[Square Webhook 受信] イベント種別: ${eventType}`);

    // ============================================================
    // 1. 引き落とし失敗
    // ============================================================
    if (eventType === 'invoice.payment_failed') {
      const invoice = dataObject?.invoice;
      const customerEmail = invoice?.primary_recipient?.email_address;
      const customerId = invoice?.customer_id;

      if (!customerEmail && !customerId) {
        return NextResponse.json({ received: true }, { status: 200 });
      }

      let query = db.collection('shops').where('email', '==', customerEmail);
      let shopSnap = await query.get();

      if (shopSnap.empty && customerId) {
        shopSnap = await db.collection('shops').where('squareCustomerId', '==', customerId).get();
      }

      if (!shopSnap.empty) {
        const shopDoc = shopSnap.docs[0];
        const shopData = shopDoc.data();
        const currentStatus = shopData.status || 'active';

        if (currentStatus !== 'payment_warning' && currentStatus !== 'send_disabled') {
          const gracePeriodUntil = new Date();
          gracePeriodUntil.setDate(gracePeriodUntil.getDate() + 7);
          await shopDoc.ref.update({
            status: 'payment_warning',
            failedAt: FieldValue.serverTimestamp(),
            gracePeriodUntil: gracePeriodUntil.toISOString(),
            updatedAt: FieldValue.serverTimestamp(),
          });
          console.log(`[警告] 店舗: ${shopData.name} (${customerEmail}) / 猶予期限: ${gracePeriodUntil.toISOString()}`);
        } else if (currentStatus === 'send_disabled' || currentStatus === 'payment_warning') {
          await shopDoc.ref.update({
            status: 'cancelled',
            cancelledAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          });
          const relSnap = await db.collection('referral_relations')
            .where('referredTenantId', '==', shopDoc.id)
            .get();
          relSnap.docs.forEach(async (relDoc) => {
            await relDoc.ref.update({ status: 'inactive' });
          });
          console.log(`[強制退会] 店舗: ${shopData.name} (${customerEmail})`);
        }
      }
      return NextResponse.json({ success: true, message: '引き落とし失敗処理完了' }, { status: 200 });
    }

    // ============================================================
    // 2. 決済成功
    // ============================================================
    if (eventType === 'payment.updated' || eventType === 'order.fulfillment.updated' || eventType === 'invoice.payment_made') {
      const payment = dataObject?.payment || dataObject?.invoice;
      const paymentStatus = payment?.status;
      const paymentId = payment?.id;

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

      // ============================================================
      // ① 仮登録店舗（pending_payment）の処理
      // ============================================================
      const pendingShopSnap = await db.collection('shops')
        .where('email', '==', customerEmail)
        .where('status', '==', 'pending_payment')
        .limit(1)
        .get();
　　　　　　　　　　　　// ============================================================
　　　　　　　　　　　// 🔥 冪等性チェック（最初にやる！）
　　　　　　　　　　　// ============================================================
if (paymentId) {
  const alreadyProcessed = await db.collection('shops')
    .where('squarePaymentId', '==', paymentId)
    .limit(1)
    .get();

  if (!alreadyProcessed.empty) {
    console.log(`[Webhook] 既に処理済みの支払いID: ${paymentId}`);
    return NextResponse.json({ received: true, alreadyProcessed: true }, { status: 200 });
  }
}

// ============================================================
// ① 仮登録店舗（pending_payment）の処理（処理済みチェックの後にやる）
// ============================================================

if (!pendingShopSnap.empty) {
  const pendingShopDoc = pendingShopSnap.docs[0];
  const pendingShopData = pendingShopDoc.data();
  const shopId = pendingShopDoc.id;

        // パスワード自動生成
        const generatedPassword = 'Pass-' + Math.random().toString(36).slice(-8) + 'A1!';

        // Firebase Auth ユーザー作成
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

        const plan = pendingShopData.plan || 'light';

        // 店舗更新（status: active, ownerUid 追加）
        await pendingShopDoc.ref.update({
          status: 'active',
          ownerUid: userRecord.uid,
          squareCustomerId: customerId || '',
          plan: pendingShopData.plan || 'light',
          updatedAt: FieldValue.serverTimestamp(),
        });

        // 本登録完了メール
        await sendEmail({
          to: customerEmail,
          subject: '【Push-taro】決済完了・本登録完了のお知らせ',
          html: `
            <h2>${pendingShopData.name || '店舗'} 様</h2>
            <p>決済処理が完了して、本登録が完了いたしました。</p>
            <p>この度は、Push-taroにご登録頂き誠にありがとうございます。</p>
            <p>下記のリンクより、お客様のメールアドレスとパスワードでログインしてください。</p>
             <hr />
              <p>選択プラン: ${plan.toUpperCase()}</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin">管理画面へログイン</a></p>
              <p>ログインID: ${customerEmail}</p>
              <p>パスワード: <code>${generatedPassword}</code></p>
            <hr />
        <p><strong>Push-taro.com</strong></p>
        <p>運営会社：the合同会社</p>
        <p>〒357-0123 埼玉県飯能市中藤下郷23-21</p>
        <p><a href="mailto:pushtaro-info@gmail.com">pushtaro.info@gmail.com</a></p>
          `,
        });

        // ============================================================
        // 紹介コード処理（pending の場合）
        // ============================================================
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
                // PROユーザーの場合、インボイス番号で還元率を変える
                if (referrerData?.plan === 'pro') {
                  const hasInvoice = referrerData.invoiceNumber && referrerData.invoiceNumber.trim() !== '';
                  effectiveRate = hasInvoice ? 0.10 : 0.09;
                } else {
                  effectiveRate = 0.10;
                }
                rewardAmount = Math.floor(paidAmount * effectiveRate);

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

      // ============================================================
      // ② 既存アカウントの決済（継続課金）
      // ============================================================
      const existingShopSnap = await db.collection('shops').where('email', '==', customerEmail).get();

      if (!existingShopSnap.empty) {
        const shopDoc = existingShopSnap.docs[0];
        await shopDoc.ref.update({
          status: 'active',
          squareCustomerId: customerId || shopDoc.data().squareCustomerId || '',
          failedAt: null,
          gracePeriodUntil: null,
          updatedAt: FieldValue.serverTimestamp(),
        });

        // 継続課金に伴う紹介報酬の加算処理
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
      }

      // ============================================================
      // ③ その他（フォールバック）
      // ============================================================
      console.log(`[フォールバック] 該当なし: ${customerEmail}`);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('[square-webhook] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
