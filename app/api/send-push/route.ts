import { NextRequest, NextResponse } from 'next/server';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

export async function POST(req: NextRequest) {
  try {
    // 1. 認証トークンの確認
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '認証ヘッダーが不足しています' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (e) {
      return NextResponse.json({ error: '無効な認証トークンです' }, { status: 401 });
    }

    const body = await req.parseBody ? await req.parseBody() : await req.json();
    const { shopId, title, body: msgBody, iconUrl, linkUrl, targetToken } = body;

    if (!title || !msgBody) {
      return NextResponse.json({ error: 'タイトルと本文は必須です' }, { status: 400 });
    }

    // 2. トークン一覧の取得（重複を排除）
    let tokensToEvaluate: string[] = [];

    // ピンポイント送信（テストコンソール用）の場合
    if (targetToken) {
      tokensToEvaluate = [targetToken];
    } else {
      if (!shopId) {
        return NextResponse.json({ error: '店舗IDが指定されていません' }, { status: 400 });
      }

      // subscriptions コレクションのみから取得（token_chunksは重複の原因のため参照しない）
      const subSnapshot = await adminDb.collection('subscriptions')
        .where('shopId', '==', shopId)
        .get();

      const subTokens = subSnapshot.docs
        .map(doc => doc.data().token)
        .filter((t): t is string => typeof t === 'string' && t.length > 0);

      // Set を使って重複したトークンを完全に1つへ絞り込む
      tokensToEvaluate = Array.from(new Set(subTokens));
    }

    if (tokensToEvaluate.length === 0) {
      return NextResponse.json({ success: true, successCount: 0, failureCount: 0, message: '送信対象のトークンが存在しません' });
    }

    // 3. FCM送信メッセージの構築（Android / iOS / Web 共通）
    const message = {
      tokens: tokensToEvaluate,
      data: {
        title: title,
        body: msgBody,
        icon: iconUrl || '/icon-192x192.png',
        url: linkUrl || '/',
        shopId: shopId || 'default',
      },
      // 🔥 Android宛て設定（バックグラウンドで高優先度起動させる）
      android: {
        priority: 'high' as const,
        notification: {
          title: title,
          body: msgBody,
          icon: iconUrl || '/icon-192x192.png',
          sound: 'default',
          channelId: 'default',
          clickAction: linkUrl || '/',
        },
      },
      // 📱 iOS (APNs) 宛て設定
      apns: {
        payload: {
          aps: {
            alert: {
              title: title,
              body: msgBody,
            },
            sound: 'default',
            'content-available': 1,
          },
        },
      },
      // 💻 Web/PC 宛て設定
      webpush: {
        notification: {
          title: title,
          body: msgBody,
          icon: iconUrl || '/icon-192x192.png',
        },
        fcmOptions: {
          link: linkUrl || '/',
        },
      },
    };

    // 4. 一括送信の実行
    const response = await adminMessaging.sendEachForMulticast(message);

    return NextResponse.json({
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
      tokensCount: tokensToEvaluate.length,
      responses: response.responses.map((r, idx) => ({
        token: tokensToEvaluate[idx].substring(0, 15) + '...',
        success: r.success,
        error: r.error ? r.error.message : null,
      })),
    });

  } catch (error: any) {
    console.error('Send Push Error:', error);
    return NextResponse.json({ error: error.message || '送信処理中に例外が発生しました' }, { status: 500 });
  }
}
