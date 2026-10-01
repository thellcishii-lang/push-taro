import { NextResponse } from 'next/server';
import { authAdmin, db } from '@/lib/firebase-admin';
import { couponDay } from '@/lib/coupon-day';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('shopId');
    const date = searchParams.get('date');
    const token = searchParams.get('token');
    if (!shopId) return NextResponse.json({ error: 'shopId が必要です' }, { status: 400 });

    const logs = db.collection('shops').doc(shopId).collection('coupon_logs');
    if (date !== null) {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
      const { uid } = await authAdmin.verifyIdToken(authHeader.slice(7));
      const shop = await db.collection('shops').doc(shopId).get();
      if (!shop.exists || shop.data()?.ownerUid !== uid) return NextResponse.json({ error: '権限がありません' }, { status: 403 });
      const start = new Date(`${date}T00:00:00+09:00`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(start.getTime()) || couponDay(start) !== date) {
        return NextResponse.json({ error: '日付が無効です' }, { status: 400 });
      }
      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
      const snapshot = await logs.where('usedAt', '>=', start).where('usedAt', '<', end).get();
      const histories = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().couponTitle || 'クーポン',
        phone: doc.data().customerPhone || '',
        usedAt: doc.data().usedAt?.toDate?.()?.toISOString() || null,
      })).sort((a, b) => (b.usedAt || '').localeCompare(a.usedAt || ''));
      return NextResponse.json({ histories }, { headers: { 'Cache-Control': 'no-store' } });
    }

    if (!token) return NextResponse.json({ error: 'token が必要です' }, { status: 400 });
    const subscription = await db.collection('subscriptions').doc(token).get();
    if (!subscription.exists || !subscription.data()?.shopIds?.includes(shopId)) {
      return NextResponse.json({ error: '購読が見つかりません' }, { status: 403 });
    }
    const customerUid = subscription.data()?.customerUid;
    let verifiedUid = '';
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const decoded = await authAdmin.verifyIdToken(authHeader.slice(7));
      if (customerUid && customerUid !== decoded.uid) return NextResponse.json({ error: '権限がありません' }, { status: 403 });
      verifiedUid = decoded.uid;
    }
    const snapshots = await Promise.all([
      logs.where('userToken', '==', token).get(),
      verifiedUid && customerUid ? logs.where('customerUid', '==', verifiedUid).get() : Promise.resolve(null),
    ]);
    const entries = new Map<string, { id: string; title: string; usedAt: string | null }>();
    snapshots.forEach((snapshot) => snapshot?.docs.forEach((doc) => entries.set(doc.id, {
      id: doc.id,
      title: doc.data().couponTitle || 'クーポン',
      usedAt: doc.data().usedAt?.toDate?.()?.toISOString() || null,
    })));
    return NextResponse.json({ histories: Array.from(entries.values()).sort((a, b) => (b.usedAt || '').localeCompare(a.usedAt || '')) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[coupon-history] エラー:', error);
    return NextResponse.json({ error: '履歴の取得に失敗しました' }, { status: 500 });
  }
}