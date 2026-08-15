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
  console.log('[subscribe/route.ts] POST 受信');
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'レート制限を超えました。1分後にお試しください。' }, { status: 429 });
  }

  try {
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ error: 'トークンが必要です' }, { status: 400 });
    }

    await messaging.subscribeToTopic([token], 'all_users');

    // ✅ Firestoreにトークン保存（クリーンアップ用）
    await db.collection('subscriptions').doc(token).set({
      token,
      topic: 'all_users',
      createdAt: FieldValue.serverTimestamp(),
      lastActive: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('[subscribe/route.ts] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
