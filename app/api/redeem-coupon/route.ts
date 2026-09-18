// app/api/redeem-coupon/route.ts
import { NextResponse } from 'next/server';
import { db, authAdmin } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

// クーポン使用状態のデフォルト（遅延マイグレーション用）
const DEFAULT_USAGE = {
  firstCouponUsedAt: null,
  normalCouponUsedAt: null,
  lastCouponUsedAt: null,
  totalVisits: 0,
  loyaltyAchieved: false,
  loyaltyAchievedAt: null,
  stepUpIndex: 0,
  repeatCouponActiveUntil: null,
  dormantNotifiedAt: null,
  birthdayNotifiedYear: null,
};

export async function POST(request: Request) {
  // ─── 認証（店舗オーナー）───
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
    const { shopId, couponType, token } = await request.json();

    if (!shopId || !couponType || !token) {
      return NextResponse.json({ error: '無効なQRコードデータです' }, { status: 400 });
    }

    // ─── 店舗所有権チェック ───
    const shopDoc = await db.collection('shops').doc(shopId).get();
    if (!shopDoc.exists || shopDoc.data()?.ownerUid !== uid) {
      return NextResponse.json({ error: '店舗の操作権限がありません' }, { status: 403 });
    }
    const shopData = shopDoc.data()!;

    // ─── 顧客ドキュメント（subscriptions/{token}）を取得 ───
    const usageRef = db.collection('subscriptions').doc(token);
    const usageDoc = await usageRef.get();

    if (!usageDoc.exists) {
      return NextResponse.json(
        { error: '顧客が見つかりません。通知登録が完了しているかご確認ください。' },
        { status: 404 }
      );
    }

    const usageData = usageDoc.data()!;
    const usage = usageData.couponUsage?.[shopId] || DEFAULT_USAGE;

    let couponTitle = 'クーポン';
    let responseExtra: any = {};

    // ============================================================
    // 初回クーポン
    // ============================================================
    if (couponType === 'first') {
      couponTitle = shopData.coupon?.title || '初回限定クーポン';

      if (usage.firstCouponUsedAt) {
        return NextResponse.json(
          { error: '⚠️ この初回限定クーポンはすでに使用済みです！' },
          { status: 400 }
        );
      }

      const expiresAt = shopData.coupon?.expiresAt;
      if (expiresAt && new Date(`${expiresAt}T23:59:59`).getTime() < Date.now()) {
        return NextResponse.json(
          { error: '⚠️ この初回限定クーポンは有効期限切れです！' },
          { status: 400 }
        );
      }

      await usageRef.update({
        [`couponUsage.${shopId}.firstCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.lastCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.totalVisits`]: FieldValue.increment(1),
      });
    }

    // ============================================================
    // 通常クーポン
    // ============================================================
    else if (couponType === 'normal') {
      couponTitle = shopData.normalCoupon?.title || '通常クーポン';

      if (usage.normalCouponUsedAt) {
        return NextResponse.json(
          { error: '⚠️ この通常クーポンはすでに使用済みです！' },
          { status: 400 }
        );
      }

      const expiresAt = shopData.normalCoupon?.expiresAt;
      if (expiresAt && new Date(`${expiresAt}T23:59:59`).getTime() < Date.now()) {
        return NextResponse.json(
          { error: '⚠️ この通常クーポンは有効期限切れです！' },
          { status: 400 }
        );
      }

      await usageRef.update({
        [`couponUsage.${shopId}.normalCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.lastCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.totalVisits`]: FieldValue.increment(1),
      });
    }

    // ============================================================
    // 特別達成クーポン（STANDARD）
    // ============================================================
    else if (couponType === 'loyalty') {
      couponTitle = shopData.loyaltyCoupon?.title || '特別達成クーポン';

      if (usage.loyaltyAchieved) {
        return NextResponse.json(
          { error: '⚠️ このクーポンはすでに使用済みです！' },
          { status: 400 }
        );
      }

      await usageRef.update({
        [`couponUsage.${shopId}.loyaltyAchieved`]: true,
        [`couponUsage.${shopId}.loyaltyAchievedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.lastCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.totalVisits`]: FieldValue.increment(1),
      });
    }

    // ============================================================
    // ステップアップクーポン（PRO）
    // ============================================================
    else if (couponType === 'step-up') {
      const steps = shopData.proCoupons?.stepUp?.steps || [];
      const currentIndex = usage.stepUpIndex || 0;

      if (currentIndex >= steps.length) {
        return NextResponse.json(
          { error: '⚠️ 全てのステップを達成済みです！' },
          { status: 400 }
        );
      }

      const currentStep = steps[currentIndex];
      couponTitle = currentStep?.title || `ステップ${currentIndex + 1}`;

      // 次のステップへ進める
      const nextIndex = currentIndex + 1;
      const nextStep = steps[nextIndex];

      await usageRef.update({
        [`couponUsage.${shopId}.stepUpIndex`]: nextIndex,
        [`couponUsage.${shopId}.lastCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.totalVisits`]: FieldValue.increment(1),
      });

      // レスポンスに「次回特典」を追加
      if (nextStep) {
        responseExtra.nextStep = {
          title: nextStep.title,
          index: nextIndex + 1,
        };
      } else {
        responseExtra.allStepsCompleted = true;
      }
    }

    // ============================================================
    // 連続クーポン（PRO）
    // ============================================================
    else if (couponType === 'repeat') {
      couponTitle = shopData.proCoupons?.repeat?.title || '連続クーポン';

      const expireDays = shopData.proCoupons?.repeat?.expireDays || 14;
      const activeUntil = new Date(Date.now() + expireDays * 24 * 60 * 60 * 1000);

      await usageRef.update({
        [`couponUsage.${shopId}.repeatCouponActiveUntil`]: activeUntil,
        [`couponUsage.${shopId}.lastCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.totalVisits`]: FieldValue.increment(1),
      });

      responseExtra.nextRepeatCouponUntil = activeUntil.toISOString();
    }

    // ============================================================
    // 誕生日クーポン（PRO） / 休眠復活クーポン（PRO）
    // → Cron 側で送信済み。消込時は使用記録のみ
    // ============================================================
    else if (couponType === 'birthday') {
      couponTitle = shopData.proCoupons?.birthday?.title || '誕生日クーポン';
      await usageRef.update({
        [`couponUsage.${shopId}.lastCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.totalVisits`]: FieldValue.increment(1),
      });
    }
    else if (couponType === 'dormant') {
      couponTitle = shopData.proCoupons?.dormant?.title || '復帰クーポン';
      await usageRef.update({
        [`couponUsage.${shopId}.lastCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.totalVisits`]: FieldValue.increment(1),
      });
    }

    // ============================================================
    // 未知のクーポンタイプ
    // ============================================================
    else {
      return NextResponse.json(
        { error: `未対応のクーポンタイプです: ${couponType}` },
        { status: 400 }
      );
    }

    // ─── 利用ログの書き込み ───
    await db.collection('shops').doc(shopId).collection('coupon_logs').add({
      couponType,
      couponTitle,
      userToken: token,
      usedAt: FieldValue.serverTimestamp(),
      scannedBy: uid,
    });

    return NextResponse.json({
      success: true,
      couponTitle,
      usedAt: new Date().toISOString(),
      ...responseExtra,
    });
  } catch (error: any) {
    console.error('[redeem-coupon] エラー:', error);
    return NextResponse.json(
      { error: error.message || '消し込み処理に失敗しました' },
      { status: 500 }
    );
  }
}
