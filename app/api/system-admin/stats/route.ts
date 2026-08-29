// app/api/system-admin/stats/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  try {
    // 1. 全店舗データの取得
    const shopsSnapshot = await db.collection('shops').get();
    const shops = shopsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 2. 全代理店データの取得
    const agenciesSnapshot = await db.collection('agencies').get();
    const agencies = agenciesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 3. プラン別・流通区分別の集計計算
    let lightCount = 0;
    let standardCount = 0;
    let proCount = 0;
    let directCount = 0;
    let referralCount = 0;
    let agencyCount = 0;

    shops.forEach((shop: any) => {
      // プラン集計
      const plan = shop.plan?.toLowerCase() || 'light';
      if (plan === 'pro') proCount++;
      else if (plan === 'standard') standardCount++;
      else lightCount++;

      // 流入区分集計
      if (shop.agencyId) agencyCount++;
      else if (shop.referrerId) referralCount++;
      else directCount++;
    });

    return NextResponse.json({
      summary: {
        lightCount,
        standardCount,
        proCount,
        proDetails: {
          direct: directCount,
          referral: referralCount,
          agency: agencyCount,
        },
        agencyTotal: agencies.length,
      },
      shops,
      agencies,
    });
  } catch (error: any) {
    console.error('[API System Admin Error]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
