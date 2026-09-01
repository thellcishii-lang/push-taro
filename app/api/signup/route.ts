import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendEmail } from '../../../lib/mailer';

// Square決済リンク生成関数（仮）
function generateSquarePaymentLink(shopId: string, email: string, amount: number): string {
  // 実際にはSquare APIを呼び出して支払いリンクを生成
  // 今回はモック
  return `https://square.link/xxx?shopId=${shopId}&email=${encodeURIComponent(email)}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plan, companyName, invoiceNumber, address, phone, email } = body;

    if (!email || !companyName) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      );
    }

    // ① 仮店舗ドキュメントを作成（status: pending_payment）
    const shopData = {
      name: companyName,
      email,
      plan: plan || 'light',
      status: 'pending_payment', // 🔑 決済待ち
      createdAt: FieldValue.serverTimestamp(),
      coupon: { enabled: false, title: '', description: '', discountRate: 0 },
      linkUrl: '',
      iconUrl: '',
      invoiceNumber: invoiceNumber || '',
      address: address || '',
      phone: phone || '',
      // Authはまだ作成しない！
    };

    const shopRef = await db.collection('shops').add(shopData);
    const shopId = shopRef.id;
    const referralCode = shopId.slice(0, 8).toUpperCase();
    await shopRef.update({ referralCode });

    // ② Square決済リンクを生成（店舗ID・メール・プラン情報を埋め込む）
    const amount = plan === 'pro' ? 10000 : plan === 'standard' ? 3800 : 1980;
    const paymentUrl = generateSquarePaymentLink(shopId, email, amount);

    // ③ 「申し込み受付メール」を送信（決済案内＋決済リンク記載）
    await sendEmail({
      to: email,
      subject: '【プッシュ太郎】申し込み受付のお知らせ（決済手続きのお願い）',
      html: `
        <h2>${companyName} 様</h2>
        <p>この度はプッシュ太郎へのお申し込み、誠にありがとうございます。</p>
        <p>ご登録を完了するには、以下のリンクより決済手続きをお進めください。</p>
        <p><a href="${paymentUrl}" style="display:inline-block;padding:12px 24px;background:#3182ce;color:#fff;border-radius:6px;text-decoration:none;">決済画面へ進む</a></p>
        <p>※決済完了後、改めて本登録完了のメールをお送りいたします。</p>
        <hr />
        <p>店舗ID: <code>${shopId}</code></p>
        <p>選択プラン: ${plan.toUpperCase()}</p>
      `,
    });

    // ④ フロントに決済リンクを返す
    return NextResponse.json({
      success: true,
      shopId,
      paymentUrl,
      message: '申し込みを受け付けました。決済へお進みください。',
    });

  } catch (error: any) {
    console.error('[signup] エラー:', error);
    return NextResponse.json(
      { error: error.message || '登録処理に失敗しました' },
      { status: 500 }
    );
  }
}
