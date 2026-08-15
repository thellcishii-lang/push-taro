import { NextResponse } from 'next/server';
import { messaging, db } from '../../../lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ error: 'トークンが必要です' }, { status: 400 });
    }

    await messaging.unsubscribeFromTopic([token], 'all_users');
    await db.collection('subscriptions').doc(token).delete();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('[unsubscribe] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
