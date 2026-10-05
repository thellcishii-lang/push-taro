import { NextResponse } from 'next/server';
import { messaging, db } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { enforceRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // レート制限: トークン総当たりによる第三者の購読解除を防止
    const retryAfter = await enforceRateLimit(request, 'unsubscribe', 10, 10 * 60 * 1000);
    if (retryAfter !== null) {
      return NextResponse.json(
        { error: 'Too Many Requests' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

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
      // 顧客情報・クーポン利用履歴は保持し、店舗との紐付けだけ解除する。
      // ドキュメントを削除すると、再登録時に初回クーポンが再利用できてしまう。
      await subscriptionRef.update({
        shopIds: [],
        topics: [],
        unsubscribedShopIds: FieldValue.arrayUnion(shopId),
        updatedAt: FieldValue.serverTimestamp(),
      });
    } else {
      await subscriptionRef.update({
        shopIds: FieldValue.arrayRemove(shopId),
        topics: FieldValue.arrayRemove(topic),
        unsubscribedShopIds: FieldValue.arrayUnion(shopId),
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
