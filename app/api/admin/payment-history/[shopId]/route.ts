// app/api/admin/payment-history/[shopId]/route.ts
import { NextResponse } from 'next/server';
import { db, authAdmin } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { shopId: string } }
) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await authAdmin.verifyIdToken(idToken);
    const userRecord = await authAdmin.getUser(decoded.uid);

    const shopId = params.shopId;
    const shopDoc = await db.collection('shops').doc(shopId).get();
    if (!shopDoc.exists) {
      return NextResponse.json({ error: '店舗が見つかりません' }, { status: 404 });
    }

    // 権限チェック：管理者 OR 店舗オーナー OR 紹介者
    const shopData = shopDoc.data();
    const isAdmin = userRecord.customClaims?.admin === true;
    const isOwner = shopData?.ownerUid === decoded.uid;
    const isReferrer = shopData?.referrerId === decoded.uid;

    if (!isAdmin && !isOwner && !isReferrer) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }

    // payment_history を取得（attemptedAt 降順）
    const historySnap = await db.collection('shops')
      .doc(shopId)
      .collection('payment_history')
      .orderBy('attemptedAt', 'desc')
      .get();

    const history = historySnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        billingMonth: data.billingMonth,
        periodStart: data.periodStart?.toDate?.()?.toISOString() || null,
        periodEnd: data.periodEnd?.toDate?.()?.toISOString() || null,
        amount: data.amount || 0,
        result: data.result,
        failureAttempt: data.failureAttempt || null,
        attemptedAt: data.attemptedAt?.toDate?.()?.toISOString() || null,
        paymentId: data.paymentId || null,
      };
    });

    // 月単位でグルーピング
    const groupedByMonth: Record<string, any[]> = {};
    history.forEach((h) => {
      const month = h.billingMonth || 'unknown';
      if (!groupedByMonth[month]) groupedByMonth[month] = [];
      groupedByMonth[month].push(h);
    });

    return NextResponse.json({
      success: true,
      shopId,
      shopName: shopData?.name || '未設定',
      paymentStatus: shopData?.paymentStatus?.current || 'normal',
      manualActions: shopData?.manualActions || {},
      history,
      groupedByMonth,
    });
  } catch (error: any) {
    console.error('[payment-history] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
