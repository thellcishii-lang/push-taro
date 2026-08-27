import { NextResponse } from 'next/server';
// import { stripe } from '@/lib/stripe';
// import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.text();
  // const sig = request.headers.get('stripe-signature')!;

  let event;
  try {
    // 1. StripeからのWebhook署名検証（本番では必須）
    // event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    
    // --- 【モック用イベントデータ】 ---
    event = {
      type: 'invoice.payment_succeeded',
      data: {
        object: {
          customer: 'cus_stripe_tenant_xxx', // 支払った店舗のStripe顧客ID
          amount_paid: 9800, // 支払額（円）
          subscription: 'sub_xxx'
        }
      }
    };
  } catch (err: any) {
    return NextResponse.json({ success: false, error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 2. 決済成功イベントの場合の処理
  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object;
    const stripeCustomerId = invoice.customer;
    const paidAmount = invoice.amount_paid; // 9800

    try {
      // 3. 支払った店舗情報を取得し、誰に紹介されたか（referral_relations）を調べる
      // const { data: tenant } = await supabase.from('tenants').select('id').eq('stripe_customer_id', stripeCustomerId).single();
      // const { data: relation } = await supabase.from('referral_relations').select('*').eq('referred_tenant_id', tenant.id).eq('status', 'active').single();

      // --- 【モックデータによるシミュレーション】 ---
      const relation = {
        referrer_id: 'user_agency_or_store_123', // 紹介者または代理店のID
        reward_rate: 0.30 // 代理店なら30%、一般紹介なら0.10
      };
      // ----------------------------------------

      if (relation) {
        // 4. 還元額を計算 (例: 9800円 × 30% = 2940円)
        const rewardAmount = Math.floor(paidAmount * relation.reward_rate);
        const currentMonth = new Date().toISOString().slice(0, 7); // '2026-08'

        // 5. 月別報酬明細テーブル（monthly_rewards）に加算・保存
        // await supabase.from('monthly_rewards').insert({
        //   user_id: relation.referrer_id,
        //   source_tenant_id: tenant.id,
        //   amount: rewardAmount,
        //   billing_month: currentMonth,
        //   status: 'unpaid' // 未払い（PayPay送金待ち・蓄積中）
        // });
      }

    } catch (dbErr) {
      console.error('報酬計算処理のエラー:', dbErr);
    }
  }

  return NextResponse.json({ received: true });
}
