// lib/square-webhook/handle-new-signup.ts
/**
 * 新規登録（pending_payment → active）の処理
 * 
 * 1. Auth ユーザー作成
 * 2. shops を active に更新
 * 3. 本登録完了メール送信
 * 4. 紹介報酬の初回計算
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
  // 4. 紹介報酬の初回計算
  // ============================================================
  const referrerId = pendingShopData.referrerId;
  const referrerType = pendingShopData.referrerType || null;

  if (referrerId && referrerType && referrerType !== 'shop') {
    try {
      const referrerCollection = getReferrerCollection(referrerType);
      const referrerDoc = await db.collection(referrerCollection).doc(referrerId).get();

      if (referrerDoc.exists) {
        const referrerData = referrerDoc.data()!;
        const effectiveRate = await calculateRewardRate(referrerData, referrerType, plan, referrerId);

        if (effectiveRate > 0) {
          const planAmount = PLAN_PRICES[plan] || 1980;
          const rewardAmount = Math.floor(planAmount * effectiveRate);

          if (rewardAmount > 0) {
            const unpaidField = getUnpaidField(referrerType);
            const currentUnpaid = (referrerData?.[unpaidField] || 0) + rewardAmount;
            const threshold = getPayoutThreshold(referrerType);

            if (currentUnpaid >= threshold) {
              await referrerDoc.ref.update({
                [unpaidField]: currentUnpaid,
                ...(referrerType === 'affiliate' && {
                  totalEarnings: (referrerData?.totalEarnings || 0) + rewardAmount,
                }),
                payoutStatus: 'pending',
                updatedAt: FieldValue.serverTimestamp(),
              });
              await sendAdminPayoutNotification(referrerData, referrerId, currentUnpaid, referrerType);
            } else {
              await referrerDoc.ref.update({
                [unpaidField]: currentUnpaid,
                ...(referrerType === 'affiliate' && {
                  totalEarnings: (referrerData?.totalEarnings || 0) + rewardAmount,
                }),
                updatedAt: FieldValue.serverTimestamp(),
              });
            }

            const currentMonth = new Date().toISOString().slice(0, 7);

            // referral_relations を active に
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
