import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendEmail } from '../../../lib/mailer';

// Square決済リンク生成関数（仮）
function generateSquarePaymentLink(shopId: string, email: string, amount: number): string {
  return `https://square.link/xxx?shopId=${shopId}&email=${encodeURIComponent(email)}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // ① bodyから checkOnly, bankAccount を含む全データを取り出す
    const { plan, companyName, invoiceNumber, address, phone, email, checkOnly, bankAccount } = body;

    // メールアドレスの必須チェック
    if (!email) {
      return NextResponse.json(
        { error: 'メールアドレスは必須です。' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

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
        } else if (['active', 'payment_warning', 'send_disabled'].includes(status)) {
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
          alreadyPaid: true,
        }, { status: 409 });
      }
    }

    // ============================================================
    // 🔑 入力画面（signup/page）からの重複チェック（checkOnly: true）時の処理
    // DBへの登録やメール送信は行わずにここでレスポンスを返して終了
    // ============================================================
    if (checkOnly) {
      return NextResponse.json({
        success: true,
        message: '利用可能なメールアドレスです。',
      });
    }

    // ============================================================
    // これ以降は確認画面（signup/confirm/page）からの本申し込み処理
    // ============================================================
    if (!companyName) {
      return NextResponse.json(
        { error: '必須項目が不足しています。' },
        { status: 400 }
      );
    }

    // ① 仮店舗ドキュメントを作成（status: pending_payment）
    const shopData = {
      name: companyName,
      email: normalizedEmail,
      plan: plan || 'light',
      status: 'pending_payment',
      createdAt: FieldValue.serverTimestamp(),
      coupon: { enabled: false, title: '', description: '', discountRate: 0 },
      linkUrl: '',
      iconUrl: '',
      invoiceNumber: invoiceNumber || '',
      address: address || '',
      phone: phone || '',
      bankAccount: bankAccount || null,
    };

    const shopRef = await db.collection('shops').add(shopData);
    const shopId = shopRef.id;
    const referralCode = shopId.slice(0, 8).toUpperCase();
    await shopRef.update({ referralCode });

    // 紹介コードの処理
    const referralCodeFromBody = body.referralCode || '';

    if (referralCodeFromBody) {
      const referrerSnapshot = await db.collection('shops')
        .where('referralCode', '==', referralCodeFromBody)
        .limit(1)
        .get();

      if (!referrerSnapshot.empty) {
        const referrerDoc = referrerSnapshot.docs[0];
        const referrerData = referrerDoc.data();
        const referrerId = referrerDoc.id;

        // 1. 紹介者の種別（代理店かPRO会員か）を判定
        const isAgency = referrerData.role === 'agency';
        const isPro = referrerData.plan === 'pro' || referrerData.role === 'pro';

        // 🔑 代理店でもPRO会員でもない場合は、紹介報酬対象外とする
        if (isAgency || isPro) {
          const referrerType = isAgency ? 'agency' : 'pro';

          // 2. 新仕様に基づいた報酬率（rewardRate）の計算
          let rewardRate = 0;
          if (isAgency) {
            // 代理店の場合: Proは30%、Light/Standardは18%
            rewardRate = (plan === 'pro') ? 0.30 : 0.18;
          } else if (isPro) {
            // PROプラン会員の場合: 全プラン一律10%
            rewardRate = 0.10;
          }

          await shopRef.update({
            referrerId: referrerId,
            referredByCode: referralCodeFromBody,
            referrerType: referrerType,
          });

          await db.collection('referral_relations').add({
            referrerId: referrerId,
            referredTenantId: shopId,
            rewardRate: rewardRate, // 🔑 動的に計算された報酬率を保存
            status: 'pending',
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          });

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

          console.log(`[紹介コード] 紹介者: ${referrerId} (${referrerType}), 新規店舗: ${shopId}, レート: ${rewardRate * 100}%`);
        }
      }
    }

    // ② Square決済リンク生成
    let paymentUrl = '';
    if (plan === 'light') {
      paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_TEST || 'https://square.link/u/pORV1sXA';
    } else if (plan === 'standard') {
      paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_TEST || 'https://square.link/u/pORV1sXA';
    } else if (plan === 'pro') {
      paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_TEST || 'https://square.link/u/pORV1sXA';
    }

    // ③ 申し込み受付メール送信
    await sendEmail({
      to: normalizedEmail,
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

    // ④ フロント（確認画面）へレスポンスを返す
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
