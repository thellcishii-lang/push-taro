// app/api/agency/stats/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase-admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const agencyId = searchParams.get('agencyId');

    if (!agencyId) {
      return NextResponse.json({ error: 'Agency ID is required' }, { status: 400 });
    }

    // 1. 代理店データの取得
    const agencyDoc = await db.collection('agencies').doc(agencyId).get();

    if (!agencyDoc.exists) {
      return NextResponse.json({ error: 'Agency not found' }, { status: 404 });
    }

    // 2. この代理店が紹介した店舗一覧を取得
    const shopsSnapshot = await db
      .collection('shops')
      .where('agencyId', '==', agencyId)
      .get();

    const referredShops = shopsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 3. 報酬（振り込み）データの集計
    const payoutsSnapshot = await db
      .collection('agencyPayouts')
      .where('agencyId', '==', agencyId)
      .get();

    let pendingPayout = 0;
    let totalEarned = 0;

    payoutsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.status === 'pending') {
        pendingPayout += data.amount || 0;
      } else if (data.status === 'completed') {
        totalEarned += data.amount || 0;
      }
    });

    return NextResponse.json({
      agency: {
        id: agencyDoc.id,
        ...agencyDoc.data(),
      },
      stats: {
        referredShopCount: referredShops.length,
        pendingPayout,
        totalEarned,
      },
      shops: referredShops,
    });
  } catch (error: any) {
    console.error('[API Agency Stats Error]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
