import { NextResponse } from 'next/server';
import { db, authAdmin } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

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
    const body = await request.json();
    const { name } = body;

    // 既存店舗チェック
    const existing = await db.collection('shops').where('ownerUid', '==', uid).limit(1).get();
    if (!existing.empty) {
      const doc = existing.docs[0];
      return NextResponse.json({ 
        success: true, 
        shopId: doc.id,
        exists: true,
        shop: doc.data()
      }, { status: 200 });
    }

    // 新規作成
    const shopRef = db.collection('shops').doc();
    await shopRef.set({
      name: name || '未設定の店舗',
      ownerUid: uid,
      createdAt: FieldValue.serverTimestamp(),
      coupon: {
        enabled: false,
        title: '',
        description: '',
        discountRate: 0,
      },
      linkUrl: '',
    });

    return NextResponse.json({ 
      success: true, 
      shopId: shopRef.id,
      exists: false 
    }, { status: 201 });
  } catch (error: any) {
    console.error('[create-shop] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
