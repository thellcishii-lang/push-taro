import { NextResponse } from 'next/server';
import { db, authAdmin } from '@/lib/firebase-admin';

/**
 * 店舗に関連するサブコレクションを再帰的に削除する
 */
async function deleteCollection(collectionRef: FirebaseFirestore.CollectionReference, batchSize = 100) {
  const snapshot = await collectionRef.limit(batchSize).get();
  if (snapshot.empty) return;

  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  // 次のバッチがあれば再帰的に削除
  if (snapshot.size === batchSize) {
    await deleteCollection(collectionRef, batchSize);
  }
}

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

    const shopRef = db.collection('shops').doc(shopId);
    const shopDoc = await shopRef.get();

    if (!shopDoc.exists) {
      return NextResponse.json({ error: '店舗が見つかりません' }, { status: 404 });
    }

    // ----- 関連データを削除 -----

    // 1. 店舗のサブコレクション（subscribers, coupon_logs, invoice_history 等）
    const subCollections = ['subscribers', 'coupon_logs', 'invoice_history'];
    for (const colName of subCollections) {
      try {
        await deleteCollection(shopRef.collection(colName));
      } catch (err) {
        console.warn(`[delete-shop] サブコレクション ${colName} 削除中にエラー:`, err);
        // サブコレクションが存在しない場合はスキップ
      }
    }

    // 2. subscriptions コレクションから shopIds 配列内の shopId を除去（または削除）
    const subsSnapshot = await db.collection('subscriptions')
      .where('shopIds', 'array-contains', shopId)
      .get();

    if (!subsSnapshot.empty) {
      const batch = db.batch();
      subsSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const newShopIds = (data.shopIds || []).filter((id: string) => id !== shopId);

        if (newShopIds.length === 0) {
          // 他の店舗に関連していなければドキュメントごと削除
          batch.delete(doc.ref);
        } else {
          // shopIds から対象の shopId を除去
          batch.update(doc.ref, { shopIds: newShopIds });
        }
      });
      await batch.commit();
    }

    // 3. referral_relations から参照を削除（または inactive に）
    const relSnapshot = await db.collection('referral_relations')
      .where('referredTenantId', '==', shopId)
      .get();

    if (!relSnapshot.empty) {
      const batch = db.batch();
      relSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }

    // 4. histories（配信履歴）を削除（optional）
    const histSnapshot = await db.collection('histories')
      .where('shopId', '==', shopId)
      .get();

    if (!histSnapshot.empty) {
      const batch = db.batch();
      histSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
    }

    // ----- 本体を削除 -----
    await shopRef.delete();

    console.log(`[delete-shop] 店舗 ${shopId} を完全に削除しました`);

    return NextResponse.json({
      success: true,
      message: `店舗 ${shopId} を削除しました`,
    });
  } catch (error: any) {
    console.error('[delete-shop] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
