import { NextResponse } from 'next/server';
import { messaging, db } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const rateLimit = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);
  if (!record || now > record.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60000 });
    return false;
  }
  if (record.count >= 10) return true;
  record.count++;
  return false;
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'レート制限を超えました' }, { status: 429 });
  }

  try {
    const { token, shopId } = await request.json();
    if (!token || !shopId) {
      return NextResponse.json({ error: 'tokenとshopIdが必要です' }, { status: 400 });
    }

    // 店舗存在確認
    const shopDoc = await db.collection('shops').doc(shopId).get();
    if (!shopDoc.exists) {
      return NextResponse.json({ error: '店舗が見つかりません' }, { status: 404 });
    }

    const topic = `shop_${shopId}_users`;
    await messaging.subscribeToTopic([token], topic);

    await db.collection('subscriptions').doc(token).set({
      token,
      shopId,
      topic,
      createdAt: FieldValue.serverTimestamp(),
      lastActive: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, topic }, { status: 200 });
  } catch (error: any) {
    console.error('[subscribe] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
