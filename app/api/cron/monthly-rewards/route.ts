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
    const now = new Date();
    const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const scheduledPayoutMonth = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}`;

    console.log(`[月末バッチ] 支払い予定月: ${scheduledPayoutMonth}`);

    // 1. アクティブな紹介関係を一括取得
    const relSnap = await db.collection('referral_relations')
      .where('status', '==', 'active')
      .get();

    console.log(`[月末バッチ] 対象 referral_relations: ${relSnap.size}件`);

    // 2. 未処理の全決済履歴を collectionGroup で1回のクエリで一括取得（高速化）
    const allUnpaidPaymentsSnap = await db.collectionGroup('payment_history')
      .where('rewardProcessed', '==', false)
      .where('result', '==', 'success')
      .get();

    console.log(`[月末バッチ] 対象 未処理決済件数: ${allUnpaidPaymentsSnap.size}件`);

    // 3. 決済履歴を shopId (親ドキュメントID) ごとにメモリ上でグループ化
    const paymentsByShop = new Map<string, typeof allUnpaidPaymentsSnap.docs>();
    allUnpaidPaymentsSnap.docs.forEach((doc) => {
      const shopId = doc.ref.parent.parent?.id;
      if (!shopId) return;

      if (!paymentsByShop.has(shopId)) {
        paymentsByShop.set(shopId, []);
      }
      paymentsByShop.get(shopId)!.push(doc);
    });

    // 4. 紹介者ごとにグループ化
    const groups = new Map<string, {
      referrerId: string;
      referrerType: string;
      relations: Array<{ relId: string; referredTenantId: string }>;
    }>();

    relSnap.docs.forEach((relDoc) => {
      const relData = relDoc.data();
      const referrerId = relData.referrerId;
      const referrerType = relData.referrerType || 'pro';
      const referredTenantId = relData.referredTenantId;
      if (!referrerId || !referredTenantId) return;

      const key = `${referrerType}_${referrerId}`;
      if (!groups.has(key)) {
        groups.set(key, { referrerId, referrerType, relations: [] });
      }
      groups.get(key)!.relations.push({ relId: relDoc.id, referredTenantId });
    });

    console.log(`[月末バッチ] referrer数: ${groups.size}`);

    let processedCount = 0;
    let totalRewardAmount = 0;
    const errors: string[] = [];

    // DBバッチ処理用の操作を溜める配列
    const batchOperations: Array<
      | { type: 'set_reward'; ref: any; data: any }
      | { type: 'update_history'; ref: any }
      | { type: 'update_referrer'; ref: any; data: any }
    > = [];

    // DB成功後に実行するメール送信タスク
    const pendingEmails: Array<() => Promise<void>> = [];

    for (const [key, group] of Array.from(groups.entries())) {
      const { referrerId, referrerType, relations } = group;

      try {
        // 対象店舗の未処理決済が存在するものだけに絞り込み
        const targetRelations = relations.filter(r => paymentsByShop.has(r.referredTenantId));
        if (targetRelations.length === 0) continue;

        const referrerCollection = getReferrerCollection(referrerType);
        const referrerDoc = await db.collection(referrerCollection).doc(referrerId).get();

        if (!referrerDoc.exists) {
          errors.push(`紹介者が見つかりません: ${referrerCollection}/${referrerId}`);
          continue;
        }

        const referrerData = referrerDoc.data()!;
        const hasInvoice = !!(
          referrerData?.invoiceNumber &&
          String(referrerData.invoiceNumber).trim() !== ''
        );

        let totalReward = 0;
        let totalBaseReward = 0;
        let totalPayment = 0;
        const shopBreakdown: Array<{ shopName: string; plan: string; payment: number; baseReward: number; reward: number }> = [];

        for (const rel of targetRelations) {
          const { referredTenantId } = rel;
          const historyDocs = paymentsByShop.get(referredTenantId) || [];
          if (historyDocs.length === 0) continue;

          const shopDoc = await db.collection('shops').doc(referredTenantId).get();
          const shopData = shopDoc.data();
          const plan = shopData?.plan || 'light';
          const shopName = shopData?.name || '不明';

          // 元の報酬率を算出
          const baseRate = await calculateRewardRate(referrerData, referrerType, plan, referrerId);
          // インボイス未登録の場合は 10% 引き（源泉徴収）
          const effectiveRate = hasInvoice ? baseRate : baseRate * 0.9;

          let shopPayment = 0;
          let shopBaseReward = 0;
          let shopReward = 0;

          for (const histDoc of historyDocs) {
            const histData = histDoc.data();
            const amount = histData.amount || 0;
            shopPayment += amount;

            if (baseRate > 0) {
              const baseRewardAmount = Math.floor(amount * baseRate);
              const rewardAmount = Math.floor(amount * effectiveRate);

              shopBaseReward += baseRewardAmount;
              shopReward += rewardAmount;

              if (rewardAmount > 0) {
                const newRewardRef = db.collection('monthly_rewards').doc();
                batchOperations.push({
                  type: 'set_reward',
                  ref: newRewardRef,
                  data: {
                    userId: referrerId,
                    sourceTenantId: referredTenantId,
                    sourceShopName: shopName,
                    amount: rewardAmount,
                    baseAmount: baseRewardAmount,
                    billingMonth: histData.billingMonth,
                    scheduledPayoutMonth,
                    status: 'unpaid',
                    referrerType,
                    createdAt: FieldValue.serverTimestamp(),
                    paidAt: null,
                    paidBy: null,
                  }
                });
              }
            }

            batchOperations.push({
              type: 'update_history',
              ref: histDoc.ref
            });
          }

          if (shopPayment > 0) {
            totalPayment += shopPayment;
            totalBaseReward += shopBaseReward;
            totalReward += shopReward;
            shopBreakdown.push({ shopName, plan, payment: shopPayment, baseReward: shopBaseReward, reward: shopReward });
          }
        }

        if (totalReward > 0) {
          const unpaidField = getUnpaidField(referrerType);
          const currentUnpaid = (referrerData?.[unpaidField] || 0) + totalReward;
          const threshold = getPayoutThreshold(referrerType);

          const referrerUpdateData: any = {
            [unpaidField]: currentUnpaid,
            ...(referrerType === 'affiliate' && {
              totalEarnings: (referrerData?.totalEarnings || 0) + totalReward,
            }),
            updatedAt: FieldValue.serverTimestamp(),
          };

          if (currentUnpaid >= threshold) {
            referrerUpdateData.payoutStatus = 'pending';
          }

          batchOperations.push({
            type: 'update_referrer',
            ref: referrerDoc.ref,
            data: referrerUpdateData
          });

          if (referrerData?.email) {
            pendingEmails.push(async () => {
              if (currentUnpaid >= threshold) {
                await sendAdminPayoutNotification(referrerData, referrerId, currentUnpaid, referrerType);
              }
              if (referrerType === 'agency') {
                await sendAgencyPayoutEmail(
                  referrerData,
                  shopBreakdown,
                  totalPayment,
                  totalBaseReward,
                  totalReward,
                  hasInvoice,
                  scheduledPayoutMonth
                );
              } else {
                await sendPayoutScheduledEmail(
                  referrerData,
                  referrerType,
                  totalReward,
                  scheduledPayoutMonth
                );
              }
            });
          }

          processedCount++;
          totalRewardAmount += totalReward;
          console.log(`[月末バッチ] 計算完了 ${referrerType}/${referrerId} -> ${totalReward}円`);
        }

      } catch (relError: any) {
        console.error(`[月末バッチ] referrer 処理エラー (${key}):`, relError);
        errors.push(`${key}: ${relError.message}`);
      }
    }

    // 5. バッチコミット（450件ずつ分割処理）
    const CHUNK_SIZE = 450;
    for (let i = 0; i < batchOperations.length; i += CHUNK_SIZE) {
      const chunk = batchOperations.slice(i, i + CHUNK_SIZE);
      const batch = db.batch();

      chunk.forEach((op) => {
        if (op.type === 'set_reward') {
          batch.set(op.ref, op.data);
        } else if (op.type === 'update_history') {
          batch.update(op.ref, { rewardProcessed: true });
        } else if (op.type === 'update_referrer') {
          batch.update(op.ref, op.data);
        }
      });

      await batch.commit();
    }

    // 6. DB更新成功後にメールを安全に一括送信
    for (const sendEmailTask of pendingEmails) {
      await sendEmailTask();
    }

    console.log(`[月末バッチ] 全処理完了: ${processedCount}件処理 / 合計 ${totalRewardAmount}円`);

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

async function sendAgencyPayoutEmail(
  referrerData: any,
  shopBreakdown: Array<{ shopName: string; plan: string; payment: number; baseReward: number; reward: number }>,
  totalPayment: number,
  totalBaseReward: number,
  totalReward: number,
  hasInvoice: boolean,
  scheduledPayoutMonth: string
) {
  const [year, month] = scheduledPayoutMonth.split('-');
  const payoutMonthLabel = `${year}年${parseInt(month, 10)}月`;

  const withholding = hasInvoice ? 0 : totalBaseReward - totalReward;
  const netReward = totalReward;

  let breakdownRows = '';
  for (const s of shopBreakdown) {
    breakdownRows += '<tr>';
    breakdownRows += '<td style="padding: 6px; border-bottom: 1px solid #e2e8f0;">' + s.shopName + '</td>';
    breakdownRows += '<td style="padding: 6px; border-bottom: 1px solid #e2e8f0; text-align: right;">' + s.plan.toUpperCase() + '</td>';
    breakdownRows += '<td style="padding: 6px; border-bottom: 1px solid #e2e8f0; text-align: right;">' + s.payment.toLocaleString() + '円</td>';
    breakdownRows += '<td style="padding: 6px; border-bottom: 1px solid #e2e8f0; text-align: right;">' + s.reward.toLocaleString() + '円</td>';
    breakdownRows += '</tr>';
  }

  const withholdingRowHtml = hasInvoice
    ? ''
    : '<tr><td style="padding: 6px; font-weight: bold; color: #dc2626;">源泉徴収（インボイス未登録 -10%）</td><td style="padding: 6px; color: #dc2626;">-' + withholding.toLocaleString() + '円</td></tr>';

  const html = [
    '<div style="font-family: sans-serif; padding: 20px;">',
    '<h2>' + (referrerData.companyName || referrerData.ownerName || '代理店') + ' 様</h2>',
    '<p>いつもPush-taroをご利用いただき、ありがとうございます。</p>',
    '<p>今月分の紹介報酬が確定いたしましたので、ご案内申し上げます。</p>',
    '<hr />',
    '<h3 style="font-size: 15px;">配下店舗の月合計決済額</h3>',
    '<table style="font-size: 13px; border-collapse: collapse; width: 100%;">',
    '<thead><tr style="background: #f8fafc;">',
    '<th style="padding: 6px; text-align: left; border-bottom: 2px solid #e2e8f0;">店舗名</th>',
    '<th style="padding: 6px; text-align: right; border-bottom: 2px solid #e2e8f0;">プラン</th>',
    '<th style="padding: 6px; text-align: right; border-bottom: 2px solid #e2e8f0;">決済額</th>',
    '<th style="padding: 6px; text-align: right; border-bottom: 2px solid #e2e8f0;">報酬</th>',
    '</tr></thead>',
    '<tbody>',
    breakdownRows,
    '<tr style="font-weight: bold; background: #f0f9ff;">',
    '<td style="padding: 8px;" colspan="2">合計</td>',
    '<td style="padding: 8px; text-align: right;">' + totalPayment.toLocaleString() + '円</td>',
    '<td style="padding: 8px; text-align: right;">' + totalReward.toLocaleString() + '円</td>',
    '</tr>',
    '</tbody>',
    '</table>',
    '<hr />',
    '<h3 style="font-size: 15px;">お支払い内訳</h3>',
    '<table style="font-size: 14px;">',
    '<tr><td style="padding: 6px; font-weight: bold;">今回の紹介報酬（税込）</td><td style="padding: 6px;">' + totalBaseReward.toLocaleString() + '円</td></tr>',
    withholdingRowHtml,
    '<tr style="border-top: 1px solid #e2e8f0;">',
    '<td style="padding: 6px; font-weight: bold;">お支払い総額</td>',
    '<td style="padding: 6px; color: #ff4500; font-weight: bold; font-size: 16px;">' + netReward.toLocaleString() + '円</td>',
    '</tr>',
    '<tr><td style="padding: 6px; font-weight: bold;">お振込予定</td><td style="padding: 6px;">' + payoutMonthLabel + '末</td></tr>',
    '</table>',
    '<hr />',
    '<p style="font-size: 13px; color: #64748b;">※ 実際の振込日は前後する場合がございます。<br />※ 詳細な明細は、代理店コンソールよりご確認いただけます。</p>',
    '<p><a href="' + process.env.NEXT_PUBLIC_APP_URL + '/agency/dashboard" style="display:inline-block; padding:12px 24px; background:#3182ce; color:#fff; border-radius:6px; text-decoration:none; font-weight:bold;">代理店コンソールで確認する</a></p>',
    '<hr />',
    '<p><strong>Push-taro.com</strong></p>',
    '<p>運営会社：the合同会社</p>',
    '<p><a href="mailto:pushtaro-info@gmail.com">pushtaro-info@gmail.com</a></p>',
    '</div>',
  ].join('');

  try {
    await sendEmail({
      to: referrerData.email,
      subject: `【Push-taro】${payoutMonthLabel}末 お振込予定のご案内`,
      html,
    });
    console.log(`[代理店支払い予定メール] 送信完了: ${referrerData.email}`);
  } catch (error) {
    console.error('[代理店支払い予定メール] 送信失敗:', error);
  }
}

async function sendPayoutScheduledEmail(
  referrerData: any,
  referrerType: string,
  amount: number,
  scheduledPayoutMonth: string
) {
  const typeLabel = referrerType === 'affiliate' ? 'アフィリエイト' : 'PRO紹介';

  const [year, month] = scheduledPayoutMonth.split('-');
  const payoutMonthLabel = `${year}年${parseInt(month, 10)}月`;

  const html = [
    '<div style="font-family: sans-serif; padding: 20px;">',
    '<h2>' + (referrerData.name || referrerData.companyName || '紹介者') + ' 様</h2>',
    '<p>いつもPush-taroをご利用いただき、ありがとうございます。</p>',
    '<p>今月分の紹介報酬が確定いたしましたので、ご案内申し上げます。</p>',
    '<hr />',
    '<table style="font-size: 14px; border-collapse: collapse;">',
    '<tr><td style="padding: 6px; font-weight: bold;">種別</td><td style="padding: 6px;">' + typeLabel + '</td></tr>',
    '<tr><td style="padding: 6px; font-weight: bold;">今回発生報酬</td><td style="padding: 6px; color: #ff4500; font-weight: bold;">' + amount.toLocaleString() + '円</td></tr>',
    '<tr><td style="padding: 6px; font-weight: bold;">お振込予定</td><td style="padding: 6px;">' + payoutMonthLabel + '末</td></tr>',
    '</table>',
    '<hr />',
    '<p style="font-size: 13px; color: #64748b;">※ 実際の振込日は前後する場合がございます。<br />※ 詳細な明細は、マイページよりご確認いただけます。</p>',
    '<p><a href="' + process.env.NEXT_PUBLIC_APP_URL + '/admin" style="display:inline-block; padding:12px 24px; background:#ff4500; color:#fff; border-radius:6px; text-decoration:none; font-weight:bold;">マイページを確認する</a></p>',
    '<hr />',
    '<p><strong>Push-taro.com</strong></p>',
    '<p>運営会社：the合同会社</p>',
    '<p><a href="mailto:pushtaro-info@gmail.com">pushtaro-info@gmail.com</a></p>',
    '</div>',
  ].join('');

  try {
    await sendEmail({
      to: referrerData.email,
      subject: `【Push-taro】${payoutMonthLabel}末 お振込予定のご案内`,
      html,
    });
    console.log(`[支払い予定メール] 送信完了: ${referrerData.email}`);
  } catch (error) {
    console.error('[支払い予定メール] 送信失敗:', error);
  }
}
