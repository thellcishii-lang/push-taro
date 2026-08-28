import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Authorization ヘッダーの検証
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid cron secret' },
      { status: 401 }
    );
  }

  try {
    // 従来の処理（誕生日通知の送信など）
    // ...
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[CRON Birthday] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
