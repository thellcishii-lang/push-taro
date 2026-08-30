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

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'レート制限を超えました' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { token, shopId, birthDate } = body;

    // パラメータチェック
    if (!token || !shopId || shopId === 'undefined' || shopId === 'null') {
      return NextResponse.json({ error: '有効な token と shopId が必要です' }, { status: 400 });
    }

    const normalizedToken = token.trim();
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

    // 3. チャンク保存 (配列直接追加による競合防止策)
    try {
      const chunksRef = db.collection('shops').doc(shopId).collection('token_chunks');
      const chunkDoc = chunksRef.doc('chunk_1');
      await chunkDoc.set({
        tokens: FieldValue.arrayUnion(normalizedToken),
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    } catch (chunkErr: any) {
      console.warn('[API WARN] チャンク保存スキップ:', chunkErr.message);
    }

    // 4. 個別顧客プロファイル（subscriptions）の保存/更新
    const docRef = db.collection('subscriptions').doc(normalizedToken);
    const doc = await docRef.get();

    const baseData = {
      token: normalizedToken,
      lastActive: FieldValue.serverTimestamp(),
      ...(birthDate ? { birthDate, birthMonth, birthDay } : {}),
    };

    if (doc.exists) {
      console.log('[API] 既存登録の更新:', shopId);
      await docRef.set({
        ...baseData,
        shopIds: FieldValue.arrayUnion(shopId),
        topics: FieldValue.arrayUnion(topic),
      }, { merge: true });

      return NextResponse.json({
        success: true,
        topic,
        message: '登録を更新しました',
      }, { status: 200 });

    } else {
      console.log('[API] 新規登録:', { shopId, birthDate });
      await docRef.set({
        ...baseData,
        shopIds: [shopId],
        topics: [topic],
        createdAt: FieldValue.serverTimestamp(),
      }, { merge: true });

      return NextResponse.json({
        success: true,
        topic,
        message: '新規登録しました',
      }, { status: 200 });
    }

  } catch (error: any) {
    console.error('[API ERROR]', error.message, error.stack);
    return NextResponse.json({ error: '登録エラー: ' + error.message }, { status: 500 });
  }
}
