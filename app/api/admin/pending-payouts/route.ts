import { NextResponse } from 'next/server';
import { db, authAdmin } from '@/lib/firebase-admin';

async function verifyAdmin(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await authAdmin.verifyIdToken(idToken);
    const userRecord = await authAdmin.getUser(decoded.uid);
    return userRecord.customClaims?.admin === true ? decoded.uid : null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const uid = await verifyAdmin(request);
  if (!uid) {
    return NextResponse.json({ error: '管理者権限が必要です' }, { status: 403 });
  }

  try {
    // 未払い報酬があるユーザーを取得（shops + affiliates）
    const shopsSnap = await db.collection('shops')
      .where('unpaidRewardTotal', '>', 0)
      .get();

    const affiliatesSnap = await db.collection('affiliates')
      .where('unpaidReward', '>', 0)
      .get();

    const pendingUsers: any[] = [];

    // 店舗・代理店・PRO の場合
    shopsSnap.docs.forEach((doc) => {
      const data = doc.data();
      const isAgency = data.role === 'agency';
      const isPro = data.plan === 'pro' || data.role === 'pro';
      const isShop = !isAgency && !isPro;

      if (isAgency || isPro) {
        pendingUsers.push({
          id: doc.id,
          name: data.name || '未設定',
          email: data.email || '',
          type: isAgency ? '代理店' : 'PRO紹介者',
          unpaidReward: data.unpaidRewardTotal || 0,
          payoutStatus: data.payoutStatus || 'none',
          bankAccount: data.bankAccount || null,
          lastPaidAt: data.lastPaidAt?.toDate?.()?.toISOString() || null,
        });
      }
    });

    // アフィリエイトの場合
    affiliatesSnap.docs.forEach((doc) => {
      const data = doc.data();
      pendingUsers.push({
        id: doc.id,
        name: data.name || '未設定',
        email: data.email || '',
        type: 'アフィリエイト',
        unpaidReward: data.unpaidReward || 0,
        payoutStatus: data.payoutStatus || 'none',
        bankAccount: data.bankAccount || null,
        lastPaidAt: data.lastPaidAt?.toDate?.()?.toISOString() || null,
      });
    });

    // 未払い額の降順でソート
    pendingUsers.sort((a, b) => b.unpaidReward - a.unpaidReward);

    return NextResponse.json({ success: true, users: pendingUsers });
  } catch (error: any) {
    console.error('[pending-payouts] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
