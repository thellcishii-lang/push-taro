import { NextResponse } from 'next/server';
import { db, authAdmin } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * 代理店の有効紹介数に応じて、超過累進方式で1件あたりの還元額を算出するヘルパー関数
 * @param activeCount 現在の有効紹介数（アクティブ店舗数）
 * @param monthlyFee プロプランの月額料金（今回は 10000 円）
 */
function calculateTieredReward(activeCount: number, monthlyFee: number = 10000): number {
  // 代理店でない場合や一般紹介の場合は、従来の固定30%（または10%）を別の場所で計算するため、
  // ここでは代理店向けの「トータル報酬ではなく、今回決済された1件がどの枠に入るか」を判定するか、
  // あるいは「現在の総アクティブ数から今回の報酬単価を割り出す」形にするとスマートです。

  // 超過累進のルールに基づき、何件目の枠に該当するかで今回の還元率を決定する：
  // ・1件目〜100件目までの枠：30% (3,000円)
  // ・101件目〜200件目までの枠：36% (3,600円)
  // ・201件目以降の枠：45% (4,500円)

  if (activeCount <= 100) {
    return Math.floor(monthlyFee * 0.30); // 3,000円
  } else if (activeCount <= 200) {
    return Math.floor(monthlyFee * 0.36); // 3,600円
  } else {
    return Math.floor(monthlyFee * 0.45); // 4,500円
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // SquareからのWebhookイベント種別を確認
    const eventType = body?.type;
    if (eventType !== 'payment.updated' && eventType !== 'order.fulfillment.updated') {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const payment = body?.data?.object?.payment;
    const customerEmail = payment?.buyer_email_address || body?.related_customer_email;
    const note = payment?.note || ''; // 申込時の店舗名など
    const paidAmount = payment?.amount_money?.amount || 10000; // プロプラン月額（10,000円）
    
    // 紹介コード
    const referralCode = payment?.reference_id || ''; 

    if (!customerEmail) {
      return NextResponse.json({ error: '顧客のメールアドレスが見つかりません' }, { status: 400 });
    }

    // 1. ランダムな初期パスワードを生成
    const temporaryPassword = Math.random().toString(36).slice(-8) + 'A1!';

    // 2. Firebase Authにアカウント（ID/パスワード）を自動作成
    const userRecord = await authAdmin.createUser({
      email: customerEmail,
      password: temporaryPassword,
      emailVerified: true,
    });

    const uid = userRecord.uid;

    // 3. Firestoreに初期の店舗データを作成
    const shopRef = db.collection('shops').doc();
    await shopRef.set({
      name: note || '未設定の店舗',
      ownerUid: uid,
      createdAt: FieldValue.serverTimestamp(),
      coupon: { enabled: false, title: '', description: '', discountRate: 0 },
      linkUrl: '',
      iconUrl: '',
    });

    // 4. 紹介コードがある場合、紹介者または代理店を探して報酬を計算・保存する
    if (referralCode) {
      try {
        // 紹介コードを持っている店舗/代理店を検索
        const referrerSnapshot = await db.collection('shops')
          .where('referralCode', '==', referralCode)
          .limit(1)
          .get();

        if (!referrerSnapshot.empty) {
          const referrerDoc = referrerSnapshot.docs[0];
          const referrerData = referrerDoc.data();
          const referrerId = referrerDoc.id;

          const isAgency = referrerData.role === 'agency';
          let rewardAmount = 0;
          let effectiveRate = 0.10; // デフォルト一般紹介（10%）

          if (isAgency) {
            // --- 代理店の場合の超過累進報酬計算 ---
            // 現在、この代理店が何件のアクティブな紹介店舗を持っているか（firestoreからカウント）
            const activeRelationsSnapshot = await db.collection('referral_relations')
              .where('referrerId', '==', referrerId)
              .where('status', '==', 'active')
              .get();
            
            // 今回新しく増える1件を含めたアクティブ数、または現在の数に基づき計算
            const currentActiveCount = activeRelationsSnapshot.size;
            
            // 超過累進の単価関数に通す（100件目まで3,000円、101〜200件目3,600円、201件目以降4,500円）
            rewardAmount = calculateTieredReward(currentActiveCount + 1, 10000);
            effectiveRate = rewardAmount / 10000; // 表示用の還元率（0.30, 0.36, 0.45）
          } else {
            // --- 一般紹介の場合（一律10% = 1,000円） ---
            effectiveRate = 0.10;
            rewardAmount = Math.floor(paidAmount * effectiveRate);
          }

          const currentMonth = new Date().toISOString().slice(0, 7); // 例: '2026-08'

          // ① 誰が誰を紹介したかの紐付け（active）を保存
          await db.collection('referral_relations').add({
            referrerId: referrerId,
            referredTenantId: shopRef.id,
            rewardRate: effectiveRate,
            status: 'active',
            createdAt: FieldValue.serverTimestamp(),
          });

          // ② 毎月の報酬明細（monthly_rewards）に保存
          await db.collection('monthly_rewards').add({
            userId: referrerId,
            sourceTenantId: shopRef.id,
            amount: rewardAmount,
            billingMonth: currentMonth,
            status: 'unpaid', // 未払い（PayPay送金待ち）
            createdAt: FieldValue.serverTimestamp(),
          });
        }
      } catch (refError) {
        console.error('[square-webhook] 紹介報酬の処理エラー:', refError);
      }
    }

    const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com'}/admin`;

    console.log('--- 【プッシュ太郎】アカウント自動発行＆超過累進紹介処理完了 ---');
    console.log(`宛先: ${customerEmail}`);
    console.log(`紹介コード: ${referralCode || 'なし'}`);
    console.log(`管理画面URL: ${loginUrl}`);
    console.log('------------------------------------------------------------');

    return NextResponse.json({ success: true, message: 'アカウントを自動発行しました' }, { status: 200 });

  } catch (error: any) {
    console.error('[square-webhook] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
