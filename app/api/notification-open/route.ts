import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { db } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { notificationId } = await request.json();
    if (typeof notificationId !== 'string' || !notificationId) {
      return NextResponse.json({ error: 'notificationId is required' }, { status: 400 });
    }

    const historyRef = db.collection('histories').doc(notificationId);
    const history = await historyRef.get();
    if (!history.exists) {
      return NextResponse.json({ success: true });
    }

    await historyRef.update({ openedCount: FieldValue.increment(1) });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[notification-open] エラー:', error);
    return NextResponse.json({ error: '開封情報の記録に失敗しました' }, { status: 500 });
  }
}