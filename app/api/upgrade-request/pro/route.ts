// app/api/upgrade-request/pro/route.ts
import { NextResponse } from 'next/server';
import { db, authAdmin } from '../../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendEmail } from '../../../../lib/mailer';

// PROプランのSquareリンク（環境変数から取得）
const PRO_PAYMENT_URL = process.env.NEXT_PUBLIC_SQUARE_LINK_PRO || '';

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  let uid: string;
  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await authAdmin.verifyIdToken(idToken);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: '無効なトークンです' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { shopId, companyName, invoiceNumber, address, phone, bankAccount } = body;

    if (!shopId) {
      return NextResponse.json({ error: '店舗IDが必要です' }, { status: 400 });
    }

    // 店舗の所有権確認
    const shopDoc = await db.collection('shops').doc(shopId).get();
    if (!shopDoc.exists || shopDoc.data()?.ownerUid !== uid) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }

    const shopData = shopDoc.data();

    // 既にPROならエラー
    if (shopData?.plan === 'pro') {
      return NextResponse.json(
        { error: 'すでにPROプランです' },
        { status: 400 }
      );
    }

    // アップグレード申請情報を一時保存（決済待ち）
    await shopDoc.ref.update({
      upgradeStatus: 'pending_payment',
      upgradeTargetPlan: 'pro',
      upgradeRequestedAt: FieldValue.serverTimestamp(),
      upgradeData: {
        companyName: companyName || shopData?.name || '',
        invoiceNumber: invoiceNumber || '',
        address: address || '',
        phone: phone || '',
        bankAccount: bankAccount || null,
      },
      updatedAt: FieldValue.serverTimestamp(),
    });

    // PROプランのSquare決済リンクを返す
    if (!PRO_PAYMENT_URL) {
      return NextResponse.json(
        { error: '決済リンクが設定されていません' },
        { status: 500 }
      );
    }

    // 決済リンクに shopId をパラメータとして付与
    const paymentUrl = `${PRO_PAYMENT_URL}?shop_id=${shopId}&upgrade=pro`;

    // アップグレード申請受付メール（決済案内）
    await sendEmail({
  to: shopData?.email || '',  // ← オプショナルチェーン + フォールバック
  subject: '【プッシュ太郎】PROプラン アップグレード申請受付',  // ← 正しい名称
  html: `
    <h2>${shopData?.name || '店舗'} 様</h2>  // ← オプショナルチェーン + フォールバック
    <p>PROプランへのアップグレード申請を受け付けました。</p>
    <p>以下のリンクより決済手続きをお進めください。</p>
    <p><a href="${paymentUrl}" style="display:inline-block;padding:12px 24px;background:#ff4500;color:#fff;border-radius:6px;text-decoration:none;">決済画面へ進む</a></p>
    <p>決済完了後、PROプランが有効になり、紹介報酬機能もご利用いただけます。</p>
  `,
});

    return NextResponse.json({
      success: true,
      paymentUrl,
      message: 'PROアップグレード申請を受け付けました。決済へお進みください。',
    });

  } catch (error: any) {
    console.error('[upgrade-pro] エラー:', error);
    return NextResponse.json(
      { error: error.message || 'アップグレード処理に失敗しました' },
      { status: 500 }
    );
  }
}
