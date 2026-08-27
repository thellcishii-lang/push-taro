// app/actions/agencyActions.ts
import { db } from '@/lib/firebase'; // Firestoreなどの初期化設定

export async function getAgencyDashboardData(agencyId: string) {
  // 1. 代理店自身の情報を取得
  const agencyDoc = await db.collection('agencies').doc(agencyId).get();
  const agencyData = agencyDoc.data();
  const referralCode = agencyData?.referralCode;

  // 2. この紹介コード経由で登録されたアクティブ店舗数をカウント
  const storesSnapshot = await db.collection('stores')
    .where('referredBy', '==', referralCode)
    .where('status', '==', 'active') // 有料プラン継続中の店舗
    .get();
  
  const activeCount = storesSnapshot.size;

  // 3. 超過累進報酬の計算ロジック（1-100: 30%, 101-200: 36%, 201+: 45%）
  let totalEstimatedReward = 0;
  // プロプラン月額10,000円をベースに計算する場合
  const planPrice = 10000; 

  if (activeCount <= 100) {
    totalEstimatedReward = activeCount * planPrice * 0.30;
  } else if (activeCount <= 200) {
    totalEstimatedReward = (100 * planPrice * 0.30) + ((activeCount - 100) * planPrice * 0.36);
  } else {
    totalEstimatedReward = (100 * planPrice * 0.30) + (100 * planPrice * 0.36) + ((activeCount - 200) * planPrice * 0.45);
  }

  // 現在の還元率を判定
  const currentRate = activeCount <= 100 ? 30 : activeCount <= 200 ? 36 : 45;

  return {
    referralCode,
    activeCount,
    currentRate,
    monthlyEstimatedReward: Math.floor(totalEstimatedReward),
  };
}
