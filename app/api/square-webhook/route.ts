import { NextResponse } from 'next/server';
import { db, authAdmin } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * 代理店の有効紹介数に応じて、超過累進方式で1件あたりの還元額を算出するヘルパー関数
 */
function calculateTieredReward(activeCount: number, monthlyFee: number = 10000): number {
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
    const eventType = body?.type;
    const dataObject = body?.data?.object;

    console.log(`[Square Webhook 受信] イベント種別: ${eventType}`);

    // =========================================================================
    // 1. 引き落とし失敗（1回目警告 or 送信停止中の次回失敗による強制退会）
    // =========================================================================
    if (eventType === 'invoice.payment_failed') {
      const invoice = dataObject?.invoice;
      const customerEmail = invoice?.primary_recipient?.email_address;
      const customerId = invoice?.customer_id;

      if (!customerEmail && !customerId) {
        return NextResponse.json({ received: true }, { status: 200 });
      }

      // メールアドレスまたはSquare顧客IDから店舗ドキュメントを特定
      let query = db.collection('shops').where('email', '==', customerEmail);
      let shopSnap = await query.get();

      if (shopSnap.empty && customerId) {
        shopSnap = await db.collection('shops').where('squareCustomerId', '==', customerId).get();
      }

      if (!shopSnap.empty) {
        const shopDoc = shopSnap.docs[0];
        const shopData = shopDoc.data();
        const currentStatus = shopData.status || 'active';

        // ---------------------------------------------------------------------
        // 【パターン1】 初回の引き落とし失敗 ➔ 7日間の猶予期間（payment_warning）
        // ---------------------------------------------------------------------
        if (currentStatus !== 'payment_warning' && currentStatus !== 'send_disabled') {
          const gracePeriodUntil = new Date();
          gracePeriodUntil.setDate(gracePeriodUntil.getDate() + 7); // 7日後の日付

          await shopDoc.ref.update({
            status: 'payment_warning', // 警告状態（送信は7日間可能）
            failedAt: FieldValue.serverTimestamp(),
            gracePeriodUntil: gracePeriodUntil.toISOString(),
            updatedAt: FieldValue.serverTimestamp(),
          });

          // 📧 TODO: メール送信①「【重要】お支払い失敗のお知らせとカード情報更新のお願い（7日間猶予）」
          console.log(`[警告メール送信通知] 店舗: ${shopData.name} (${customerEmail}) / 7日間猶予期限: ${gracePeriodUntil.toISOString()}`);
        } 
        // ---------------------------------------------------------------------
        // 【パターン2】 送信停止中（send_disabled）で次回引き落としも失敗 ➔ 強制退会（cancelled）
        // ---------------------------------------------------------------------
        else if (currentStatus === 'send_disabled' || currentStatus === 'payment_warning') {
          await shopDoc.ref.update({
            status: 'cancelled', // 強制退会（画面不可）
            cancelledAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          });

          // 関連する紹介リレーションも無効化 (inactive)
          const relSnap = await db.collection('referral_relations')
            .where('referredTenantId', '==', shopDoc.id)
            .get();
          
          relSnap.docs.forEach(async (relDoc) => {
            await relDoc.ref.update({ status: 'inactive' });
          });

          // 📧 TODO: メール送信③「【Push-taro】退会手続き完了のお知らせ」
          console.log(`[強制退会完了] 店舗: ${shopData.name} (${customerEmail}) のアカウントを閉鎖しました。`);
        }
      }

      return NextResponse.json({ success: true, message: '引き落とし失敗処理完了' }, { status: 200 });
    }

    // =========================================================================
    // 2. 決済成功・新規購入・次回自動引き落とし成功時
    // =========================================================================
    if (eventType === 'payment.updated' || eventType === 'order.fulfillment.updated' || eventType === 'invoice.payment_made') {
      const payment = dataObject?.payment || dataObject?.invoice;
      const paymentStatus = payment?.status;

      // 決済未完了の場合は何もしない
      if (eventType === 'payment.updated' && paymentStatus !== 'COMPLETED') {
        return NextResponse.json({ received: true }, { status: 200 });
      }

      const customerEmail = payment?.buyer_email_address || payment?.primary_recipient?.email_address || body?.related_customer_email;
      const customerId = payment?.customer_id;
      const note = payment?.note || '';
      const paidAmount = payment?.amount_money?.amount || 10000;
      const referralCode = payment?.reference_id || '';

      if (!customerEmail) {
        return NextResponse.json({ error: '顧客のメールアドレスが見つかりません' }, { status: 400 });
      }

      // 既存の店舗アカウントがあるか確認（既存店舗の継続課金成功か、新規決済か）
      const existingShopSnap = await db.collection('shops').where('email', '==', customerEmail).get();

      if (!existingShopSnap.empty) {
        // --- A. 既存アカウントの継続引き落とし成功（復活処理） ---
        const shopDoc = existingShopSnap.docs[0];
        await shopDoc.ref.update({
          status: 'active', // 警告や停止から正常(active)に復活
          squareCustomerId: customerId || shopDoc.data().squareCustomerId || '',
          failedAt: null,
          gracePeriodUntil: null,
          updatedAt: FieldValue.serverTimestamp(),
        });

        console.log(`[アカウント自動復活/更新] 店舗: ${shopDoc.data().name} (${customerEmail})`);
        return NextResponse.json({ success: true, message: '契約ステータスを有効に更新しました' }, { status: 200 });

      } else {
        // --- B. 新規購入時：アカウント作成 ＋ 紹介報酬処理 ---
        const temporaryPassword = Math.random().toString(36).slice(-8) + 'A1!';

        // Firebase Auth ユーザー作成
        const userRecord = await authAdmin.createUser({
          email: customerEmail,
          password: temporaryPassword,
          emailVerified: true,
        });

        const uid = userRecord.uid;

        // 店舗ドキュメントの作成
        const shopRef = db.collection('shops').doc();
        await shopRef.set({
          name: note || '未設定の店舗',
          email: customerEmail,
          ownerUid: uid,
          squareCustomerId: customerId || '',
          plan: 'pro',
          status: 'active',
          createdAt: FieldValue.serverTimestamp(),
          coupon: { enabled: false, title: '', description: '', discountRate: 0 },
          linkUrl: '',
          iconUrl: '',
        });

        // 紹介コードが存在する場合の処理
        if (referralCode) {
          try {
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
              let effectiveRate = 0.10;

              if (isAgency) {
                const activeRelationsSnapshot = await db.collection('referral_relations')
                  .where('referrerId', '==', referrerId)
                  .where('status', '==', 'active')
                  .get();

                const currentActiveCount = activeRelationsSnapshot.size;
                rewardAmount = calculateTieredReward(currentActiveCount + 1, 10000);
                effectiveRate = rewardAmount / 10000;
              } else {
                effectiveRate = 0.10;
                rewardAmount = Math.floor(paidAmount * effectiveRate);
              }

              const currentMonth = new Date().toISOString().slice(0, 7);

              await db.collection('referral_relations').add({
                referrerId: referrerId,
                referredTenantId: shopRef.id,
                rewardRate: effectiveRate,
                status: 'active',
                createdAt: FieldValue.serverTimestamp(),
              });

              await db.collection('monthly_rewards').add({
                userId: referrerId,
                sourceTenantId: shopRef.id,
                amount: rewardAmount,
                billingMonth: currentMonth,
                status: 'unpaid',
                createdAt: FieldValue.serverTimestamp(),
              });
            }
          } catch (refError) {
            console.error('[square-webhook] 紹介報酬の処理エラー:', refError);
          }
        }

        console.log(`[新規アカウント自動発行完了] メール: ${customerEmail}`);
        return NextResponse.json({ success: true, message: 'アカウントを自動発行しました' }, { status: 200 });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error('[square-webhook] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
