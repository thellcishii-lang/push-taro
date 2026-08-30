import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin'; // `@/` エイリアスで絶対パス指定

// ユーザー通知メール送信用のヘルパー関数
async function sendUserPayoutEmail({ to, amount, bankHolder }: { to: string; amount: number; bankHolder?: string }) {
  console.log(`[振込完了メール通知] To: ${to} | 金額: ¥${amount} | 名義: ${bankHolder}`);
}

export async function POST(req: Request) {
  try {
    const { userId, amount } = await req.json();
    const userRef = db.collection('shops').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'ユーザーが存在しません' }, { status: 400 });
    }

    const userData = userDoc.data();

    // 1. 未払い累計額を0にリセット＆ステータス更新
    await userRef.update({
      unpaidRewardTotal: 0,
      payoutStatus: 'none',
      lastPaidAt: new Date(),
    });

    // 2. ユーザーへ振込完了通知メールを送信
    await sendUserPayoutEmail({
      to: userData?.email,
      amount: amount,
      bankHolder: userData?.bankAccount?.accountHolder,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
