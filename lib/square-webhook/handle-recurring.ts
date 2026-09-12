// lib/square-webhook/handle-recurring.ts
/**
 * 継続課金の処理
 * 
 * 1. shops を active に更新（決済不履行からの復活も含む）
 * 2. payment_history に成功を記録
 * 3. 決済不履行の場合は paymentStatus を 'normal' に戻す
 * 4. 紹介報酬の月次計算
 */
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
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

export async function handleRecurring(
  shopDoc: FirebaseFirestore.QueryDocumentSnapshot,
  customerEmail: string,
  customerId: string | null,
  paymentId: string | null
) {
  const shopData = shopDoc.data();
  const shopId = shopDoc.id;
  const plan = shopData.plan || 'light';
  const planAmount = PLAN_PRICES[plan] || 1980;

  const currentStatus = shopData?.paymentStatus?.current || 'normal';

  // ============================================================
  // 1. shops を active に更新
  // ============================================================
  const updatePayload: Record<string, any> = {
    status: 'active',
    squareCustomerId: customerId || shopData.squareCustomerId || '',
    squarePaymentId: paymentId || '',
    failedAt: null,
    gracePeriodUntil: null,
    updatedAt: FieldValue.serverTimestamp(),
  };

  // 🔥 決済不履行中だった場合、paymentStatus を normal に戻す
  if (currentStatus !== 'normal') {
    updatePayload.paymentStatus = {
      current: 'normal',
      lastUpdatedAt: FieldValue.serverTimestamp(),
    };
    console.log(`[継続課金] 決済不履行から復活: ${currentStatus} → normal`);
  }

  await shopDoc.ref.update(updatePayload);

  // ============================================================
  // 2. payment_history に成功を記録
  // ============================================================
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  await db.collection('shops').doc(shopId).collection('payment_history').add({
    billingMonth: currentMonth,
    periodStart,
    periodEnd,
    amount: planAmount,
    result: 'success',
    failureAttempt: null,
    attemptedAt: FieldValue.serverTimestamp(),
    paymentId,
    createdAt: FieldValue.serverTimestamp(),
  });

  // ============================================================
  // 3. 紹介報酬の月次計算
  // ============================================================
  const relSnap = await db.collection('referral_relations')
    .where('referredTenantId', '==', shopId)
    .where('status', '==', 'active')
    .limit(1)
    .get();

  if (!relSnap.empty) {
    const relData = relSnap.docs[0].data();
    const relReferrerId = relData.referrerId;
    const relReferrerType = relData.referrerType || 'pro';

    if (relReferrerId && relReferrerType !== 'shop') {
      try {
        const referrerCollection = getReferrerCollection(relReferrerType);
        const referrerDoc = await db.collection(referrerCollection).doc(relReferrerId).get();

        if (referrerDoc.exists) {
          const referrerData = referrerDoc.data()!;
          const effectiveRate = await calculateRewardRate(referrerData, relReferrerType, plan, relReferrerId);

          if (effectiveRate > 0) {
            const rewardAmount = Math.floor(planAmount * effectiveRate);

            if (rewardAmount > 0) {
              const unpaidField = getUnpaidField(relReferrerType);
              const currentUnpaid = (referrerData?.[unpaidField] || 0) + rewardAmount;
              const threshold = getPayoutThreshold(relReferrerType);

              if (currentUnpaid >= threshold) {
                await referrerDoc.ref.update({
                  [unpaidField]: currentUnpaid,
                  ...(relReferrerType === 'affiliate' && {
                    totalEarnings: (referrerData?.totalEarnings || 0) + rewardAmount,
                  }),
                  payoutStatus: 'pending',
                  updatedAt: FieldValue.serverTimestamp(),
                });
                await sendAdminPayoutNotification(referrerData, relReferrerId, currentUnpaid, relReferrerType);
              } else {
                await referrerDoc.ref.update({
                  [unpaidField]: currentUnpaid,
                  ...(relReferrerType === 'affiliate' && {
                    totalEarnings: (referrerData?.totalEarnings || 0) + rewardAmount,
                  }),
                  updatedAt: FieldValue.serverTimestamp(),
                });
              }

              // monthly_rewards に記録
              await db.collection('monthly_rewards').add({
                userId: relReferrerId,
                sourceTenantId: shopId,
                amount: rewardAmount,
                billingMonth: currentMonth,
                status: 'unpaid',
                referrerType: relReferrerType,
                createdAt: FieldValue.serverTimestamp(),
              });

              console.log(`[継続課金] ✅ 報酬加算: ${relReferrerType} / ${rewardAmount}円 / 累計 ${currentUnpaid}円`);
            }
          }
        }
      } catch (refError) {
        console.error('[継続課金] 報酬処理エラー:', refError);
      }
    }
  }

  console.log(`[継続課金完了] 店舗: ${shopData.name} / プラン: ${plan}`);
  return NextResponse.json({ success: true, message: '契約更新完了' }, { status: 200 });
}
