import { NextResponse } from 'next/server';
import { messaging, authAdmin } from '../../../lib/firebase-admin';

export async function POST(request: Request) {
  console.log('[send-push/route.ts] POST 受信');

  // ✅ 認証チェック
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    console.log('[send-push/route.ts] 認証ヘッダーなし');
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await authAdmin.verifyIdToken(idToken);
    console.log('[send-push/route.ts] 認証成功:', decoded.uid);
  } catch (err) {
    console.error('[send-push/route.ts] 認証失敗:', err);
    return NextResponse.json({ error: '無効な認証トークンです' }, { status: 401 });
  }

  try {
    const bodyData = await request.json();
    console.log('[send-push/route.ts] リクエストボディ:', bodyData);
    const { title, body, imageUrl, linkUrl } = bodyData;

    if (!title || !body) {
      console.log('[send-push/route.ts] バリデーションエラー');
      return NextResponse.json({ error: 'タイトルと本文は必須です。' }, { status: 400 });
    }

    const message = {
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
    const response = await messaging.send(message);
    console.log('[send-push/route.ts] FCM送信成功 messageId:', response);

    return NextResponse.json({ success: true, messageId: response }, { status: 200 });
  } catch (error: any) {
    console.error('[send-push/route.ts] FCM送信エラー:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
