import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Firebase Adminの初期化（二重初期化防止）
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(request: Request) {
  try {
    const bodyData = await request.json();
    const { title, body, imageUrl, linkUrl } = bodyData;

    if (!title || !body) {
      return NextResponse.json({ error: 'タイトルと本文は必須です。' }, { status: 400 });
    }

    // FCMのペイロード構築
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

    // FCMへ送信リクエスト
    const response = await admin.messaging().send(message);

    return NextResponse.json({ success: true, messageId: response }, { status: 200 });
  } catch (error: any) {
    console.error('FCM Send Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
