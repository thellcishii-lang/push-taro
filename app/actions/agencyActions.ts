// app/actions/agencyActions.ts
import { db } from '@/lib/firebase-admin'; // または Firebase Admin

export async function getAgencyDashboardData(agencyShopId: string) {
  try {
    // 1. 代理店自身のショップ情報（ID）を基に、紹介コード等を取得
    const agencyDoc = await db.collection('shops').doc(agencyShopId).get();
    if (!agencyDoc.exists) {
      throw new Error('代理店情報が見つかりません');
    }
    const agencyData = agencyDoc.data();
    const referralCode = agencyData?.referralCode || '';

    // 2. referral_relations コレクションから、この代理店(referrerId)経由の「active」な店舗をカウント
    const relationsSnapshot = await db.collection('referral_relations')
      .where('referrerId', '==', agencyShopId)
      .where('status', '==', 'active')
      .get();
    
    const activeCount = relationsSnapshot.size;

    // 3. 現在の還元率の判定（1-100件: 30%, 101-200件: 36%, 201件以降: 45%）
    const currentRate = activeCount <= 100 ? 30 : activeCount <= 200 ? 36 : 45;

    // 4. 当月の未払い報酬合計（monthly_rewards から今月分の金額を合算）
    const currentMonth = new Date().toISOString().slice(0, 7); // 例: '2026-08'
    const rewardsSnapshot = await db.collection('monthly_rewards')
      .where('userId', '==', agencyShopId)
      .where('billingMonth', '==', currentMonth)
      .where('status', '==', 'unpaid')
      .get();

    let monthlyEstimatedReward = 0;
    rewardsSnapshot.forEach((doc) => {
      monthlyEstimatedReward += doc.data().amount || 0;
    });

    return {
      referralCode,
      activeCount,
      currentRate,
      monthlyEstimatedReward,
    };
  } catch (error) {
    console.error('ダッシュボードデータの取得に失敗しました:', error);
    return {
      referralCode: '',
      activeCount: 0,
      currentRate: 30,
      monthlyEstimatedReward: 0,
    };
  }
}
