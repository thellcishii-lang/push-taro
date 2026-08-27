// app/api/webhook/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';// Firestoreの初期化設定 // Firestoreの初期化設定

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const event = JSON.parse(body);

    // 決済完了やサブスクリプション成立のイベントをキャッチ
    // ※ Stripeの場合は 'invoice.payment_succeeded' や 'checkout.session.completed' など
    if (event.type === 'checkout.session.completed' || event.type === 'invoice.payment_succeeded') {
      const session = event.data.object;

      // メタデータから紹介コードと店舗情報を取得
      const referredByCode = session.metadata?.referredBy || null;
      const customerEmail = session.customer_email || session.customer_details?.email;
      const storeId = session.client_reference_id || session.customer;

      if (storeId) {
        // stores コレクションへ保存（既に存在する場合はステータスと紹介元を更新）
        await db.collection('stores').doc(storeId).set({
          email: customerEmail,
          status: 'active', // 有料プラン有効
          referredBy: referredByCode, // 代理店からの紹介コードをここで確定保存！
          updatedAt: new Date(),
        }, { merge: true });

        console.log(`Store ${storeId} successfully linked to referral code: ${referredByCode}`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
