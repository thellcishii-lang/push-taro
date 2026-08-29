// app/api/agency/stats/route.ts
import { NextResponse } from 'next/server';
import { db as dbAdmin } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agencyId = searchParams.get('agencyId');

  if (!agencyId) {
    return NextResponse.json({ error: 'Agency ID required' }, { status: 400 });
  }

  // 1. 代理店データの取得
  const agencyDoc = await dbAdmin.collection('agencies').doc(agencyId).get();
  if (!agencyDoc.exists) {
    return NextResponse.json({ error: 'Agency not found' }, { status: 404 });
  }

  // 2. 紹介した店舗一覧を取得
  const shopsSnapshot = await dbAdmin
    .collection('shops')
    .where('agencyId', '==', agencyId)
    .get();

  const referredShops = shopsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  // 3. 報酬データの集計
  const payoutsSnapshot = await dbAdmin
    .collection('agencyPayouts')
    .where('agencyId', '==', agencyId)
    .get();

  let pendingPayout = 0;
  let totalEarned = 0;

  payoutsSnapshot.forEach(doc => {
    const data = doc.data();
    if (data.status === 'pending') {
      pendingPayout += data.amount || 0;
    } else if (data.status === 'completed') {
      totalEarned += data.amount || 0;
    }
  });

  return NextResponse.json({
    agency: agencyDoc.data(),
    stats: {
      referredShopCount: referredShops.length,
      pendingPayout,
      totalEarned,
    },
    shops: referredShops,
  });
}
