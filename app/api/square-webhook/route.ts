// app/api/square-webhook/route.ts
import { NextResponse } from 'next/server';
import { db, authAdmin } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendEmail } from '../../../lib/mailer';
import { notifyAdmins } from '@/lib/error-notifier';

// ============================================================
// 管理者宛に1万円到達時の手動振込依頼メールを送る
// ============================================================
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
// メイン Webhook エンドポイント
// ============================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const eventType = body?.type;
    const dataObject = body?.data?.object;

    console.log(`[Square Webhook 受信] イベント種別: ${eventType}`);

    // ============================================================
    // 1. 引き落とし失敗（invoice.payment_failed）
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
    const currentFailedCount = shopData.failedCount || 0;
    const newFailedCount = currentFailedCount + 1;

    if (newFailedCount === 1) {
      // 1回目：警告状態にする（メールは送らない。Squareがリトライするため）
      await shopDoc.ref.update({
        status: 'payment_warning',
        failedCount: 1,
        failedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      console.log(`[決済失敗 1回目] ${customerEmail} - payment_warning`);

    } else if (newFailedCount === 2) {
      // 2回目：リマインダーメール送信
      await shopDoc.ref.update({
        failedCount: 2,
        failedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      await sendEmail({
        to: shopData.email,
        subject: '【Push-taro】決済失敗のお知らせ（再決済のお願い）',
        html: `
          <h2>${shopData.name || '店舗'} 様</h2>
          <p>ご利用料金の決済に失敗しました（2回目）。</p>
          <p>Squareよりカード情報更新のご案内が届いているかと思いますので、</p>
          <p>お手数ですがカード情報を更新いただき、再決済をお願いいたします。</p>
          <p style="color: #e53e3e; font-weight: bold;">※3回目の失敗でサービスが停止いたします。</p>
          <hr />
          <p><strong>Push-taro.com</strong></p>
           <hr />
            <p>運営会社：the合同会社</p>
            <p>〒357-0123 埼玉県飯能市中藤下郷23-21</p>
            <p><a href="mailto:pushtaro-info@gmail.com">pushtaro.info@gmail.com</a></p>
        `,
      });
      console.log(`[決済失敗 2回目] ${customerEmail} - リマインダーメール送信`);

    } else if (newFailedCount >= 3) {
      // 3回目：サービス停止（send_disabled）
      await shopDoc.ref.update({
        status: 'send_disabled',
        failedCount: 3,
        failedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      // 紹介リレーションを inactive に
      const relSnap = await db.collection('referral_relations')
        .where('referredTenantId', '==', shopDoc.id)
        .get();
      relSnap.docs.forEach(async (relDoc) => {
        await relDoc.ref.update({ status: 'inactive' });
      });

      await sendEmail({
        to: shopData.email,
        subject: '【Push-taro】決済不履行によるサービス停止のお知らせ',
        html: `
          <h2>${shopData.name || '店舗'} 様</h2>
          <p>ご利用料金の決済が3回連続で失敗したため、</p>
          <p>Push-taroのサービスを一時停止いたしました。</p>
          <p>カード情報を更新いただき、再決済が完了しましたら</p>
          <p style="font-weight: bold; color: #16a34a;">自動的にサービスが再開されます。</p>
          <hr />
          <p>再開手続きはSquareのご案内メールに従って</p>
          <p>カード情報を更新してください。</p>
          <hr />
          <p><strong>Push-taro.com</strong></p>
           <hr />
            <p>運営会社：the合同会社</p>
            <p>〒357-0123 埼玉県飯能市中藤下郷23-21</p>
            <p><a href="mailto:pushtaro-info@gmail.com">pushtaro.info@gmail.com</a></p>
        `,
      });
      console.log(`[決済失敗 3回目] ${customerEmail} - send_disabled + メール送信`);
    }
  }

  return NextResponse.json({ success: true, message: '決済失敗処理完了' }, { status: 200 });
}

    // ============================================================
    // 2. 決済成功（payment.updated / invoice.payment_made）
    // ============================================================
    if (eventType === 'payment.updated' || eventType === 'invoice.payment_made') {
      const payment = dataObject?.payment || dataObject?.invoice;
      const paymentStatus = payment?.status;

      // payment.updated の場合は COMPLETED のみ処理
      if (eventType === 'payment.updated' && paymentStatus !== 'COMPLETED') {
        return NextResponse.json({ received: true }, { status: 200 });
      }

      const customerEmail = payment?.buyer_email_address || payment?.primary_recipient?.email_address || body?.related_customer_email;
      const customerId = payment?.customer_id;
      const note = payment?.note || '';
      const paidAmount = payment?.amount_money?.amount || 10000;
      const referralCode = payment?.reference_id || '';
      const paymentId = payment?.id;

      if (!customerEmail) {
        return NextResponse.json({ error: '顧客のメールアドレスが見つかりません' }, { status: 400 });
      }

      // ============================================================
      // 🔥 冪等性チェック（支払いIDがすでに処理済みか）
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
      // ① 新規登録（pending_payment）の処理
      // ============================================================
      const pendingShopSnap = await db.collection('shops')
        .where('email', '==', customerEmail)
        .where('status', '==', 'pending_payment')
        .limit(1)
        .get();

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
          squarePaymentId: paymentId,
          failedAt: null,
          gracePeriodUntil: null,
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
            <p>
              <a 
                href="${process.env.NEXT_PUBLIC_APP_URL}/admin" 
                style="display:inline-block; padding:12px 24px; background:#ff4500; color:#fff; border-radius:6px; text-decoration:none; font-weight:bold;"
              >
                管理画面へログイン
              </a>
            </p>
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
        // 🔑 紹介報酬計算（新規契約時）
        // ============================================================
        const referrerId = pendingShopData.referrerId;
        if (referrerId) {
          try {
            const referrerDoc = await db.collection('shops').doc(referrerId).get();

            if (referrerDoc.exists) {
              const referrerData = referrerDoc.data();
              const isAgency = referrerData?.role === 'agency';
              const isPro = referrerData?.plan === 'pro' || referrerData?.role === 'pro';

              if (isAgency || isPro) {
                let baseRate = 0;

                if (isAgency) {
                  // 代理店：PROプランは30%、Standard/Lightは18%（一律）
                  baseRate = (plan === 'pro') ? 0.30 : 0.18;

                  // 代理店：インボイスなしは10%差し引き
                  const hasInvoice = referrerData?.invoiceNumber && referrerData.invoiceNumber.trim() !== '';
                  if (!hasInvoice) {
                    baseRate = baseRate * 0.9; // 30%→27%, 18%→16.2%
                  }
                } else if (isPro) {
                  // PRO会員：全プラン一律10%（インボイスなし9%）
                  const hasInvoice = referrerData?.invoiceNumber && referrerData.invoiceNumber.trim() !== '';
                  baseRate = hasInvoice ? 0.10 : 0.09;
                }

                // プラン別の月額金額
                const planPrices: Record<string, number> = { light: 1980, standard: 3800, pro: 10000 };
                const planAmount = planPrices[plan] || 1980;

                const rewardAmount = Math.floor(planAmount * baseRate);

                if (rewardAmount > 0) {
                  const currentUnpaid = (referrerData?.unpaidRewardTotal || 0) + rewardAmount;

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

                  const currentMonth = new Date().toISOString().slice(0, 7);

                  // リレーションを active に更新/作成
                  const relSnap = await db.collection('referral_relations')
                    .where('referredTenantId', '==', shopId)
                    .limit(1)
                    .get();

                  if (!relSnap.empty) {
                    await relSnap.docs[0].ref.update({
                      status: 'active',
                      rewardRate: baseRate,
                      updatedAt: FieldValue.serverTimestamp(),
                    });
                  } else {
                    await db.collection('referral_relations').add({
                      referrerId: referrerId,
                      referredTenantId: shopId,
                      rewardRate: baseRate,
                      status: 'active',
                      createdAt: FieldValue.serverTimestamp(),
                    });
                  }

                  // 月次報酬ログを追加
                  await db.collection('monthly_rewards').add({
                    userId: referrerId,
                    sourceTenantId: shopId,
                    amount: rewardAmount,
                    billingMonth: currentMonth,
                    status: 'unpaid',
                    createdAt: FieldValue.serverTimestamp(),
                  });
                }
              }
            }
          } catch (refError) {
            console.error('[square-webhook] 紹介報酬処理エラー:', refError);
          }
        }

        console.log(`[決済完了・本登録] 店舗ID: ${shopId}, メール: ${customerEmail}`);
        return NextResponse.json({ success: true, message: '本登録完了しました' }, { status: 200 });
      }

      // ============================================================
      // ② アップグレード申請中（upgradeStatus == pending_payment）の処理
      // ============================================================
      const upgradeShopSnap = await db.collection('shops')
        .where('email', '==', customerEmail)
        .where('upgradeStatus', '==', 'pending_payment')
        .limit(1)
        .get();

      if (!upgradeShopSnap.empty) {
        const upgradeShopDoc = upgradeShopSnap.docs[0];
        const upgradeShopData = upgradeShopDoc.data();
        const targetPlan = upgradeShopData.targetPlan;
        const planName = targetPlan === 'pro' ? 'PRO' : 'スタンダード';

        await upgradeShopDoc.ref.update({
          plan: targetPlan,
          upgradeStatus: 'completed',
          upgradeCompletedAt: FieldValue.serverTimestamp(),
          squarePaymentId: paymentId || '',
          failedAt: null,
          gracePeriodUntil: null,
          updatedAt: FieldValue.serverTimestamp(),
        });

        await sendEmail({
          to: customerEmail,
          subject: `【Push-taro】${planName}プランへのアップグレードが完了しました`,
          html: `
            <h2>${upgradeShopData.name || '店舗'} 様</h2>
            <p>${planName}プランへのアップグレードが完了いたしました。</p>
            <p>アップグレードされた機能をご利用いただけます。</p>
            <p>
              <a 
                href="${process.env.NEXT_PUBLIC_APP_URL}/admin" 
                style="display:inline-block; padding:12px 24px; background:#ff4500; color:#fff; border-radius:6px; text-decoration:none; font-weight:bold;"
              >
                管理画面へログイン
              </a>
            </p>
            ${targetPlan === 'pro' ? '<p>PROプラン特典として、紹介報酬機能も有効になりました。</p>' : ''}
            <hr />
            <p><strong>Push-taro.com</strong></p>
            <p>運営会社：the合同会社</p>
            <p>〒357-0123 埼玉県飯能市中藤下郷23-21</p>
            <p><a href="mailto:pushtaro-info@gmail.com">pushtaro.info@gmail.com</a></p>
          `,
        });

        console.log(`[アップグレード完了] 店舗: ${upgradeShopData.name} (${customerEmail}) -> プラン: ${targetPlan}`);
        return NextResponse.json({ success: true, message: 'アップグレード完了しました' }, { status: 200 });
      }

      // ============================================================
      // ③ 既存アカウントの継続課金
      // ============================================================
      const existingShopSnap = await db.collection('shops').where('email', '==', customerEmail).get();

      if (!existingShopSnap.empty) {
        const shopDoc = existingShopSnap.docs[0];
        const shopData = shopDoc.data();
        const plan = shopData.plan || 'light';
        const planPrices: Record<string, number> = { light: 1980, standard: 3800, pro: 10000 };
        const planAmount = planPrices[plan] || 1980;

        // 🔥 決済成功時に failedAt と gracePeriodUntil をリセットする（②の問題対応）
        await shopDoc.ref.update({
          status: 'active',
          squareCustomerId: customerId || shopData.squareCustomerId || '',
          squarePaymentId: paymentId || '',
          failedAt: null,
          gracePeriodUntil: null,
          updatedAt: FieldValue.serverTimestamp(),
        });

        // ============================================================
        // 継続課金に伴う紹介報酬の加算処理
        // ============================================================
        const relSnap = await db.collection('referral_relations')
          .where('referredTenantId', '==', shopDoc.id)
          .where('status', '==', 'active')
          .limit(1)
          .get();

        if (!relSnap.empty) {
          const relData = relSnap.docs[0].data();
          const referrerDoc = await db.collection('shops').doc(relData.referrerId).get();

          if (referrerDoc.exists) {
            const referrerData = referrerDoc.data();
            const isAgency = referrerData?.role === 'agency';
            const isPro = referrerData?.plan === 'pro' || referrerData?.role === 'pro';

            if (isAgency || isPro) {
              let baseRate = 0;

              if (isAgency) {
                // 代理店：PROプランは30%、Standard/Lightは18%（一律）
                baseRate = (plan === 'pro') ? 0.30 : 0.18;

                // 代理店：インボイスなしは10%差し引き
                const hasInvoice = referrerData?.invoiceNumber && referrerData.invoiceNumber.trim() !== '';
                if (!hasInvoice) {
                  baseRate = baseRate * 0.9;
                }
              } else if (isPro) {
                // PRO会員：全プラン一律10%（インボイスなし9%）
                const hasInvoice = referrerData?.invoiceNumber && referrerData.invoiceNumber.trim() !== '';
                baseRate = hasInvoice ? 0.10 : 0.09;
              }

              const rewardAmount = Math.floor(planAmount * baseRate);

              if (rewardAmount > 0) {
                const currentUnpaid = (referrerData?.unpaidRewardTotal || 0) + rewardAmount;
                if (currentUnpaid >= 10000) {
                  await referrerDoc.ref.update({
                    unpaidRewardTotal: currentUnpaid,
                    payoutStatus: 'pending',
                    updatedAt: FieldValue.serverTimestamp(),
                  });
                  await sendAdminPayoutNotification(referrerData, referrerDoc.id, currentUnpaid);
                } else {
                  await referrerDoc.ref.update({
                    unpaidRewardTotal: currentUnpaid,
                    updatedAt: FieldValue.serverTimestamp(),
                  });
                }

                const currentMonth = new Date().toISOString().slice(0, 7);
                await db.collection('monthly_rewards').add({
                  userId: referrerDoc.id,
                  sourceTenantId: shopDoc.id,
                  amount: rewardAmount,
                  billingMonth: currentMonth,
                  status: 'unpaid',
                  createdAt: FieldValue.serverTimestamp(),
                });
              }
            }
          }
        }

        console.log(`[アカウント更新・継続課金報酬加算] 店舗: ${shopData.name} (${customerEmail})`);
        return NextResponse.json({ success: true, message: '契約更新完了' }, { status: 200 });
      }

      // ============================================================
      // ④ フォールバック（該当なし）
      // ============================================================
      console.log(`[フォールバック] 該当なし: ${customerEmail}`);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // その他のイベントタイプは無視
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
  console.error('[square-webhook] エラー:', error);
  
  // 🔥 管理者通知
  await notifyAdmins(error, {
    source: 'square-webhook',
    details: {
      eventType: body?.type,
      paymentId: body?.data?.object?.payment?.id,
    },
  });

  return NextResponse.json({ error: error.message }, { status: 500 });
}
