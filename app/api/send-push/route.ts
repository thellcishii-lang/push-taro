import { NextResponse } from 'next/server';
import { messaging, db, authAdmin } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// 🔍 トークンからプラットフォームを推測する簡易関数
function guessPlatform(token: string): string {
  if (!token) return 'unknown';
  // iPhone のトークンは長さが異なる傾向（APNsトークンは64文字の16進数 + FCMプレフィックス）
  // ここでは、特定のプレフィックスや長さで判断（あくまで推測）
  if (token.startsWith('c-') || token.startsWith('d-')) {
    return 'iPhone (APNs)';
  }
  if (token.includes('APA91')) {
    // Web Push トークンに多いパターン
    return 'Web (PC/Android)';
  }
  // その他は不明
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

    // 🔍 各トークンのプラットフォーム推定をログ出力
    registrationTokens.forEach((token, index) => {
      const platform = guessPlatform(token);
      console.log(`[send-push] 📱 トークン#${index+1}: ${token.slice(0, 20)}... (推定: ${platform})`);
    });

    if (registrationTokens.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: '有効なトークンがありません' 
      }, { status: 404 });
    }

    // ✅ マルチキャスト送信
    const message = {
      notification: {
        title, body },
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
        priority: 'high',
        notification: {
          sound: 'default',
        },
      },
      webpush: {
        headers: {
          Urgency: 'high',
        },
        notification: {
          icon: '/icon-192x192.png',
          requireInteraction: true,
        },
      },
      tokens: registrationTokens,
    };

    console.log(`[send-push] 🚀 送信開始: ${registrationTokens.length} 件`);

    const response = await messaging.sendEachForMulticast(message);

    console.log(`[send-push] ✅ 成功: ${response.successCount}, ❌ 失敗: ${response.failureCount}`);

    // 🔍 各トークンの送信結果をログ出力（プラットフォーム別に色分け）
    response.responses.forEach((resp, idx) => {
      const token = registrationTokens[idx];
      const platform = guessPlatform(token);
      if (!resp.success) {
        console.error(`[send-push] ❌ 失敗: ${token.slice(0, 20)}... (${platform})`, resp.error);
      } else {
        console.log(`[send-push] ✅ 成功: ${token.slice(0, 20)}... (${platform})`);
      }
    });

    // 失敗したトークンを Firestore から削除
    if (response.failureCount > 0) {
      const failedTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(registrationTokens[idx]);
        }
      });

      const batch = db.batch();
      for (const token of failedTokens) {
        const docRef = db.collection('subscriptions').doc(token);
        batch.delete(docRef);
        console.log(`[send-push] 🗑️ 削除: ${token.slice(0, 20)}...`);
      }
      await batch.commit();
      console.log(`[send-push] 🧹 ${failedTokens.length} 件の無効トークンを削除`);
    }

    // 履歴保存
    await db.collection('histories').add({
      shopId,
      title,
      body,
      imageUrl: imageUrl || null,
      linkUrl: linkUrl || null,
      sentAt: FieldValue.serverTimestamp(),
      status: 'success',
      successCount: response.successCount,
      failureCount: response.failureCount,
    });

    return NextResponse.json({ 
      success: true, 
      successCount: response.successCount,
      failureCount: response.failureCount,
    }, { status: 200 });

  } catch (error: any) {
    console.error('[send-push] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
