import { NextResponse } from 'next/server';
import { db, authAdmin } from '../../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendEmail } from '../../../../lib/mailer';
import { PDFDocument } from 'pdf-lib';
import path from 'path';

// ============================================================
// 申し込み内容PDFを生成する関数（square-webhook と同じもの）
// ============================================================
async function generateInvoicePDF(data: any): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([600, 800]);
  const { width, height } = page.getSize();

  // タイトル
  page.drawText('お申し込み内容確認書', {
    x: 50,
    y: height - 50,
    size: 18,
  });

  // 申し込み内容
  const items = [
    ['会社名 / 屋号', data.name || ''],
    ['メールアドレス', data.email || ''],
    ['電話番号', data.phone || ''],
    ['住所', data.address || ''],
    ['選択プラン', data.plan ? data.plan.toUpperCase() : ''],
    ['インボイス番号', data.invoiceNumber || '未登録'],
  ];

  let y = height - 100;
  for (const [label, value] of items) {
    page.drawText(`${label}: ${value}`, {
      x: 50,
      y: y,
      size: 12,
    });
    y -= 25;
  }

  // PROプランの場合、口座情報も表示
  if (data.plan === 'pro' && data.bankAccount) {
    page.drawText('--- 銀行口座情報 ---', { x: 50, y: y, size: 12 });
    y -= 25;
    const bankItems = [
      ['金融機関名', data.bankAccount.bankName || ''],
      ['支店名', data.bankAccount.branchName || ''],
      ['口座種別', data.bankAccount.accountType === 'savings' ? '普通' : '当座'],
      ['口座番号', data.bankAccount.accountNumber || ''],
      ['口座名義', data.bankAccount.accountHolder || ''],
    ];
    for (const [label, value] of bankItems) {
      page.drawText(`${label}: ${value}`, { x: 50, y: y, size: 12 });
      y -= 25;
    }
  }

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}

// ============================================================
// 強制アクティベーションAPI
// ============================================================
export async function POST(request: Request) {
  try {
    const { shopId } = await request.json();

    if (!shopId) {
      return NextResponse.json({ error: 'shopIdが必要です' }, { status: 400 });
    }

    const shopDoc = await db.collection('shops').doc(shopId).get();

    if (!shopDoc.exists) {
      return NextResponse.json({ error: '店舗が見つかりません' }, { status: 404 });
    }

    const shopData = shopDoc.data();
    if (!shopData) {
      return NextResponse.json({ error: '店舗データが取得できません' }, { status: 404 });
    }

    if (shopData.status !== 'pending_payment') {
      return NextResponse.json({ error: 'この店舗は pending_payment ではありません' }, { status: 400 });
    }

    const customerEmail = shopData.email;
    const plan = shopData.plan || 'light';

    // ① パスワード生成（本番と同じ）
    const generatedPassword = 'Pass-' + Math.random().toString(36).slice(-8) + 'A1!';

    // ② Firebase Auth ユーザー作成（本番と同じ）
    let userRecord;
    try {
      userRecord = await authAdmin.createUser({
        email: customerEmail,
        password: generatedPassword,
        emailVerified: true,
      });
    } catch (err: any) {
      if (err.code === 'auth/email-already-exists') {
        userRecord = await authAdmin.getUserByEmail(customerEmail);
        await authAdmin.updateUser(userRecord.uid, { password: generatedPassword });
      } else {
        throw err;
      }
    }

    // ③ Firestore 更新（本番と同じ）
    await shopDoc.ref.update({
      status: 'active',
      ownerUid: userRecord.uid,
      squareCustomerId: 'force_activated',
      squarePaymentId: 'force_activated_' + Date.now(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // ④ 本登録完了メール送信（本番と同じ内容 + PDF添付）
    await sendEmail({
      to: customerEmail,
      subject: '【Push-taro】決済完了・本登録完了のお知らせ',
      html: `
        <h2>${shopData.name || '店舗'} 様</h2>
        <p>決済処理が完了して、本登録が完了いたしました。</p>
        <p>この度は、Push-taroにご登録頂き誠にありがとうございます。</p>
        <p>下記のリンクより、お客様のメールアドレスとパスワードでログインしてください。</p>
        <hr />
        <p>選択プラン: ${plan.toUpperCase()}</p>
        <p>
          <a 
            href="${process.env.NEXT_PUBLIC_APP_URL}/admin" 
            style="display:inline-block; padding:12px 24px; background:#ff4500; color:#fff; border-radius:6px; text-decoration:none; font-weight:bold;"
          >
            管理画面へログイン
          </a>
        </p>
        <p>ログインID: ${customerEmail}</p>
        <p>パスワード: <code>${generatedPassword}</code></p>
        <hr />
        <p><strong>Push-taro.com</strong></p>
        <p>運営会社：the合同会社</p>
        <p>〒357-0123 埼玉県飯能市中藤下郷23-21</p>
        <p><a href="mailto:pushtaro-info@gmail.com">pushtaro.info@gmail.com</a></p>
      `,
      attachments: [
        {
          filename: 'お申し込み内容.pdf',
          content: await generateInvoicePDF(shopData),
          contentType: 'application/pdf',
        },
        {
          filename: '利用規約.pdf',
          path: path.join(process.cwd(), 'public', 'terms.pdf'),
          contentType: 'application/pdf',
        },
      ],
    });

    return NextResponse.json({
      success: true,
      shopId,
      email: customerEmail,
      password: generatedPassword,
      message: '強制アクティベーション完了（本番と同じメール＋PDFを送信）',
    });

  } catch (error: any) {
    console.error('[force-activate] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
