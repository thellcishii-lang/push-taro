import { NextResponse } from 'next/server';
import { db, authAdmin } from '@/lib/firebase-admin';

export async function POST(request: Request) {
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
    const { shopId } = await request.json();

    if (!shopId) {
      return NextResponse.json({ error: 'shopIdが必要です' }, { status: 400 });
    }

    // 店舗ドキュメントの存在確認
    const shopDoc = await db.collection('shops').doc(shopId).get();
    if (!shopDoc.exists) {
      return NextResponse.json({ error: '店舗が見つかりません' }, { status: 404 });
    }

    // 🔥 関連サブコレクションを削除（必要に応じて）
    // 現実的には、サブコレクションが多いので全部削除するのは大変。
    // ここでは shop ドキュメント自体を削除するだけにする。

    await db.collection('shops').doc(shopId).delete();

    console.log(`[delete-shop] 店舗削除完了: ${shopId}`);

    return NextResponse.json({
      success: true,
      message: '店舗を削除しました',
    });
  } catch (error: any) {
    console.error('[delete-shop] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
