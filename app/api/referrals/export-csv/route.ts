// app/api/referrals/export-csv/route.ts
/**
 * 紹介報酬の月次CSVダウンロード
 *
 * 参照元: app/pro-shop/dashboard/page.tsx の handleDownloadCSV
 * 用途: PRO店舗が自分の紹介報酬をCSVで保存
 */
import { NextResponse } from 'next/server';
import { db, authAdmin } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // ─── 認証（クエリ or ヘッダー）───
  // window.open で叩かれるため、クエリパラメータ経由でトークンを受け取る想定
  const { searchParams } = new URL(request.url);
  const referrerId = searchParams.get('referrer_id');
  const targetMonth = searchParams.get('month'); // '2026-08'

  if (!referrerId) {
    return NextResponse.json({ error: 'referrer_id が必要です' }, { status: 400 });
  }

  // ─── データ取得 ───
  try {
    // monthly_rewards から referrerType='pro' の該当月を取得
    let query: any = db.collection('monthly_rewards')
      .where('userId', '==', referrerId)
      .where('referrerType', '==', 'pro');

    if (targetMonth) {
      query = query.where('billingMonth', '==', targetMonth);
    }

    const rewardsSnap = await query.get();

    // ─── CSV生成 ───
    let csv = '\uFEFF対象月,紹介先店舗名,報酬率,決済額,基本報酬,源泉徴収,報酬額,ステータス\n';

    rewardsSnap.docs.forEach((doc: any) => {
      const d = doc.data();
      const status = d.status === 'paid' ? '振込済' : '未払い';
      const rate = d.baseAmount > 0 ? ((d.baseAmount / (d.paymentAmount || 1)) * 100).toFixed(1) : '—';
      csv += [
        d.billingMonth || '',
        `"${d.sourceShopName || '不明'}"`,
        `${rate}%`,
        d.paymentAmount || 0,
        d.baseAmount || 0,
        d.withholding || 0,
        d.amount || 0,
        status,
      ].join(',') + '\n';
    });

    // ─── レスポンス ───
    const filename = `referral_statement_${targetMonth || 'all'}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error: any) {
    console.error('[referrals/export-csv] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
