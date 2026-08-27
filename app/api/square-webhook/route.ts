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
    const paidAmount = payment?.amount_money?.amount || 9800; // 決済金額（例: 9800円）
    
    // ※Squareの備考欄やメタデータ等に「紹介コード」が入っている想定（例: "PRO-ABC123"）
    // 特に入っていない場合は空文字になります
    const referralCode = payment?.reference_id || ''; 

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

    // 4. 【追加】紹介コードがある場合、紹介者または代理店を探して報酬を計算・保存する
    if (referralCode) {
      try {
        // 紹介コードを持っている店舗/代理店を検索
        const referrerSnapshot = await db.collection('shops')
          .where('referralCode', '==', referralCode)
          .limit(1)
          .get();

        if (!referrerSnapshot.empty) {
          const referrerDoc = referrerSnapshot.docs[0];
          const referrerData = referrerDoc.data();
          const referrerId = referrerDoc.id;

          // 権限によって還元率を変動させる（代理店 'agency' なら30%、一般紹介なら10%）
          const isAgency = referrerData.role === 'agency';
          const rewardRate = isAgency ? 0.30 : 0.10;

          // 還元額の計算（例: 9800円 × 30% = 2940円）
          const rewardAmount = Math.floor(paidAmount * rewardRate);
          const currentMonth = new Date().toISOString().slice(0, 7); // 例: '2026-08'

          // ① 誰が誰を紹介したかの紐付け（active）を保存
          await db.collection('referral_relations').add({
            referrerId: referrerId,
            referredTenantId: shopRef.id,
            rewardRate: rewardRate,
            status: 'active', // 離脱したら cancelled に更新すれば一覧から消せます
            createdAt: FieldValue.serverTimestamp(),
          });

          // ② 毎月の報酬明細（monthly_rewards）に保存（後でPayPay送金やCSVダウンロードに使う）
          await db.collection('monthly_rewards').add({
            userId: referrerId,
            sourceTenantId: shopRef.id,
            amount: rewardAmount,
            billingMonth: currentMonth,
            status: 'unpaid', // 未払い（PayPay送金待ち）
            createdAt: FieldValue.serverTimestamp(),
          });
        }
      } catch (refError) {
        console.error('[square-webhook] 紹介報酬の処理エラー:', refError);
        // 紹介処理でエラーが出ても、アカウント発行自体は止めないようにキャッチする
      }
    }

    const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com'}/admin`;

    // 5. サーバーのログに出力
    console.log('--- 【プッシュ太郎】アカウント自動発行＆紹介処理完了 ---');
    console.log(`宛先: ${customerEmail}`);
    console.log(`紹介コード: ${referralCode || 'なし'}`);
    console.log(`管理画面URL: ${loginUrl}`);
    console.log('--------------------------------------------------');

    return NextResponse.json({ success: true, message: 'アカウントを自動発行しました' }, { status: 200 });

  } catch (error: any) {
    console.error('[square-webhook] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
