// app/api/square-webhook/route.ts
/**
 * Square Webhook のメインエントリ
 * 
 * 受信したイベントを各ハンドラに振り分けるだけのシンプルな構造。
 * 実処理は lib/square-webhook/ 配下に分離。
 */
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { notifyAdmins } from '@/lib/error-notifier';

import { handlePaymentFailed } from '@/lib/square-webhook/handle-payment-failed';
import { handleNewSignup } from '@/lib/square-webhook/handle-new-signup';
import { handleUpgrade } from '@/lib/square-webhook/handle-upgrade';
import { handleRecurring } from '@/lib/square-webhook/handle-recurring';
import { handleAgencyPaymentSuccess, handleAgencyPaymentFailed } from '@/lib/square-webhook/handle-agency-payment';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: any = {};

  try {
    body = await request.json();
    const eventType = body?.type;
    const dataObject = body?.data?.object;

    console.log(`[Square Webhook 受信] イベント種別: ${eventType}`);

    // ============================================================
    // 1. 引き落とし失敗
    // ============================================================
　　　　　　　　 if (eventType === 'invoice.payment_failed') {
      // 🆕 代理店の月額失敗チェック
      const invoice = dataObject?.invoice;
      const failedEmail = invoice?.primary_recipient?.email_address;
      const failedAmount = invoice?.amount_money?.amount;
      
      if (failedEmail && failedAmount) {
        const agencyResult = await handleAgencyPaymentFailed(failedEmail, failedAmount);
        if (agencyResult) {
          return NextResponse.json(agencyResult, { status: 200 });
        }
      }

      // 既存の店舗の決済失敗処理
      return await handlePaymentFailed(body);
    }
    
    if (eventType === 'invoice.payment_failed') {
      return await handlePaymentFailed(body);
    }

    // ============================================================
    // 2. 決済成功（新規 / アップグレード / 継続 の3分岐）
    // ============================================================
    if (eventType === 'payment.updated' || eventType === 'invoice.payment_made') {
      const payment = dataObject?.payment || dataObject?.invoice;
      const paymentStatus = payment?.status;

      // payment.updated の場合は COMPLETED のみ処理
      if (eventType === 'payment.updated' && paymentStatus !== 'COMPLETED') {
        return NextResponse.json({ received: true }, { status: 200 });
      }

      const customerEmail = payment?.buyer_email_address || payment?.primary_recipient?.email_address;
      const customerId = payment?.customer_id || null;
      const paymentId = payment?.id || null;

      if (!customerEmail) {
        return NextResponse.json({ error: '顧客のメールアドレスが見つかりません' }, { status: 400 });
      }
　　　　　　　　　　　if (eventType === 'payment.updated' || eventType === 'invoice.payment_made') {
      const payment = dataObject?.payment || dataObject?.invoice;
      const paymentStatus = payment?.status;

      if (eventType === 'payment.updated' && paymentStatus !== 'COMPLETED') {
        return NextResponse.json({ received: true }, { status: 200 });
      }

      const customerEmail = payment?.buyer_email_address || payment?.primary_recipient?.email_address;
      const customerId = payment?.customer_id || null;
      const paymentId = payment?.id || null;
      const amount = payment?.amount_money?.amount || 0;

      if (!customerEmail) {
        return NextResponse.json({ error: '顧客のメールアドレスが見つかりません' }, { status: 400 });
      }

      // 🆕 代理店の決済チェック（加盟金 or 月額）
      const agencyResult = await handleAgencyPaymentSuccess(customerEmail, amount, paymentId);
      if (agencyResult) {
        return NextResponse.json(agencyResult, { status: 200 });
      }
      // ============================================================
      // 冪等性チェック（同じ paymentId を2回処理しない）
      // ============================================================
      if (paymentId) {
        const alreadyProcessed = await db.collection('shops')
          .where('squarePaymentId', '==', paymentId)
          .limit(1)
          .get();

        if (!alreadyProcessed.empty) {
          console.log(`[Webhook] 既に処理済みの支払いID: ${paymentId}`);
          return NextResponse.json({ received: true, alreadyProcessed: true }, { status: 200 });
        }
      }

      // ============================================================
      // ① 新規登録（pending_payment の店舗が存在するか）
      // ============================================================
      const pendingShopSnap = await db.collection('shops')
        .where('email', '==', customerEmail)
        .where('status', '==', 'pending_payment')
        .limit(1)
        .get();

      if (!pendingShopSnap.empty) {
        return await handleNewSignup(
          pendingShopSnap.docs[0],
          customerEmail,
          customerId,
          paymentId
        );
      }

      // ============================================================
      // ② アップグレード（upgradeStatus pending_payment の店舗が存在するか）
      // ============================================================
      const upgradeShopSnap = await db.collection('shops')
        .where('email', '==', customerEmail)
        .where('upgradeStatus', '==', 'pending_payment')
        .limit(1)
        .get();

      if (!upgradeShopSnap.empty) {
        return await handleUpgrade(
          upgradeShopSnap.docs[0],
          customerEmail,
          paymentId
        );
      }

      // ============================================================
      // ③ 継続課金（上記いずれにも該当しない既存店舗）
      // ============================================================
      const existingShopSnap = await db.collection('shops')
        .where('email', '==', customerEmail)
        .limit(1)
        .get();

      if (!existingShopSnap.empty) {
        return await handleRecurring(
          existingShopSnap.docs[0],
          customerEmail,
          customerId,
          paymentId
        );
      }

      // ============================================================
      // 該当なし → 何もしない
      // ============================================================
      console.log(`[Webhook] 該当なし: ${customerEmail}`);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // ============================================================
    // その他のイベントタイプは無視
    // ============================================================
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error('[square-webhook] エラー:', error);

    await notifyAdmins(error, {
      source: 'square-webhook',
      details: { eventType: body?.type },
    });

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
