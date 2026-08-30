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

    if (!token || !shopId) {
      return NextResponse.json({ error: 'tokenとshopIdが必要です' }, { status: 400 });
    }

    // 店舗存在確認
    const shopDoc = await db.collection('shops').doc(shopId).get();
    if (!shopDoc.exists) {
      return NextResponse.json({ error: '店舗が見つかりません' }, { status: 404 });
    }

    // Proプラン用 生年月日の数値化処理
    let birthMonth: number | null = null;
    let birthDay: number | null = null;

    if (birthDate) {
      const dateObj = new Date(birthDate);
      if (!isNaN(dateObj.getTime())) {
        birthMonth = dateObj.getMonth() + 1;
        birthDay = dateObj.getDate();
      }
    }

    const normalizedToken = token.trim();
    const topic = `shop_${shopId}_users`;
    const docRef = db.collection('subscriptions').doc(normalizedToken);
    const doc = await docRef.get();

    // FCM トピック登録
    try {
      await messaging.subscribeToTopic([normalizedToken], topic);
    } catch (fcmError) {
      console.error('[subscribe] FCM subscribe error:', fcmError);
    }

    // ----------------------------------------------------
    // ⚡️ 5,000件チャンク保存
    // ----------------------------------------------------
    const chunksRef = db.collection('shops').doc(shopId).collection('token_chunks');
    const snapshot = await chunksRef.orderBy('createdAt', 'desc').limit(1).get();

    let targetDocRef;
    let currentTokens: string[] = [];

    if (snapshot.empty) {
      targetDocRef = chunksRef.doc('chunk_1');
    } else {
      const lastDoc = snapshot.docs[0];
      const data = lastDoc.data();
      currentTokens = data.tokens || [];

      if (currentTokens.length >= 5000) {
        const nextIndex = snapshot.docs.length + 1;
        targetDocRef = chunksRef.doc(`chunk_${nextIndex}`);
        currentTokens = [];
      } else {
        targetDocRef = lastDoc.ref;
      }
    }

    if (!currentTokens.includes(normalizedToken)) {
      currentTokens.push(normalizedToken);
      
      // 🔴 修正: createdAt と updatedAt を明示的に設定
      const chunkData: any = {
        tokens: currentTokens,
        updatedAt: FieldValue.serverTimestamp(),
      };
      
      // 新規ドキュメントの場合のみ createdAt を設定
      if (currentTokens.length === 1 && !snapshot.empty) {
        // 新規チャンクの場合
        chunkData.createdAt = FieldValue.serverTimestamp();
      } else if (snapshot.empty) {
        // 最初のチャンクの場合
        chunkData.createdAt = FieldValue.serverTimestamp();
      }
      
      await targetDocRef.set(chunkData, { merge: true });
    }

    // ----------------------------------------------------
    // 👤 個別顧客プロファイル（subscriptions）の保存/更新
    // ----------------------------------------------------
    
    // 🔴 修正: 保存するデータを明示的に構築（undefinedを排除）
    const baseData: any = {
      token: normalizedToken,
      lastActive: FieldValue.serverTimestamp(),
    };

    // birthDate がある場合のみ追加
    if (birthDate) {
      baseData.birthDate = birthDate;
      baseData.birthMonth = birthMonth;
      baseData.birthDay = birthDay;
    }

    if (doc.exists) {
      const data = doc.data();
      const shopIds = data?.shopIds || [];

      if (shopIds.includes(shopId)) {
        // 更新: 既存店舗
        await docRef.update({
          ...baseData,
          // 🔴 修正: 更新時は createdAt を上書きしない
        });

        return NextResponse.json({
          success: true,
          topic,
          message: '既存の登録を更新しました',
        }, { status: 200 });
      } else {
        // 更新: 新しい店舗を追加
        await docRef.update({
          ...baseData,
          shopIds: FieldValue.arrayUnion(shopId),
          topics: FieldValue.arrayUnion(topic),
          // 🔴 修正: createdAt は既存のものを保持
        });

        return NextResponse.json({
          success: true,
          topic,
          message: '新しい店舗を追加しました',
        }, { status: 200 });
      }
    } else {
      // 新規登録
      const newDocData: any = {
        token: normalizedToken,
        shopIds: [shopId],
        topics: [topic],
        createdAt: FieldValue.serverTimestamp(),
        lastActive: FieldValue.serverTimestamp(),
      };

      // birthDate がある場合のみ追加
      if (birthDate) {
        newDocData.birthDate = birthDate;
        newDocData.birthMonth = birthMonth;
        newDocData.birthDay = birthDay;
      }

      await docRef.set(newDocData);

      return NextResponse.json({
        success: true,
        topic,
        message: '新規登録しました',
      }, { status: 200 });
    }

  } catch (error: any) {
    console.error('[API ERROR]', error.message, error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
