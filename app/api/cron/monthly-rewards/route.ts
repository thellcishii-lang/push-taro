// app/api/cron/monthly-rewards/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendEmail } from '@/lib/mailer';
import {
  calculateRewardRate,
  getReferrerCollection,
  getUnpaidField,
  getPayoutThreshold,
  sendAdminPayoutNotification,
} from '@/lib/square-webhook/reward-calculator';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 支払い予定月 = 翌月
    const now = new Date();
    const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const scheduledPayoutMonth = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}`;

    console.log(`[月末バッチ] 支払い予定月: ${scheduledPayoutMonth}`);

    const relSnap = await db.collection('referral_relations')
      .where('status', '==', 'active')
      .get();

    console.log(`[月末バッチ] 対象 referral_relations: ${relSnap.size}件`);

    let processedCount = 0;
    let totalRewardAmount = 0;
    const errors: string[] = [];

    for (const relDoc of relSnap.docs) {
      const relData = relDoc.data();
      const referrerId = relData.referrerId;
      const referredTenantId = relData.referredTenantId;
      const referrerType = relData.referrerType || 'pro';

      if (!referrerId || !referredTenantId) continue;

      try {
        const historySnap = await db.collection('shops')
          .doc(referredTenantId)
          .collection('payment_history')
          .where('rewardProcessed', '==', false)
          .where('result', '==', 'success')
          .get();

        if (historySnap.empty) continue;

        const referrerCollection = getReferrerCollection(referrerType);
        const referrerDoc = await db.collection(referrerCollection).doc(referrerId).get();

        if (!referrerDoc.exists) {
          errors.push(`紹介者が見つかりません: ${referrerCollection}/${referrerId}`);
          continue;
        }

        const referrerData = referrerDoc.data()!;
        const shopDoc = await db.collection('shops').doc(referredTenantId).get();
        const shopData = shopDoc.data();
        const plan = shopData?.plan || 'light';

        const effectiveRate = await calculateRewardRate(referrerData, referrerType, plan, referrerId);

        if (effectiveRate <= 0) {
          const batch = db.batch();
          historySnap.docs.forEach((doc) => {
            batch.update(doc.ref, { rewardProcessed: true });
          });
          await batch.commit();
          continue;
        }

        let batchRewardTotal = 0;
        const monthlyRewardRecords: any[] = [];

        for (const histDoc of historySnap.docs) {
          const histData = histDoc.data();
          const amount = histData.amount || 0;
          const rewardAmount = Math.floor(amount * effectiveRate);

          if (rewardAmount > 0) {
            batchRewardTotal += rewardAmount;
            monthlyRewardRecords.push({
              billingMonth: histData.billingMonth,
              amount: rewardAmount,
              sourceTenantId: referredTenantId,
              sourceShopName: shopData?.name || '不明',
            });
          }
        }

        if (batchRewardTotal <= 0) {
          const batch = db.batch();
          historySnap.docs.forEach((doc) => batch.update(doc.ref, { rewardProcessed: true }));
          await batch.commit();
          continue;
        }

        // 未払い累計に加算
        const unpaidField = getUnpaidField(referrerType);
        const currentUnpaid = (referrerData?.[unpaidField] || 0) + batchRewardTotal;
        const threshold = getPayoutThreshold(referrerType);

        if (currentUnpaid >= threshold) {
          await referrerDoc.ref.update({
            [unpaidField]: currentUnpaid,
            ...(referrerType === 'affiliate' && {
              totalEarnings: (referrerData?.totalEarnings || 0) + batchRewardTotal,
            }),
            payoutStatus: 'pending',
            updatedAt: FieldValue.serverTimestamp(),
          });
          await sendAdminPayoutNotification(referrerData, referrerId, currentUnpaid, referrerType);
        } else {
          await referrerDoc.ref.update({
            [unpaidField]: currentUnpaid,
            ...(referrerType === 'affiliate' && {
              totalEarnings: (referrerData?.totalEarnings || 0) + batchRewardTotal,
            }),
            updatedAt: FieldValue.serverTimestamp(),
          });
        }

        // monthly_rewards に記録（scheduledPayoutMonth 付き）
        const batch = db.batch();
        monthlyRewardRecords.forEach((rec) => {
          const newRef = db.collection('monthly_rewards').doc();
          batch.set(newRef, {
            userId: referrerId,
            sourceTenantId: rec.sourceTenantId,
            sourceShopName: rec.sourceShopName,
            amount: rec.amount,
            billingMonth: rec.billingMonth,
            scheduledPayoutMonth: scheduledPayoutMonth, // 🆕
            status: 'unpaid',
            referrerType: referrerType,
            createdAt: FieldValue.serverTimestamp(),
            paidAt: null,
            paidBy: null,
          });
        });

        historySnap.docs.forEach((doc) => {
          batch.update(doc.ref, { rewardProcessed: true });
        });

        await batch.commit();

        // 支払い予定メール送信
        if (referrerData?.email) {
          await sendPayoutScheduledEmail(
            referrerData,
            referrerType,
            batchRewardTotal,
            scheduledPayoutMonth
          );
        }

        processedCount++;
        totalRewardAmount += batchRewardTotal;

        console.log(`[月末バッチ] ✅ ${referrerType}/${referrerId} → ¥${batchRewardTotal.toLocaleString()} (${monthlyRewardRecords.length}ヶ月分)`);

      } catch (relError: any) {
        console.error(`[月末バッチ] relation 処理エラー:`, relError);
        errors.push(`${relDoc.id}: ${relError.message}`);
      }
    }

    console.log(`[月末バッチ] 完了: ${processedCount}件処理 / 合計 ¥${totalRewardAmount.toLocaleString()}`);

    return NextResponse.json({
      success: true,
      processedCount,
      totalRewardAmount,
      scheduledPayoutMonth,
      errors: errors.length > 0 ? errors : undefined,
      message: `${processedCount}件の紹介者に報酬を加算しました`,
    });

  } catch (error: any) {
    console.error('[月末バッチ] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ============================================================
// 支払い予定メール送信
// ============================================================
async function sendPayoutScheduledEmail(
  referrerData: any,
  referrerType: string,
  amount: number,
  scheduledPayoutMonth: string
) {
  const typeLabel =
    referrerType === 'agency'    ? '代理店' :
    referrerType === 'affiliate' ? 'アフィリエイト' :
                                   'PRO紹介';

  const [year, month] = scheduledPayoutMonth.split('-');
  const payoutMonthLabel = `${year}年${parseInt(month, 10)}月`;

  try {
    await sendEmail({
      to: referrerData.email,
      subject: `【Push-taro】${payoutMonthLabel}末 お振込予定のご案内`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>${referrerData.name || referrerData.companyName || '紹介者'} 様</h2>
          <p>いつもPush-taroをご利用いただき、ありがとうございます。</p>
          <p>今月分の紹介報酬が確定いたしましたので、ご案内申し上げます。</p>
          <hr />
          <table style="font-size: 14px; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px; font-weight: bold;">種別</td>
              <td style="padding: 6px;">${typeLabel}</td>
            </tr>
            <tr>
              <td style="padding: 6px; font-weight: bold;">今回発生報酬</td>
              <td style="padding: 6px; color: #ff4500; font-weight: bold;">¥${amount.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 6px; font-weight: bold;">お振込予定</td>
              <td style="padding: 6px;">${payoutMonthLabel}末</td>
            </tr>
          </table>
          <hr />
          <p style="font-size: 13px; color: #64748b;">
            ※ 実際の振込日は前後する場合がございます。<br />
            ※ 詳細な明細は、マイページよりご確認いただけます。
          </p>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" style="display:inline-block; padding:12px 24px; background:#ff4500; color:#fff; border-radius:6px; text-decoration:none; font-weight:bold;">
              マイページを確認する
            </a>
          </p>
          <hr />
          <p><strong>Push-taro.com</strong></p>
          <p>運営会社：the合同会社</p>
          <p><a href="mailto:pushtaro-info@gmail.com">pushtaro-info@gmail.com</a></p>
        </div>
      `,
    });
    console.log(`[支払い予定メール] 送信完了: ${referrerData.email}`);
  } catch (error) {
    console.error('[支払い予定メール] 送信失敗:', error);
  }
}
