// app/api/admin/dashboard/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase-admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('shopId');

    if (!shopId) {
      return NextResponse.json({ error: 'Shop ID is required' }, { status: 400 });
    }

    // 1. 店舗基本情報の取得
    const shopDoc = await db.collection('shops').doc(shopId).get();
    const shopData = shopDoc.exists ? shopDoc.data() : {};

    // 2. subscriptions コレクションから shopIds 配列に shopId が含まれるドキュメントをカウント
    const subscribersSnapshot = await db
      .collection('subscriptions')
      .where('shopIds', 'array-contains', shopId)
      .get();

    return NextResponse.json({
      shop: {
        id: shopId,
        ...shopData,
      },
      stats: {
        subscriberCount: subscribersSnapshot.size, // 正しく12件等が取得されます
        pushCount: shopData?.pushCount || 0,
        status: shopData?.status || 'active',
      },
    });
  } catch (error: any) {
    console.error('[API Admin Dashboard Error]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
