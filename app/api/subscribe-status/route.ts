// app/api/subscribe-status/route.ts
/**
 * 顧客のクーポン使用状態を返す
 *
 * 参照元: app/subscribe/page.tsx
 *
 * データソース:
 *   subscriptions/{token}.couponUsage[shopId]
 *
 * 認証:
 *   Firebase Auth 不要（顧客は認証されない）
 *   token を知っている人のみが叩ける（実質的な保護）
 */
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

// デフォルト値（既存顧客の遅延マイグレーション用）
const DEFAULT_USAGE = {
  firstCouponUsedAt: null,
  normalCouponUsedAt: null,
  lastCouponUsedAt: null,
  totalVisits: 0,
  loyaltyAchieved: false,
  loyaltyAchievedAt: null,
  stepUpIndex: 0,
  repeatCouponActiveUntil: null,
  dormantNotifiedAt: null,
  birthdayNotifiedYear: null,
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('shopId');
    const token = searchParams.get('token');

    if (!shopId || !token) {
      return NextResponse.json(
        { success: false, error: 'shopId と token が必要です' },
        { status: 400 }
      );
    }

    // ─── subscriptions/{token} を取得 ───
    const doc = await db.collection('subscriptions').doc(token).get();

    if (!doc.exists) {
      // 顧客が未登録 → デフォルト値を返す
      return NextResponse.json({
        success: true,
        firstCouponUsed: false,
        couponUsed: false,
        totalVisits: 0,
        loyaltyAchieved: false,
        stepUpIndex: 0,
        registered: false,
      });
    }

    const data = doc.data()!;

    // ─── couponUsage[shopId] を取り出す（無ければデフォルト）───
    const usage = data?.couponUsage?.[shopId] || DEFAULT_USAGE;

    return NextResponse.json({
      success: true,
      registered: true,
      firstCouponUsed: Boolean(usage.firstCouponUsedAt),
      normalCouponUsed: Boolean(usage.normalCouponUsedAt),
      couponUsed: Boolean(usage.firstCouponUsedAt), // 後方互換
      totalVisits: usage.totalVisits || 0,
      loyaltyAchieved: usage.loyaltyAchieved === true,
      stepUpIndex: usage.stepUpIndex || 0,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    console.error('[subscribe-status] エラー:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
