import { NextResponse } from 'next/server';
import { db, authAdmin } from '../../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendEmail } from '../../../../lib/mailer';

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

    if (shopData.status !== 'pending_payment') {
      return NextResponse.json({ error: 'この店舗は pending_payment ではありません' }, { status: 400 });
    }

    // パスワード生成
    const generatedPassword = 'Pass-' + Math.random().toString(36).slice(-8) + 'A1!';

    // Firebase Auth ユーザー作成
    let userRecord;
    try {
      userRecord = await authAdmin.createUser({
        email: shopData.email,
        password: generatedPassword,
        emailVerified: true,
      });
    } catch (err: any) {
      if (err.code === 'auth/email-already-exists') {
        userRecord = await authAdmin.getUserByEmail(shopData.email);
        await authAdmin.updateUser(userRecord.uid, { password: generatedPassword });
      } else {
        throw err;
      }
    }

    // 店舗更新
    await shopDoc.ref.update({
      status: 'active',
      ownerUid: userRecord.uid,
      updatedAt: FieldValue.serverTimestamp(),
      // squarePaymentId はモック用にダミーを入れておく（任意）
      squarePaymentId: 'force_activated_' + Date.now(),
    });

    // メール送信
    await sendEmail({
      to: shopData.email,
      subject: '【Push-taro】決済完了・本登録完了のお知らせ（テスト）',
      html: `
        <h2>${shopData.name || '店舗'} 様</h2>
        <p>テスト用の強制アクティベーションが完了しました。</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin">管理画面へログイン</a></p>
        <hr />
        <p>ログインID: ${shopData.email}</p>
        <p>パスワード: <code>${generatedPassword}</code></p>
        <p>※このパスワードは変更できません。大切に保管してください。</p>
      `,
    });

    return NextResponse.json({
      success: true,
      shopId,
      email: shopData.email,
      password: generatedPassword,
      message: '強制アクティベーションが完了しました（メール送信済み）',
    });

  } catch (error: any) {
    console.error('[force-activate] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
