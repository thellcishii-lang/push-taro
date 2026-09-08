import { NextResponse } from 'next/server';
import { db as adminDb } from '@/lib/firebase-admin';

// 毎日/1時間ごとに定期実行されるAPI
export async function GET(req: Request) {
  try {
    const today = new Date();
    const currentDateStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
    const currentDayOfMonth = today.getDate().toString();     // 1〜31
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const currentDayOfWeek = days[today.getDay()];            // mon, tue...

    const shopsSnapshot = await adminDb.collection('shops').get();
    let totalSent = 0;

    for (const doc of shopsSnapshot.docs) {
      const shop = doc.data();
      const scheduledList = shop.scheduledList || [];
      if (scheduledList.length === 0) continue;

      const remainingSchedules = [];

      for (const item of scheduledList) {
        let shouldSend = false;

        // ① 1回限りの日付指定
        if (item.scheduleType === 'once' && item.scheduleRaw?.date === currentDateStr) {
          shouldSend = true;
        }
        // ② 毎月指定日
        else if (item.scheduleType === 'monthly' && item.scheduleRaw?.dayOfMonth === currentDayOfMonth) {
          shouldSend = true;
        }
        // ③ 毎週指定曜日
        else if (item.scheduleType === 'weekly' && item.scheduleRaw?.dayOfWeek === currentDayOfWeek) {
          shouldSend = true;
        }

        if (shouldSend) {
          // プッシュ通知送信処理を実行（既存の送信APIロジックを呼び出し）
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/send-push`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              shopId: doc.id,
              title: item.title,
              body: item.body,
              url: item.linkUrl,
              isCron: true,
            }),
          });
          totalSent++;

          // 1回限りの予約は送信後にリストから削除（定期配信は残す）
          if (item.scheduleType !== 'once') {
            remainingSchedules.push(item);
          }
        } else {
          remainingSchedules.push(item);
        }
      }

      // 1回限り送信分の削除結果をDBに反映
      await adminDb.collection('shops').doc(doc.id).update({
        scheduledList: remainingSchedules,
      });
    }

    return NextResponse.json({ success: true, processedCount: totalSent });
  } catch (err: any) {
    console.error('予約配信バッチエラー:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
