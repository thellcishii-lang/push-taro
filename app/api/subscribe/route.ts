// api/subscribe/route.ts
import { NextResponse } from 'next/server';
import { getShop, saveSubscription, subscribeToTopic, saveTokenChunk } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    const { token, shopId, birthDate } = await request.json();

    if (!token || !shopId) {
      return NextResponse.json({ error: 'tokenとshopIdが必要です' }, { status: 400 });
    }

    // 店舗存在確認
    const shop = await getShop(shopId);
    if (!shop) {
      return NextResponse.json({ error: '店舗が見つかりません' }, { status: 404 });
    }

    // FCMトピック登録
    const topic = `shop_${shopId}_users`;
    await subscribeToTopic([token], topic);

    // サブスクリプション保存
    await saveSubscription(token, shopId, birthDate);

    // チャンク保存 (5,000件単位)
    await saveTokenChunk(shopId, token);

    return NextResponse.json({
      success: true,
      topic,
      message: '登録しました',
    }, { status: 200 });

  } catch (error: any) {
    console.error('[subscribe] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
