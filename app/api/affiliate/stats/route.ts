import { NextResponse } from 'next/server';
import { db, authAdmin } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await authAdmin.verifyIdToken(idToken);
    const uid = decoded.uid;

    const affiliateQuery = await db.collection('affiliates')
      .where('uid', '==', uid)
      .limit(1)
      .get();

    if (affiliateQuery.empty) {
      return NextResponse.json({ error: 'アフィリエイト情報が見つかりません' }, { status: 404 });
    }

    const affiliateDoc = affiliateQuery.docs[0];
    const affiliateData = affiliateDoc.data();
    const affiliateId = affiliateDoc.id;

    // 紹介店舗一覧
    const referralsSnapshot = await db.collection('affiliate_referrals')
      .where('affiliateId', '==', affiliateId)
      .get();

    const referrals = referralsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        shopName: data.shopName || '不明な店舗',
        plan: data.plan || 'light',
        status: data.status || 'active',
      };
    });

    // 報酬履歴
    const rewardsSnapshot = await db.collection('affiliate_rewards')
      .where('affiliateId', '==', affiliateId)
      .orderBy('createdAt', 'desc')
      .get();

    const rewards = rewardsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        amount: data.amount || 0,
        billingMonth: data.billingMonth || '',
        status: data.status || 'unpaid',
        sourceShopName: data.sourceShopName || '',
      };
    });

    return NextResponse.json({
      success: true,
      affiliate: {
        id: affiliateId,
        name: affiliateData.name,
        email: affiliateData.email,
        referralCode: affiliateData.referralCode,
        rewardType: affiliateData.rewardType || 'recurring',
        status: affiliateData.status,
      },
      summary: {
        totalEarnings: affiliateData.totalEarnings || 0,
        unpaidReward: affiliateData.unpaidReward || 0,
        referralCount: referrals.filter(r => r.status === 'active').length,
        payoutThreshold: 5000,
        canPayout: (affiliateData.unpaidReward || 0) >= 5000,
      },
      referrals,
      rewards,
    });

  } catch (error: any) {
    console.error('[affiliate/stats] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
