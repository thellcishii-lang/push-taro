import { NextResponse } from 'next/server';
import { messaging, db } from '@/lib/firebase/admin';

export async function POST(request: Request) {
  try {
    const { token, shopId } = await request.json();
    if (!token || !shopId) {
      return NextResponse.json({ error: 'tokenとshopIdが必要です' }, { status: 400 });
    }

    const topic = `shop_${shopId}_users`;
    await messaging.unsubscribeFromTopic([token], topic);
    await db.collection('subscriptions').doc(token).delete();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('[unsubscribe] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
