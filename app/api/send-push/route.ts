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
    const shopId = shopQuery.docs[0].id;
    console.log(`[send-push] 🏪 店舗ID: ${shopId}`);

    const { title, body, imageUrl, linkUrl } = await request.json();
    if (!title || !body) {
      return NextResponse.json({ error: 'タイトルと本文は必須です' }, { status: 400 });
    }

    // 📋 トークン取得（店舗に登録されている全トークン）
    const tokensSnapshot = await db.collection('subscriptions')
      .where('shopIds', 'array-contains', shopId)
      .get();

    console.log(`[send-push] 📋 該当ドキュメント数: ${tokensSnapshot.size}`);

    if (tokensSnapshot.empty) {
      return NextResponse.json({ 
        success: false, 
        error: 'この店舗に登録されている端末がありません' 
      }, { status: 404 });
    }

    const registrationTokens: string[] = [];
    tokensSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.token) {
        registrationTokens.push(data.token);
      }
    });

    console.log(`[send-push] 📱 取得したトークン数: ${registrationTokens.length}`);

    if (registrationTokens.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: '有効なトークンがありません' 
      }, { status: 404 });
    }

    // ✅ 基本のメッセージ構造
    const baseMessage = {
      data: {
        title: title,
        body: body,
        image: imageUrl || '',
        url: linkUrl || '',
        shopId: shopId,
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
        notification: {
          sound: 'default',
        },
      },
      webpush: {
        headers: {
          Urgency: 'high',
        },
      },
    };

    console.log(`[send-push] 🚀 送信開始 (総件数: ${registrationTokens.length} 件)`);

    // 🛡️ 500件の上限に対して安全に「450件ずつ」に分割（チャンク処理）
    const CHUNK_SIZE = 450;
    let totalSuccessCount = 0;
    let totalFailureCount = 0;
    const failedTokens: string[] = [];

    for (let i = 0; i < registrationTokens.length; i += CHUNK_SIZE) {
      const chunkTokens = registrationTokens.slice(i, i + CHUNK_SIZE);
      console.log(`[send-push] 📦 チャンク送信中: ${i + 1} 〜 ${i + chunkTokens.length} 件目`);

      const message = {
        ...baseMessage,
        tokens: chunkTokens,
      };

      try {
        const response = await messaging.sendEachForMulticast(message);
        totalSuccessCount += response.successCount;
        totalFailureCount += response.failureCount;

        // このチャンクで失敗したトークンを回収
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            const token = chunkTokens[idx];
            failedTokens.push(token);
            const platform = guessPlatform(token);
            console.error(`[send-push] ❌ 失敗: ${token.slice(0, 20)}... (${platform})`, resp.error);
          }
        });
      } catch (chunkError) {
        console.error(`[send-push] ❌ チャンク送信エラー (index ${i}):`, chunkError);
        // チャンク全体が失敗した場合のフォールバックとしてカウント
        totalFailureCount += chunkTokens.length;
      }
    }

    console.log(`[send-push] ✅ 合計成功: ${totalSuccessCount}, ❌ 合計失敗: ${totalFailureCount}`);

    // 🗑️ 失敗した全トークンを Firestore からまとめて削除
    if (failedTokens.length > 0) {
      // Firestoreのバッチ処理は一度に最大500件までなので、安全に分割して削除
      for (let i = 0; i < failedTokens.length; i += 400) {
        const batchTokens = failedTokens.slice(i, i + 400);
        const batch = db.batch();
        for (const token of batchTokens) {
          const docRef = db.collection('subscriptions').doc(token);
          batch.delete(docRef);
        }
        await batch.commit();
      }
      console.log(`[send-push] 🧹 ${failedTokens.length} 件の無効トークンを削除しました`);
    }

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
