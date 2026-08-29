// app/api/admin/dashboard/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('shopId');

    if (!shopId) {
      return NextResponse.json({ error: 'Shop ID is required' }, { status: 400 });
    }

    // 1. 店舗基本情報の取得
    const shopDoc = await db.collection('shops').doc(shopId).get();
    
    if (!shopDoc.exists) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    const shopData = shopDoc.data();

    // 2. 購読者数（Push登録顧客数）の集計
    const subscribersSnapshot = await db
      .collection('users')
      .where('shopId', '==', shopId)
      .get();

    // 3. レスポンスの返却
    return NextResponse.json({
      shop: {
        id: shopDoc.id,
        ...shopData,
      },
      stats: {
        subscriberCount: subscribersSnapshot.size,
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
