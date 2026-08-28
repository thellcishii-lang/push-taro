import { NextResponse } from 'next/server';
import { db, authAdmin } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

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
  // メール送信サービス（Resend, SendGrid, Nodemailer等）をここに接続
  console.log(`
==================================================
【要対応】紹介報酬 10,000円到達のお知らせ
--------------------------------------------------
ユーザーID: ${referrerId}
メールアドレス: ${referrerData.email}
現在の未払い累計額: ¥${totalAmount.toLocaleString()}

【振込先口座情報】
金融機関名: ${referrerData.bankAccount?.bankName || '未登録'}
支店名: ${referrerData.bankAccount?.branchName || '未登録'}
口座種別: ${referrerData.bankAccount?.accountType === 'savings' ? '普通' : '当座'}
口座番号: ${referrerData.bankAccount?.accountNumber || '未登録'}
口座名義: ${referrerData.bankAccount?.accountHolder || '未登録'}
==================================================
  `);
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

          console.log(`[警告メール送信通知] 店舗: ${shopData.name} (${customerEmail}) / 7日間猶予期限: ${gracePeriodUntil.toISOString()}`);
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

          console.log(`[強制退会完了] 店舗: ${shopData.name} (${customerEmail}) のアカウントを閉鎖しました。`);
        }
      }

      return NextResponse.json({ success: true, message: '引き落とし失敗処理完了' }, { status: 200 });
    }

    // =========================================================================
    // 2. 決済成功・新規購入・次回自動引き落とし成功時
    // =========================================================================
    if (eventType === 'payment.updated' || eventType === 'order.fulfillment.updated' || eventType === 'invoice.payment_made') {
      const payment = dataObject?.payment || dataObject?.invoice;
      const paymentStatus = payment?.status;

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
            
            // 代理店以外（Proプラン通常ユーザー）のみが10%＆1万円到達メール通知の対象
            if (referrerData?.plan === 'pro' && referrerData?.role !== 'agency') {
              const rewardAmount = Math.floor(paidAmount * 0.10);
              const currentUnpaid = (referrerData.unpaidRewardTotal || 0) + rewardAmount;

              if (currentUnpaid >= 10000) {
                await referrerRef.update({
                  unpaidRewardTotal: currentUnpaid,
                  payoutStatus: 'pending', // 手動振込待ちステータス
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
        // --- B. 新規購入時：アカウント作成 ＋ 初回紹介報酬処理 ---
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

        // 紹介コードが存在する場合の初回報酬計算・記録
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

                // Proプラン通常ユーザーの1万円到達判定
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
                referredTenantId: shopRef.id,
                rewardRate: effectiveRate,
                status: 'active',
                createdAt: FieldValue.serverTimestamp(),
              });

              await db.collection('monthly_rewards').add({
                userId: referrerId,
                sourceTenantId: shopRef.id,
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

        console.log(`[新規アカウント自動発行完了] メール: ${customerEmail}`);
        return NextResponse.json({ success: true, message: 'アカウントを自動発行しました' }, { status: 200 });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error('[square-webhook] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
