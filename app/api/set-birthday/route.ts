// app/api/set-birthday/route.ts
/**
 * 顧客の誕生日・記念日の月日を初回のみ登録する
 *
 * 参照元: app/subscribe/page.tsx（ログイン後の設定画面）
 *
 * データソース:
 *   subscriptions/{token}.birthMonth / birthDay
 *
 * 仕様:
 *   一度設定した後は変更不可（既に値がある場合はエラーを返す）
 */
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, birthMonth: rawBirthMonth, birthDay: rawBirthDay } = body;

    if (!token) {
      return NextResponse.json({ success: false, error: 'token が必要です' }, { status: 400 });
    }

    const birthMonth = Number(rawBirthMonth);
    const birthDay = Number(rawBirthDay);
    if (!birthMonth || !birthDay || birthMonth < 1 || birthMonth > 12 || birthDay < 1 || birthDay > 31) {
      return NextResponse.json({ success: false, error: '誕生日・記念日の月日を正しく選択してください' }, { status: 400 });
    }

    const docRef = db.collection('subscriptions').doc(token);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ success: false, error: '顧客情報が見つかりません' }, { status: 404 });
    }

    const data = doc.data()!;
    if (data.birthMonth && data.birthDay) {
      return NextResponse.json(
        { success: false, error: '誕生日・記念日は既に設定済みのため変更できません' },
        { status: 409 }
      );
    }

    await docRef.set({ birthMonth, birthDay }, { merge: true });

    return NextResponse.json({ success: true, birthMonth, birthDay });
  } catch (error: any) {
    console.error('[set-birthday] エラー:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
