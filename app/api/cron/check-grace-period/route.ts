import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase-admin';

// 毎日深夜に自動実行されるCron処理
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid cron secret' },
      { status: 401 }
    );
  }
  try {
    const now = new Date().toISOString();

    // ステータスが payment_warning で、猶予期限 (gracePeriodUntil) を過ぎた店舗を抽出
    const snapshot = await adminDb.collection('shops')
      .where('status', '==', 'payment_warning')
      .where('gracePeriodUntil', '<=', now)
      .get();

    const batch = adminDb.batch();

    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {
        status: 'send_disabled', // 送信不可ステータスに変更
        updatedAt: now,
      });

      const shopData = doc.data();

      // 📧 メール送信②: 7日経過に伴う「送信機能停止 兼 次回引き落とし不可時の退会予告」メール
      /*
        件名: 【Push-taro】通知送信機能の停止および次回引き落としに関する重要なお知らせ
        本文: 
        お支払い猶予期間の7日間が経過したため、プッシュ通知の送信機能を一時停止いたしました。
        次回引き落とし日までにカード情報のお手続きが完了しない場合、自動的に強制退会手続き（アカウント閉鎖）をとらせていただきますのでご了承ください。
      */
      console.log(`[送信停止＆次回退会予告メール送信] 店舗名: ${shopData.name} / Email: ${shopData.email}`);
    });

    await batch.commit();

    return NextResponse.json({ success: true, disabledCount: snapshot.size });
  } catch (error: any) {
    console.error('[猶予期限チェックCronエラー]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
