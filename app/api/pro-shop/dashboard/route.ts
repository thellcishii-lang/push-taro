// app/api/pro-shop/dashboard/route.ts
/**
 * PRO店舗ダッシュボード用データ取得
 *
 * - 店舗情報（紹介コード・口座）
 * - 紹介店舗一覧（referral_relations + shops）
 * - 報酬明細（monthly_rewards）
 * - サマリー（累計報酬・未払い・紹介店舗数）
 *
 * 参照元: app/pro-shop/dashboard/page.tsx
 */
import { NextResponse } from 'next/server';
import { db, authAdmin } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // ─── 認証 ───
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  let uid: string;
  let isAdmin = false;
  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await authAdmin.verifyIdToken(idToken);
    uid = decoded.uid;
    const userRecord = await authAdmin.getUser(uid);
    isAdmin = userRecord.customClaims?.admin === true;
  } catch {
    return NextResponse.json({ error: '無効なトークンです' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    let shopId = searchParams.get('shopId');

    if (!shopId) {
      const ownedShop = await db.collection('shops')
        .where('ownerUid', '==', uid)
        .where('plan', '==', 'pro')
        .limit(1)
        .get();
      if (ownedShop.empty) {
        return NextResponse.json({ error: 'PRO店舗情報が見つかりません' }, { status: 403 });
      }
      shopId = ownedShop.docs[0].id;
    }

    // ─── 権限チェック（店舗オーナー or 管理者）───
    const shopDoc = await db.collection('shops').doc(shopId).get();
    if (!shopDoc.exists) {
      return NextResponse.json({ error: '店舗情報が見つかりません' }, { status: 404 });
    }

    const shopData = shopDoc.data()!;
    if (shopData.ownerUid !== uid && !isAdmin) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }
    if (shopData.plan !== 'pro') {
      return NextResponse.json({ error: 'PROプラン専用の管理画面です' }, { status: 403 });
    }

    // ============================================================
    // 1. 紹介店舗一覧（referral_relations から referrerType='pro'）
    // ============================================================
    const relSnap = await db.collection('referral_relations')
      .where('referrerId', '==', shopId)
      .where('referrerType', '==', 'pro')
      .get();

    const referrals: any[] = [];
    let activeCount = 0;

    for (const relDoc of relSnap.docs) {
      const relData = relDoc.data();
      const referredShopId = relData.referredTenantId;
      if (!referredShopId) continue;

      const referredShopDoc = await db.collection('shops').doc(referredShopId).get();
      if (!referredShopDoc.exists) continue;

      const referredShopData = referredShopDoc.data()!;
      const relStatus = relData.status || 'pending';
      if (relStatus === 'active') activeCount++;

      // 利用開始日
      let startedAt = '不明';
      if (relData.createdAt?.toDate) {
        startedAt = relData.createdAt.toDate().toISOString().slice(0, 10);
      }

      // 参考値：月額報酬
      const plan = (referredShopData.plan || 'light').toLowerCase();
      const PLAN_PRICES: Record<string, number> = {
        light: 1980,
        standard: 3800,
        pro: 10000,
      };
      const planAmount = PLAN_PRICES[plan] || PLAN_PRICES.light;
      const rewardRate = relData.rewardRate || 0;
      const monthlyReward = Math.floor(planAmount * rewardRate);

      referrals.push({
        id: referredShopId,
        shopCode: referredShopData.referralCode || referredShopId,
        name: referredShopData.name || '未設定',
        plan,
        status: relStatus,
        rewardRate,
        monthlyReward,
        startedAt,
      });
    }

    // ============================================================
    // 2. 報酬明細（monthly_rewards から referrerType='pro'）
    // ============================================================
    const rewardsSnap = await db.collection('monthly_rewards')
      .where('userId', '==', shopId)
      .where('referrerType', '==', 'pro')
      .get();

    const rewards = rewardsSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        billingMonth: data.billingMonth || '',
        shopName: data.sourceShopName || '不明',
        amount: data.amount || 0,
        status: data.status || 'unpaid',
      };
    });

    // 支払い予定月で降順ソート（billingMonth で代用）
    rewards.sort((a, b) => b.billingMonth.localeCompare(a.billingMonth));

    // ============================================================
    // 3. サマリー
    // ============================================================
    const totalEarnings = shopData.totalEarnings || 0;
    const unpaidReward = shopData.unpaidRewardTotal || 0;

    // ============================================================
    // 4. レスポンス
    // ============================================================
    return NextResponse.json({
      success: true,
      shop: {
        id: shopId,
        name: shopData.name || '',
        referralCode: shopData.referralCode || '',
        bankAccount: shopData.bankAccount || null,
      },
      summary: {
        totalEarnings,
        unpaidReward,
        referralCount: activeCount,
      },
      referrals,
      rewards,
    });
  } catch (error: any) {
    console.error('[pro-shop/dashboard] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
