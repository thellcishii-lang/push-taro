import { NextResponse } from 'next/server';
import { db, authAdmin } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendEmail } from '@/lib/mailer';

// 紹介コード生成（AGENCY-XXXXXX）
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'AGENCY-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// パスワード自動生成（8桁）
function generatePassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const {
      businessType,
      companyName,
      ownerName,
      email,
      phone,
      address,
      invoiceNumber,
      bankAccount,
    } = await request.json();

    // === バリデーション ===
    if (!email) {
      return NextResponse.json({ error: 'メールアドレスは必須です' }, { status: 400 });
    }
    if (!ownerName) {
      return NextResponse.json({ error: '担当者名は必須です' }, { status: 400 });
    }
    if (!address) {
      return NextResponse.json({ error: '住所は必須です' }, { status: 400 });
    }
    if (businessType === 'corporation' && !companyName) {
      return NextResponse.json({ error: '法人の場合は会社名が必須です' }, { status: 400 });
    }
    if (!bankAccount || !bankAccount.bankName || !bankAccount.branchName || !bankAccount.accountNumber || !bankAccount.accountHolder) {
      return NextResponse.json({ error: '振込先口座情報はすべて必須です' }, { status: 400 });
    }

    // メールアドレス重複チェック（Auth）
    try {
      await authAdmin.getUserByEmail(email);
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 409 }
      );
    } catch (e: any) {
      if (e.code !== 'auth/user-not-found') {
        throw e;
      }
    }

    // メールアドレス重複チェック（agencies）
    const existing = await db.collection('agencies').where('email', '==', email).get();
    if (!existing.empty) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に代理店登録されています' },
        { status: 409 }
      );
    }

    // パスワード自動生成
    const generatedPassword = generatePassword();

    // Firebase Auth ユーザー作成
    const userRecord = await authAdmin.createUser({
      email,
      password: generatedPassword,
      emailVerified: true,
    });

    // 紹介コード生成（重複防止）
    let referralCode = generateReferralCode();
    let codeExists = true;
    let attempts = 0;
    while (codeExists && attempts < 10) {
      const existingCode = await db.collection('agencies')
        .where('referralCode', '==', referralCode)
        .get();
      if (existingCode.empty) {
        codeExists = false;
      } else {
        referralCode = generateReferralCode();
        attempts++;
      }
    }

    const hasInvoice = !!(invoiceNumber && invoiceNumber.trim() !== '');

    // agencies コレクションに保存
    const agencyData = {
      uid: userRecord.uid,
      companyName: businessType === 'corporation' ? companyName.trim() : null,
      ownerName: ownerName.trim(),
      email: email.trim(),
      phone: phone || '',
      address: address.trim(),
      businessType: businessType || 'corporation',
      invoiceNumber: invoiceNumber || null,
      hasInvoice,
      referralCode,
      status: 'pending_approval',
      bankAccount: {
        bankName: bankAccount.bankName.trim(),
        branchName: bankAccount.branchName.trim(),
        accountType: bankAccount.accountType || 'savings',
        accountNumber: bankAccount.accountNumber.trim(),
        accountHolder: bankAccount.accountHolder.trim(),
      },
      approvedAt: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await db.collection('agencies').doc(userRecord.uid).set(agencyData);

    // 登録完了メール（パスワード含む）
    await sendEmail({
      to: email,
      subject: '【Push-taro】代理店申し込み受付のお知らせ',
      html: `
        <h2>${ownerName} 様</h2>
        <p>この度はPush-taro代理店プログラムへのお申し込み、誠にありがとうございます。</p>
        <p>以下の情報で管理画面にログインいただけます。</p>
        <hr />
        <p><strong>ログインID（メールアドレス）:</strong> ${email}</p>
        <p><strong>パスワード:</strong> <code style="background:#f1f5f9;padding:4px 12px;border-radius:4px;font-weight:bold;font-size:16px;">${generatedPassword}</code></p>
        <p><strong>ご自身の紹介コード:</strong> <code style="background:#f1f5f9;padding:4px 12px;border-radius:4px;font-weight:bold;">${referralCode}</code></p>
        <hr />
        <p>審査完了後、決済手続き用のご案内メールをお送りいたします。</p>
        <p>初回ログイン後、パスワードの変更をお勧めします。</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/agency/dashboard" style="display:inline-block;padding:12px 24px;background:#3182ce;color:#fff;border-radius:6px;text-decoration:none;">代理店ダッシュボードへ</a></p>
        <hr />
        <p><strong>Push-taro.com</strong></p>
        <p>運営会社：the合同会社</p>
        <p>〒357-0123 埼玉県飯能市中藤下郷23-21</p>
        <p><a href="mailto:pushtaro-info@gmail.com">pushtaro-info@gmail.com</a></p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: '代理店申し込みを受け付けました',
      agencyId: userRecord.uid,
      referralCode,
      email,
    });

  } catch (error: any) {
    console.error('[agency/signup] エラー:', error);
    return NextResponse.json(
      { error: error.message || '申し込み処理に失敗しました' },
      { status: 500 }
    );
  }
}
