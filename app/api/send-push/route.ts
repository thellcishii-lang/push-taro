import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

console.log('[send-push/route.ts] ファイル読み込み');

if (!admin.apps.length) {
  console.log('[send-push/route.ts] Firebase Admin 初期化');
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(request: Request) {
  console.log('[send-push/route.ts] POST 受信');
  try {
    const bodyData = await request.json();
    console.log('[send-push/route.ts] リクエストボディ:', bodyData);
    const { title, body, imageUrl, linkUrl } = bodyData;

    if (!title || !body) {
      console.log('[send-push/route.ts] バリデーションエラー');
      return NextResponse.json({ error: 'タイトルと本文は必須です。' }, { status: 400 });
    }

    const message: admin.messaging.Message = {
      topic: 'all_users',
      notification: {
        title: title,
        body: body,
        ...(imageUrl ? { image: imageUrl } : {}),
      },
      data: {
        ...(linkUrl ? { url: linkUrl } : {}),
      },
    };
    console.log('[send-push/route.ts] FCMメッセージ構築:', JSON.stringify(message));

    console.log('[send-push/route.ts] FCM送信開始');
    const response = await admin.messaging().send(message);
    console.log('[send-push/route.ts] FCM送信成功 messageId:', response);

    return NextResponse.json({ success: true, messageId: response }, { status: 200 });
  } catch (error: any) {
    console.error('[send-push/route.ts] FCM送信エラー:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
