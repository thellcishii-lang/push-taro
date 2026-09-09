import { NextResponse } from 'next/server';
import { db, authAdmin } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendEmail } from '@/lib/mailer';

// 紹介コード生成関数（AF-XXXXXX）
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'AF-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: Request) {
  try {
    const { name, email, password, bankAccount } = await request.json();

    // ① バリデーション
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: '氏名・メールアドレス・パスワードは必須です' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'パスワードは6文字以上にしてください' },
        { status: 400 }
      );
    }

    // ② メールアドレスの重複チェック（Auth + Firestore）
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
      // ユーザーが存在しない → 続行
    }

    // Firestore でも重複チェック
    const existing = await db.collection('affiliates').where('email', '==', email).get();
    if (!existing.empty) {
      return NextResponse.json(
        { error: 'このメールアドレスは既にアフィリエイト登録されています' },
        { status: 409 }
      );
    }

    // ③ Firebase Auth ユーザー作成
    const userRecord = await authAdmin.createUser({
      email,
      password,
      emailVerified: true,
    });

    // ④ 紹介コード生成（重複防止）
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

    // ⑤ Firestore にアフィリエイトデータを作成
    const affiliateData = {
      uid: userRecord.uid,
      name: name.trim(),
      email: email.trim(),
      referralCode,
      status: 'active',
      totalEarnings: 0,
      unpaidReward: 0,
      bankAccount: bankAccount || null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('affiliates').add(affiliateData);

    // ⑥ 登録完了メール送信
    await sendEmail({
      to: email,
      subject: '【Push-taro】アフィリエイト登録完了のお知らせ',
      html: `
        <h2>${name} 様</h2>
        <p>この度はPush-taroアフィリエイトプログラムへのご登録、誠にありがとうございます。</p>
        <p>以下の情報で管理画面にログインいただけます。</p>
        <hr />
        <p><strong>ログインID:</strong> ${email}</p>
        <p><strong>ご自身の紹介コード:</strong> <code style="background:#f1f5f9;padding:4px 12px;border-radius:4px;font-weight:bold;">${referralCode}</code></p>
        <hr />
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
