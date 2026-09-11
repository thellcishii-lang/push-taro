import { NextResponse } from 'next/server';
import { db, authAdmin } from '@/lib/firebase-admin';
import { sendEmail } from '@/lib/mailer';
import { FieldValue } from 'firebase-admin/firestore';

// 🔥 実際にメールを送信するヘルパー
async function sendUserPayoutEmail({
  to,
  amount,
  bankHolder,
}: {
  to: string;
  amount: number;
  bankHolder?: string;
}) {
  try {
    await sendEmail({
      to,
      subject: '【Push-taro】紹介報酬のお振込み完了のお知らせ',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>紹介報酬のお振込みが完了しました</h2>
          <p>いつもPush-taroをご利用いただき、ありがとうございます。</p>
          <p>下記の通り、紹介報酬のお振込みが完了いたしましたのでご報告いたします。</p>
          <hr />
          <table style="font-size: 14px;">
            <tr>
              <td style="padding: 6px; font-weight: bold;">お振込金額</td>
              <td style="padding: 6px;">¥${amount.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 6px; font-weight: bold;">お振込先</td>
              <td style="padding: 6px;">${bankHolder || 'ご登録口座'}</td>
            </tr>
            <tr>
              <td style="padding: 6px; font-weight: bold;">お振込日</td>
              <td style="padding: 6px;">${new Date().toLocaleDateString('ja-JP')}</td>
            </tr>
          </table>
          <hr />
          <p style="font-size: 13px; color: #64748b;">
            ご不明な点がございましたら、お気軽にお問い合わせください。
          </p>
          <hr />
          <p><strong>Push-taro.com</strong></p>
          <p>運営会社：the合同会社</p>
          <p><a href="mailto:pushtaro-info@gmail.com">pushtaro-info@gmail.com</a></p>
        </div>
      `,
    });
    console.log(`[振込完了メール] 送信成功: ${to}`);
  } catch (error) {
    console.error('[振込完了メール] 送信失敗:', error);
    throw error;
  }
}

// ============================================================
// メイン API
// ============================================================
export async function POST(req: Request) {
  // 🔒 管理者チェック
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await authAdmin.verifyIdToken(idToken);
    const userRecord = await authAdmin.getUser(decoded.uid);
    if (userRecord.customClaims?.admin !== true) {
      return NextResponse.json({ error: '管理者権限が必要です' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: '無効なトークンです' }, { status: 401 });
  }

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
      lastPaidAt: FieldValue.serverTimestamp(),
    });

    // 2. ユーザーへ振込完了通知メールを送信
    await sendUserPayoutEmail({
      to: userData?.email,
      amount: amount,
      bankHolder: userData?.bankAccount?.accountHolder,
    });

    // 3. 振込履歴を記録
    await db.collection('payout_history').add({
      userId,
      amount,
      bankAccount: userData?.bankAccount || null,
      paidAt: FieldValue.serverTimestamp(),
      paidBy: userRecord.uid,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[complete-payout] エラー:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
