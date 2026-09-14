// app/api/cleanup/route.ts
import { NextResponse } from 'next/server';
import { messaging, db, authAdmin } from '../../../lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const idToken = authHeader.split('Bearer ')[1];
    await authAdmin.verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: '無効な認証トークンです' }, { status: 401 });
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // ─── 30日以上更新のないトークンを取得 ───
    const snapshot = await db.collection('subscriptions')
      .where('lastActive', '<', thirtyDaysAgo)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ success: true, removed: 0 }, { status: 200 });
    }

    const tokensToRemove: string[] = [];
    const topicMap = new Map<string, string[]>(); // token → topics[]

    snapshot.forEach((doc) => {
      const data = doc.data();
      const token = data.token || doc.id;
      const topics: string[] = data.topics || [];

      tokensToRemove.push(token);
      topicMap.set(token, topics);
    });

    // ─── FCMトピックから購読解除 ───
    // 各トークン × 各トピックの組み合わせで解除
    const unsubTasks: Promise<any>[] = [];
    for (const [token, topics] of Array.from(topicMap.entries())) {
      for (const topic of topics) {
        unsubTasks.push(
          messaging.unsubscribeFromTopic([token], topic).catch((err) => {
            console.warn(`[cleanup] トピック解除失敗 token=${token.slice(0, 10)}... topic=${topic}:`, err.message);
          })
        );
      }
    }
    await Promise.all(unsubTasks);

    // ─── Firestoreから削除 ───
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    console.log(`[cleanup] ✅ ${tokensToRemove.length}件のトークンを削除`);

    return NextResponse.json({
      success: true,
      removed: tokensToRemove.length,
    }, { status: 200 });
  } catch (error: any) {
    console.error('[cleanup] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
