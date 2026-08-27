// app/api/webhook/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function POST(req: Request) {
  const event = await req.json();

  // 決済完了イベント（例: SquareやStripeのサブスクリプション初回決済成功時）
  if (event.type === 'payment.completed' || event.type === 'invoice.payment_succeeded') {
    const paymentObj = event.data.object;
    
    const storeId = paymentObj.metadata?.storeId || paymentObj.customer_id;
    const storeEmail = paymentObj.customer_email;
    const planType = paymentObj.metadata?.planType || 'pro';
    
    // 登録時にURL等から保持していた紹介コード（メタデータやカスタムフィールド経由で引き継ぐ）
    const referredByCode = paymentObj.metadata?.referredBy || null;

    // 店舗データを Firestore に保存・更新
    await db.collection('stores').doc(storeId).set({
      email: storeEmail,
      plan: planType,
      status: 'active', // 有料プラン継続中
      referredBy: referredByCode, // 代理店等の紹介コード
      createdAt: new Date(),
    }, { merge: true });
  }

  return NextResponse.json({ received: true });
}
