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
    const { token, shopId, birthDate } = body; // 👈 birthDate を受け取る

    if (!token || !shopId) {
      return NextResponse.json({ error: 'tokenとshopIdが必要です' }, { status: 400 });
    }

    // 店舗存在確認
    const shopDoc = await db.collection('shops').doc(shopId).get();
    if (!shopDoc.exists) {
      return NextResponse.json({ error: '店舗が見つかりません' }, { status: 404 });
    }

    // Proプランで送られてきた誕生日の数値化処理（月抽出用）
    let birthMonth: number | null = null;
    let birthDay: number | null = null;

    if (birthDate) {
      const dateObj = new Date(birthDate);
      if (!isNaN(dateObj.getTime())) {
        birthMonth = dateObj.getMonth() + 1; // 1〜12月
        birthDay = dateObj.getDate();        // 1〜31日
      }
    }

    const normalizedToken = token.trim();
    const topic = `shop_${shopId}_users`;
    const docRef = db.collection('subscriptions').doc(normalizedToken);
    const doc = await docRef.get();

    // FCM トピック登録
    await messaging.subscribeToTopic([normalizedToken], topic);

    if (doc.exists) {
      const data = doc.data();
      const shopIds = data?.shopIds || [];

      // 生年月日データオブジェクト
      const birthDataUpdate = birthDate ? {
        birthDate,
        birthMonth,
        birthDay,
      } : {};

      // ✅ 同じ店舗が既に登録されているかチェック
      if (shopIds.includes(shopId)) {
        // 同じ店舗 → 最終アクティブ日時および生年月日情報を更新
        console.log('[API] 同じ店舗への再登録（更新）:', shopId);
        await docRef.update({
          ...birthDataUpdate,
          lastActive: FieldValue.serverTimestamp(),
        });

        return NextResponse.json({
          success: true,
          topic,
          message: '既存の登録を更新しました',
        }, { status: 200 });
      } else {
        // 別の店舗 → 追加登録
        console.log('[API] 別の店舗を追加:', shopId);
        await docRef.update({
          ...birthDataUpdate,
          shopIds: FieldValue.arrayUnion(shopId),
          topics: FieldValue.arrayUnion(topic),
          lastActive: FieldValue.serverTimestamp(),
        });

        return NextResponse.json({
          success: true,
          topic,
          message: '新しい店舗を追加しました',
        }, { status: 200 });
      }
    } else {
      // 新規トークン → 新規作成（生年月日もセット）
      console.log('[API] 新規登録:', { token: normalizedToken.slice(0, 20) + '...', shopId, birthDate });
      await docRef.set({
        token: normalizedToken,
        shopIds: [shopId],
        topics: [topic],
        birthDate: birthDate || null,
        birthMonth: birthMonth || null,
        birthDay: birthDay || null,
        createdAt: FieldValue.serverTimestamp(),
        lastActive: FieldValue.serverTimestamp(),
      });

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
