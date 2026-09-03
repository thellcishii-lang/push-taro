import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase-admin';

export async function GET(request: Request) {
  // 🔒 Cron認証（Vercel Cron Jobs からのみ実行）
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    // 5日以上経過した pending_payment を取得
    const snapshot = await db.collection('shops')
      .where('status', '==', 'pending_payment')
      .where('createdAt', '<', fiveDaysAgo)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ 
        success: true, 
        deleted: 0,
        message: '削除対象の pending_payment はありませんでした。'
      });
    }

    // バッチ削除
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    console.log(`[cleanup-pending] ${snapshot.size}件の期限切れ pending_payment を削除しました`);

    return NextResponse.json({ 
      success: true, 
      deleted: snapshot.size,
      message: `${snapshot.size}件の期限切れ pending_payment を削除しました。`
    });

  } catch (error: any) {
    console.error('[cleanup-pending] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
