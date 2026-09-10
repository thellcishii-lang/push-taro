import { NextResponse } from 'next/server';
import { db, authAdmin } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendEmail } from '@/lib/mailer';

// 紹介コード生成
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'AF-';
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
    // 🔥 すべてのフィールドを受け取る
    const {
      name,
      email,
      phone,
      address,
      businessType,
      companyName,
      invoiceNumber,
      rewardType,
      bankAccount,
    } = await request.json();

    // === バリデーション ===
    if (!name || !email) {
      return NextResponse.json(
        { error: '氏名とメールアドレスは必須です' },
        { status: 400 }
      );
    }

    if (!address) {
      return NextResponse.json(
        { error: '住所は必須です' },
        { status: 400 }
      );
    }

    if (businessType === 'corporation' && !companyName) {
      return NextResponse.json(
        { error: '法人の場合は会社名が必須です' },
        { status: 400 }
      );
    }

    if (!rewardType || !['recurring', 'one-time'].includes(rewardType)) {
      return NextResponse.json(
        { error: '報酬タイプを選択してください' },
        { status: 400 }
      );
    }

    if (!bankAccount || !bankAccount.bankName || !bankAccount.branchName || !bankAccount.accountNumber || !bankAccount.accountHolder) {
      return NextResponse.json(
        { error: '振込先口座情報はすべて必須です' },
        { status: 400 }
      );
    }

    // メールアドレス重複チェック
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

    const existing = await db.collection('affiliates').where('email', '==', email).get();
    if (!existing.empty) {
      return NextResponse.json(
        { error: 'このメールアドレスは既にアフィリエイト登録されています' },
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
      const existingCode = await db.collection('affiliates')
        .where('referralCode', '==', referralCode)
        .get();
      if (existingCode.empty) {
        codeExists = false;
      } else {
        referralCode = generateReferralCode();
        attempts++;
      }
    }

    // 🔥 インボイス番号の有無を判定
    const hasInvoice = !!(invoiceNumber && invoiceNumber.trim() !== '');

    // 🔥 Firestore 保存（全フィールドを保存）
    const affiliateData = {
      uid: userRecord.uid,
      name: name.trim(),
      email: email.trim(),
      phone: phone || '',
      address: address.trim(),
      businessType: businessType || 'individual',
      companyName: businessType === 'corporation' ? companyName.trim() : null,
      invoiceNumber: invoiceNumber || null,
      hasInvoice, // インボイス有無フラグ（報酬計算用）
      referralCode,
      rewardType,
      status: 'active',
      totalEarnings: 0,
      unpaidReward: 0,
      bankAccount: bankAccount,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('affiliates').add(affiliateData);

    // 🔥 登録完了メール（インボイス注意書き付き）
    await sendEmail({
      to: email,
      subject: '【Push-taro】アフィリエイト登録完了のお知らせ',
      html: `
        <h2>${name} 様</h2>
        <p>この度はPush-taroアフィリエイトプログラムへのご登録、誠にありがとうございます。</p>
        <p>以下の情報で管理画面にログインいただけます。</p>
        <hr />
        <p><strong>ログインID（メールアドレス）:</strong> ${email}</p>
        <p><strong>パスワード:</strong> <code style="background:#f1f5f9;padding:4px 12px;border-radius:4px;font-weight:bold;font-size:16px;">${generatedPassword}</code></p>
        <p><strong>ご自身の紹介コード:</strong> <code style="background:#f1f5f9;padding:4px 12px;border-radius:4px;font-weight:bold;">${referralCode}</code></p>
        <hr />
        <p><strong>インボイス登録番号:</strong> ${invoiceNumber || '未登録'}</p>
        ${!hasInvoice ? `
          <p style="color: #dc2626; font-weight: bold;">
            ⚠️ インボイス番号が未登録のため、報酬支払い時に10%が源泉徴収（または手数料）として差し引かれます。
          </p>
          <p>インボイス番号は後日マイページから登録可能です。</p>
        ` : `
          <p>✅ インボイス番号が登録されています。報酬は全額支払われます。</p>
        `}
        <hr />
        <p>初回ログイン後、パスワードの変更をお勧めします。</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/affiliate/dashboard" style="display:inline-block;padding:12px 24px;background:#ff4500;color:#fff;border-radius:6px;text-decoration:none;">アフィリエイトダッシュボードへ</a></p>
        <hr />
        <p><strong>Push-taro.com</strong></p>
        <p>運営会社：the合同会社</p>
        <p><a href="mailto:pushtaro-info@gmail.com">pushtaro-info@gmail.com</a></p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'アフィリエイト登録が完了しました',
      affiliateId: docRef.id,
      referralCode,
      email,
    });

  } catch (error: any) {
    console.error('[affiliate/signup] エラー:', error);
    return NextResponse.json(
      { error: error.message || '登録処理に失敗しました' },
      { status: 500 }
    );
  }
}
