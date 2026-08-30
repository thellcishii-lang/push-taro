// api/shop-info/route.ts
import { NextResponse } from 'next/server';
import { getShop } from '@/lib/firebase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get('s');

  if (!shopId) {
    return NextResponse.json({ error: 'shopIdが必要です' }, { status: 400 });
  }

  try {
    const shop = await getShop(shopId);
    if (!shop) {
      return NextResponse.json({ error: '店舗が見つかりません' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      shopId: shop.id,
      name: shop.name,
      coupon: shop.coupon,
      linkUrl: shop.linkUrl,
      iconUrl: shop.iconUrl,
      plan: shop.plan,
    }, { status: 200 });
  } catch (error: any) {
    console.error('[shop-info] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
