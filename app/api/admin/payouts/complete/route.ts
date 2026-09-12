// app/api/admin/payouts/complete/route.ts
/**
 * 支払い完了処理
 * 
 * 1. 対象ユーザーの monthly_rewards（未払い）を全件 paid に更新
 * 2. unpaidRewardTotal / unpaidReward を 0 にリセット
 * 3. ユーザーに振込完了メール送信
 * 4. payout_history に記録
 */
import { NextResponse } from 'next/server';
import { db, authAdmin } from '@/lib/firebase-admin';
import { sendEmail } from '@/lib/mailer';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  let adminUid: string;
  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await authAdmin.verifyIdToken(idToken);
    const userRecord = await authAdmin.getUser(decoded.uid);
    if (userRecord.customClaims?.admin !== true) {
      return NextResponse.json({ error: '管理者権限が必要です' }, { status: 403 });
    }
    adminUid = decoded.uid;
  } catch {
    return NextResponse.json({ error: '無効なトークンです' }, { status: 401 });
  }

  try {
    const { userId, referrerType, amount } = await req.json();

    if (!userId || !referrerType || !amount) {
      return NextResponse.json({ error: 'userId, referrerType, amount が必要です' }, { status: 400 });
    }

    // コレクション判定
    let collection = 'shops';
    if (referrerType === 'agency') collection = 'agencies';
    else if (referrerType === 'affiliate') collection = 'affiliates';

    const userRef = db.collection(collection).doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    const userData = userDoc.data()!;

    // ============================================================
    // 1. monthly_rewards の未払いレコードを paid に更新
    // ============================================================
    const rewardsSnap = await db.collection('monthly_rewards')
      .where('userId', '==', userId)
      .where('referrerType', '==', referrerType)
      .where('status', '==', 'unpaid')
      .get();

    const batch = db.batch();
    rewardsSnap.docs.forEach((doc) => {
      batch.update(doc.ref, {
        status: 'paid',
        paidAt: FieldValue.serverTimestamp(),
        paidBy: adminUid,
      });
    });
    await batch.commit();

    // ============================================================
    // 2. 未払い累計をリセット
    // ============================================================
    const unpaidField = referrerType === 'affiliate' ? 'unpaidReward' : 'unpaidRewardTotal';

    await userRef.update({
      [unpaidField]: 0,
      payoutStatus: 'none',
      lastPaidAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // ============================================================
    // 3. 振込完了メール
    // ============================================================
    if (userData.email) {
      await sendEmail({
        to: userData.email,
        subject: '【Push-taro】報酬のお振込み完了のお知らせ',
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>報酬のお振込みが完了しました</h2>
            <p>いつもPush-taroをご利用いただき、ありがとうございます。</p>
            <p>下記の通り、報酬のお振込みが完了いたしましたのでご報告いたします。</p>
            <hr />
            <table style="font-size: 14px;">
              <tr>
                <td style="padding: 6px; font-weight: bold;">お振込金額</td>
                <td style="padding: 6px;">¥${amount.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 6px; font-weight: bold;">お振込先</td>
                <td style="padding: 6px;">${userData.bankAccount?.accountHolder || 'ご登録口座'}</td>
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
    }

    // ============================================================
    // 4. payout_history に記録
    // ============================================================
    await db.collection('payout_history').add({
      userId,
      referrerType,
      amount,
      bankAccount: userData.bankAccount || null,
      paidAt: FieldValue.serverTimestamp(),
      paidBy: adminUid,
      rewardIds: rewardsSnap.docs.map((d) => d.id),
    });

    console.log(`[payouts/complete] ✅ ${referrerType}/${userId} / ¥${amount.toLocaleString()}`);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[payouts/complete] エラー:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
