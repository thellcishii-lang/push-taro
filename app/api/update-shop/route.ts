import { NextResponse } from 'next/server';
import { db, authAdmin } from '../../../lib/firebase-admin';

export const dynamic = 'force-dynamic';

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
    const {
      shopId,
      name,
      coupon,
      normalCoupon,
      loyaltyCoupon,
      proCoupons,
      linkUrl,
      iconUrl,
      bankAccount,
      scheduledList,
    } = body;

    if (!shopId) {
      return NextResponse.json({ error: 'shopIdが必要です' }, { status: 400 });
    }

    // 所有者確認
    const shopDoc = await db.collection('shops').doc(shopId).get();
    if (!shopDoc.exists || shopDoc.data()?.ownerUid !== uid) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }

    // 送信されたフィールドのみを更新（未送信項目は上書きしない）
    const updateData: Record<string, any> = {};
    if (name !== undefined)          updateData.name = name;
    if (coupon !== undefined)        updateData.coupon = coupon;
    if (normalCoupon !== undefined)  updateData.normalCoupon = normalCoupon;
    if (loyaltyCoupon !== undefined) updateData.loyaltyCoupon = loyaltyCoupon;
    if (proCoupons !== undefined)    updateData.proCoupons = proCoupons;
    if (linkUrl !== undefined)       updateData.linkUrl = linkUrl;
    if (iconUrl !== undefined)       updateData.iconUrl = iconUrl;
    if (bankAccount !== undefined)   updateData.bankAccount = bankAccount;
    if (scheduledList !== undefined) updateData.scheduledList = scheduledList;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: true, message: '更新項目がありません' });
    }

    await db.collection('shops').doc(shopId).update(updateData);

    console.log(`[update-shop] 更新完了: ${shopId} / フィールド: ${Object.keys(updateData).join(', ')}`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('[update-shop] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
