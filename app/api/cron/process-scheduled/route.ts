// app/api/cron/process-scheduled/route.ts
import { NextResponse } from 'next/server';
import { db as adminDb } from '@/lib/firebase-admin';
import { sendPushToShop } from '@/lib/push-sender';

export const dynamic = 'force-dynamic';

// 毎日 0:00 UTC（日本時間 9:00）に実行される予約配信バッチ
export async function GET(req: Request) {
  // 🔒 Cron認証（Vercel Cron Jobs からのみ実行可能）
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const today = new Date();
    const currentDateStr = today.toISOString().slice(0, 10);
    const currentDayOfMonth = today.getDate().toString();
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const currentDayOfWeek = days[today.getDay()];

    const shopsSnapshot = await adminDb.collection('shops').get();
    let totalSent = 0;
    const errors: string[] = [];

    for (const doc of shopsSnapshot.docs) {
      const shop = doc.data();
      const scheduledList = shop.scheduledList || [];
      if (scheduledList.length === 0) continue;

      const remainingSchedules: any[] = [];

      for (const item of scheduledList) {
        let shouldSend = false;

        // ① 1回限りの日付指定
        if (item.scheduleType === 'once' && item.scheduleRaw?.date === currentDateStr) {
          shouldSend = true;
        }
        // ② 毎月指定日
        else if (
          item.scheduleType === 'monthly' &&
          String(item.scheduleRaw?.dayOfMonth) === currentDayOfMonth
        ) {
          shouldSend = true;   // 🔥 ここが抜けていた
        }
        // ③ 毎週指定曜日
        else if (
          item.scheduleType === 'weekly' &&
          item.scheduleRaw?.dayOfWeek === currentDayOfWeek
        ) {
          shouldSend = true;
        }

        if (shouldSend) {
          try {
            await sendPushToShop({
              shopId: doc.id,
              title: item.title,
              body: item.body,
              url: item.linkUrl,
              source: 'cron_scheduled',
            });
            totalSent++;
          } catch (err: any) {
            console.error(`[process-scheduled] 送信エラー shop=${doc.id}:`, err);
            errors.push(`${doc.id}: ${err.message}`);
          }

          // 1回限りの予約は送信後にリストから削除（定期配信は残す）
          if (item.scheduleType !== 'once') {
            remainingSchedules.push(item);
          }
        } else {
          remainingSchedules.push(item);
        }
      }

      // リストの差分がある場合のみ更新（無駄な書き込みを回避）
      if (remainingSchedules.length !== scheduledList.length) {
        await adminDb.collection('shops').doc(doc.id).update({
          scheduledList: remainingSchedules,
        });
      }
    }

    return NextResponse.json({
      success: true,
      processedCount: totalSent,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err: any) {
    console.error('予約配信バッチエラー:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
