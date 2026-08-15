import { NextResponse } from 'next/server';
import { messaging, db, authAdmin } from '../../../lib/firebase-admin';

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  let uid: string;
  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await authAdmin.verifyIdToken(idToken);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: '無効な認証トークンです' }, { status: 401 });
  }

  try {
    // adminのshopId取得
    const shopQuery = await db.collection('shops').where('ownerUid', '==', uid).limit(1).get();
    if (shopQuery.empty) {
      return NextResponse.json({ error: '店舗が見つかりません' }, { status: 403 });
    }
    const shopId = shopQuery.docs[0].id;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const snapshot = await db.collection('subscriptions')
      .where('shopId', '==', shopId)
      .where('lastActive', '<', thirtyDaysAgo)
      .get();

    const tokensToRemove: string[] = [];
    snapshot.forEach(doc => tokensToRemove.push(doc.id));

    if (tokensToRemove.length === 0) {
      return NextResponse.json({ success: true, removed: 0 }, { status: 200 });
    }

    const topic = `shop_${shopId}_users`;
    await messaging.unsubscribeFromTopic(tokensToRemove, topic);

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
