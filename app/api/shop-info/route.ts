// app/api/shop-info/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get('s') || searchParams.get('shopId') || searchParams.get('shopid');

  if (!shopId || shopId === 'undefined' || shopId === 'null' || shopId.trim() === '') {
    return NextResponse.json(
      { success: false, error: 'URLパラメータ（?s=店舗ID）が正しく渡されていません' },
      { status: 400, headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' } }
    );
  }

  try {
    const cleanId = shopId.trim();
    const doc = await db.collection('shops').doc(cleanId).get();

    if (!doc.exists) {
      return NextResponse.json(
        { 
          success: false, 
          error: `店舗ID [${cleanId}] はFirestoreに存在しません。admin画面で店舗作成を完了させてください。` 
        },
        { status: 404, headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' } }
      );
    }

    const data = doc.data();
    return NextResponse.json({
      success: true,
      shopId: doc.id,
      name: data?.name || '登録店舗',
      status: data?.status || 'pending_payment',

      // ── クーポン情報（全種別）──
      coupon: data?.coupon || null,                    // 初回クーポン
      normalCoupon: data?.normalCoupon || null,        // 🆕 通常クーポン（STANDARD/PRO）
      loyaltyCoupon: data?.loyaltyCoupon || null,      // 🆕 特別達成クーポン（STANDARD/PRO）
      proCoupons: data?.proCoupons || null,            // 🆕 PRO専用クーポン群

      // ── アップグレード状態 ──
      upgradeStatus: data?.upgradeStatus || null,
      upgradeTargetPlan: data?.upgradeTargetPlan || data?.targetPlan || null,
      targetPlan: data?.upgradeTargetPlan || data?.targetPlan || null,

      // ── その他 ──
      linkUrl: data?.linkUrl || '',
      iconUrl: data?.iconUrl || '',
      plan: data?.plan || 'free',
    }, { status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' } });

  } catch (error: any) {
    console.error('[shop-info] エラー:', error);
    return NextResponse.json(
      { success: false, error: `サーバー内部エラー: ${error.message}` },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' } }
    );
  }
}
