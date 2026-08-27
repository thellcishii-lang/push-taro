import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const referrerId = searchParams.get('referrer_id');
    const targetMonth = searchParams.get('month'); // 例: '2026-08'

    if (!referrerId) {
      return NextResponse.json({ success: false, error: '紹介者IDが指定されていません。' }, { status: 400 });
    }

    // 1. データベースから指定月の報酬明細データを取得
    // const { data: rewards, error } = await supabase
    //   .from('monthly_rewards')
    //   .select(`
    //     billing_month,
    //     amount,
    //     status,
    //     created_at,
    //     source_tenant:source_tenant_id ( name )
    //   `)
    //   .eq('user_id', referrerId)
    //   .eq('billing_month', targetMonth || '2026-08');

    // --- 【モックデータ（動作確認用）】 ---
    const rewards = [
      { billing_month: '2026-08', amount: 980, status: 'unpaid', source_tenant: { name: 'カフェ・ド・ルネ' } }
    ];
    // ----------------------------------------

    // 2. CSVフォーマットの文字列を作成 (BOM付きでExcel文字化け対策)
    let csvContent = '\uFEFF対象月,紹介先店舗名,還元額(円),ステータス\n';
    
    rewards.forEach((r: any) => {
      const statusText = r.status === 'paid' ? '振込済み' : '未払い（蓄積中）';
      csvContent += `${r.billing_month},"${r.source_tenant?.name || '不明'}`,${r.amount},${statusText}\n`;
    });

    // 3. CSVファイルとしてレスポンスを返す
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="referral_statement_${targetMonth || 'all'}.csv"`,
      },
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
