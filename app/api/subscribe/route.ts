import { NextResponse } from 'next/server';
import { messaging, db, authAdmin } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { randomUUID } from 'crypto';
import { enforceRateLimit } from '@/lib/rate-limit';

function getCustomerId(request: Request): string {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookie = cookieHeader
    .split(';')
    .find((value) => value.trim().startsWith('push_taro_customer_id='));
  return cookie?.split('=').slice(1).join('=').trim() || '';
}

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const retryAfter = await enforceRateLimit(request, 'subscribe', 20, 60 * 1000);
  if (retryAfter !== null) {
    return NextResponse.json(
      { error: 'レート制限を超えました' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  try {
    const body = await request.json();
    const { token, shopId, deviceId, customerId: requestedCustomerId, customerUid } = body;

    // パラメータチェック
    if (!token || !shopId || shopId === 'undefined' || shopId === 'null') {
      return NextResponse.json({ error: '有効な token と shopId が必要です' }, { status: 400 });
    }

    const normalizedToken = token.trim();
    const normalizedDeviceId = typeof deviceId === 'string' ? deviceId.trim() : '';
    let verifiedCustomerUid = '';
    const authHeader = request.headers.get('Authorization');
    if (customerUid && authHeader?.startsWith('Bearer ')) {
      try {
        const decoded = await authAdmin.verifyIdToken(authHeader.slice('Bearer '.length));
        if (decoded.uid === customerUid) verifiedCustomerUid = decoded.uid;
      } catch {
        return NextResponse.json({ error: '電話番号認証の有効期限が切れています' }, { status: 401 });
      }
    }
    const customerId = getCustomerId(request) || requestedCustomerId || randomUUID();
    const topic = `shop_${shopId}_users`;

    // FCM トピック登録（エラーが起きても処理をスキップしてDB保存を優先）
    try {
      await messaging.subscribeToTopic([normalizedToken], topic);
    } catch (fcmErr: any) {
      console.warn('[API WARN] FCMトピック登録スキップ（個別配信は可能）:', fcmErr.message);
    }

    // 3. 個別顧客プロファイル（subscriptions）の保存/更新
    const docRef = db.collection('subscriptions').doc(normalizedToken);
    const doc = await docRef.get();

    // 同じ端末のFCMトークンが更新された場合は、店舗単位で旧レコードを移行する。
    const previousDocRefs: FirebaseFirestore.DocumentReference[] = [];
    let previousData: FirebaseFirestore.DocumentData | null = null;
    const previousTokens: string[] = [];
    if (normalizedDeviceId || customerId || verifiedCustomerUid) {
      const previousSnapshots = await Promise.all([
        normalizedDeviceId
          ? db.collection('subscriptions').where('deviceId', '==', normalizedDeviceId).limit(10).get()
          : Promise.resolve(null),
        db.collection('subscriptions').where('customerId', '==', customerId).limit(10).get(),
        verifiedCustomerUid
          ? db.collection('subscriptions').where('customerUid', '==', verifiedCustomerUid).limit(10).get()
          : Promise.resolve(null),
      ]);
      const previousDocs = new Map<string, FirebaseFirestore.QueryDocumentSnapshot>();
      previousSnapshots.forEach((snapshot) => {
        snapshot?.docs.forEach((previousDoc) => previousDocs.set(previousDoc.id, previousDoc));
      });

      for (const previousDoc of Array.from(previousDocs.values())) {
        const oldData = previousDoc.data();
        if (
          previousDoc.id !== normalizedToken &&
          ((Array.isArray(oldData.shopIds) && oldData.shopIds.includes(shopId)) ||
            (Array.isArray(oldData.unsubscribedShopIds) && oldData.unsubscribedShopIds.includes(shopId)))
        ) {
          previousDocRefs.push(previousDoc.ref);
          if (typeof oldData.token === 'string') previousTokens.push(oldData.token);
          const priorData = previousData as Record<string, any> | null;
          previousData = {
            ...(previousData || {}),
            ...oldData,
            shopIds: Array.from(new Set([
              ...(Array.isArray(priorData?.shopIds) ? priorData.shopIds : []),
              ...(Array.isArray(oldData.shopIds) ? oldData.shopIds : []),
            ])),
            topics: Array.from(new Set([
              ...(Array.isArray(priorData?.topics) ? priorData.topics : []),
              ...(Array.isArray(oldData.topics) ? oldData.topics : []),
            ])),
            couponUsage: {
              ...(priorData?.couponUsage || {}),
              ...(oldData.couponUsage || {}),
            },
          };
        }
      }
    }

    const baseData = {
      token: normalizedToken,
      ...(verifiedCustomerUid ? { customerUid: verifiedCustomerUid } : {}),
      customerId,
      ...(normalizedDeviceId ? { deviceId: normalizedDeviceId } : {}),
      lastActive: FieldValue.serverTimestamp(),
    };

    if (doc.exists) {
      console.log('[API] 既存登録の更新:', shopId);
      await docRef.set({
        ...(previousData || {}),
        ...doc.data(),
        ...baseData,
        shopIds: FieldValue.arrayUnion(shopId),
        topics: FieldValue.arrayUnion(topic),
        unsubscribedShopIds: FieldValue.arrayRemove(shopId),
      }, { merge: true });

      for (const previousDocRef of previousDocRefs) {
        const oldData = (await previousDocRef.get()).data() || {};
        const remainingShopIds = Array.isArray(oldData.shopIds)
          ? oldData.shopIds.filter((id: string) => id !== shopId)
          : [];
        if (remainingShopIds.length === 0) await previousDocRef.delete();
        else await previousDocRef.update({
          shopIds: FieldValue.arrayRemove(shopId),
          topics: FieldValue.arrayRemove(topic),
        });
      }
    } else {
      console.log('[API] 新規登録:', { shopId });
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

      for (const previousDocRef of previousDocRefs) {
        const oldData = (await previousDocRef.get()).data() || {};
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
      if (previousTokens.length > 0) {
        await chunkDoc.update({ tokens: FieldValue.arrayRemove(...previousTokens) });
      }
    } catch (chunkErr: any) {
      console.warn('[API WARN] チャンク保存スキップ:', chunkErr.message);
    }

    const response = NextResponse.json({
      success: true,
      topic,
      message: doc.exists ? '登録を更新しました' : '新規登録しました',
    }, { status: 200 });
    response.headers.set(
      'Set-Cookie',
      `push_taro_customer_id=${customerId}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`
    );
    return response;

  } catch (error: any) {
    console.error('[API ERROR]', error.message, error.stack);
    return NextResponse.json({ error: '登録エラー: ' + error.message }, { status: 500 });
  }
}
