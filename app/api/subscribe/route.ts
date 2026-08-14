import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

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
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({ error: 'トークンが必要です' }, { status: 400 });
    }

    await admin.messaging().subscribeToTopic([token], 'all_users');
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Subscribe Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
