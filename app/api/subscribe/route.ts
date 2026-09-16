import { NextResponse } from 'next/server';
import { messaging, db } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const rateLimit = new Map();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);
  if (!record || now > record.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60000 });
    return false;
  }
  if (record.count >= 10) return true;
  record.count++;
  return false;
}

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'レート制限を超えました' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { token, shopId, deviceId, birthDate } = body;

    // パラメータチェック
    if (!token || !shopId || shopId === 'undefined' || shopId === 'null') {
      return NextResponse.json({ error: '有効な token と shopId が必要です' }, { status: 400 });
    }

    const normalizedToken = token.trim();
    const normalizedDeviceId = typeof deviceId === 'string' ? deviceId.trim() : '';
    const topic = `shop_${shopId}_users`;

    // 1. 生年月日の数値化処理（日付が送られてきた場合）
    let birthMonth: number | null = null;
    let birthDay: number | null = null;

    if (birthDate) {
      const dateObj = new Date(birthDate);
      if (!isNaN(dateObj.getTime())) {
        birthMonth = dateObj.getMonth() + 1; // 1〜12月
        birthDay = dateObj.getDate();        // 1〜31日
      }
    }

    // 2. FCM トピック登録（エラーが起きても処理をスキップしてDB保存を優先）
    try {
      await messaging.subscribeToTopic([normalizedToken], topic);
    } catch (fcmErr: any) {
      console.warn('[API WARN] FCMトピック登録スキップ（個別配信は可能）:', fcmErr.message);
    }

    // 3. 個別顧客プロファイル（subscriptions）の保存/更新
    const docRef = db.collection('subscriptions').doc(normalizedToken);
    const doc = await docRef.get();

    // 同じ端末のFCMトークンが更新された場合は、店舗単位で旧レコードを移行する。
    let previousDocRef: FirebaseFirestore.DocumentReference | null = null;
    let previousToken = '';
    if (normalizedDeviceId) {
      const previousSnapshot = await db.collection('subscriptions')
        .where('deviceId', '==', normalizedDeviceId)
        .limit(10)
        .get();

      for (const previousDoc of previousSnapshot.docs) {
        const previousData = previousDoc.data();
        if (
          previousDoc.id !== normalizedToken &&
          ((Array.isArray(previousData.shopIds) && previousData.shopIds.includes(shopId)) ||
            (Array.isArray(previousData.unsubscribedShopIds) && previousData.unsubscribedShopIds.includes(shopId)))
        ) {
          previousDocRef = previousDoc.ref;
          break;
        }
      }
    }

    const baseData = {
      token: normalizedToken,
      ...(normalizedDeviceId ? { deviceId: normalizedDeviceId } : {}),
      lastActive: FieldValue.serverTimestamp(),
      ...(birthDate ? { birthDate, birthMonth, birthDay } : {}),
    };

    if (doc.exists) {
      console.log('[API] 既存登録の更新:', shopId);
      await docRef.set({
        ...baseData,
        shopIds: FieldValue.arrayUnion(shopId),
        topics: FieldValue.arrayUnion(topic),
        unsubscribedShopIds: FieldValue.arrayRemove(shopId),
      }, { merge: true });

      if (previousDocRef) {
        const previousData = (await previousDocRef.get()).data() || {};
        previousToken = typeof previousData.token === 'string' ? previousData.token : '';
        const remainingShopIds = Array.isArray(previousData.shopIds)
          ? previousData.shopIds.filter((id: string) => id !== shopId)
          : [];
        if (remainingShopIds.length === 0) {
          await previousDocRef.delete();
        } else {
          await previousDocRef.update({
            shopIds: FieldValue.arrayRemove(shopId),
            topics: FieldValue.arrayRemove(topic),
          });
        }
      }
    } else {
      let previousData: FirebaseFirestore.DocumentData | null = null;
      if (previousDocRef) {
        const previousDoc = await previousDocRef.get();
        if (previousDoc.exists) previousData = previousDoc.data() || null;
      }

      console.log('[API] 新規登録:', { shopId, birthDate });
      const previousShopIds = Array.isArray(previousData?.shopIds) ? previousData.shopIds : [];
      const previousTopics = Array.isArray(previousData?.topics) ? previousData.topics : [];
      await docRef.set({
        ...(previousData || {}),
        ...baseData,
        shopIds: Array.from(new Set([...previousShopIds, shopId])),
        topics: Array.from(new Set([...previousTopics, topic])),
        unsubscribedShopIds: FieldValue.arrayRemove(shopId),
        createdAt: previousData?.createdAt || FieldValue.serverTimestamp(),
      }, { merge: true });

      if (previousDocRef) {
        const oldData = previousData || {};
        previousToken = typeof oldData.token === 'string' ? oldData.token : '';
        const remainingShopIds = Array.isArray(oldData.shopIds)
          ? oldData.shopIds.filter((id: string) => id !== shopId)
          : [];
        if (remainingShopIds.length === 0) {
          await previousDocRef.delete();
        } else {
          await previousDocRef.update({
            shopIds: FieldValue.arrayRemove(shopId),
            topics: FieldValue.arrayRemove(topic),
          });
        }
      }
    }

    // チャンクは補助データ。移行・再登録でも必ず旧トークンを除去してから追加する。
    try {
      const chunkDoc = db.collection('shops').doc(shopId).collection('token_chunks').doc('chunk_1');
      await chunkDoc.set({
        tokens: FieldValue.arrayUnion(normalizedToken),
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
      if (previousToken) {
        await chunkDoc.update({ tokens: FieldValue.arrayRemove(previousToken) });
      }
    } catch (chunkErr: any) {
      console.warn('[API WARN] チャンク保存スキップ:', chunkErr.message);
    }

    return NextResponse.json({
      success: true,
      topic,
      message: doc.exists ? '登録を更新しました' : '新規登録しました',
    }, { status: 200 });

  } catch (error: any) {
    console.error('[API ERROR]', error.message, error.stack);
    return NextResponse.json({ error: '登録エラー: ' + error.message }, { status: 500 });
  }
}
