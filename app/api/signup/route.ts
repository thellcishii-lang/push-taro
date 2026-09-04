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
    const normalizedEmail = email.trim().toLowerCase();

    if (!email || !companyName) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      );
    }

    
    // ============================================================
// メールアドレスの重複チェック
// ============================================================
const existingShops = await db.collection('shops')
  .where('email', '==', normalizedEmail)
  .get();

if (!existingShops.empty) {
  let isPending = false;
  let isActive = false;

  for (const doc of existingShops.docs) {
    const data = doc.data();
    const status = data.status || 'active';
    if (status === 'pending_payment') {
      isPending = true;
    } else if (status === 'active' || status === 'payment_warning' || status === 'send_disabled') {
      isActive = true;
    }
  }

  if (isPending) {
    return NextResponse.json({
      error: 'このメールアドレスはすでにお申し込み中です。決済をお済ませいただくか、別のメールアドレスをご使用ください。',
      status: 'pending_payment',
    }, { status: 409 });
  }

  if (isActive) {
    return NextResponse.json({
      error: 'このメールアドレスはすでにご登録済みです。管理画面よりログインしてください。',
      status: 'already_registered',
      alreadyPaid: true, // ← この1行を追加
    }, { status: 409 });
  }
}
// ============================================================
// 重複チェックここまで
// ============================================================

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

    // 🔽 この位置（仮店舗作成後、paymentUrl生成前）に追加
// ============================================================================
// 【追加】紹介コードの処理
// ============================================================================
const referralCodeFromBody = body.referralCode || ''; // フロントから送信される紹介コード

let referrerId: string | null = null;
let referrerType: string | null = null;

if (referralCodeFromBody) {
  // 紹介コードを検索（shops.referralCode で検索）
  const referrerSnapshot = await db.collection('shops')
    .where('referralCode', '==', referralCodeFromBody)  // ← 修正！ referralCode が正しい
    .limit(1)
    .get();

  if (!referrerSnapshot.empty) {
    const referrerDoc = referrerSnapshot.docs[0];
    const referrerData = referrerDoc.data();
    referrerId = referrerDoc.id;
    referrerType = referrerData.role === 'agency' ? 'agency' : 'pro';

    // 店舗に紹介者情報を保存（仮登録時点で保存）
    await shopRef.update({
      referrerId: referrerId,
      referredByCode: referralCodeFromBody,
      referrerType: referrerType,
    });

    // referral_relations を作成（status: pending）
    await db.collection('referral_relations').add({
      referrerId: referrerId,
      referredTenantId: shopId,
      rewardRate: referrerType === 'agency' ? 0.30 : 0.10, // 仮のレート（決済後に確定）
      status: 'pending', // 決済完了後に active へ変更
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // 紹介者へ通知メールを送信（※非同期で実行）
    await sendEmail({
      to: referrerData.email,
      subject: `【Push-taro】紹介コード [${referralCodeFromBody}] から新規登録がありました`,
      html: `
        <h2>${referrerData.name || '紹介者'} 様</h2>
        <p>あなたの紹介コード（${referralCodeFromBody}）を使用して、新しい店舗が登録されました。</p>
        <p><strong>店舗名:</strong> ${companyName || '未設定'}</p>
        <p>この店舗が決済を完了すると、紹介報酬が確定します。</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin">ダッシュボードで確認する</a></p>
      `,
    });

    console.log(`[紹介コード] 紹介者: ${referrerId} (${referrerType}), 新規店舗: ${shopId}`);
  }
}

    // ② Square決済リンクを生成（店舗ID・メール・プラン情報を埋め込む）
    let paymentUrl = '';
if (plan === 'light') {
  paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_TEST || 'https://square.link/u/pORV1sXA';
} else if (plan === 'standard') {
  paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_TEST || 'https://square.link/u/pORV1sXA';
} else if (plan === 'pro') {
  paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_TEST || 'https://square.link/u/pORV1sXA';
}

    // ③ 「申し込み受付メール」を送信（決済案内＋決済リンク記載）
    await sendEmail({
      to: email,
      subject: '【Push-taro】お申し込み受付のお知らせ（決済手続きのお願い）',
      html: `
        <h2>${companyName} 様</h2>
        <p>この度はPush-taroへのお申し込み、誠にありがとうございます。</p>
        <p>ご登録を完了するには、以下のリンクより決済手続きをお進めください。</p>
        <p>
          <a 
            href="${process.env.NEXT_PUBLIC_APP_URL}/payment/check?shopId=${shopId}" 
            style="display:inline-block; padding:12px 24px; background:#3182ce; color:#fff; border-radius:6px; text-decoration:none; font-weight:bold;"
          >
          決済画面へ進む
          </a>
　　　　　　　　　　　　　　　</p>
        <p>※決済完了後、改めて本登録完了のメールをお送りいたします。</p>
        <hr />
        <p>選択プラン: ${plan.toUpperCase()}</p>
        <hr />
        <p><strong>Push-taro.com</strong></p>
        <p>運営会社：the合同会社</p>
        <p>〒357-0123 埼玉県飯能市中藤下郷23-21</p>
        <p><a href="mailto:pushtaro-info@gmail.com">pushtaro.info@gmail.com</a></p>
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
