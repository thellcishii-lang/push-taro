import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase-admin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get('s');

  if (!shopId) {
    return NextResponse.json({ error: 'shopIdが必要です' }, { status: 400 });
  }

  try {
    const doc = await db.collection('shops').doc(shopId).get();
    if (!doc.exists) {
      return NextResponse.json({ error: '店舗が見つかりません' }, { status: 404 });
    }

    const data = doc.data();
    return NextResponse.json({
      success: true,
      shopId: doc.id,
      name: data?.name,
      coupon: data?.coupon,
      linkUrl: data?.linkUrl,
    }, { status: 200 });
  } catch (error: any) {
    console.error('[shop-info] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
