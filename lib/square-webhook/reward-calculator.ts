// lib/square-webhook/reward-calculator.ts
/**
 * 報酬計算の共通ロジック（代理店 / PRO / アフィリエイト）
 */
import { db } from '@/lib/firebase-admin';
import { sendEmail } from '@/lib/mailer';

// ============================================================
// 代理店が紹介しているアクティブなPRO店舗数をカウント
// ============================================================
export async function countActiveProReferrals(referrerId: string): Promise<number> {
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
// 報酬率を計算（代理店 / PRO会員 / アフィリエイト 対応）
// ============================================================
export async function calculateRewardRate(
  referrerData: any,
  referrerType: string,
  plan: string,
  referrerId: string
): Promise<number> {
  if (!referrerType || referrerType === 'shop') return 0;

  let baseRate = 0;

  if (referrerType === 'agency') {
    if (plan === 'pro') {
      const activeProCount = await countActiveProReferrals(referrerId);
      if (activeProCount <= 100)      baseRate = 0.30;
      else if (activeProCount <= 200) baseRate = 0.36;
      else                            baseRate = 0.45;
    } else {
      baseRate = 0.18;
    }

    const hasInvoice = !!(referrerData?.invoiceNumber && String(referrerData.invoiceNumber).trim() !== '');
    if (!hasInvoice) baseRate = baseRate * 0.9;

  } else if (referrerType === 'pro') {
    const hasInvoice = !!(referrerData?.invoiceNumber && String(referrerData.invoiceNumber).trim() !== '');
    baseRate = hasInvoice ? 0.10 : 0.09;

  } else if (referrerType === 'affiliate') {
    baseRate = 0.05;
  }

  return baseRate;
}

// ============================================================
// コレクション名を取得
// ============================================================
export function getReferrerCollection(referrerType: string): string {
  if (referrerType === 'agency') return 'agencies';
  if (referrerType === 'affiliate') return 'affiliates';
  return 'shops';
}

// ============================================================
// 未払いフィールド名を取得
// ============================================================
export function getUnpaidField(referrerType: string): string {
  return referrerType === 'affiliate' ? 'unpaidReward' : 'unpaidRewardTotal';
}

// ============================================================
// 閾値を取得（代理店・PRO=10000円 / アフィリ=5000円）
// ============================================================
export function getPayoutThreshold(referrerType: string): number {
  return referrerType === 'affiliate' ? 5000 : 10000;
}

// ============================================================
// 管理者宛の振込リクエストメール送信
// ============================================================
export async function sendAdminPayoutNotification(
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
