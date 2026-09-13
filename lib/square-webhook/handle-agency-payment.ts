// lib/square-webhook/handle-agency-payment.ts
/**
 * 代理店の決済（加盟金 / 月額）を処理
 * 
 * 加盟金: 300,000円（単発）
 * 月額:   30,000円（サブスク）
 * 
 * 金額で判別。
 * 両方完了で agencies.status = 'active'
 */
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendEmail } from '@/lib/mailer';

const AGENCY_INITIAL_AMOUNT = 300000;
const AGENCY_MONTHLY_AMOUNT = 30000;

/**
 * 加盟金 or 月額の成功を処理
 */
export async function handleAgencyPaymentSuccess(
  customerEmail: string,
  amount: number,
  paymentId: string | null
) {
  // 金額で判別
  if (amount !== AGENCY_INITIAL_AMOUNT && amount !== AGENCY_MONTHLY_AMOUNT) {
    // 代理店の決済ではない
    return null;
  }

  // 代理店をメールアドレスで検索
  const agencySnap = await db.collection('agencies')
    .where('email', '==', customerEmail)
    .limit(1)
    .get();

  if (agencySnap.empty) {
    console.log(`[代理店決済] 該当代理店なし: ${customerEmail}`);
    return null;
  }

  const agencyDoc = agencySnap.docs[0];
  const agencyData = agencyDoc.data();
  const agencyId = agencyDoc.id;

  // 冪等性チェック
  if (paymentId) {
    const alreadyProcessed = await db.collection('agencies')
      .where('initialPayment.paymentId', '==', paymentId)
      .limit(1)
      .get();
    if (!alreadyProcessed.empty) {
      console.log(`[代理店決済] 加盟金 処理済み: ${paymentId}`);
      return { success: true, alreadyProcessed: true };
    }

    const alreadyMonthly = await db.collection('agencies')
      .where('monthlyPayment.lastPaymentId', '==', paymentId)
      .limit(1)
      .get();
    if (!alreadyMonthly.empty) {
      console.log(`[代理店決済] 月額 処理済み: ${paymentId}`);
      return { success: true, alreadyProcessed: true };
    }
  }

  // ============================================================
  // 加盟金の処理
  // ============================================================
  if (amount === AGENCY_INITIAL_AMOUNT) {
    await agencyDoc.ref.update({
      initialPayment: {
        paid: true,
        paidAt: FieldValue.serverTimestamp(),
        paymentId,
      },
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`[代理店決済] 加盟金完了: ${agencyId}`);

    // 両方完了チェック
    await checkAndActivate(agencyDoc);

    return { success: true, type: 'initial' };
  }

  // ============================================================
  // 月額の処理
  // ============================================================
  if (amount === AGENCY_MONTHLY_AMOUNT) {
    await agencyDoc.ref.update({
      'monthlyPayment.status': 'active',
      'monthlyPayment.lastPaidAt': FieldValue.serverTimestamp(),
      'monthlyPayment.lastPaymentId': paymentId,
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`[代理店決済] 月額完了: ${agencyId}`);

    // 両方完了チェック
    await checkAndActivate(agencyDoc);

    return { success: true, type: 'monthly' };
  }

  return null;
}

/**
 * 加盟金 or 月額の失敗を処理
 */
export async function handleAgencyPaymentFailed(
  customerEmail: string,
  amount: number
) {
  // 月額失敗のみ処理（加盟金は単発で失敗したら再度リンクを送る運用）
  if (amount !== AGENCY_MONTHLY_AMOUNT) {
    return null;
  }

  const agencySnap = await db.collection('agencies')
    .where('email', '==', customerEmail)
    .limit(1)
    .get();

  if (agencySnap.empty) return null;

  const agencyDoc = agencySnap.docs[0];
  const agencyData = agencyDoc.data();
  const currentFailedCount = agencyData?.monthlyPayment?.failedCount || 0;

  await agencyDoc.ref.update({
    'monthlyPayment.status': 'failed',
    'monthlyPayment.lastFailedAt': FieldValue.serverTimestamp(),
    'monthlyPayment.failedCount': currentFailedCount + 1,
    updatedAt: FieldValue.serverTimestamp(),
  });

  console.log(`[代理店決済] 月額失敗: ${agencyDoc.id} / ${currentFailedCount + 1}回目`);

  return { success: true, type: 'monthly_failed' };
}

/**
 * 両方完了チェック → active に
 */
async function checkAndActivate(
  agencyDoc: FirebaseFirestore.QueryDocumentSnapshot
) {
  const data = agencyDoc.data();

  const initialPaid = data?.initialPayment?.paid === true;
  const monthlyActive = data?.monthlyPayment?.status === 'active';

  if (initialPaid && monthlyActive && data?.status !== 'active') {
    await agencyDoc.ref.update({
      status: 'active',
      activatedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // 新パスワード生成
const newPassword = 'Pass-' + Math.random().toString(36).slice(-8) + 'A1!';
await authAdmin.updateUser(data.uid, { password: newPassword });

await sendEmail({
  to: data.email,
  subject: '【Push-taro】代理店アカウントが有効化されました',
  html: `
    ...
    <p><strong>ログインID:</strong> ${data.email}</p>
    <p><strong>パスワード:</strong> <code>${newPassword}</code></p>
    ...
  `,
});
    
    // 完了メール送信
    if (data?.email) {
      await sendEmail({
        to: data.email,
        subject: '【Push-taro】代理店アカウントが有効化されました',
        html: `
          <h2>${data.companyName || data.ownerName || '代理店'} 様</h2>
          <p>加盟金および月額費用のお支払いが確認されました。</p>
          <p>代理店アカウントが正式に有効化されましたので、ご報告いたします。</p>
          <hr />
          <p><strong>代理店ログイン:</strong> ${data.email}</p>
          <p><strong>紹介コード:</strong> <code>${data.referralCode || '未設定'}</code></p>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/agency/dashboard" style="display:inline-block;padding:12px 24px;background:#3182ce;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">
              代理店ダッシュボードへ
            </a>
          </p>
          <hr />
          <p><strong>Push-taro.com</strong></p>
          <p>運営会社：the合同会社</p>
          <p>〒357-0123 埼玉県飯能市中藤下郷23-21</p>
          <p><a href="mailto:pushtaro-info@gmail.com">pushtaro-info@gmail.com</a></p>
        `,
      });
    }

    console.log(`[代理店決済] ✅ 代理店を active に: ${agencyDoc.id}`);
  }
}
