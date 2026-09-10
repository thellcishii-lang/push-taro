// app/api/cancel-subscription/route.ts（修正後）
import { NextResponse } from 'next/server';
import { db, authAdmin } from '@/lib/firebase-admin';
import { Client, Environment } from 'square';

const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
});

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await authAdmin.verifyIdToken(idToken);
    const uid = decoded.uid;

    const { shopId } = await request.json();

    const shopRef = db.collection('shops').doc(shopId);
    const shopDoc = await shopRef.get();

    if (!shopDoc.exists || shopDoc.data()?.ownerUid !== uid) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }

    const shopData = shopDoc.data();
    let validUntilDate = new Date();

    // Square解約
    if (shopData?.subscriptionId) {
      try {
        const response = await squareClient.subscriptionsApi.cancelSubscription(shopData.subscriptionId);
        const subscription = response.result.subscription;
        if (subscription?.chargedThroughDate) {
          validUntilDate = new Date(subscription.chargedThroughDate);
        }
      } catch (sqErr: any) {
        console.error('Square解約処理エラー:', sqErr);
      }
    }

    // Firestore更新
    await shopRef.update({
      status: 'canceled',
      canceledAt: new Date(),
      validUntil: validUntilDate,
    });

    // ============================================================
    // 🔥 Authユーザーも削除（退会後はログイン不可にする）
    // ============================================================
    try {
      await authAdmin.deleteUser(uid);
      console.log(`[cancel-subscription] Authユーザー削除完了: ${uid}`);
    } catch (authErr: any) {
      if (authErr.code !== 'auth/user-not-found') {
        console.error('[cancel-subscription] Auth削除エラー:', authErr);
      }
    }

    return NextResponse.json({
      success: true,
      validUntil: validUntilDate.toISOString().slice(0, 10),
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || '退会処理に失敗しました' }, { status: 500 });
  }
}
