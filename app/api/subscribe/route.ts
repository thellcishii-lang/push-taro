import { NextResponse } from 'next/server';
import { messaging } from '../../../lib/firebase-admin';

// 簡易メモリベースレート制限（本番ではRedis等に移行推奨）
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

  // ✅ レート制限
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'レート制限を超えました。1分後にお試しください。' }, { status: 429 });
  }

  try {
    const { token } = await request.json();
    console.log('[subscribe/route.ts] 受信トークン:', token ? token.substring(0, 20) + '...' : 'null');

    if (!token) {
      console.log('[subscribe/route.ts] トークンなしエラー');
      return NextResponse.json({ error: 'トークンが必要です' }, { status: 400 });
    }

    console.log('[subscribe/route.ts] all_users トピック登録開始');
    const response = await messaging.subscribeToTopic([token], 'all_users');
    console.log('[subscribe/route.ts] 登録結果:', response);

    return NextResponse.json({ success: true, response }, { status: 200 });
  } catch (error: any) {
    console.error('[subscribe/route.ts] 登録エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
