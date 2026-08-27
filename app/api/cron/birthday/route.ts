import { NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    // 1. 本日の「月」と「日」を取得
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // 1〜12
    const currentDay = today.getDate();       // 1〜31
    const currentYear = today.getFullYear();   // 2026

    // 2. データベースから、今日が誕生日の顧客を取得
    // ※ PostgreSQL等のSQLで月と日が一致し、かつ今年まだ送信していない人を抽出
    // const { data: targetCustomers, error } = await supabase
    //   .from('customers')
    //   .select('*')
    //   .eq('birth_month', currentMonth)
    //   .eq('birth_day', currentDay)
    //   .neq('last_birthday_sent_year', currentYear);

    // --- 【モックデータ（動作確認用）】 ---
    const targetCustomers = [
      { id: 'cust-1', tenant_id: 'tenant-abc', name: '山田 花子', push_token: 'token_xxx' }
    ];
    // ----------------------------------------

    if (!targetCustomers || targetCustomers.length === 0) {
      return NextResponse.json({ success: true, message: '本日の誕生日該当者はいませんでした。' });
    }

    // 3. 対象者へお祝いプッシュ通知を自動送信
    for (const customer of targetCustomers) {
      // 既存の配信ロジック（send-pushなど）を内部で呼び出してメッセージを送信
      // await sendPushNotification({
      //   token: customer.push_token,
      //   title: '🎉 お誕生日おめでとうございます！',
      //   body: '今月使える【特別お祝いクーポン】をプレゼントいたします。ぜひご来店ください！'
      // });

      // 4. 今年送信済みにアップデート（重複防止）
      // await supabase
      //   .from('customers')
      //   .update({ last_birthday_sent_year: currentYear })
      //   .eq('id', customer.id);
    }

    return NextResponse.json({
      success: true,
      count: targetCustomers.length,
      message: `${targetCustomers.length}件の誕生日自動配信を実行しました。`,
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
