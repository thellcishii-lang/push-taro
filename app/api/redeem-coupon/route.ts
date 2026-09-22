// app/api/redeem-coupon/route.ts
import { NextResponse } from 'next/server';
import { db, authAdmin } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

// クーポン使用状態のデフォルト（遅延マイグレーション用）
const DEFAULT_USAGE = {
  firstCouponUsedAt: null,
  normalCouponUsedAt: null,
  normalCouponUsedCouponId: null,
  normalCouponVisitCount: 0,
  loyaltyCouponAvailable: false,
  lastCouponUsedAt: null,
  totalVisits: 0,
  loyaltyAchieved: false,
  loyaltyAchievedAt: null,
  stepUpIndex: 0,
  repeatCouponActiveUntil: null,
  repeatCouponUsedAt: null,
  dormantNotifiedAt: null,
  dormantCouponUsedAt: null,
  birthdayNotifiedYear: null,
  birthdayCouponUsedYear: null,
  scheduledCouponUsedIds: [],
};

async function addToLoyaltyCount(
  usageRef: FirebaseFirestore.DocumentReference,
  shopData: FirebaseFirestore.DocumentData,
  shopId: string,
  shouldCount: boolean,
) {
  if (!shouldCount || shopData.loyaltyCoupon?.enabled !== true) return false;

  let unlocked = false;
  await db.runTransaction(async (transaction) => {
    const currentDoc = await transaction.get(usageRef);
    const currentUsage = currentDoc.data()?.couponUsage?.[shopId] || DEFAULT_USAGE;
    const targetCount = Number(shopData.loyaltyCoupon?.targetCount || 0);
    const nextVisitCount = Number(currentUsage.normalCouponVisitCount || 0) + 1;
    const canRepeat = shopData.loyaltyCoupon?.repeatEnabled === true;
    unlocked = targetCount > 0 && nextVisitCount >= targetCount &&
      (canRepeat || currentUsage.loyaltyAchieved !== true);
    transaction.set(usageRef, {
      couponUsage: {
        [shopId]: {
          ...currentUsage,
          normalCouponVisitCount: unlocked ? 0 : nextVisitCount,
          loyaltyCouponAvailable: unlocked || currentUsage.loyaltyCouponAvailable === true,
        },
      },
    }, { merge: true });
  });
  return unlocked;
}

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
    const body = await request.json();
    const { shopId, token, couponId } = body;
    const rawCouponType = body.couponType;
    const normalizedCouponType = typeof rawCouponType === 'string'
      ? rawCouponType.trim().toLowerCase().replace(/_/g, '-')
      : rawCouponType;
    const couponType = normalizedCouponType === 'stepup' ? 'step-up'
      : normalizedCouponType === 'repeat-coupon' ? 'repeat'
      : normalizedCouponType;

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

      const expiresAt = shopData.normalCoupon?.expiresAt;
      if (expiresAt && new Date(`${expiresAt}T23:59:59`).getTime() < Date.now()) {
        return NextResponse.json(
          { error: '⚠️ この通常クーポンは有効期限切れです！' },
          { status: 400 }
        );
      }

      const normalCouponId = shopData.normalCoupon?.couponId || 'legacy';
      let loyaltyUnlocked = false;
      await db.runTransaction(async (transaction) => {
        const currentDoc = await transaction.get(usageRef);
        const currentUsage = currentDoc.data()?.couponUsage?.[shopId] || DEFAULT_USAGE;
        const alreadyUsed = currentUsage.normalCouponUsedCouponId === normalCouponId ||
          (normalCouponId === 'legacy' && Boolean(currentUsage.normalCouponUsedAt));
        if (alreadyUsed) {
          throw new Error('COUPON_ALREADY_USED');
        }

        const targetCount = Number(shopData.loyaltyCoupon?.targetCount || 0);
        const nextVisitCount = Number(currentUsage.normalCouponVisitCount || 0) + 1;
        loyaltyUnlocked = targetCount > 0 && nextVisitCount >= targetCount;

        transaction.set(usageRef, {
          couponUsage: {
            [shopId]: {
              ...currentUsage,
              normalCouponUsedAt: FieldValue.serverTimestamp(),
              normalCouponUsedCouponId: normalCouponId,
              normalCouponVisitCount: loyaltyUnlocked ? 0 : nextVisitCount,
              loyaltyCouponAvailable: loyaltyUnlocked || currentUsage.loyaltyCouponAvailable === true,
              lastCouponUsedAt: FieldValue.serverTimestamp(),
              totalVisits: FieldValue.increment(1),
            },
          },
        }, { merge: true });
      });
      if (loyaltyUnlocked) responseExtra.loyaltyUnlocked = true;
    }

    // ============================================================
    // 特別達成クーポン（STANDARD）
    // ============================================================
    else if (couponType === 'loyalty') {
      couponTitle = shopData.loyaltyCoupon?.title || '特別達成クーポン';

      if (!usage.loyaltyCouponAvailable) {
        return NextResponse.json(
          { error: '⚠️ この特別達成クーポンはまだ利用できません！' },
          { status: 400 }
        );
      }

      const loyalty = shopData.loyaltyCoupon || {};
      if (loyalty.expireType === 'date' && loyalty.expireDate &&
        new Date(`${loyalty.expireDate}T23:59:59`).getTime() < Date.now()) {
        return NextResponse.json({ error: '⚠️ この特別達成クーポンは有効期限切れです！' }, { status: 400 });
      }
      if (loyalty.expireType === 'days' && usage.loyaltyAchievedAt) {
        const achievedAt = usage.loyaltyAchievedAt?.toDate?.() || new Date(usage.loyaltyAchievedAt);
        const expiresAt = new Date(achievedAt.getTime() + Math.max(1, Number(loyalty.expireDays) || 1) * 24 * 60 * 60 * 1000);
        if (expiresAt.getTime() < Date.now()) {
          return NextResponse.json({ error: '⚠️ この特別達成クーポンは有効期限切れです！' }, { status: 400 });
        }
      }

      await usageRef.update({
        [`couponUsage.${shopId}.loyaltyCouponAvailable`]: false,
        [`couponUsage.${shopId}.loyaltyAchieved`]: shopData.loyaltyCoupon?.repeatEnabled !== true,
        [`couponUsage.${shopId}.loyaltyAchievedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.lastCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.totalVisits`]: FieldValue.increment(1),
      });
    }

    // ============================================================
    // ステップアップクーポン（PRO）
    // ============================================================
    else if (couponType === 'step-up') {
      if (shopData.proCoupons?.stepUp?.enabled !== true) {
        return NextResponse.json({ error: '⚠️ ステップアップクーポンは現在無効です' }, { status: 400 });
      }
      const steps = shopData.proCoupons?.stepUp?.steps || [];
      const currentIndex = usage.stepUpIndex || 0;

      if (currentIndex >= steps.length) {
        return NextResponse.json(
          { error: '⚠️ 全てのステップを達成済みです！' },
          { status: 400 }
        );
      }

      const currentStep = steps[currentIndex];
      if (!currentStep) {
        return NextResponse.json({ error: '⚠️ 現在利用できるステップがありません。顧客画面を更新してください' }, { status: 400 });
      }
      couponTitle = currentStep?.title || `ステップ${currentIndex + 1}`;

      // 次のステップへ進める
      const nextIndex = currentIndex + 1;
      const nextStep = steps[nextIndex];

      await usageRef.update({
        [`couponUsage.${shopId}.stepUpIndex`]: nextIndex,
        [`couponUsage.${shopId}.stepUpIndexUpdatedAt`]: FieldValue.serverTimestamp(),
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
      if (await addToLoyaltyCount(usageRef, shopData, shopId, currentStep.loyaltyCountable ?? currentStep.combinable === true)) {
        responseExtra.loyaltyUnlocked = true;
      }
    }

    // ============================================================
    // 連続クーポン（PRO）
    // ============================================================
    else if (couponType === 'repeat') {
      if (shopData.proCoupons?.repeat?.enabled !== true) {
        return NextResponse.json({ error: '⚠️ 連続クーポンは現在無効です' }, { status: 400 });
      }
      couponTitle = shopData.proCoupons?.repeat?.title || '連続クーポン';

      const repeat = shopData.proCoupons.repeat;
      const expireType = repeat.expireType || 'days';
      let activeUntil: Date | null = null;
      if (expireType === 'days') {
        const expireDays = Math.max(1, Number(repeat.expireDays) || 14);
        activeUntil = new Date(Date.now() + expireDays * 24 * 60 * 60 * 1000);
      } else if (expireType === 'date') {
        if (!repeat.expireDate || new Date(`${repeat.expireDate}T23:59:59`).getTime() < Date.now()) {
          return NextResponse.json({ error: '⚠️ 連続クーポンは有効期限切れです' }, { status: 400 });
        }
        activeUntil = new Date(`${repeat.expireDate}T23:59:59`);
      }

      await usageRef.update({
        [`couponUsage.${shopId}.repeatCouponActiveUntil`]: activeUntil,
        [`couponUsage.${shopId}.repeatCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.lastCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.totalVisits`]: FieldValue.increment(1),
      });

      responseExtra.nextRepeatCouponUntil = activeUntil?.toISOString() || null;
      if (await addToLoyaltyCount(usageRef, shopData, shopId, repeat.loyaltyCountable ?? repeat.combinable === true)) {
        responseExtra.loyaltyUnlocked = true;
      }
    }

    // ============================================================
    // 誕生日クーポン（PRO） / 休眠復活クーポン（PRO）
    // → Cron 側で送信済み。消込時は使用記録のみ
    // ============================================================
    else if (couponType === 'birthday') {
      const birthday = shopData.proCoupons?.birthday || {};
      couponTitle = birthday.title || '記念日、お誕生日クーポン';
      const currentYear = String(new Date().getFullYear());
      if (String(usage.birthdayNotifiedYear) !== currentYear) {
        return NextResponse.json({ error: '⚠️ このお誕生日クーポンは現在利用できません！' }, { status: 400 });
      }
      if (String(usage.birthdayCouponUsedYear) === currentYear) {
        return NextResponse.json({ error: '⚠️ このお誕生日クーポンはすでに使用済みです！' }, { status: 400 });
      }
      await usageRef.update({
        [`couponUsage.${shopId}.birthdayCouponUsedYear`]: currentYear,
        [`couponUsage.${shopId}.lastCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.totalVisits`]: FieldValue.increment(1),
      });
      if (await addToLoyaltyCount(usageRef, shopData, shopId, birthday.loyaltyCountable ?? birthday.combinable === true)) {
        responseExtra.loyaltyUnlocked = true;
      }
    }
    else if (couponType === 'dormant') {
      const dormant = shopData.proCoupons?.dormant || {};
      couponTitle = dormant.title || '復帰クーポン';
      if (!usage.dormantNotifiedAt) {
        return NextResponse.json({ error: '⚠️ この休眠復活クーポンは現在利用できません！' }, { status: 400 });
      }
      if (usage.dormantCouponUsedAt) {
        return NextResponse.json({ error: '⚠️ この休眠復活クーポンはすでに使用済みです！' }, { status: 400 });
      }
      const notifiedAt = usage.dormantNotifiedAt?.toDate?.() || new Date(usage.dormantNotifiedAt);
      const expiresAt = new Date(notifiedAt.getTime() + Math.max(1, Number(dormant.expireDays) || 14) * 24 * 60 * 60 * 1000);
      if (expiresAt.getTime() < Date.now()) {
        return NextResponse.json({ error: '⚠️ この休眠復活クーポンは有効期限切れです！' }, { status: 400 });
      }
      await usageRef.update({
        [`couponUsage.${shopId}.dormantCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.lastCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.totalVisits`]: FieldValue.increment(1),
      });
      if (await addToLoyaltyCount(usageRef, shopData, shopId, dormant.loyaltyCountable ?? dormant.combinable === true)) {
        responseExtra.loyaltyUnlocked = true;
      }
    }

    else if (couponType === 'scheduled') {
      const scheduledCoupon = (shopData.scheduledCoupons || []).find((coupon: any) => coupon.id === couponId);
      if (!scheduledCoupon) {
        return NextResponse.json({ error: 'この予約クーポンは見つかりません' }, { status: 404 });
      }
      if (scheduledCoupon.expiresAt && new Date(scheduledCoupon.expiresAt).getTime() < Date.now()) {
        return NextResponse.json({ error: 'この予約クーポンは有効期限切れです' }, { status: 400 });
      }
      if ((usage.scheduledCouponUsedIds || []).includes(couponId)) {
        return NextResponse.json({ error: 'この予約クーポンは使用済みです' }, { status: 400 });
      }
      couponTitle = scheduledCoupon.title || '予約クーポン';
      await usageRef.update({
        [`couponUsage.${shopId}.scheduledCouponUsedIds`]: FieldValue.arrayUnion(couponId),
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
    if (error?.message === 'COUPON_ALREADY_USED') {
      return NextResponse.json(
        { error: '⚠️ この通常クーポンはすでに使用済みです！' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || '消し込み処理に失敗しました' },
      { status: 500 }
    );
  }
}
