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
    await authAdmin.verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: '無効なトークンです' }, { status: 401 });
  }

  try {
    // status === 'send_disabled' かつ failedCount >= 3 の店舗を取得
    const snapshot = await db.collection('shops')
      .where('status', '==', 'send_disabled')
      .where('failedCount', '>=', 3)
      .get();

    const shops = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '未設定',
        email: data.email || '',
        plan: data.plan || 'light',
        failedCount: data.failedCount || 0,
        failedAt: data.failedAt?.toDate?.()?.toISOString() || null,
        status: data.status,
      };
    });

    return NextResponse.json({ success: true, shops });
  } catch (error: any) {
    console.error('[payment-failures] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
