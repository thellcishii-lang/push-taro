import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

console.log('[subscribe/route.ts] ファイル読み込み');

if (!admin.apps.length) {
  console.log('[subscribe/route.ts] Firebase Admin 初期化');
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(request: Request) {
  console.log('[subscribe/route.ts] POST 受信');
  try {
    const { token } = await request.json();
    console.log('[subscribe/route.ts] 受信トークン:', token ? token.substring(0, 20) + '...' : 'null');

    if (!token) {
      console.log('[subscribe/route.ts] トークンなしエラー');
      return NextResponse.json({ error: 'トークンが必要です' }, { status: 400 });
    }

    console.log('[subscribe/route.ts] all_users トピック登録開始');
    const response = await admin.messaging().subscribeToTopic([token], 'all_users');
    console.log('[subscribe/route.ts] 登録結果:', response);

    return NextResponse.json({ success: true, response }, { status: 200 });
  } catch (error: any) {
    console.error('[subscribe/route.ts] 登録エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
