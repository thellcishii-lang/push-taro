import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '../../../../lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: '有効なメールアドレスを入力してください' }, { status: 400 });
    }

    // 1. ランダムな初期パスワードを生成 (例: test-8桁ランダム)
    const generatedPassword = 'pass-' + Math.random().toString(36).substring(2, 10);

    // 2. Firebase Authentication にユーザーを作成 (すでに存在する場合は取得・パスワード上書き)
    let userRecord;
    try {
      userRecord = await adminAuth.createUser({
        email: email,
        password: generatedPassword,
        emailVerified: true,
      });
    } catch (e: any) {
      if (e.code === 'auth/email-already-exists') {
        userRecord = await adminAuth.getUserByEmail(email);
        await adminAuth.updateUser(userRecord.uid, { password: generatedPassword });
      } else {
        throw e;
      }
    }

    // 3. Firestore `shops` コレクションに新店舗ドキュメントを作成
    const shopRef = await adminDb.collection('shops').add({
      name: `テスト店舗 (${email})`,
      ownerUid: userRecord.uid,
      email: email,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      shopId: shopRef.id,
      email: email,
      password: generatedPassword,
    });
  } catch (error: any) {
    console.error('Test Shop Creation Error:', error);
    return NextResponse.json({ error: error.message || '作成処理に失敗しました' }, { status: 500 });
  }
}
