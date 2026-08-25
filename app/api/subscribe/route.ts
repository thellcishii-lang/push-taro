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
  console.log('[API CHECK 1] リクエスト受信 from IP:', ip);

  if (isRateLimited(ip)) {
    console.log('[API CHECK 1] レート制限ヒット');
    return NextResponse.json({ error: 'レート制限を超えました' }, { status: 429 });
  }

  try {
    const body = await request.json();
    console.log('[API CHECK 2] 受信ボディ:', { token: body.token?.slice(0, 20) + '...', shopId: body.shopId });

    const { token, shopId } = body;
    if (!token || !shopId) {
      console.log('[API CHECK 2] バリデーション失敗:', { hasToken: !!token, hasShopId: !!shopId });
      return NextResponse.json({ error: 'tokenとshopIdが必要です' }, { status: 400 });
    }

    console.log('[API CHECK 3] Firestoreで店舗検索:', shopId);
    const shopDoc = await db.collection('shops').doc(shopId).get();
    console.log('[API CHECK 3] 店舗存在:', shopDoc.exists);
    
    if (!shopDoc.exists) {
      return NextResponse.json({ error: '店舗が見つかりません' }, { status: 404 });
    }

    const topic = `shop_${shopId}_users`;
    console.log('[API CHECK 4] FCMトピック登録:', topic);
    const subscribeResult = await messaging.subscribeToTopic([token], topic);
    console.log('[API CHECK 4] FCM登録結果:', subscribeResult);

    console.log('[API CHECK 5] Firestore書き込み開始:', { token: token.slice(0, 20) + '...', shopId, topic });
    
    // 🔥 修正: shopId + token でドキュメントIDを生成
    const docId = `${shopId}_${token}`;
    await db.collection('subscriptions').doc(docId).set({
      token,
      shopId,
      topic,
      createdAt: FieldValue.serverTimestamp(),
      lastActive: FieldValue.serverTimestamp(),
    });
    
    console.log('[API CHECK 5] Firestore書き込み完了');

    console.log('[API CHECK 6] レスポンス返却: success');
    return NextResponse.json({ success: true, topic }, { status: 200 });
  } catch (error: any) {
    console.error('[API CHECK ERROR] 例外発生:', error.message, error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
