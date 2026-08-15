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
    // adminのuidからshopIdを取得
    const shopQuery = await db.collection('shops').where('ownerUid', '==', uid).limit(1).get();
    if (shopQuery.empty) {
      return NextResponse.json({ error: '店舗が見つかりません' }, { status: 403 });
    }
    const shopId = shopQuery.docs[0].id;
    const shopData = shopQuery.docs[0].data();

    const { title, body, imageUrl, linkUrl } = await request.json();
    if (!title || !body) {
      return NextResponse.json({ error: 'タイトルと本文は必須です' }, { status: 400 });
    }

    const topic = `shop_${shopId}_users`;
    const message = {
      topic,
      notification: {
        title,
        body,
        ...(imageUrl ? { image: imageUrl } : {}),
      },
      data: {
        ...(linkUrl ? { url: linkUrl } : {}),
        shopId,
      },
    };

    const response = await messaging.send(message);

    // 履歴をFirestoreにも保存（オプション：有料化するまでDexie併用でも可）
    await db.collection('histories').add({
      shopId,
      title,
      body,
      imageUrl: imageUrl || null,
      linkUrl: linkUrl || null,
      sentAt: FieldValue.serverTimestamp(),
      status: 'success',
    });

    return NextResponse.json({ success: true, messageId: response }, { status: 200 });
  } catch (error: any) {
    console.error('[send-push] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
