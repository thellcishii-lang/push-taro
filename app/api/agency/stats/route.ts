import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase-admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const agencyId = searchParams.get('agencyId');

    if (!agencyId) {
      return NextResponse.json({ error: 'Agency ID is required' }, { status: 400 });
    }

    // 1. 対象の代理店IDに紐づく傘下店舗を取得
    const shopsSnapshot = await db
      .collection('shops')
      .where('agencyId', '==', agencyId)
      .get();

    // 2. 全 subscriptions から店舗ごとの配信許可人数（端末数）を集計
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

    // 3. 当月の開始日時・終了日時の算出（月末集計用）
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    let monthlyNewCount = 0;
    let monthlyCanceledCount = 0;
    const planCounts = { light: 0, standard: 0, pro: 0, other: 0 };

    // 4. 店舗データの整形と集計
    const detailedShops = shopsSnapshot.docs.map((doc) => {
      const data = doc.data();
      const shopId = doc.id;

      // 日時オブジェクトの変換処理
      const createdAtDate = data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : null);
      const canceledAtDate = data.canceledAt?.toDate ? data.canceledAt.toDate() : (data.canceledAt ? new Date(data.canceledAt) : null);

      // ① 月末新規登録数の判定
      if (createdAtDate && createdAtDate >= startOfMonth && createdAtDate <= endOfMonth) {
        monthlyNewCount++;
      }

      // ② 月末退会数の判定
      if (data.status === 'canceled' || (canceledAtDate && canceledAtDate >= startOfMonth && canceledAtDate <= endOfMonth)) {
        monthlyCanceledCount++;
      }

      // ③ プラン別集計
      const plan = (data.plan || 'light').toLowerCase();
      if (plan === 'pro') planCounts.pro++;
      else if (plan === 'standard') planCounts.standard++;
      else if (plan === 'light') planCounts.light++;
      else planCounts.other++;

      return {
        id: shopId,
        shopCode: data.referralCode || shopId,
        name: data.name || '未設定店舗',
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

    return NextResponse.json({
      success: true,
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
