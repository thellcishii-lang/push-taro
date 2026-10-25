// app/api/pos/v1/redeem/route.ts
/**
 * POS連携: クーポン消込確定
 *
 * POST /api/pos/v1/redeem
 *   Idempotency-Key: uuid（必須）
 */
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { authenticatePosRequest, isPosAuthError } from '@/lib/pos-api-auth';
import { redeemCouponCore, RedeemError } from '@/lib/redeem-coupon-core';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const auth = await authenticatePosRequest(request);
  if (isPosAuthError(auth)) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const idempotencyKey = request.headers.get('Idempotency-Key');
  if (!idempotencyKey) {
    return NextResponse.json({ error: 'Idempotency-Key ヘッダが必要です' }, { status: 400 });
  }

  const idempotencyRef = db.collection('pos_api_logs').doc(`${auth.shopId}_${idempotencyKey}`);

  try {
    const body = await request.json();
    const { qrPayload } = body;

    if (!qrPayload || typeof qrPayload !== 'string') {
      return NextResponse.json({ error: 'qrPayload が必要です' }, { status: 400 });
    }

    let parsed: any;
    try {
      parsed = JSON.parse(qrPayload);
    } catch {
      return NextResponse.json({ error: 'qrPayload の形式が正しくありません' }, { status: 400 });
    }

    const { shopId, couponType, token, couponId } = parsed;
    if (!shopId || !couponType || !token) {
      return NextResponse.json({ error: 'QRコードの内容が不足しています' }, { status: 400 });
    }

    if (shopId !== auth.shopId) {
      return NextResponse.json({ error: 'QRコードの店舗とAPIキーの店舗が一致しません' }, { status: 403 });
    }

    const normalizedCouponType = typeof couponType === 'string'
      ? couponType.trim().toLowerCase().replace(/_/g, '-')
      : couponType;
    const normalizedType = normalizedCouponType === 'stepup' ? 'step-up'
      : normalizedCouponType === 'repeat-coupon' ? 'repeat'
      : normalizedCouponType;

    // 冪等性チェック
    const existing = await idempotencyRef.get();
    if (existing.exists) {
      const data = existing.data()!;
      if (data.result === 'success') {
        return NextResponse.json({
          success: true,
          couponTitle: data.couponTitle,
          redeemedAt: data.redeemedAt,
          idempotent: true,
        });
      }
    }

    const usageRef = db.collection('subscriptions').doc(token);
    const usageDoc = await usageRef.get();
    if (!usageDoc.exists) {
      return NextResponse.json({ error: '顧客が見つかりません' }, { status: 404 });
    }

    const result = await redeemCouponCore({
      shopId,
      couponType: normalizedType,
      token,
      couponId,
      shopData: auth.shopData,
      usageRef,
      usageData: usageDoc.data()!,
      scannedBy: `pos:${auth.terminalId || 'unknown'}`,
      dryRun: false,
    });

    await idempotencyRef.set({
      shopId: auth.shopId,
      terminalId: auth.terminalId,
      action: 'redeem',
      result: 'success',
      couponTitle: result.couponTitle,
      couponType: normalizedType,
      qrPayloadHash: crypto.createHash('sha256').update(qrPayload).digest('hex'),
      redeemedAt: result.usedAt,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      couponTitle: result.couponTitle,
      redeemedAt: result.usedAt,
      ...result.responseExtra,
    });
  } catch (error: any) {
    if (error instanceof RedeemError) {
      await idempotencyRef.set({
        shopId: auth.shopId,
        terminalId: auth.terminalId,
        action: 'redeem',
        result: 'error',
        errorCode: error.code,
        errorMessage: error.message,
        createdAt: FieldValue.serverTimestamp(),
      }).catch(() => undefined);

      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('[pos/v1/redeem] エラー:', error);
    return NextResponse.json({ error: '消込に失敗しました' }, { status: 500 });
  }
}
