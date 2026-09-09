import { NextResponse } from 'next/server';
import { db, authAdmin } from '@/lib/firebase-admin';
import { AFFILIATE_PAYOUT_THRESHOLD } from '@/lib/constants';

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await authAdmin.verifyIdToken(idToken);
    const uid = decoded.uid;

    // ① アフィリエイトデータを取得
    const affiliateSnapshot = await db.collection('affiliates')
      .where('uid', '==', uid)
      .limit(1)
      .get();

    if (affiliateSnapshot.empty) {
      return NextResponse.json({ error: 'アフィリエイト登録が見つかりません' }, { status: 404 });
    }

    const affiliateDoc = affiliateSnapshot.docs[0];
    const affiliateData = affiliateDoc.data();
    const affiliateId = affiliateDoc.id;

    // ② 紹介した店舗の数をカウント（active のみ）
    const referralsSnapshot = await db.collection('affiliate_referrals')
      .where('affiliateId', '==', affiliateId)
      .where('status', '==', 'active')
      .get();

    const referralCount = referralsSnapshot.size;

    // ③ 紹介店舗の詳細一覧（activeのみ）
    const referrals = referralsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        shopId: data.shopId,
        shopName: data.shopName || '不明',
        plan: data.plan || 'light',
        rewardType: data.rewardType || 'recurring', // 'recurring' | 'one-time'
        rewardRate: data.rewardRate || 0.05,
        oneTimeAmount: data.oneTimeAmount || 0,
        status: data.status || 'active',
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || null,
      };
    });

    // ④ 最近の報酬履歴（直近10件、降順）
    const rewardsSnapshot = await db.collection('affiliate_rewards')
      .where('affiliateId', '==', affiliateId)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    const rewards = rewardsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        amount: data.amount || 0,
        billingMonth: data.billingMonth || '',
        status: data.status || 'unpaid', // 'unpaid' | 'paid'
        sourceShopId: data.sourceShopId || '',
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || null,
      };
    });

    // ⑤ 振込対象かどうかのフラグ
    const unpaidReward = affiliateData.unpaidReward || 0;
    const isPayoutReady = unpaidReward >= AFFILIATE_PAYOUT_THRESHOLD;

    return NextResponse.json({
      success: true,
      affiliateId,
      referralCode: affiliateData.referralCode || '',
      totalEarnings: affiliateData.totalEarnings || 0,
      unpaidReward: unpaidReward,
      isPayoutReady,
      payoutThreshold: AFFILIATE_PAYOUT_THRESHOLD,
      referralCount,
      referrals,
      rewards,
    });

  } catch (error: any) {
    console.error('[affiliate/stats] エラー:', error);
    return NextResponse.json(
      { error: error.message || 'データ取得に失敗しました' },
      { status: 500 }
    );
  }
}
