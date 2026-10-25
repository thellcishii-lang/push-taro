// app/api/pos/v1/coupons/route.ts
/**
 * POS連携: 有効クーポン一覧
 *
 * GET /api/pos/v1/coupons
 */
import { NextResponse } from 'next/server';
import { authenticatePosRequest, isPosAuthError } from '@/lib/pos-api-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const auth = await authenticatePosRequest(request);
  if (isPosAuthError(auth)) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const shopData = auth.shopData;
  const coupons: Array<{ couponType: string; title: string }> = [];

  if (shopData.coupon?.enabled) {
    coupons.push({
      couponType: 'first',
      title: shopData.coupon.title || '初回限定クーポン',
    });
  }

  if (shopData.normalCoupon?.enabled) {
    coupons.push({
      couponType: 'normal',
      title: shopData.normalCoupon.title || '通常クーポン',
    });
  }

  if (shopData.loyaltyCoupon?.enabled) {
    coupons.push({
      couponType: 'loyalty',
      title: shopData.loyaltyCoupon.title || '特別達成クーポン',
    });
  }

  if (shopData.proCoupons?.stepUp?.enabled) {
    coupons.push({
      couponType: 'step-up',
      title: shopData.proCoupons.stepUp.title || 'ステップアップクーポン',
    });
  }
  if (shopData.proCoupons?.repeat?.enabled) {
    coupons.push({
      couponType: 'repeat',
      title: shopData.proCoupons.repeat.title || '連続クーポン',
    });
  }
  if (shopData.proCoupons?.birthday?.enabled) {
    coupons.push({
      couponType: 'birthday',
      title: shopData.proCoupons.birthday.title || '記念日・お誕生日クーポン',
    });
  }
  if (shopData.proCoupons?.dormant?.enabled) {
    coupons.push({
      couponType: 'dormant',
      title: shopData.proCoupons.dormant.title || '休眠復活クーポン',
    });
  }

  return NextResponse.json(
    { coupons },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
