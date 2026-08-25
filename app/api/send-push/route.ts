import { NextResponse } from 'next/server';
import { messaging, db, authAdmin } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  // ...（認証部分は既存のまま）...

  try {
    // 店舗情報を取得（既存のまま）
    const shopQuery = await db.collection('shops').where('ownerUid', '==', uid).limit(1).get();
    if (shopQuery.empty) {
      return NextResponse.json({ error: '店舗が見つかりません' }, { status: 403 });
    }
    const shopId = shopQuery.docs[0].id;

    const { title, body, imageUrl, linkUrl } = await request.json();

    // 🔥 追加: この店舗の全デバイストークンを取得
    const tokensSnapshot = await db.collection('subscriptions')
      .where('shopId', '==', shopId)
      .get();

    if (tokensSnapshot.empty) {
      return NextResponse.json({ error: '購読者がいません' }, { status: 404 });
    }

    const registrationTokens = tokensSnapshot.docs.map(doc => doc.data().token);

    // 🔥 修正: トピック送信 → マルチキャスト送信に変更
    const message = {
      notification: {
        title: title,
        body: body,
        ...(imageUrl ? { image: imageUrl } : {}),
      },
      data: {
        ...(linkUrl ? { url: linkUrl } : {}),
        shopId: shopId,
      },
      // 🍏 iOS（iPhone）向け
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
            'content-available': 1,
          },
        },
      },
      // 🤖 Android向け
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          clickAction: 'FLUTTER_NOTIFICATION_CLICK',
        },
      },
      // 💻 PC（Web）向け
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

    // 🔥 修正: messaging.send() → messaging.sendEachForMulticast()
    const response = await messaging.sendEachForMulticast(message);

    // 🔥 送信結果をFirestoreに保存（履歴）
    await db.collection('histories').add({
      shopId,
      title,
      body,
      imageUrl: imageUrl || null,
      linkUrl: linkUrl || null,
      sentAt: FieldValue.serverTimestamp(),
      status: response.failureCount === 0 ? 'success' : 'partial',
      targetCount: registrationTokens.length,
      successCount: response.successCount,
      failureCount: response.failureCount,
    });

    // 🔥 無効なトークンをFirestoreから削除（クリーンアップ）
    if (response.failureCount > 0) {
      const invalidTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.error(`[send-push] 無効なトークン: ${registrationTokens[idx]}`, resp.error);
          invalidTokens.push(registrationTokens[idx]);
        }
      });

      // 無効なトークンを一括削除
      for (const token of invalidTokens) {
        const docId = `${shopId}_${token}`;
　　　　　　　　　　　　　　　　　　await db.collection('subscriptions').doc(docId).delete();
        console.log(`[send-push] 無効なトークンを削除: ${token}`);
      }
    }

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
