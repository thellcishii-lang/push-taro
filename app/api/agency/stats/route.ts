// app/api/agency/stats/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const agencyId = searchParams.get('agencyId');

    if (!agencyId) {
      return NextResponse.json({ error: 'Agency ID is required' }, { status: 400 });
    }

    // 🔥 1. 代理店自身の情報を `agencies` から取得
    const agencyDoc = await db.collection('agencies').doc(agencyId).get();
    if (!agencyDoc.exists) {
      return NextResponse.json({ error: '代理店情報が見つかりません' }, { status: 404 });
    }

    const agencyData = agencyDoc.data();

    // 🔥 agencyData が undefined の場合のガード
    if (!agencyData) {
      return NextResponse.json({ error: '代理店データが不正です。' }, { status: 400 });
    }

    // 2. 対象の代理店IDに紐づく傘下店舗を取得
    const shopsSnapshot = await db
      .collection('shops')
      .where('agencyId', '==', agencyId)
      .get();

    // 3. 全 subscriptions から店舗ごとの配信許可人数を集計
    const subsSnapshot = await db.collection('subscriptions').get();
    const subscriberCounts: Record<string, number> = {};

    subsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (Array.isArray(data.shopIds)) {
        data.shopIds.forEach((sId: string) => {
          subscriberCounts[sId] = (subscriberCounts[sId] || 0) + 1;
        });
      } else if (data.shopId) {
        subscriberCounts[data.shopId] = (subscriberCounts[data.shopId] || 0) + 1;
      }
    });

    // 4. 当月の集計
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    let monthlyNewCount = 0;
    let monthlyCanceledCount = 0;
    const planCounts = { light: 0, standard: 0, pro: 0, other: 0 };

    // 5. 店舗データの整形
    const detailedShops = shopsSnapshot.docs.map((doc) => {
      const data = doc.data();
      const shopId = doc.id;

      const createdAtDate = data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : null);
      const canceledAtDate = data.canceledAt?.toDate ? data.canceledAt.toDate() : (data.canceledAt ? new Date(data.canceledAt) : null);

      if (createdAtDate && createdAtDate >= startOfMonth && createdAtDate <= endOfMonth) {
        monthlyNewCount++;
      }

      if (data.status === 'canceled' || (canceledAtDate && canceledAtDate >= startOfMonth && canceledAtDate <= endOfMonth)) {
        monthlyCanceledCount++;
      }

      const plan = (data.plan || 'light').toLowerCase();
      if (plan === 'pro') planCounts.pro++;
      else if (plan === 'standard') planCounts.standard++;
      else if (plan === 'light') planCounts.light++;
      else planCounts.other++;

      return {
        id: shopId,
        shopCode: data.referralCode || shopId,
        name: data.name || '未設定店舗',
        email: data.email || '未登録',
        address: data.address || '未登録',
        phone: data.phone || '未登録',
        subscriberCount: subscriberCounts[shopId] || 0,
        createdAt: createdAtDate ? createdAtDate.toISOString().slice(0, 10) : '不明',
        status: data.status || 'active',
        canceledAt: canceledAtDate ? canceledAtDate.toISOString().slice(0, 10) : null,
        validUntil: data.validUntil ? (data.validUntil.toDate ? data.validUntil.toDate().toISOString().slice(0, 10) : String(data.validUntil).slice(0, 10)) : null,
        plan: plan,
      };
    });

    // 🔥 代理店情報も返す（ダッシュボードのヘッダー表示用）
    return NextResponse.json({
      success: true,
      agency: {
        id: agencyId,
        companyName: agencyData.companyName,
        ownerName: agencyData.ownerName,
        email: agencyData.email,
        referralCode: agencyData.referralCode,
        status: agencyData.status,
        approvedAt: agencyData.approvedAt,
      },
      summary: {
        totalShops: detailedShops.length,
        monthlyNewCount,
        monthlyCanceledCount,
        planCounts,
      },
      shops: detailedShops,
    });
  } catch (error: any) {
    console.error('[API Agency Stats Error]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
