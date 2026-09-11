// app/api/square-webhook/route.ts
import { NextResponse } from 'next/server';
import { db, authAdmin } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendEmail } from '../../../lib/mailer';
import { notifyAdmins } from '@/lib/error-notifier';

// ============================================================
// ヘルパー: 代理店が紹介しているアクティブなPRO店舗数をカウント
// ============================================================
async function countActiveProReferrals(referrerId: string): Promise<number> {
  try {
    const relSnap = await db.collection('referral_relations')
      .where('referrerId', '==', referrerId)
      .where('status', '==', 'active')
      .get();

    if (relSnap.empty) return 0;

    let proCount = 0;
    for (const relDoc of relSnap.docs) {
      const relData = relDoc.data();
      const shopDoc = await db.collection('shops').doc(relData.referredTenantId).get();
      if (shopDoc.exists) {
        const shopData = shopDoc.data();
        if (shopData?.plan === 'pro' && shopData?.status === 'active') {
          proCount++;
        }
      }
    }
    return proCount;
  } catch (error) {
    console.error('[countActiveProReferrals] エラー:', error);
    return 0;
  }
}

// ============================================================
// ヘルパー: 報酬率を計算（代理店 / PRO会員 / アフィリエイト 対応）
// ============================================================
async function calculateRewardRate(
  referrerData: any,
  referrerType: string,
  plan: string,
  referrerId: string
): Promise<number> {
  if (!referrerType || referrerType === 'shop') return 0;

  let baseRate = 0;

  if (referrerType === 'agency') {
    if (plan === 'pro') {
      // PRO: 超過累進（30% / 36% / 45%）
      const activeProCount = await countActiveProReferrals(referrerId);
      if (activeProCount <= 100)      baseRate = 0.30;
      else if (activeProCount <= 200) baseRate = 0.36;
      else                            baseRate = 0.45;
    } else {
      // LIGHT / STANDARD: 一律18%
      baseRate = 0.18;
    }

    // インボイスなしは10%差引
    const hasInvoice = !!(referrerData?.invoiceNumber && String(referrerData.invoiceNumber).trim() !== '');
    if (!hasInvoice) baseRate = baseRate * 0.9;

  } else if (referrerType === 'pro') {
    // PRO会員: 全プラン一律10%（インボイスなし9%）
    const hasInvoice = !!(referrerData?.invoiceNumber && String(referrerData.invoiceNumber).trim() !== '');
    baseRate = hasInvoice ? 0.10 : 0.09;

  } else if (referrerType === 'affiliate') {
    // アフィリエイト（継続課金型）: 一律5%
    baseRate = 0.05;
  }

  return baseRate;
}

// ============================================================
// 管理者宛に閾値到達時の手動振込依頼メールを送る
// ============================================================
async function sendAdminPayoutNotification(
  referrerData: any,
  referrerId: string,
  totalAmount: number,
  referrerType: string
) {
  const adminEmail = 'pushtaro-info@gmail.com';
  const typeLabel =
    referrerType === 'agency'    ? '代理店' :
    referrerType === 'affiliate' ? 'アフィリエイト' :
    referrerType === 'pro'       ? 'PRO紹介者' :
                                   '不明';

  try {
    await sendEmail({
      to: adminEmail,
      subject: `【要対応】${typeLabel}報酬の振込リクエスト（${referrerData.email}）`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #fff5f5; border: 2px solid #dc2626; border-radius: 8px;">
          <h2 style="color: #dc2626; margin: 0 0 16px 0;">【要対応】${typeLabel} 報酬 閾値到達</h2>
          <p>${typeLabel}の報酬累計額が閾値に達しました。</p>
          <p>口座情報をご確認の上、手動でお振り込み（PayPay銀行等）をお願いいたします。</p>
          <hr />
          <h3>■ ユーザー情報</h3>
          <ul>
            <li>種別: <strong>${typeLabel}</strong></li>
            <li>ユーザーID: <code>${referrerId}</code></li>
            <li>メールアドレス: ${referrerData.email}</li>
            <li>現在の未払い累計額: <strong>¥${totalAmount.toLocaleString()}</strong></li>
          </ul>
          <h3>■ 振込先口座情報</h3>
          <ul>
            <li>金融機関名: ${referrerData.bankAccount?.bankName || '未登録'}</li>
            <li>支店名: ${referrerData.bankAccount?.branchName || '未登録'}</li>
            <li>口座種別: ${referrerData.bankAccount?.accountType === 'savings' ? '普通' : '当座'}</li>
            <li>口座番号: ${referrerData.bankAccount?.accountNumber || '未登録'}</li>
            <li>口座名義: ${referrerData.bankAccount?.accountHolder || '未登録'}</li>
          </ul>
          <hr />
          <p style="font-size: 12px; color: #64748b;">
            振込完了後、管理画面から「振込完了処理」を実行してください。
          </p>
        </div>
      `,
    });
    console.log(`[管理者通知] 送信完了: ${adminEmail}`);
  } catch (error) {
    console.error('[管理者通知] 送信失敗:', error);
  }
}

// ============================================================
// メイン Webhook エンドポイント
// ============================================================
export async function POST(request: Request) {
  let body: any = {};

  try {
    body = await request.json();
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
        const currentFailedCount = shopData.failedCount || 0;
        const newFailedCount = currentFailedCount + 1;

        if (newFailedCount === 1) {
          await shopDoc.ref.update({
            status: 'payment_warning',
            failedCount: 1,
            failedAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          });
          console.log(`[決済失敗 1回目] ${customerEmail} - payment_warning`);
        } else if (newFailedCount === 2) {
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
              <p>運営会社：the合同会社</p>
              <p><a href="mailto:pushtaro-info@gmail.com">pushtaro-info@gmail.com</a></p>
            `,
          });
          console.log(`[決済失敗 2回目] ${customerEmail} - リマインダーメール送信`);
        } else if (newFailedCount >= 3) {
          await shopDoc.ref.update({
            status: 'send_disabled',
            failedCount: 3,
            failedAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          });

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
              <p><strong>Push-taro.com</strong></p>
              <p>運営会社：the合同会社</p>
              <p><a href="mailto:pushtaro-info@gmail.com">pushtaro-info@gmail.com</a></p>
            `,
          });
          console.log(`[決済失敗 3回目] ${customerEmail} - send_disabled`);
        }
      }

      return NextResponse.json({ success: true, message: '決済失敗処理完了' }, { status: 200 });
    }

    // ============================================================
    // 2. 決済成功
    // ============================================================
    if (eventType === 'payment.updated' || eventType === 'invoice.payment_made') {
      const payment = dataObject?.payment || dataObject?.invoice;
      const paymentStatus = payment?.status;

      if (eventType === 'payment.updated' && paymentStatus !== 'COMPLETED') {
        return NextResponse.json({ received: true }, { status: 200 });
      }

      const customerEmail = payment?.buyer_email_address || payment?.primary_recipient?.email_address;
      const customerId = payment?.customer_id;
      const paymentId = payment?.id;

      if (!customerEmail) {
        return NextResponse.json({ error: '顧客のメールアドレスが見つかりません' }, { status: 400 });
      }

      // 冪等性チェック
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
      // ① 新規登録
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
        const plan = pendingShopData.plan || 'light';

        const generatedPassword = 'Pass-' + Math.random().toString(36).slice(-8) + 'A1!';

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

        await pendingShopDoc.ref.update({
          status: 'active',
          ownerUid: userRecord.uid,
          squareCustomerId: customerId || '',
          plan: plan,
          squarePaymentId: paymentId,
          failedAt: null,
          gracePeriodUntil: null,
          updatedAt: FieldValue.serverTimestamp(),
        });

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
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" style="display:inline-block; padding:12px 24px; background:#ff4500; color:#fff; border-radius:6px; text-decoration:none; font-weight:bold;">
                管理画面へログイン
              </a>
            </p>
            <p>ログインID: ${customerEmail}</p>
            <p>パスワード: <code>${generatedPassword}</code></p>
            <hr />
            <p><strong>Push-taro.com</strong></p>
            <p>運営会社：the合同会社</p>
            <p><a href="mailto:pushtaro-info@gmail.com">pushtaro-info@gmail.com</a></p>
          `,
        });

        // ============================================================
        // 紹介報酬計算（新規契約時）
        // ============================================================
        const referrerId = pendingShopData.referrerId;
        const referrerType = pendingShopData.referrerType || null;

        if (referrerId && referrerType && referrerType !== 'shop') {
          try {
            // 🔥 紹介者の種別に応じてコレクションを切り替え
            let referrerCollection = 'shops';
            if (referrerType === 'agency')         referrerCollection = 'agencies';
            else if (referrerType === 'affiliate') referrerCollection = 'affiliates';

            const referrerDoc = await db.collection(referrerCollection).doc(referrerId).get();

            if (referrerDoc.exists) {
              const referrerData = referrerDoc.data()!;
              const effectiveRate = await calculateRewardRate(referrerData, referrerType, plan, referrerId);

              if (effectiveRate > 0) {
                const planPrices: Record<string, number> = { light: 1980, standard: 3800, pro: 10000 };
                const planAmount = planPrices[plan] || 1980;
                const rewardAmount = Math.floor(planAmount * effectiveRate);

                if (rewardAmount > 0) {
                  // 🔥 コレクションごとに未払いフィールド名が違う
                  const unpaidField = referrerType === 'affiliate' ? 'unpaidReward' : 'unpaidRewardTotal';
                  const currentUnpaid = (referrerData?.[unpaidField] || 0) + rewardAmount;

                  // 🔥 閾値もコレクションごとに違う
                  const threshold = referrerType === 'affiliate' ? 5000 : 10000;

                  if (currentUnpaid >= threshold) {
                    await referrerDoc.ref.update({
                      [unpaidField]: currentUnpaid,
                      payoutStatus: 'pending',
                      updatedAt: FieldValue.serverTimestamp(),
                    });
                    await sendAdminPayoutNotification(referrerData, referrerId, currentUnpaid, referrerType);
                  } else {
                    await referrerDoc.ref.update({
                      [unpaidField]: currentUnpaid,
                      updatedAt: FieldValue.serverTimestamp(),
                    });
                  }

                  const currentMonth = new Date().toISOString().slice(0, 7);

                  // referral_relations の更新
                  const relSnap = await db.collection('referral_relations')
                    .where('referredTenantId', '==', shopId)
                    .limit(1)
                    .get();

                  if (!relSnap.empty) {
                    await relSnap.docs[0].ref.update({
                      status: 'active',
                      rewardRate: effectiveRate,
                      referrerType: referrerType,
                      updatedAt: FieldValue.serverTimestamp(),
                    });
                  } else {
                    await db.collection('referral_relations').add({
                      referrerId: referrerId,
                      referredTenantId: shopId,
                      rewardRate: effectiveRate,
                      referrerType: referrerType,
                      status: 'active',
                      createdAt: FieldValue.serverTimestamp(),
                    });
                  }

                  // monthly_rewards に記録
                  await db.collection('monthly_rewards').add({
                    userId: referrerId,
                    sourceTenantId: shopId,
                    amount: rewardAmount,
                    billingMonth: currentMonth,
                    status: 'unpaid',
                    referrerType: referrerType,
                    createdAt: FieldValue.serverTimestamp(),
                  });

                  console.log(`[square-webhook] ✅ 紹介報酬加算: ${referrerType} / ${rewardAmount}円 / 累計 ${currentUnpaid}円`);
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
      // ② アップグレード
      // ============================================================
      const upgradeShopSnap = await db.collection('shops')
        .where('email', '==', customerEmail)
        .where('upgradeStatus', '==', 'pending_payment')
        .limit(1)
        .get();

      if (!upgradeShopSnap.empty) {
        const upgradeShopDoc = upgradeShopSnap.docs[0];
        const upgradeShopData = upgradeShopDoc.data();
        // 🔥 A-5修正: upgradeTargetPlan を優先、フォールバックで targetPlan
        const targetPlan = upgradeShopData.upgradeTargetPlan || upgradeShopData.targetPlan;
        const planName = targetPlan === 'pro' ? 'PRO' : 'スタンダード';

        // 🔥 A-6修正: upgradeData から bankAccount / invoiceNumber などをトップレベルに昇格
        const upgradeData = upgradeShopData.upgradeData || {};
        const updatePayload: Record<string, any> = {
          plan: targetPlan,
          upgradeStatus: 'completed',
          upgradeCompletedAt: FieldValue.serverTimestamp(),
          squarePaymentId: paymentId || '',
          failedAt: null,
          gracePeriodUntil: null,
          updatedAt: FieldValue.serverTimestamp(),
        };

        if (upgradeData.bankAccount)   updatePayload.bankAccount = upgradeData.bankAccount;
        if (upgradeData.invoiceNumber !== undefined) updatePayload.invoiceNumber = upgradeData.invoiceNumber;
        if (upgradeData.address)       updatePayload.address = upgradeData.address;
        if (upgradeData.phone)         updatePayload.phone = upgradeData.phone;

        // PROアップグレード時は role も更新
        if (targetPlan === 'pro') {
          updatePayload.role = 'pro';
        }

        await upgradeShopDoc.ref.update(updatePayload);

        await sendEmail({
          to: customerEmail,
          subject: `【Push-taro】${planName}プランへのアップグレードが完了しました`,
          html: `
            <h2>${upgradeShopData.name || '店舗'} 様</h2>
            <p>${planName}プランへのアップグレードが完了いたしました。</p>
            <p>アップグレードされた機能をご利用いただけます。</p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" style="display:inline-block; padding:12px 24px; background:#ff4500; color:#fff; border-radius:6px; text-decoration:none; font-weight:bold;">
                管理画面へログイン
              </a>
            </p>
            ${targetPlan === 'pro' ? '<p>PROプラン特典として、紹介報酬機能も有効になりました。</p>' : ''}
            <hr />
            <p><strong>Push-taro.com</strong></p>
            <p>運営会社：the合同会社</p>
            <p><a href="mailto:pushtaro-info@gmail.com">pushtaro-info@gmail.com</a></p>
          `,
        });

        console.log(`[アップグレード完了] 店舗: ${upgradeShopData.name} -> プラン: ${targetPlan}`);
        return NextResponse.json({ success: true, message: 'アップグレード完了しました' }, { status: 200 });
      }

      // ============================================================
      // ③ 継続課金
      // ============================================================
      const existingShopSnap = await db.collection('shops').where('email', '==', customerEmail).get();

      if (!existingShopSnap.empty) {
        const shopDoc = existingShopSnap.docs[0];
        const shopData = shopDoc.data();
        const plan = shopData.plan || 'light';
        const planPrices: Record<string, number> = { light: 1980, standard: 3800, pro: 10000 };
        const planAmount = planPrices[plan] || 1980;

        await shopDoc.ref.update({
          status: 'active',
          squareCustomerId: customerId || shopData.squareCustomerId || '',
          squarePaymentId: paymentId || '',
          failedAt: null,
          gracePeriodUntil: null,
          updatedAt: FieldValue.serverTimestamp(),
        });

        // ============================================================
        // 継続課金時の紹介報酬
        // ============================================================
        const relSnap = await db.collection('referral_relations')
          .where('referredTenantId', '==', shopDoc.id)
          .where('status', '==', 'active')
          .limit(1)
          .get();

        if (!relSnap.empty) {
          const relData = relSnap.docs[0].data();
          const relReferrerId = relData.referrerId;
          const relReferrerType = relData.referrerType || 'pro';

          if (relReferrerId && relReferrerType !== 'shop') {
            try {
              let referrerCollection = 'shops';
              if (relReferrerType === 'agency')         referrerCollection = 'agencies';
              else if (relReferrerType === 'affiliate') referrerCollection = 'affiliates';

              const referrerDoc = await db.collection(referrerCollection).doc(relReferrerId).get();

              if (referrerDoc.exists) {
                const referrerData = referrerDoc.data()!;
                const effectiveRate = await calculateRewardRate(referrerData, relReferrerType, plan, relReferrerId);

                if (effectiveRate > 0) {
                  const rewardAmount = Math.floor(planAmount * effectiveRate);

                  if (rewardAmount > 0) {
                    const unpaidField = relReferrerType === 'affiliate' ? 'unpaidReward' : 'unpaidRewardTotal';
                    const currentUnpaid = (referrerData?.[unpaidField] || 0) + rewardAmount;
                    const threshold = relReferrerType === 'affiliate' ? 5000 : 10000;

                    if (currentUnpaid >= threshold) {
                      await referrerDoc.ref.update({
                        [unpaidField]: currentUnpaid,
                        payoutStatus: 'pending',
                        updatedAt: FieldValue.serverTimestamp(),
                      });
                      await sendAdminPayoutNotification(referrerData, relReferrerId, currentUnpaid, relReferrerType);
                    } else {
                      await referrerDoc.ref.update({
                        [unpaidField]: currentUnpaid,
                        updatedAt: FieldValue.serverTimestamp(),
                      });
                    }

                    const currentMonth = new Date().toISOString().slice(0, 7);
                    await db.collection('monthly_rewards').add({
                      userId: relReferrerId,
                      sourceTenantId: shopDoc.id,
                      amount: rewardAmount,
                      billingMonth: currentMonth,
                      status: 'unpaid',
                      referrerType: relReferrerType,
                      createdAt: FieldValue.serverTimestamp(),
                    });

                    console.log(`[square-webhook] ✅ 継続報酬加算: ${relReferrerType} / ${rewardAmount}円 / 累計 ${currentUnpaid}円`);
                  }
                }
              }
            } catch (refError) {
              console.error('[square-webhook] 継続報酬処理エラー:', refError);
            }
          }
        }

        console.log(`[アカウント更新・継続課金報酬加算] 店舗: ${shopData.name}`);
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

    await notifyAdmins(error, {
      source: 'square-webhook',
      details: { eventType: body?.type },
    });

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
