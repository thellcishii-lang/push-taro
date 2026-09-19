// api/send-push/route.ts
import { NextResponse } from 'next/server';
import { messaging, db } from '../../../lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue } from 'firebase-admin/firestore';
import { notifyAdmins } from '@/lib/error-notifier';
import { PLAN_LIMITS, PLAN_LIMIT_LABELS } from '@/lib/constants';

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



export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  let uid: string;
  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await getAuth().verifyIdToken(idToken);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: '無効な認証トークンです' }, { status: 401 });
  }

  // ============================================================
  try {
    const systemConfig = await db.collection('config').doc('system').get();
    if (systemConfig.exists && systemConfig.data()?.isCircuitBreakerOpen === true) {
      console.warn('[send-push] 🚨 サーキットブレーカー発動中 - 送信をブロックしました');
      return NextResponse.json({
        success: false,
        error: '現在、システムは緊急停止中です。管理者にお問い合わせください。',
      }, { status: 503 });
    }
  } catch (err) {
    console.warn('[send-push] システム状態チェック失敗（続行）:', err);
  }

  try {
    const requestBody = await request.json();
    const { shopId: requestedShopId, title, body, url } = requestBody;

    const shopQuery = requestedShopId
      ? await db.collection('shops').where('ownerUid', '==', uid).where('__name__', '==', requestedShopId).limit(1).get()
      : await db.collection('shops').where('ownerUid', '==', uid).limit(1).get();
    if (shopQuery.empty) {
      return NextResponse.json({ error: '店舗が見つかりません' }, { status: 403 });
    }
    const shopDoc = shopQuery.docs[0];
    const shopId = shopDoc.id;
    const shopData = shopDoc.data();
    console.log(`[send-push] 🏪 店舗ID: ${shopId}`);

    if (!title || !body) {
      return NextResponse.json({ error: 'タイトルと本文は必須です' }, { status: 400 });
    }

    // ----------------------------------------------------
    // 📱 subscriptions から最新のトークンを取得（二重取得の防止）
    // ----------------------------------------------------
    const tokensSnapshot = await db.collection('subscriptions')
      .where('shopIds', 'array-contains', shopId)
      .get();

    const tokenByCustomer = new Map<string, { token: string; lastActive: number }>();
    tokensSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.token) {
        const customerKey = data.customerId || data.deviceId || data.token;
        const lastActive = data.lastActive?.toMillis?.() || data.lastActive?.seconds * 1000 || 0;
        const current = tokenByCustomer.get(customerKey);
        if (!current || lastActive >= current.lastActive) {
          tokenByCustomer.set(customerKey, { token: data.token, lastActive });
        }
      }
    });
    let registrationTokens = Array.from(tokenByCustomer.values()).map(({ token }) => token);

    // 重複を完全に除去
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
    const monthlyLimit = shopData.monthlyLimit || PLAN_LIMITS[planKey] || PLAN_LIMITS['standard'];
    const planName = PLAN_LIMIT_LABELS[planKey] || PLAN_LIMIT_LABELS['standard'];

    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    let currentMonthSent = shopData.currentMonthSent || 0;
    const lastSentMonth = shopData.lastSentMonth || '';

    if (lastSentMonth !== currentMonthStr) {
      currentMonthSent = 0;
    }

    const targetCount = registrationTokens.length;
        if (planKey !== 'pro' && (currentMonthSent + targetCount > monthlyLimit)) {
      return NextResponse.json({ 
        success: false, 
        error: `今月の送信上限（${planName}: ${monthlyLimit.toLocaleString()}件）に達するため送信できません。今月の送信済み数: ${currentMonthSent.toLocaleString()}件` 
      }, { status: 400 });
    }

    const configuredBaseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const appBaseUrl = process.env.NODE_ENV === 'production'
      ? configuredBaseUrl.replace(/^http:/, 'https:')
      : configuredBaseUrl;
    const target = new URL(url || `/subscribe?s=${shopId}`, appBaseUrl);
    if (target.origin === new URL(appBaseUrl).origin && !target.pathname.startsWith('/subscribe')) {
      target.searchParams.set('returnTo', `/subscribe?s=${encodeURIComponent(shopId)}`);
    }
    const targetUrl = target.toString();
    const displayTitle = title || shopData.name || 'Push-taro';
    const displayIcon = new URL(shopData.iconUrl || '/icon-192x192.png', appBaseUrl).toString();
    const notificationId = crypto.randomUUID();

    // ✅ 各OSに特化した全端末対応メッセージ構造
    const baseMessage = {
      data: {
        title: String(displayTitle),
        body: String(body),
        icon: String(displayIcon),
        url: String(targetUrl),
        shopId: String(shopId),
        notificationId,
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title: displayTitle,
              body: body,
            },
            sound: 'default',
            badge: 1,
            'content-available': 1,
          },
        },
      },
      android: {
        priority: 'high' as const,
        notification: {
          title: displayTitle,
          body: body,
          icon: displayIcon,
          sound: 'default',
        },
      },
      webpush: {
        headers: {
          Urgency: 'high',
        },
        fcmOptions: {
          link: targetUrl,
        },
      },
    };

    console.log(`[send-push] 🚀 送信開始 (総件数: ${targetCount} 件)`);

    const CHUNK_SIZE = 100;
    let totalSuccessCount = 0;
    let totalFailureCount = 0;
    const invalidTokens: string[] = [];

    for (let i = 0; i < registrationTokens.length; i += CHUNK_SIZE) {
      const chunkTokens = registrationTokens.slice(i, i + CHUNK_SIZE);
      console.log(`[send-push] 📦 バッチ送信中: ${i + 1} 〜 ${i + chunkTokens.length} 件目`);

      // sendEachForMulticast はFCMの廃止された一括エンドポイントへ
      // 接続してHTMLの404を返すことがあるため、HTTP v1単体送信を使う。
      const results = await Promise.all(chunkTokens.map(async (token) => {
        try {
          await messaging.send({
            ...baseMessage,
            token,
          });
          return { token, success: true };
        } catch (sendError: any) {
          const platform = guessPlatform(token);
          console.error(`[send-push] ❌ 失敗: ${token.slice(0, 20)}... (${platform})`, sendError);
          return { token, success: false, error: sendError };
        }
      }));

      for (const result of results) {
        if (result.success) {
          totalSuccessCount++;
          continue;
        }

        totalFailureCount++;
        const errorCode = result.error?.code;
        if (
          errorCode === 'messaging/registration-token-not-registered' ||
          errorCode === 'messaging/invalid-registration-token'
        ) {
          invalidTokens.push(result.token);
        }
      }
    }

    console.log(`[send-push] ✅ 合計成功: ${totalSuccessCount}, ❌ 合計失敗: ${totalFailureCount}`);

    // 🧹 FCMが無効と判定したトークンだけを削除する
    if (invalidTokens.length > 0) {
      const IN_LIMIT = 30;
      let deletedCount = 0;

      for (let i = 0; i < invalidTokens.length; i += IN_LIMIT) {
        const chunkFailedTokens = invalidTokens.slice(i, i + IN_LIMIT);
        
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

      console.log(`[send-push] 🧹 ${deletedCount} 件の無効トークンを完全に削除・整理しました`);
    }

    if (totalSuccessCount === 0) {
      await db.collection('histories').doc(notificationId).set({
        shopId,
        notificationId,
        title,
        body,
        linkUrl: url || null,
        sentAt: FieldValue.serverTimestamp(),
        status: 'error',
        successCount: 0,
        failureCount: totalFailureCount,
        openedCount: 0,
      });

      return NextResponse.json({
        success: false,
        error: `送信に失敗しました（対象 ${targetCount} 件、成功 0 件）。サーバーログでFCMエラーの詳細を確認してください。`,
        successCount: 0,
        failureCount: totalFailureCount,
      }, { status: 502 });
    }

    // 📈 今月の送信数を加算
    const newMonthSentCount = currentMonthSent + totalSuccessCount;
    await shopDoc.ref.update({
      currentMonthSent: newMonthSentCount,
      lastSentMonth: currentMonthStr,
    });

    // 📝 履歴保存
    await db.collection('histories').doc(notificationId).set({
      shopId,
      notificationId,
      title,
      body,
      linkUrl: url || null,
      sentAt: FieldValue.serverTimestamp(),
      status: 'success',
      successCount: totalSuccessCount,
      failureCount: totalFailureCount,
      openedCount: 0,
    });

    return NextResponse.json({ 
      success: true, 
      successCount: totalSuccessCount,
      failureCount: totalFailureCount,
      notificationId,
      currentMonthSent: newMonthSentCount,
    }, { status: 200 });

  } catch (error: any) {
    console.error('[send-push] エラー:', error);
    
    // 🔥 管理者通知
    await notifyAdmins(error, {
      source: 'send-push',
      userId: uid,
    });

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
