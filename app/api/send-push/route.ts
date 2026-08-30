import { NextResponse } from 'next/server';
import { messaging, db, authAdmin } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// 🔍 トークンからプラットフォームを推測する簡易関数
function guessPlatform(token: string): string {
  if (!token) return 'unknown';
  if (token.startsWith('c-') || token.startsWith('d-')) {
    return 'iPhone (APNs)';
  }
  if (token.includes('APA91')) {
    return 'Web (PC/Android)';
  }
  return 'unknown';
}

// 📦 プランごとの月間送信上限
const PLAN_LIMITS: Record<string, { name: string; limit: number }> = {
  light: { name: 'ライトプラン', limit: 5000 },
  standard: { name: 'スタンダードプラン', limit: 15000 },
  pro: { name: 'プロプラン', limit: 5000000 }, // 登録5万人・無制限対応
};

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  let uid: string;
  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await authAdmin.verifyIdToken(idToken);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: '無効な認証トークンです' }, { status: 401 });
  }

  try {
    const shopQuery = await db.collection('shops').where('ownerUid', '==', uid).limit(1).get();
    if (shopQuery.empty) {
      return NextResponse.json({ error: '店舗が見つかりません' }, { status: 403 });
    }
    const shopDoc = shopQuery.docs[0];
    const shopId = shopDoc.id;
    const shopData = shopDoc.data();
    console.log(`[send-push] 🏪 店舗ID: ${shopId}`);

    const { title, body, imageUrl, linkUrl } = await request.json();
    if (!title || !body) {
      return NextResponse.json({ error: 'タイトルと本文は必須です' }, { status: 400 });
    }

    // ----------------------------------------------------
    // ⚡️ 1. チャンク保存データ（5,000件まとめ）から高速一括取得
    // ----------------------------------------------------
    let registrationTokens: string[] = [];
    const chunksSnapshot = await db.collection('shops').doc(shopId).collection('token_chunks').get();

    if (!chunksSnapshot.empty) {
      chunksSnapshot.forEach((chunkDoc) => {
        const chunkData = chunkDoc.data();
        if (Array.isArray(chunkData.tokens)) {
          registrationTokens = registrationTokens.concat(chunkData.tokens);
        }
      });
      console.log(`[send-push] ⚡️ チャンクからトークン一括取得完了 (${chunksSnapshot.size} ドキュメント / 計 ${registrationTokens.length} 件)`);
    }

    // ----------------------------------------------------
    // 🛡️ 2. フォールバック（既存の subscriptions コレクションから取得）
    // ----------------------------------------------------
    if (registrationTokens.length === 0) {
      const tokensSnapshot = await db.collection('subscriptions')
        .where('shopIds', 'array-contains', shopId)
        .get();

      console.log(`[send-push] 📋 従来の subscriptions ドキュメント数: ${tokensSnapshot.size}`);

      tokensSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.token) {
          registrationTokens.push(data.token);
        }
      });
    }

    // 重複を除去
    registrationTokens = Array.from(new Set(registrationTokens));
    console.log(`[send-push] 📱 最終ターゲットトークン数: ${registrationTokens.length}`);

    if (registrationTokens.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'この店舗に登録されている端末（有効なトークン）がありません' 
      }, { status: 404 });
    }

    // 🛡️ プランと月間送信上限のチェック
    const planKey = shopData.plan || 'standard';
    const planInfo = PLAN_LIMITS[planKey] || PLAN_LIMITS['standard'];
    const monthlyLimit = shopData.monthlyLimit || planInfo.limit;

    // 現在の年月（例: "2026-08"）
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    let currentMonthSent = shopData.currentMonthSent || 0;
    const lastSentMonth = shopData.lastSentMonth || '';

    // 月が変わっていたら送信数をリセット
    if (lastSentMonth !== currentMonthStr) {
      currentMonthSent = 0;
    }

    // PROプラン以外で上限オーバーのチェック（PROプランは無制限扱い）
    const targetCount = registrationTokens.length;
    if (planKey !== 'pro' && (currentMonthSent + targetCount > monthlyLimit)) {
      return NextResponse.json({ 
        success: false, 
        error: `今月の送信上限（${planInfo.name}: ${monthlyLimit.toLocaleString()}件）に達するため送信できません。今月の送信済み数: ${currentMonthSent.toLocaleString()}件` 
      }, { status: 400 });
    }

   // 現在時刻とユニークIDの生成
    const nowTimestamp = Date.now();
    const uniqueMsgId = `msg_${nowTimestamp}_${Math.random().toString(36).substring(2, 7)}`;

    // ✅ 基本のメッセージ構造（Android/PCで確実に受信できるよう再調整）
    const baseMessage = {
      data: {
        title: title,
        body: body,
        image: imageUrl || '',
        url: linkUrl || '',
        shopId: shopId,
        msgId: uniqueMsgId,                // 通知履歴の上書き防止用ID
        timestamp: String(nowTimestamp),   // 正しい時刻の伝達用
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
            'content-available': 1,
          },
        },
      },
      android: {
        priority: 'high' as const,
      },
      webpush: {
        headers: {
          Urgency: 'high',
        },
      },
    };

    console.log(`[send-push] 🚀 送信開始 (総件数: ${targetCount} 件)`);

    // 🛡️ FCM上限(500件)に対して安全に「450件ずつ」に分割（バッチ処理）
    const CHUNK_SIZE = 450;
    let totalSuccessCount = 0;
    let totalFailureCount = 0;
    const failedTokens: string[] = [];

    for (let i = 0; i < registrationTokens.length; i += CHUNK_SIZE) {
      const chunkTokens = registrationTokens.slice(i, i + CHUNK_SIZE);
      console.log(`[send-push] 📦 バッチ送信中: ${i + 1} 〜 ${i + chunkTokens.length} 件目`);

      const message = {
        ...baseMessage,
        tokens: chunkTokens,
      };

      try {
        const response = await messaging.sendEachForMulticast(message);
        totalSuccessCount += response.successCount;
        totalFailureCount += response.failureCount;

        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            const token = chunkTokens[idx];
            failedTokens.push(token);
            const platform = guessPlatform(token);
            console.error(`[send-push] ❌ 失敗: ${token.slice(0, 20)}... (${platform})`, resp.error);
          }
        });
      } catch (chunkError) {
        console.error(`[send-push] ❌ バッチ送信エラー (index ${i}):`, chunkError);
        totalFailureCount += chunkTokens.length;
      }
    }

    console.log(`[send-push] ✅ 合計成功: ${totalSuccessCount}, ❌ 合計失敗: ${totalFailureCount}`);

    // 🧹 失敗した全トークンを Firestore (subscriptions & token_chunks) から完全削除
    if (failedTokens.length > 0) {
      const IN_LIMIT = 30;
      let deletedCount = 0;

      // 1. subscriptions から削除
      for (let i = 0; i < failedTokens.length; i += IN_LIMIT) {
        const chunkFailedTokens = failedTokens.slice(i, i + IN_LIMIT);
        
        const invalidDocsSnapshot = await db.collection('subscriptions')
          .where('token', 'in', chunkFailedTokens)
          .get();

        if (!invalidDocsSnapshot.empty) {
          const batch = db.batch();
          invalidDocsSnapshot.forEach((doc) => {
            batch.delete(doc.ref);
            deletedCount++;
          });
          await batch.commit();
        }
      }

      // 2. token_chunks 配列からも失敗トークンをクリーニング
      if (!chunksSnapshot.empty) {
        for (const chunkDoc of chunksSnapshot.docs) {
          const chunkData = chunkDoc.data();
          if (Array.isArray(chunkData.tokens)) {
            const updatedTokens = chunkData.tokens.filter((t: string) => !failedTokens.includes(t));
            if (updatedTokens.length !== chunkData.tokens.length) {
              await chunkDoc.ref.update({
                tokens: updatedTokens,
                updatedAt: FieldValue.serverTimestamp(),
              });
            }
          }
        }
      }

      console.log(`[send-push] 🧹 ${deletedCount} 件の無効トークンを完全に削除・整理しました`);
    }

    // 📈 今月の送信数を加算して店舗ドキュメントを更新
    const newMonthSentCount = currentMonthSent + totalSuccessCount;
    await shopDoc.ref.update({
      currentMonthSent: newMonthSentCount,
      lastSentMonth: currentMonthStr,
    });

    // 📝 履歴保存
    await db.collection('histories').add({
      shopId,
      title,
      body,
      imageUrl: imageUrl || null,
      linkUrl: linkUrl || null,
      sentAt: FieldValue.serverTimestamp(),
      status: 'success',
      successCount: totalSuccessCount,
      failureCount: totalFailureCount,
    });

    return NextResponse.json({ 
      success: true, 
      successCount: totalSuccessCount,
      failureCount: totalFailureCount,
    }, { status: 200 });

  } catch (error: any) {
    console.error('[send-push] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
