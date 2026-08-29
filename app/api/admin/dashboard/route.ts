// app/api/admin/dashboard/route.ts
import { NextResponse } from 'next/server';
import { dbAdmin } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get('shopId');

  if (!shopId) {
    return NextResponse.json({ error: 'Shop ID required' }, { status: 400 });
  }

  // 1. 店舗情報取得
  const shopDoc = await dbAdmin.collection('shops').doc(shopId).get();
  const shopData = shopDoc.data();

  // 2. 購読ユーザー数 (アクティブなPushトークン保有数) の集計
  const subscribersSnapshot = await dbAdmin
    .collection('users')
    .where('shopId', '==', shopId)
    .get();

  const subscriberCount = subscribersSnapshot.size;

  return NextResponse.json({
    shop: shopData,
    stats: {
      subscriberCount,
      pushCount: shopData?.pushCount || 0,
      status: shopData?.status || 'active',
    },
  });
}
