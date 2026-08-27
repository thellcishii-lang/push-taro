import { NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    // クエリパラメータ等から紹介者のIDを取得（例: ?referrer_id=xxx）
    const { searchParams } = new URL(request.url);
    const referrerId = searchParams.get('referrer_id');

    if (!referrerId) {
      return NextResponse.json({ success: false, error: '紹介者IDが指定されていません。' }, { status: 400 });
    }

    // 1. データベースから紹介関係（activeなもののみ）と紹介された店舗の情報を取得
    // ※ 離脱（解約）した店舗は status = 'cancelled' またはレコードを外すことで一覧に表示させない
    // const { data: referrals, error } = await supabase
    //   .from('referral_relations')
    //   .select(`
    //     id,
    //     reward_rate,
    //     created_at,
    //     referred_tenant:referred_tenant_id (
    //       id,
    //       name,
    //       plan,
    //       status
    //     )
    //   `)
    //   .eq('referrer_id', referrerId)
    //   .eq('status', 'active'); // アクティブ（継続中）のみ抽出

    // --- 【モックデータ（動作確認用）】 ---
    const referrals = [
      {
        id: 'ref-1',
        reward_rate: 0.10, // 10% (通常紹介) または 0.30 (代理店)
        created_at: '2026-06-15',
        referred_tenant: {
          id: 'tenant-002',
          name: 'カフェ・ド・ルネ',
          plan: 'pro',
          status: 'active'
        }
      }
    ];
    // ----------------------------------------

    return NextResponse.json({
      success: true,
      referrals: referrals || []
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
