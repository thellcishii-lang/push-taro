import { NextResponse } from 'next/server';
import { messaging, db } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { token, shopId } = await request.json();
    if (!token || !shopId) {
      return NextResponse.json({ error: 'tokenとshopIdが必要です' }, { status: 400 });
    }

    const subscriptionRef = db.collection('subscriptions').doc(token);
    const subscriptionDoc = await subscriptionRef.get();
    if (!subscriptionDoc.exists) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const subscriptionData = subscriptionDoc.data()!;
    const shopIds = Array.isArray(subscriptionData.shopIds) ? subscriptionData.shopIds : [];
    if (!shopIds.includes(shopId)) {
      return NextResponse.json({ error: 'この購読は指定店舗に紐づいていません' }, { status: 403 });
    }

    const topic = `shop_${shopId}_users`;
    await messaging.unsubscribeFromTopic([token], topic);

    const remainingShopIds = shopIds.filter((id: string) => id !== shopId);
    if (remainingShopIds.length === 0) {
      await subscriptionRef.delete();
    } else {
      await subscriptionRef.update({
        shopIds: FieldValue.arrayRemove(shopId),
        topics: FieldValue.arrayRemove(topic),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    const chunkRef = db.collection('shops').doc(shopId).collection('token_chunks').doc('chunk_1');
    await chunkRef.set({
      tokens: FieldValue.arrayRemove(token),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('[unsubscribe] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
