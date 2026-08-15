import { NextResponse } from 'next/server';
import { db, authAdmin } from '../../../lib/firebase-admin';

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
    const { shopId, name, coupon, linkUrl } = await request.json();

    // 所有者確認
    const shopDoc = await db.collection('shops').doc(shopId).get();
    if (!shopDoc.exists || shopDoc.data()?.ownerUid !== uid) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }

    await db.collection('shops').doc(shopId).update({
      ...(name !== undefined && { name }),
      ...(coupon !== undefined && { coupon }),
      ...(linkUrl !== undefined && { linkUrl }),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('[update-shop] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
