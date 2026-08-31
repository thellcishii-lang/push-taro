import { NextResponse } from 'next/server';
import { messaging, db, authAdmin } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const idToken = authHeader.split('Bearer ')[1];
    await authAdmin.verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: '無効な認証トークンです' }, { status: 401 });
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const snapshot = await db.collection('subscriptions')
      .where('lastActive', '<', thirtyDaysAgo)
      .get();

    const tokensToRemove: string[] = [];
    snapshot.forEach(doc => tokensToRemove.push(doc.id));

    if (tokensToRemove.length === 0) {
      return NextResponse.json({ success: true, removed: 0 }, { status: 200 });
    }

    await messaging.unsubscribeFromTopic(tokensToRemove, 'all_users');

    const batch = db.batch();
    tokensToRemove.forEach(token => {
      batch.delete(db.collection('subscriptions').doc(token));
    });
    await batch.commit();

    return NextResponse.json({ success: true, removed: tokensToRemove.length }, { status: 200 });
  } catch (error: any) {
    console.error('[cleanup] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
