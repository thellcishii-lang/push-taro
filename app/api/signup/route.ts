import { NextResponse } from 'next/server';
import { db, authAdmin } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendEmail } from '../../../lib/mailer';
import { notifyAdmins } from '@/lib/error-notifier';

export async function POST(request: Request) {
  let body: any = {};  // 🔥 try の外で宣言

  try {
    body = await request.json();

    // ============================================================
    // 1. リクエストボディから全データを取得
    // ============================================================
    const {
      plan,
      companyName,
      invoiceNumber,
      address,
      phone,
      email,
      checkOnly,
      bankAccount,
      referralCode: referralCodeFromBody,
    } = body;

    // メールアドレスの必須チェック
    if (!email) {
      return NextResponse.json(
        { error: 'メールアドレスは必須です。' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ============================================================
    // 2. メールアドレスの重複チェック
    // ============================================================

    // 🔥 2-1. Firebase Auth の重複チェック
    try {
      await authAdmin.getUserByEmail(normalizedEmail);
      // ユーザーが見つかった → 既に登録済み
      return NextResponse.json({
        error: 'このメールアドレスはすでに登録されています。',
        status: 'already_registered',
      }, { status: 409 });
    } catch (authErr: any) {
      if (authErr.code !== 'auth/user-not-found') {
        // 予期しないエラー
        throw authErr;
      }
      // ユーザーが存在しない → 続行
    }

    // 🔥 2-2. Firestore (shops) の重複チェック（既存）
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
    // 3. checkOnly の場合はここで終了（重複チェックのみ）
    // ============================================================
    if (checkOnly) {
      return NextResponse.json({
        success: true,
        message: '利用可能なメールアドレスです。',
      });
    }

    // ============================================================
    // 4. 必須項目チェック（本申し込み）
    // ============================================================
    if (!companyName) {
      return NextResponse.json(
        { error: '必須項目が不足しています。' },
        { status: 400 }
      );
    }

    // ============================================================
    // 5. 紹介コードの処理（変数宣言はここで行う）
    // ============================================================
    const refCode = referralCodeFromBody || '';
    let referrerId: string | null = null;
    let referrerType: string | null = null;
    let referrerEmail: string | null = null;
    let referrerName: string | null = null;
    let rewardRate: number = 0;

    if (refCode) {
      // プレフィックスで検索先を振り分け
      if (refCode.startsWith('AF-')) {
        // アフィリエイト（affiliates コレクション）
        const affiliateSnapshot = await db.collection('affiliates')
          .where('referralCode', '==', refCode)
          .limit(1)
          .get();

        if (!affiliateSnapshot.empty) {
          const doc = affiliateSnapshot.docs[0];
          const data = doc.data();
          referrerId = doc.id;
          referrerType = 'affiliate';
          referrerEmail = data.email;
          referrerName = data.name || 'アフィリエイト';
          rewardRate = 0.05; // アフィリエイトは一律5%（継続課金型）
        }
      } else if (refCode.startsWith('AGENCY-')) {
        // 代理店（agencies コレクション）
        const agencySnapshot = await db.collection('agencies')
          .where('referralCode', '==', refCode)
          .limit(1)
          .get();

        if (!agencySnapshot.empty) {
          const doc = agencySnapshot.docs[0];
          const data = doc.data();
          referrerId = doc.id;
          referrerType = 'agency';
          referrerEmail = data.email;
          referrerName = data.companyName || data.ownerName || '代理店';
          // 代理店の報酬率はプランによって後で計算（ここでは仮）
          rewardRate = (plan === 'pro') ? 0.30 : 0.18;
          // インボイス番号がない場合は10%差引
          const hasInvoice = !!(data.invoiceNumber && data.invoiceNumber.trim() !== '');
          if (!hasInvoice) {
            rewardRate = rewardRate * 0.9;
          }
        }
      } else {
        // それ以外（shops コレクション）- PROユーザー or 一般店舗
        const shopSnapshot = await db.collection('shops')
          .where('referralCode', '==', refCode)
          .limit(1)
          .get();

        if (!shopSnapshot.empty) {
          const doc = shopSnapshot.docs[0];
          const data = doc.data();
          referrerId = doc.id;
          referrerEmail = data.email;
          referrerName = data.name || '紹介者';

          // role で判定（agency はこの時点では shops に残っている可能性もあるが、AGENCY- プレフィックスで先に処理済み）
          if (data.role === 'agency') {
            referrerType = 'agency';
            rewardRate = (plan === 'pro') ? 0.30 : 0.18;
            const hasInvoice = !!(data.invoiceNumber && data.invoiceNumber.trim() !== '');
            if (!hasInvoice) {
              rewardRate = rewardRate * 0.9;
            }
          } else if (data.role === 'pro' || data.plan === 'pro') {
            referrerType = 'pro';
            rewardRate = 0.10;
            const hasInvoice = !!(data.invoiceNumber && data.invoiceNumber.trim() !== '');
            if (!hasInvoice) {
              rewardRate = 0.09;
            }
          } else {
            // 一般店舗は紹介報酬対象外
            referrerType = 'shop';
            rewardRate = 0;
          }
        }
      }
    }

    // ============================================================
    // 6. 仮店舗ドキュメントを作成（status: pending_payment）
    // ============================================================
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
      // 紹介情報（変数を使用）
      referrerId: referrerId,
      referredByCode: refCode || '',
      referrerType: referrerType,
    };

    const shopRef = await db.collection('shops').add(shopData);
    const shopId = shopRef.id;
    const referralCode = shopId.slice(0, 8).toUpperCase();
    await shopRef.update({ referralCode });

    // ============================================================
    // 7. 紹介者が見つかった場合の追加処理
    // ============================================================
    if (referrerId && referrerType && rewardRate > 0) {
      // 紹介リレーションを保存
      await db.collection('referral_relations').add({
        referrerId: referrerId,
        referredTenantId: shopId,
        rewardRate: rewardRate,
        status: 'pending', // 決済完了で active になる
        referrerType: referrerType, // 追加：紹介者の種別
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      // 紹介者にメール通知
      if (referrerEmail) {
        const ratePercent = (rewardRate * 100).toFixed(1);
        await sendEmail({
          to: referrerEmail,
          subject: `【Push-taro】紹介コード [${refCode}] から新規登録がありました`,
          html: `
            <h2>${referrerName} 様</h2>
            <p>あなたの紹介コード（${refCode}）を使用して、新しい店舗が登録されました。</p>
            <p><strong>店舗名:</strong> ${companyName || '未設定'}</p>
            <p><strong>紹介報酬率:</strong> ${ratePercent}%</p>
            <p>この店舗が決済を完了すると、紹介報酬が確定します。</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin">ダッシュボードで確認する</a></p>
            <hr />
            <p><strong>Push-taro.com</strong></p>
          `,
        });
      }

      console.log(`[紹介コード] 紹介者: ${referrerId} (${referrerType}), 新規店舗: ${shopId}, レート: ${rewardRate * 100}%`);
    }

    // ============================================================
    // 8. Square決済リンク生成
    // ============================================================
    let paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_TEST || 'https://square.link/u/pORV1sXA';
    // プランごとにリンクを変えたい場合は環境変数を分ける
    if (plan === 'light') {
      paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_TEST || 'https://square.link/u/pORV1sXA';
    } else if (plan === 'standard') {
      paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_TEST || 'https://square.link/u/pORV1sXA';
    } else if (plan === 'pro') {
      paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_TEST || 'https://square.link/u/pORV1sXA';
    }

    // ============================================================
    // 9. 申し込み受付メール送信
    // ============================================================
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
        <p>選択プラン: ${plan?.toUpperCase() || 'LIGHT'}</p>
        <hr />
        <p><strong>Push-taro.com</strong></p>
        <p>運営会社：the合同会社</p>
        <p>〒357-0123 埼玉県飯能市中藤下郷23-21</p>
        <p><a href="mailto:pushtaro-info@gmail.com">pushtaro-info@gmail.com</a></p>
      `,
    });

    // ============================================================
    // 10. レスポンス
    // ============================================================
    return NextResponse.json({
      success: true,
      shopId,
      paymentUrl,
      message: '申し込みを受け付けました。決済へお進みください。',
    });

  } catch (error: any) {
    console.error('[signup] エラー:', error);
    
    // 🔥 管理者通知
    await notifyAdmins(error, {
      source: 'signup',
      details: { email: body?.email },
    });

    return NextResponse.json(
      { error: error.message || '登録処理に失敗しました' },
      { status: 500 }
    );
  }
}
