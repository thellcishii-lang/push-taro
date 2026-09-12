// app/api/admin/payment-failures/route.ts
import { NextResponse } from 'next/server';
import { db, authAdmin } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await authAdmin.verifyIdToken(idToken);
    const userRecord = await authAdmin.getUser(decoded.uid);
    if (userRecord.customClaims?.admin !== true) {
      return NextResponse.json({ error: '管理者権限が必要です' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: '無効なトークンです' }, { status: 401 });
  }

  try {
    // paymentStatus.current が failure_* / recovering / canceled の店舗を取得
    // ※ Firestore は != や in が弱いので、各状態を個別に取得して結合する
    const targetStatuses = ['failure_1', 'failure_2', 'failure_3_stopped', 'recovering', 'canceled'];
    const shopsMap = new Map<string, any>();

    for (const status of targetStatuses) {
      const snap = await db.collection('shops')
        .where('paymentStatus.current', '==', status)
        .get();

      snap.docs.forEach((doc) => {
        const data = doc.data();
        // 30日経過した canceled は除外
        if (status === 'canceled' && data.paymentCanceledAt) {
          const canceledAt = data.paymentCanceledAt.toDate
            ? data.paymentCanceledAt.toDate()
            : new Date(data.paymentCanceledAt);
          const daysSince = (Date.now() - canceledAt.getTime()) / (1000 * 60 * 60 * 24);
          if (daysSince > 30) {
            return; // スキップ
          }
        }

        snap.docs.forEach((doc) => {
        const data = doc.data();
        
        // 🆕 非表示フラグが立っている店舗は除外
        if (data.paymentFailureHidden === true) {
          return;
        }
        
        // 30日経過した canceled は除外
        if (status === 'canceled' && data.paymentCanceledAt) {
          // ... 既存の処理 ...
        }

        shopsMap.set(doc.id, {
          id: doc.id,
          name: data.name || '未設定',
          email: data.email || '',
          plan: data.plan || 'light',
          paymentStatus: data.paymentStatus?.current || 'normal',
          lastUpdatedAt: data.paymentStatus?.lastUpdatedAt?.toDate?.()?.toISOString() || null,
          manualActions: data.manualActions || {},
          paymentCanceledAt: data.paymentCanceledAt?.toDate?.()?.toISOString() || null,
          // 紹介者情報（あれば）
          referrerId: data.referrerId || null,
          referrerType: data.referrerType || null,
        });
      });
    }

    const shops = Array.from(shopsMap.values());

    // 状態の優先順位で並び替え（対応が必要な順）
    const statusOrder: Record<string, number> = {
      failure_3_stopped: 1,
      failure_2: 2,
      failure_1: 3,
      canceled: 4,
      recovering: 5,
    };
    shops.sort((a, b) => (statusOrder[a.paymentStatus] || 99) - (statusOrder[b.paymentStatus] || 99));

    return NextResponse.json({ success: true, shops });
  } catch (error: any) {
    console.error('[payment-failures] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
