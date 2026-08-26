import { NextResponse } from 'next/server';
import { db, authAdmin } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import nodemailer from 'nodemailer';

// メール送信用のトランスポーター設定（Gmailや各種SMTPサービスを使用）
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // 環境変数に設定する送信元メールアドレス
    pass: process.env.EMAIL_PASS, // アプリパスワード等
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // SquareからのWebhookイベント種別を確認（決済完了イベント等の判定）
    // ※実際のSquare Webhookのペイロード構造に合わせて調整します
    const eventType = body?.type;
    if (eventType !== 'payment.updated' && eventType !== 'order.fulfillment.updated') {
      // 決済完了に該当するイベント以外は一旦スルーまたは200を返す
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const payment = body?.data?.object?.payment;
    const customerEmail = payment?.buyer_email_address || body?.related_customer_email;
    const note = payment?.note || ''; // 申込時の店舗名や識別子をメモ等に入れてもらう想定

    if (!customerEmail) {
      return NextResponse.json({ error: '顧客のメールアドレスが見つかりません' }, { status: 400 });
    }

    // 1. ランダムな初期パスワードを生成
    const temporaryPassword = Math.random().toString(36.slice(-8)) + 'A1!';

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

    // 4. オーナーへログイン情報をメール送信
    const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com'}/admin`;
    
    await transporter.sendMail({
      from: '"プッシュ太郎 運営事務局" <' + process.env.EMAIL_USER + '>',
      to: customerEmail,
      subject: '【プッシュ太郎】初期ID・パスワードの発行のお知らせ',
      text: `
プッシュ太郎をご利用いただきありがとうございます。
決済が確認されましたので、管理画面用のログイン情報をお知らせいたします。

--------------------------------ログイン情報--------------------------------
管理画面URL: ${loginUrl}
ログインID（メールアドレス）: ${customerEmail}
初期パスワード: ${temporaryPassword}
----------------------------------------------------------------------------

初回ログイン後、管理画面よりパスワードの変更や店舗情報の設定を行ってください。
      `,
    });

    return NextResponse.json({ success: true, message: 'アカウントを発行しメールを送信しました' }, { status: 200 });

  } catch (error: any) {
    console.error('[square-webhook] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
