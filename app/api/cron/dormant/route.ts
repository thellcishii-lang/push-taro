import { NextResponse } from 'next/server';
// import { supabase } from '@/lib/firebase/admin';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid cron secret' },
      { status: 401 }
    );
  }
  try {
    const now = new Date();
    // 60日前の日付を計算
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();

    // 1. 最終アクセスから60日以上経過している顧客を抽出
    // const { data: dormantCustomers, error } = await supabase
    //   .from('customers')
    //   .select('*')
    //   .lt('last_visit_at', sixtyDaysAgo)
    //   .eq('is_dormant_notified', false); // まだ休眠通知を送っていない人

    // --- 【モックデータ（動作確認用）】 ---
    const dormantCustomers = [
      { id: 'cust-2', tenant_id: 'tenant-abc', name: '鈴木 一郎', push_token: 'token_yyy' }
    ];
    // ----------------------------------------

    if (!dormantCustomers || dormantCustomers.length === 0) {
      return NextResponse.json({ success: true, message: '本日の休眠該当者はいませんでした。' });
    }

    // 2. 休眠顧客へ「お久しぶりクーポン」を自動送信
    for (const customer of dormantCustomers) {
      // 配信処理の実行
      // await sendPushNotification({
      //   token: customer.push_token,
      //   title: '👋 お久しぶりです！またお顔を見せてください',
      //   body: 'いつもご利用ありがとうございます。しばらくご来店のない方へ、特別なおかえりなさいクーポンをお贈りします！'
      // });

      // 3. 通知済みフラグを立てる（何度も繰り返し送らないため）
      // await supabase
      //   .from('customers')
      //   .update({ is_dormant_notified: true })
      //   .eq('id', customer.id);
    }

    return NextResponse.json({ 
      success: true, 
      count: dormantCustomers.length,
      message: `${dormantCustomers.length}件の休眠顧客自動アプローチを実行しました。` 
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
