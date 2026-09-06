import { NextResponse } from 'next/server';
import { db, authAdmin } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await authAdmin.verifyIdToken(idToken);
    const uid = decoded.uid;

    const { shopId, couponType, token } = await request.json();

    if (!shopId || !couponType || !token) {
      return NextResponse.json({ error: '無効なQRコードデータです' }, { status: 400 });
    }

    // 店舗所有権チェック
    const shopDoc = await db.collection('shops').doc(shopId).get();
    if (!shopDoc.exists || shopDoc.data()?.ownerUid !== uid) {
      return NextResponse.json({ error: '店舗の操作権限がありません' }, { status: 403 });
    }

    const shopData = shopDoc.data();
    let couponTitle = 'クーポン';

    if (couponType === 'first') {
      couponTitle = shopData?.coupon?.title || '初回限定クーポン';

      // 顧客側のサブスクライバートークン情報に初回クーポン使用済みフラグを保存
      const subRef = db.collection('shops').doc(shopId).collection('subscribers').doc(token);
      await subRef.set({ firstCouponUsed: true, usedAt: new Date() }, { merge: true });

    } else if (couponType === 'normal') {
      couponTitle = shopData?.normalCoupon?.title || '通常クーポン';
    }

    // 利用ログの書き込み
    await db.collection('shops').doc(shopId).collection('coupon_logs').add({
      couponType,
      couponTitle,
      userToken: token,
      usedAt: new Date(),
      scannedBy: uid,
    });

    return NextResponse.json({
      success: true,
      couponTitle,
      usedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || '消し込み処理に失敗しました' }, { status: 500 });
  }
}
