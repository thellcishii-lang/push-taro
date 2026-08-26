import { NextResponse } from 'next/server';
import { db, authAdmin } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // SquareからのWebhookイベント種別を確認
    const eventType = body?.type;
    if (eventType !== 'payment.updated' && eventType !== 'order.fulfillment.updated') {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const payment = body?.data?.object?.payment;
    const customerEmail = payment?.buyer_email_address || body?.related_customer_email;
    const note = payment?.note || ''; // 申込時の店舗名など

    if (!customerEmail) {
      return NextResponse.json({ error: '顧客のメールアドレスが見つかりません' }, { status: 400 });
    }

    // 1. ランダムな初期パスワードを生成
    const temporaryPassword = Math.random().toString(36).slice(-8) + 'A1!';

    // 2. Firebase Authにアカウント（ID/パスワード）を自動作成
    const userRecord = await authAdmin.createUser({
      email: customerEmail,
      password: temporaryPassword,
      emailVerified: true,
    });

    const uid = userRecord.uid;

    // 3. Firestoreに初期の店舗データを作成
    const shopRef = db.collection('shops').doc();
    await shopRef.set({
      name: note || '未設定の店舗',
      ownerUid: uid,
      createdAt: FieldValue.serverTimestamp(),
      coupon: { enabled: false, title: '', description: '', discountRate: 0 },
      linkUrl: '',
      iconUrl: '',
    });

    const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com'}/admin`;

    // 4. メール送信の代わりに、まずはサーバーのログに確実に情報を出力
    // ※必要に応じてここを外部のメール配信用API（Resend等）の fetch に置き換え可能
    console.log('--- 【プッシュ太郎】アカウント自動発行完了 ---');
    console.log(`宛先: ${customerEmail}`);
    console.log(`ログインID: ${customerEmail}`);
    console.log(`初期パスワード: ${temporaryPassword}`);
    console.log(`管理画面URL: ${loginUrl}`);
    console.log('---------------------------------------------');

    return NextResponse.json({ success: true, message: 'アカウントを自動発行しました' }, { status: 200 });

  } catch (error: any) {
    console.error('[square-webhook] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
