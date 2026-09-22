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
  normalCouponUsedCouponId: null,
  normalCouponVisitCount: 0,
  loyaltyCouponAvailable: false,
  lastCouponUsedAt: null,
  totalVisits: 0,
  loyaltyAchieved: false,
  loyaltyAchievedAt: null,
  stepUpIndex: 0,
  repeatCouponActiveUntil: null,
  repeatCouponUsedAt: null,
  dormantNotifiedAt: null,
  dormantCouponUsedAt: null,
  birthdayNotifiedYear: null,
  birthdayCouponUsedYear: null,
  scheduledCouponUsedIds: [],
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
    const shopIds = Array.isArray(data.shopIds) ? data.shopIds : [];
    if (!shopIds.includes(shopId)) {
      return NextResponse.json(
        { success: false, error: 'この購読は指定店舗に紐づいていません' },
        { status: 403 }
      );
    }

    const shopDoc = await db.collection('shops').doc(shopId).get();
    const normalCouponId = shopDoc.data()?.normalCoupon?.couponId || 'legacy';

    // ─── couponUsage[shopId] を取り出す（無ければデフォルト）───
    const usage = data?.couponUsage?.[shopId] || DEFAULT_USAGE;
    const proCoupons = shopDoc.data()?.proCoupons || {};

    // ─── ステップアップ／連続クーポンが再有効化され、キャンペーンIDが変わっていたら進捗をリセット ───
    let stepUpIndex = usage.stepUpIndex || 0;
    let repeatCouponActiveUntilRaw = usage.repeatCouponActiveUntil || null;

    let stepUpIndexUpdatedAt: any = usage.stepUpIndexUpdatedAt || null;
    const stepUpCampaignId = proCoupons.stepUp?.campaignId || null;
    if (stepUpCampaignId && usage.stepUpCampaignId !== stepUpCampaignId) {
      stepUpIndex = 0;
      stepUpIndexUpdatedAt = new Date();
    }

    const repeatCampaignId = proCoupons.repeat?.campaignId || null;
    if (repeatCampaignId && usage.repeatCampaignId !== repeatCampaignId) {
      repeatCouponActiveUntilRaw = null;
    }

    const repeatActiveUntil = repeatCouponActiveUntilRaw?.toDate?.()?.toISOString?.() || repeatCouponActiveUntilRaw || null;
    const stepUpIndexAppearedAt = stepUpIndexUpdatedAt?.toDate?.()?.toISOString?.()
      || (stepUpIndexUpdatedAt instanceof Date ? stepUpIndexUpdatedAt.toISOString() : null)
      || (typeof stepUpIndexUpdatedAt === 'string' ? stepUpIndexUpdatedAt : null);
    const dormantNotifiedAt = usage.dormantNotifiedAt?.toDate?.()?.toISOString?.() || usage.dormantNotifiedAt || null;
    const dormantCouponUsedAt = usage.dormantCouponUsedAt?.toDate?.()?.toISOString?.() || usage.dormantCouponUsedAt || null;
    const currentYear = String(new Date().getFullYear());

    return NextResponse.json({
      success: true,
      registered: true,
      birthMonth: data.birthMonth || null,
      birthDay: data.birthDay || null,
      firstCouponUsed: Boolean(usage.firstCouponUsedAt),
      normalCouponUsed: usage.normalCouponUsedCouponId === normalCouponId ||
        (normalCouponId === 'legacy' && Boolean(usage.normalCouponUsedAt)),
      normalCouponVisitCount: usage.normalCouponVisitCount || 0,
      loyaltyCouponAvailable: usage.loyaltyCouponAvailable === true,
      couponUsed: Boolean(usage.firstCouponUsedAt), // 後方互換
      totalVisits: usage.totalVisits || 0,
      loyaltyAchieved: usage.loyaltyAchieved === true,
      loyaltyAchievedAt: usage.loyaltyAchievedAt?.toDate?.()?.toISOString?.() || usage.loyaltyAchievedAt || null,
      stepUpIndex,
      stepUpIndexAppearedAt,
      stepUpEnabled: proCoupons.stepUp?.enabled === true,
      repeatEnabled: proCoupons.repeat?.enabled === true,
      repeatCouponActiveUntil: repeatActiveUntil,
      repeatCouponUsed: false,
      birthdayNotifiedYear: usage.birthdayNotifiedYear || null,
      birthdayCouponUsed: String(usage.birthdayCouponUsedYear) === currentYear,
      dormantNotifiedAt,
      dormantCouponUsed: Boolean(dormantCouponUsedAt),
      scheduledCouponUsedIds: usage.scheduledCouponUsedIds || [],
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
