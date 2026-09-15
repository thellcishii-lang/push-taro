// app/api/square-webhook/route.ts
/**
 * Square Webhook のメインエントリ
 */
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { notifyAdmins } from '@/lib/error-notifier';
import crypto from 'crypto';

import { handlePaymentFailed } from '@/lib/square-webhook/handle-payment-failed';
import { handleNewSignup } from '@/lib/square-webhook/handle-new-signup';
import { handleUpgrade } from '@/lib/square-webhook/handle-upgrade';
import { handleRecurring } from '@/lib/square-webhook/handle-recurring';
import { handleAgencyPaymentSuccess, handleAgencyPaymentFailed } from '@/lib/square-webhook/handle-agency-payment';

export const dynamic = 'force-dynamic';

async function verifySquareSignature(request: Request, rawBody: string): Promise<boolean> {
  const signature = request.headers.get('x-square-hmacsha256-signature');
  if (!signature) return false;

  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  const notificationUrl = process.env.SQUARE_WEBHOOK_NOTIFICATION_URL;
  if (!signatureKey || !notificationUrl) return false;

  const expected = crypto
    .createHmac('sha256', signatureKey)
    .update(notificationUrl + rawBody)
    .digest('base64');

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const rawBody = await request.text();

  // 内部呼び出し（force-activate等）は別シークレットでスキップ
  const internalSecret = request.headers.get('x-internal-secret');
  const isInternal =
    !!internalSecret &&
    !!process.env.CRON_SECRET &&
    internalSecret === process.env.CRON_SECRET;

  if (!isInternal) {
    const valid = await verifySquareSignature(request, rawBody);
    if (!valid) {
      console.warn('[square-webhook] 署名検証失敗');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  let body: any = {};
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  try {
    const eventType = body?.type;
    const dataObject = body?.data?.object;

    console.log(`[Square Webhook 受信] イベント種別: ${eventType}`);

    // ============================================================
    // 1. 引き落とし失敗
    // ============================================================
    if (eventType === 'invoice.payment_failed') {
      const invoice = dataObject?.invoice;
      const failedEmail = invoice?.primary_recipient?.email_address;
      const failedAmount = invoice?.amount_money?.amount;

      // 🆕 代理店の月額失敗チェック
      if (failedEmail && failedAmount) {
        const agencyResult = await handleAgencyPaymentFailed(failedEmail, failedAmount);
        if (agencyResult) {
          return NextResponse.json(agencyResult, { status: 200 });
        }
      }

      // 店舗の決済失敗処理
      return await handlePaymentFailed(body);
    }

    // ============================================================
    // 2. 決済成功（代理店 / 新規 / アップグレード / 継続 の4分岐）
    // ============================================================
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
      // 冪等性チェック（店舗用）
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
      // ① 新規登録
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
      // ② アップグレード
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
      // ③ 継続課金
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
      // 該当なし
      // ============================================================
      console.log(`[Webhook] 該当なし: ${customerEmail}`);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // その他のイベントタイプは無視
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
