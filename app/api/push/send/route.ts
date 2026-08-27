import { NextResponse } from 'next/server';
// 仮のDBクライアント（Supabase等）を想定
// import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { tenantId, message, targetCount } = await request.json();

    // 1. 店舗の契約プランと今月の配信状況を取得
    // const { data: tenant, error } = await supabase
    //   .from('tenants')
    //   .select('plan, monthly_limit, current_month_sent')
    //   .eq('id', tenantId)
    //   .single();

    // --- 【モックデータ（動作確認用）】 ---
    const tenant = {
      plan: 'light', // 'light' (5,000) | 'standard' (10,000) | 'pro' (50,000)
      monthly_limit: 5000,
      current_month_sent: 4800
    };
    // ----------------------------------------

    // 2. 今回配信する通数を足すと上限を超えるかチェック
    const projectedTotal = tenant.current_month_sent + targetCount;
    if (projectedTotal > tenant.monthly_limit) {
      return NextResponse.json(
        { 
          success: false, 
          error: `月間配信上限（${tenant.monthly_limit.toLocaleString()}通）を超過するため送信できません。現在の今月配信数: ${tenant.current_month_sent}通` 
        }, 
        { status: 400 }
      );
    }

    // 3. 上限内であれば配信処理を実行 ＆ 配信数を加算する処理へ
    // await supabase.from('tenants').update({ current_month_sent: projectedTotal }).eq('id', tenantId);

    return NextResponse.json({ 
      success: true, 
      message: 'プッシュ通知の送信予約が完了しました。',
      remainingLimit: tenant.monthly_limit - projectedTotal
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
