import { NextResponse } from 'next/server';
import { db, authAdmin } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendEmail } from '../../../lib/mailer';
import { notifyAdmins } from '@/lib/error-notifier';
import { enforceRateLimit } from '@/lib/rate-limit';
import { generatePrintToken } from '@/lib/print-token';
import { getReferrerDashboardUrl } from '@/lib/referrer-dashboard';
import {
  AGENCY_RATE_OTHER,
  AFFILIATE_RECURRING_RATE_FIRST_YEAR,
  AFFILISHOP_RATE_FIRST_YEAR,
} from '@/lib/constants';
import {
  getProReferralRate,
  hasProReferralPlanBCapacity,
  isProReferralPlan,
} from '@/lib/pro-referral-policy';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const retryAfter = await enforceRateLimit(request, 'signup-shop', 10, 10 * 60 * 1000);
  if (retryAfter !== null) {
    return NextResponse.json(
      { error: 'しばらく待ってから再度お試しください' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }


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
      return NextResponse.json({
        error: 'このメールアドレスはすでに登録されています。管理画面よりログインしてください。',
        status: 'already_registered',
      }, { status: 409 });
    } catch (error: any) {
      if (error.code !== 'auth/user-not-found') throw error;
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
    let affiliateRewardTypeForRelation: string | null = null;
    let proReferralPlanForRelation: 'a' | 'b' | null = null;

    if (refCode) {
      // プレフィックスで検索先を振り分け
      if (refCode.startsWith('AF-S-') || refCode.startsWith('AF-O-') || refCode.startsWith('AF-')) {
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

    // rewardType を判定
    // 優先順位: affiliates.rewardType > プレフィックス > デフォルト
    let affiliateRewardType: 'recurring' | 'one-time';
    if (data.rewardType === 'one-time' || data.rewardType === 'recurring') {
      affiliateRewardType = data.rewardType;
    } else if (refCode.startsWith('AF-O-')) {
      affiliateRewardType = 'one-time';
    } else {
      affiliateRewardType = 'recurring';
    }

    // ストック型は初年度優遇率、単発型は rate 0（固定額なので使わない）
    rewardRate = affiliateRewardType === 'recurring' ? AFFILIATE_RECURRING_RATE_FIRST_YEAR : 0;
    // 後続で referral_relations に保存するために保持
    affiliateRewardTypeForRelation = affiliateRewardType;
  }
}
      
      else if (refCode.startsWith('AGENCY-')) {
        // 代理店（agencies コレクション）
        const agencySnapshot = await db.collection('agencies')
          .where('referralCode', '==', refCode)
          .where('status', '==', 'active')
          .limit(1)
          .get();

        if (!agencySnapshot.empty) {
          const doc = agencySnapshot.docs[0];
          const data = doc.data();
          referrerId = doc.id;
          referrerType = 'agency';
          referrerEmail = data.email;
          referrerName = data.companyName || data.ownerName || '代理店';
          // 源泉前の率を保存（源泉徴収は月末バッチで適用）
          rewardRate = (plan === 'pro') ? 0.30 : AGENCY_RATE_OTHER;
        }
      } else if (refCode.startsWith('ASHOP-')) {
        // affilishop（実店舗向けアフィリエイト・affilishops コレクション）
        const affilishopSnapshot = await db.collection('affilishops')
          .where('referralCode', '==', refCode)
          .where('status', '==', 'active')
          .limit(1)
          .get();

        if (!affilishopSnapshot.empty) {
          const doc = affilishopSnapshot.docs[0];
          const data = doc.data();
          referrerId = doc.id;
          referrerType = 'affilishop';
          referrerEmail = data.email;
          referrerName = data.companyName || data.ownerName || 'affilishop';
          // 全プラン一律。源泉前の初年度優遇率を保存（源泉徴収は月末バッチで適用）
          rewardRate = AFFILISHOP_RATE_FIRST_YEAR;
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

          // role で判定（agency はこの時点では shops に残っている可能性もあるが、AGENCY- プレフィックスで先に処理済み）
          if (data.role === 'pro' || data.plan === 'pro') {
            const selectedPlan = isProReferralPlan(data.proReferralPlan)
              ? data.proReferralPlan
              : null;
            const proRate = getProReferralRate(selectedPlan, String(plan || 'light').toLowerCase());
            if (selectedPlan && proRate > 0) {
              referrerId = doc.id;
              referrerType = 'pro';
              referrerEmail = data.email;
              referrerName = data.name || '紹介者';
              proReferralPlanForRelation = selectedPlan;
              rewardRate = proRate;
            }
          } else {
            referrerId = doc.id;
            referrerEmail = data.email;
            referrerName = data.name || '紹介者';
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
      referredByCode: referrerId ? refCode : '',
      referrerType: referrerType,
    };

    const shopRef = await db.collection('shops').add(shopData);
    const shopId = shopRef.id;
    const referralCode = shopId.slice(0, 8).toUpperCase();
    await shopRef.update({ referralCode });

    // ============================================================
    // 7. 紹介者が見つかった場合の追加処理
    // ============================================================
    if (referrerId && referrerType) {
  // affiliate の場合のみ rewardType を持つ
  const relationRewardType =
    referrerType === 'affiliate'
      ? (affiliateRewardTypeForRelation || 'recurring')
      : null;

  let referralAccepted = true;
  const relationRef = db.collection('referral_relations').doc();
  const relationData = {
    referrerId,
    referredTenantId: shopId,
    rewardRate,
    rewardType: relationRewardType,
    status: 'pending',
    referrerType,
    tieredReward: (referrerType === 'affiliate' && relationRewardType === 'recurring') || referrerType === 'affilishop',
    ...(referrerType === 'pro' ? { proReferralPlan: proReferralPlanForRelation } : {}),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (referrerType === 'pro' && proReferralPlanForRelation === 'b') {
    const referrerRef = db.collection('shops').doc(referrerId);
    referralAccepted = await db.runTransaction(async (transaction) => {
      const [referrerDoc, relationSnapshot] = await Promise.all([
        transaction.get(referrerRef),
        transaction.get(db.collection('referral_relations')
          .where('referrerId', '==', referrerId)
          .where('referrerType', '==', 'pro')),
      ]);
      const currentPlan = referrerDoc.data()?.proReferralPlan;
      if (
        !isProReferralPlan(currentPlan) ||
        currentPlan !== 'b' ||
        !hasProReferralPlanBCapacity(relationSnapshot.docs.map((relation) => relation.data()))
      ) {
        return false;
      }
      transaction.create(relationRef, relationData);
      return true;
    });
  } else {
    await relationRef.set(relationData);
  }

  if (!referralAccepted) {
    await shopRef.update({
      referrerId: FieldValue.delete(),
      referredByCode: FieldValue.delete(),
      referrerType: FieldValue.delete(),
    });
    referrerId = null;
    referrerType = null;
  }

  // 紹介者への通知メール（ratePercent の表示を調整）
  if (referralAccepted && referrerEmail) {
    const ratePercent = referrerType === 'agency' && plan === 'pro'
      ? '月末のPRO決済成功件数に応じて30%・36%・45%を段階適用'
      : rewardRate > 0 ? `${(rewardRate * 100).toFixed(1)}%` : '初回のみ固定報酬';
    const dashboardUrl = getReferrerDashboardUrl(referrerType || '');

    await sendEmail({
      to: referrerEmail,
      subject: `【Push-taro】紹介コード [${refCode}] から新規登録がありました`,
      html: `
        <h2>${referrerName} 様</h2>
        <p>あなたの紹介コード（${refCode}）を使用して、新しい店舗が登録されました。</p>
        <p><strong>店舗名:</strong> ${companyName || '未設定'}</p>
        <p><strong>紹介報酬:</strong> ${ratePercent}</p>
        <p>この店舗が決済を完了すると、紹介報酬が確定します。</p>
        ${dashboardUrl ? `<p><a href="${dashboardUrl}">ダッシュボードで確認する</a></p>` : ''}
        <hr />
        <p><strong>Push-taro.com</strong></p>
        <p>運営会社：the合同会社</p>
        <p>〒357-0123 埼玉県飯能市中藤下郷23-21</p>
        <p><a href="mailto:info@push-taro.com">info@push-taro.com</a></p>
      `,
    });
  }

  console.log(`[紹介コード] 紹介者: ${referrerId} (${referrerType}), 新規店舗: ${shopId}, レート: ${rewardRate}, type: ${relationRewardType}`);
}

    // ============================================================
    // 8. Square決済リンク生成
    // ============================================================
        let paymentUrl: string;

if (plan === 'light') {
  paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_LIGHT || '';
} else if (plan === 'standard') {
  paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_STANDARD || '';
} else if (plan === 'pro') {
  paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_PRO || '';
} else {
  return NextResponse.json(
    { error: '不正なプランです。' },
    { status: 400 }
  );
}

if (!paymentUrl) {
  return NextResponse.json(
    { error: '決済リンクが設定されていません。' },
    { status: 500 }
  );
}

    // ============================================================
    // 9. 申し込み受付メール送信
    // ============================================================
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://push-taro.com';
    const printType = plan === 'pro' ? 'pro-shop' : 'shop';
    // 申込書（口座情報等を含む）へのアクセス用に署名付きトークンを付与
    const printToken = generatePrintToken('shop', shopId);
    const applicationUrl = `${appUrl}/print/application?type=${printType}&shopId=${shopId}${printToken ? `&token=${printToken}` : ''}`;
    const termsUrl = `${appUrl}/print/terms?type=${printType}`;

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

        <!-- ★ ここから追加：申込書・利用規約の控え -->
        <p><strong>📄 お申し込み内容の控え</strong></p>
        <p>以下のリンクから、いつでも申込書・利用規約をダウンロードできます。</p>
        <p>
          <a href="${applicationUrl}" style="color:#3182ce;">📥 申込書をダウンロード（PDF）</a>
        </p>
        <p>
          <a href="${termsUrl}" style="color:#3182ce;">📥 利用規約をダウンロード（PDF）</a>
        </p>
        <p style="font-size:12px; color:#94a3b8;">
          ※上記リンクはご登録のメールアドレス宛にのみお送りしています。第三者と共有しないようご注意ください。
        </p>
        <hr />
        <!-- ★ ここまで追加 -->

        <p><strong>Push-taro.com</strong></p>
        <p>運営会社：the合同会社</p>
        <p>〒357-0123 埼玉県飯能市中藤下郷23-21</p>
        <p><a href="mailto:info@push-taro.com">info@push-taro.com</a></p>
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
