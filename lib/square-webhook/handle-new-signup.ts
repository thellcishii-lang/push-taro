// lib/square-webhook/handle-new-signup.ts
/**
 * 新規登録（pending_payment → active）の処理
 *
 * 1. Auth ユーザー作成
 * 2. shops を active に更新
 * 3. 本登録完了メール送信
 * 4. 紹介報酬の初回計算
 * 5. 代理店への「新規店舗申し込み完了」通知メール
 */
import { NextResponse } from 'next/server';
import { db, authAdmin } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendEmail } from '@/lib/mailer';
import {
  calculateRewardRate,
  getReferrerCollection,
  getUnpaidField,
  getPayoutThreshold,
  sendAdminPayoutNotification,
} from './reward-calculator';

const PLAN_PRICES: Record<string, number> = {
  light: 1980,
  standard: 3800,
  pro: 10000,
};

export async function handleNewSignup(
  pendingShopDoc: FirebaseFirestore.QueryDocumentSnapshot,
  customerEmail: string,
  customerId: string | null,
  paymentId: string | null
) {
  const pendingShopData = pendingShopDoc.data();
  const shopId = pendingShopDoc.id;
  const plan = pendingShopData.plan || 'light';

  // ============================================================
  // 1. Auth ユーザー作成
  // ============================================================
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

  // ============================================================
  // 2. shops を active に更新
  // ============================================================
  await pendingShopDoc.ref.update({
    status: 'active',
    ownerUid: userRecord.uid,
    squareCustomerId: customerId || '',
    plan: plan,
    squarePaymentId: paymentId,
    failedAt: null,
    gracePeriodUntil: null,
    paymentStatus: {
      current: 'normal',
      lastUpdatedAt: FieldValue.serverTimestamp(),
    },
    manualActions: {
      squareStopped:      { done: false, doneAt: null, doneBy: null },
      invoice2MonthsSent: { done: false, doneAt: null, doneBy: null },
      invoice3MonthsSent: { done: false, doneAt: null, doneBy: null },
      paymentConfirmed:   { done: false, doneAt: null, doneBy: null },
      squareResumed:      { done: false, doneAt: null, doneBy: null },
      canceled:           { done: false, doneAt: null, doneBy: null },
    },
    paymentCanceledAt: null,
    updatedAt: FieldValue.serverTimestamp(),
  });

  // ============================================================
  // 3. 本登録完了メール
  // ============================================================
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
  // 4. 紹介報酬の初回計算（月末バッチへ委譲）
  //    - referral_relations を active に
  //    - payment_history に記録（rewardProcessed: false）
  //    - 代理店へ通知メール（金額は参考値）
  // ============================================================
  const referrerId = pendingShopData.referrerId;
  const referrerType = pendingShopData.referrerType || null;

  if (referrerId && referrerType && referrerType !== 'shop') {
    try {
      const referrerCollection = getReferrerCollection(referrerType);
      const referrerDoc = await db.collection(referrerCollection).doc(referrerId).get();

      if (referrerDoc.exists) {
        const referrerData = referrerDoc.data()!;

        // 1) referral_relations を active に（月末バッチの起点）
        const relSnap = await db.collection('referral_relations')
          .where('referredTenantId', '==', shopId)
          .limit(1)
          .get();

        if (!relSnap.empty) {
          await relSnap.docs[0].ref.update({
            status: 'active',
            updatedAt: FieldValue.serverTimestamp(),
          });
        } else {
          const effectiveRate = await calculateRewardRate(referrerData, referrerType, plan, referrerId);
          await db.collection('referral_relations').add({
            referrerId: referrerId,
            referredTenantId: shopId,
            rewardRate: effectiveRate,
            referrerType: referrerType,
            status: 'active',
            createdAt: FieldValue.serverTimestamp(),
          });
        }

        // 2) payment_history に記録（月末バッチが拾って報酬化）
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        const planAmount = PLAN_PRICES[plan] || 1980;

        await db.collection('shops').doc(shopId).collection('payment_history').add({
          billingMonth: currentMonth,
          periodStart,
          periodEnd,
          amount: planAmount,
          result: 'success',
          failureAttempt: null,
          attemptedAt: FieldValue.serverTimestamp(),
          paymentId,
          rewardProcessed: false,
          createdAt: FieldValue.serverTimestamp(),
        });

        // 3) 代理店への通知メール（金額は参考値）
        if (referrerType === 'agency' && referrerData.email) {
          const effectiveRate = await calculateRewardRate(referrerData, referrerType, plan, referrerId);
          const hasInvoice = !!(
            referrerData?.invoiceNumber &&
            String(referrerData.invoiceNumber).trim() !== ''
          );
          const baseRate = hasInvoice ? effectiveRate : effectiveRate / 0.9;
          const baseReward = Math.floor(planAmount * baseRate);
          const withholding = hasInvoice ? 0 : Math.floor(baseReward * 0.1);
          const netReward = baseReward - withholding;

          await sendEmail({
            to: referrerData.email,
            subject: `【Push-taro】御社の紹介コードで新規店舗申し込みが完了しました`,
            html: `
              <h2>${referrerData.companyName || referrerData.ownerName || '代理店'} 様</h2>
              <p>御社の紹介コード（${referrerData.referralCode || '---'}）を経由して、</p>
              <p>新規店舗の申し込みおよび決済が完了いたしました。</p>
              <hr />
              <table style="font-size: 14px;">
                <tr>
                  <td style="padding: 6px; font-weight: bold;">店舗名</td>
                  <td style="padding: 6px;">${pendingShopData.name || '未設定'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px; font-weight: bold;">プラン</td>
                  <td style="padding: 6px;">${plan.toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="padding: 6px; font-weight: bold;">報酬率</td>
                  <td style="padding: 6px;">${(baseRate * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                  <td style="padding: 6px; font-weight: bold;">今回の紹介報酬（参考値）</td>
                  <td style="padding: 6px;">¥${baseReward.toLocaleString()}</td>
                </tr>
                ${!hasInvoice ? `
                <tr>
                  <td style="padding: 6px; font-weight: bold; color: #dc2626;">源泉徴収（インボイス未登録 -10%）</td>
                  <td style="padding: 6px; color: #dc2626;">-¥${withholding.toLocaleString()}</td>
                </tr>
                ` : ''}
                <tr style="border-top: 1px solid #e2e8f0;">
                  <td style="padding: 6px; font-weight: bold;">お支払い予定額</td>
                  <td style="padding: 6px; color: #ff4500; font-weight: bold; font-size: 16px;">¥${netReward.toLocaleString()}</td>
                </tr>
              </table>
              <hr />
              <p style="font-size: 13px; color: #64748b;">
                ※ 上記金額は参考値です。正式な確定額は月末締め後にご案内いたします。<br />
                ※ 詳細な明細は、代理店コンソールよりご確認いただけます。
              </p>
              <p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/agency/dashboard" style="display:inline-block;padding:12px 24px;background:#3182ce;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">
                  代理店コンソールで確認する
                </a>
              </p>
              <hr />
              <p><strong>Push-taro.com</strong></p>
              <p>運営会社：the合同会社</p>
              <p><a href="mailto:pushtaro-info@gmail.com">pushtaro-info@gmail.com</a></p>
            `,
          });
        }

        console.log(`[新規登録] ✅ 紹介関係を active に、payment_history に記録: ${referrerType}/${referrerId}`);
      }
    } catch (refError) {
      console.error('[新規登録] 紹介報酬処理エラー:', refError);
    }
  }
            // ============================================================
            // 5. 代理店への「新規店舗申し込み完了」通知メール
            // ============================================================
            if (referrerType === 'agency' && referrerData.email) {
              const hasInvoice = !!(
                referrerData?.invoiceNumber &&
                String(referrerData.invoiceNumber).trim() !== ''
              );
              const baseRate = hasInvoice ? effectiveRate : effectiveRate / 0.9;
              const baseReward = Math.floor(planAmount * baseRate);
              const withholding = hasInvoice ? 0 : Math.floor(baseReward * 0.1);
              const netReward = baseReward - withholding;
              const netUnpaid = (referrerData?.[unpaidField] || 0) + netReward;

              await sendEmail({
                to: referrerData.email,
                subject: `【Push-taro】御社の紹介コードで新規店舗申し込みが完了しました`,
                html: `
                  <h2>${referrerData.companyName || referrerData.ownerName || '代理店'} 様</h2>
                  <p>御社の紹介コード（${referrerData.referralCode || '---'}）を経由して、</p>
                  <p>新規店舗の申し込みおよび決済が完了いたしました。</p>
                  <hr />
                  <table style="font-size: 14px;">
                    <tr>
                      <td style="padding: 6px; font-weight: bold;">店舗名</td>
                      <td style="padding: 6px;">${pendingShopData.name || '未設定'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px; font-weight: bold;">プラン</td>
                      <td style="padding: 6px;">${plan.toUpperCase()}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px; font-weight: bold;">報酬率</td>
                      <td style="padding: 6px;">${(baseRate * 100).toFixed(1)}%</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px; font-weight: bold;">今回の紹介報酬</td>
                      <td style="padding: 6px;">¥${baseReward.toLocaleString()}</td>
                    </tr>
                    ${!hasInvoice ? `
                    <tr>
                      <td style="padding: 6px; font-weight: bold; color: #dc2626;">源泉徴収（インボイス未登録 -10%）</td>
                      <td style="padding: 6px; color: #dc2626;">-¥${withholding.toLocaleString()}</td>
                    </tr>
                    ` : ''}
                    <tr style="border-top: 1px solid #e2e8f0;">
                      <td style="padding: 6px; font-weight: bold;">お支払い額</td>
                      <td style="padding: 6px; color: #ff4500; font-weight: bold; font-size: 16px;">¥${netReward.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px; font-weight: bold;">未払い累計</td>
                      <td style="padding: 6px;">¥${netUnpaid.toLocaleString()}</td>
                    </tr>
                  </table>
                  <hr />
                  <p>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/agency/dashboard" style="display:inline-block;padding:12px 24px;background:#3182ce;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">
                      代理店コンソールで確認する
                    </a>
                  </p>
                  <hr />
                  <p><strong>Push-taro.com</strong></p>
                  <p>運営会社：the合同会社</p>
                  <p><a href="mailto:pushtaro-info@gmail.com">pushtaro-info@gmail.com</a></p>
                `,
              });
            }

            console.log(`[新規登録] ✅ 紹介報酬加算: ${referrerType} / ${rewardAmount}円 / 累計 ${currentUnpaid}円`);
          }
        }
      }
    } catch (refError) {
      console.error('[新規登録] 紹介報酬処理エラー:', refError);
    }
  }

  console.log(`[新規登録完了] 店舗ID: ${shopId}, メール: ${customerEmail}`);
  return NextResponse.json({ success: true, message: '本登録完了しました' }, { status: 200 });
}
