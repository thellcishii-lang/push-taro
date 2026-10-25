// lib/redeem-coupon-core.ts
import { db, authAdmin } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { couponDay } from '@/lib/coupon-day';
import { canCombineWithLastCoupon } from '@/lib/coupon-combination';

export class RedeemError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'RedeemError';
  }
}

export const DEFAULT_USAGE = {
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

export async function addToLoyaltyCount(
  usageRef: FirebaseFirestore.DocumentReference,
  shopData: FirebaseFirestore.DocumentData,
  shopId: string,
  shouldCount: boolean,
  dryRun: boolean = false,
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
    if (dryRun) return;
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

export function toDate(value: any): Date | null {
  const date = value?.toDate?.() || value;
  if (date instanceof Date) return date;
  if (typeof date === 'string') return new Date(date);
  return null;
}

export async function recordSameDayCouponUse(
  usageRef: FirebaseFirestore.DocumentReference,
  shopId: string,
  sameDayCombinable: boolean,
  dryRun: boolean = false,
) {
  await db.runTransaction(async (transaction) => {
    const currentDoc = await transaction.get(usageRef);
    const currentUsage = currentDoc.data()?.couponUsage?.[shopId] || DEFAULT_USAGE;
    if (!canCombineWithLastCoupon(
      toDate(currentUsage.lastCouponUsedAt),
      currentUsage.lastCouponSameDayCombinable,
      sameDayCombinable,
    )) {
      throw new Error('COUPON_NOT_COMBINABLE_TODAY');
    }
    if (dryRun) return;
    transaction.update(usageRef, {
      [`couponUsage.${shopId}.lastCouponUsedAt`]: FieldValue.serverTimestamp(),
      [`couponUsage.${shopId}.lastCouponSameDayCombinable`]: sameDayCombinable,
    });
  });
}

// ============================================================
// メイン: クーポン消込コア
// ============================================================
export interface RedeemCouponParams {
  shopId: string;
  couponType: string;         // 'first' | 'normal' | 'loyalty' | 'step-up' | 'repeat' | 'birthday' | 'dormant' | 'scheduled'
  token: string;
  couponId?: string;
  shopData: FirebaseFirestore.DocumentData;
  usageRef: FirebaseFirestore.DocumentReference;
  usageData: FirebaseFirestore.DocumentData;
  scannedBy: string;          // 監査用のUID（店舗オーナー or POS）
  dryRun?: boolean;           // true の場合は検証のみ（書き込みなし）
}

export interface RedeemCouponResult {
  couponTitle: string;
  usedAt: string;
  responseExtra: Record<string, any>;
}

export async function redeemCouponCore(params: RedeemCouponParams): Promise<RedeemCouponResult> {
  const { shopId, couponType, token, couponId, shopData, usageRef, usageData, scannedBy, dryRun = false } = params;
  const storedUsage = usageData.couponUsage?.[shopId] || DEFAULT_USAGE;
  const stepUpCampaignId = shopData.proCoupons?.stepUp?.campaignId;
  const usage = stepUpCampaignId && storedUsage.stepUpCampaignId !== stepUpCampaignId
    ? { ...storedUsage, stepUpIndex: 0 }
    : storedUsage;

  const sameDayCombinable = couponType === 'first' || couponType === 'normal'
    ? true
    : couponType === 'loyalty'
      ? shopData.loyaltyCoupon?.combinable === true
      : couponType === 'step-up'
        ? shopData.proCoupons?.stepUp?.steps?.[usage.stepUpIndex || 0]?.sameDayCombinable === true
        : couponType === 'repeat'
          ? shopData.proCoupons?.repeat?.sameDayCombinable === true
          : couponType === 'birthday'
            ? shopData.proCoupons?.birthday?.sameDayCombinable === true
            : couponType === 'dormant'
              ? shopData.proCoupons?.dormant?.sameDayCombinable === true
              : couponType === 'scheduled'
                ? shopData.scheduledCoupons?.find((c: any) => c.id === couponId)?.sameDayCombinable === true
                : false;

  let couponTitle = 'クーポン';
  const responseExtra: Record<string, any> = {};

  // ─── 初回クーポン ───
  if (couponType === 'first') {
    couponTitle = shopData.coupon?.title || '初回限定クーポン';
    if (usage.firstCouponUsedAt) {
      throw new RedeemError('COUPON_ALREADY_USED', '⚠️ この初回限定クーポンはすでに使用済みです！', 400);
    }
    const expiresAt = shopData.coupon?.expiresAt;
    if (expiresAt && new Date(`${expiresAt}T23:59:59`).getTime() < Date.now()) {
      throw new RedeemError('COUPON_EXPIRED', '⚠️ この初回限定クーポンは有効期限切れです！', 400);
    }
    await recordSameDayCouponUse(usageRef, shopId, sameDayCombinable, dryRun);
    if (!dryRun) {
      await usageRef.update({
        [`couponUsage.${shopId}.firstCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.lastCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.totalVisits`]: FieldValue.increment(1),
      });
    }
  }

  // ─── 通常クーポン ───
  else if (couponType === 'normal') {
    couponTitle = shopData.normalCoupon?.title || '通常クーポン';
    const expiresAt = shopData.normalCoupon?.expiresAt;
    if (expiresAt && new Date(`${expiresAt}T23:59:59`).getTime() < Date.now()) {
      throw new RedeemError('COUPON_EXPIRED', '⚠️ この通常クーポンは有効期限切れです！', 400);
    }
    const normalCouponId = shopData.normalCoupon?.couponId || 'legacy';
    let loyaltyUnlocked = false;
    await db.runTransaction(async (transaction) => {
      const currentDoc = await transaction.get(usageRef);
      const currentUsage = currentDoc.data()?.couponUsage?.[shopId] || DEFAULT_USAGE;
      const alreadyUsed = currentUsage.normalCouponUsedCouponId === normalCouponId ||
        (normalCouponId === 'legacy' && Boolean(currentUsage.normalCouponUsedAt));
      if (alreadyUsed) throw new Error('COUPON_ALREADY_USED');
      if (!canCombineWithLastCoupon(toDate(currentUsage.lastCouponUsedAt), currentUsage.lastCouponSameDayCombinable, sameDayCombinable)) {
        throw new Error('COUPON_NOT_COMBINABLE_TODAY');
      }
      const targetCount = Number(shopData.loyaltyCoupon?.targetCount || 0);
      const nextVisitCount = Number(currentUsage.normalCouponVisitCount || 0) + 1;
      loyaltyUnlocked = targetCount > 0 && nextVisitCount >= targetCount;
      if (dryRun) return;
      transaction.set(usageRef, {
        couponUsage: {
          [shopId]: {
            ...currentUsage,
            normalCouponUsedAt: FieldValue.serverTimestamp(),
            normalCouponUsedCouponId: normalCouponId,
            normalCouponVisitCount: loyaltyUnlocked ? 0 : nextVisitCount,
            loyaltyCouponAvailable: loyaltyUnlocked || currentUsage.loyaltyCouponAvailable === true,
            lastCouponUsedAt: FieldValue.serverTimestamp(),
            lastCouponSameDayCombinable: sameDayCombinable,
            totalVisits: FieldValue.increment(1),
          },
        },
      }, { merge: true });
    });
    if (loyaltyUnlocked) responseExtra.loyaltyUnlocked = true;
  }

  // ─── 特別達成クーポン ───
  else if (couponType === 'loyalty') {
    couponTitle = shopData.loyaltyCoupon?.title || '特別達成クーポン';
    if (!usage.loyaltyCouponAvailable) {
      throw new RedeemError('COUPON_NOT_AVAILABLE', '⚠️ この特別達成クーポンはまだ利用できません！', 400);
    }
    const loyalty = shopData.loyaltyCoupon || {};
    if (loyalty.expireType === 'date' && loyalty.expireDate &&
      new Date(`${loyalty.expireDate}T23:59:59`).getTime() < Date.now()) {
      throw new RedeemError('COUPON_EXPIRED', '⚠️ この特別達成クーポンは有効期限切れです！', 400);
    }
    if (loyalty.expireType === 'days' && usage.loyaltyAchievedAt) {
      const achievedAt = usage.loyaltyAchievedAt?.toDate?.() || new Date(usage.loyaltyAchievedAt);
      const expiresAt = new Date(achievedAt.getTime() + Math.max(1, Number(loyalty.expireDays) || 1) * 24 * 60 * 60 * 1000);
      if (expiresAt.getTime() < Date.now()) {
        throw new RedeemError('COUPON_EXPIRED', '⚠️ この特別達成クーポンは有効期限切れです！', 400);
      }
    }
    await recordSameDayCouponUse(usageRef, shopId, sameDayCombinable, dryRun);
    if (!dryRun) {
      await usageRef.update({
        [`couponUsage.${shopId}.loyaltyCouponAvailable`]: false,
        [`couponUsage.${shopId}.loyaltyAchieved`]: shopData.loyaltyCoupon?.repeatEnabled !== true,
        [`couponUsage.${shopId}.loyaltyAchievedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.lastCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.totalVisits`]: FieldValue.increment(1),
      });
    }
  }

  // ─── ステップアップクーポン ───
  else if (couponType === 'step-up') {
    if (shopData.proCoupons?.stepUp?.enabled !== true) {
      throw new RedeemError('COUPON_DISABLED', '⚠️ ステップアップクーポンは現在無効です', 400);
    }
    const steps = shopData.proCoupons?.stepUp?.steps || [];
    const currentIndex = usage.stepUpIndex || 0;
    if (currentIndex >= steps.length) {
      throw new RedeemError('COUPON_COMPLETED', '⚠️ 全てのステップを達成済みです！', 400);
    }
    const currentStep = steps[currentIndex];
    if (!currentStep) {
      throw new RedeemError('COUPON_NOT_AVAILABLE', '⚠️ 現在利用できるステップがありません。顧客画面を更新してください', 400);
    }
    couponTitle = currentStep?.title || `ステップ${currentIndex + 1}`;
    const nextIndex = currentIndex + 1;
    const nextStep = steps[nextIndex];
    await recordSameDayCouponUse(usageRef, shopId, sameDayCombinable, dryRun);
    if (!dryRun) {
      await usageRef.update({
        [`couponUsage.${shopId}.stepUpIndex`]: nextIndex,
        ...(stepUpCampaignId ? { [`couponUsage.${shopId}.stepUpCampaignId`]: stepUpCampaignId } : {}),
        [`couponUsage.${shopId}.stepUpIndexUpdatedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.lastCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.totalVisits`]: FieldValue.increment(1),
      });
    }
    if (nextStep) {
      responseExtra.nextStep = { title: nextStep.title, index: nextIndex + 1 };
    } else {
      responseExtra.allStepsCompleted = true;
    }
    if (await addToLoyaltyCount(usageRef, shopData, shopId, currentStep.loyaltyCountable ?? currentStep.combinable === true, dryRun)) {
      responseExtra.loyaltyUnlocked = true;
    }
  }

  // ─── 連続クーポン ───
  else if (couponType === 'repeat') {
    if (shopData.proCoupons?.repeat?.enabled !== true) {
      throw new RedeemError('COUPON_DISABLED', '⚠️ 連続クーポンは現在無効です', 400);
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
        throw new RedeemError('COUPON_EXPIRED', '⚠️ 連続クーポンは有効期限切れです', 400);
      }
      activeUntil = new Date(`${repeat.expireDate}T23:59:59`);
    }
    await db.runTransaction(async (transaction) => {
      const currentDoc = await transaction.get(usageRef);
      const currentUsage = currentDoc.data()?.couponUsage?.[shopId] || DEFAULT_USAGE;
      const lastUsed = toDate(currentUsage.repeatCouponUsedAt);
      if (lastUsed && couponDay(lastUsed) === couponDay(new Date())) {
        throw new Error('REPEAT_COUPON_USED_TODAY');
      }
      if (!canCombineWithLastCoupon(toDate(currentUsage.lastCouponUsedAt), currentUsage.lastCouponSameDayCombinable, sameDayCombinable)) {
        throw new Error('COUPON_NOT_COMBINABLE_TODAY');
      }
      if (dryRun) return;
      transaction.update(usageRef, {
        ...(repeat.campaignId ? { [`couponUsage.${shopId}.repeatCampaignId`]: repeat.campaignId } : {}),
        [`couponUsage.${shopId}.repeatCouponActiveUntil`]: activeUntil,
        [`couponUsage.${shopId}.repeatCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.lastCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.lastCouponSameDayCombinable`]: sameDayCombinable,
        [`couponUsage.${shopId}.totalVisits`]: FieldValue.increment(1),
      });
    });
    responseExtra.nextRepeatCouponUntil = activeUntil?.toISOString() || null;
    if (await addToLoyaltyCount(usageRef, shopData, shopId, repeat.loyaltyCountable ?? repeat.combinable === true, dryRun)) {
      responseExtra.loyaltyUnlocked = true;
    }
  }

  // ─── 誕生日クーポン ───
  else if (couponType === 'birthday') {
    const birthday = shopData.proCoupons?.birthday || {};
    couponTitle = birthday.title || '記念日、お誕生日クーポン';
    const currentYear = String(new Date().getFullYear());
    if (String(usage.birthdayNotifiedYear) !== currentYear) {
      throw new RedeemError('COUPON_NOT_AVAILABLE', '⚠️ このお誕生日クーポンは現在利用できません！', 400);
    }
    if (String(usage.birthdayCouponUsedYear) === currentYear) {
      throw new RedeemError('COUPON_ALREADY_USED', '⚠️ このお誕生日クーポンはすでに使用済みです！', 400);
    }
    await recordSameDayCouponUse(usageRef, shopId, sameDayCombinable, dryRun);
    if (!dryRun) {
      await usageRef.update({
        [`couponUsage.${shopId}.birthdayCouponUsedYear`]: currentYear,
        [`couponUsage.${shopId}.birthdayCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.lastCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.totalVisits`]: FieldValue.increment(1),
      });
    }
    if (await addToLoyaltyCount(usageRef, shopData, shopId, birthday.loyaltyCountable ?? birthday.combinable === true, dryRun)) {
      responseExtra.loyaltyUnlocked = true;
    }
  }

  // ─── 休眠復活クーポン ───
  else if (couponType === 'dormant') {
    const dormant = shopData.proCoupons?.dormant || {};
    couponTitle = dormant.title || '復帰クーポン';
    if (!usage.dormantNotifiedAt) {
      throw new RedeemError('COUPON_NOT_AVAILABLE', '⚠️ この休眠復活クーポンは現在利用できません！', 400);
    }
    if (usage.dormantCouponUsedAt) {
      throw new RedeemError('COUPON_ALREADY_USED', '⚠️ この休眠復活クーポンはすでに使用済みです！', 400);
    }
    const notifiedAt = usage.dormantNotifiedAt?.toDate?.() || new Date(usage.dormantNotifiedAt);
    const expiresAt = new Date(notifiedAt.getTime() + Math.max(1, Number(dormant.expireDays) || 14) * 24 * 60 * 60 * 1000);
    if (expiresAt.getTime() < Date.now()) {
      throw new RedeemError('COUPON_EXPIRED', '⚠️ この休眠復活クーポンは有効期限切れです！', 400);
    }
    await recordSameDayCouponUse(usageRef, shopId, sameDayCombinable, dryRun);
    if (!dryRun) {
      await usageRef.update({
        [`couponUsage.${shopId}.dormantCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.lastCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.totalVisits`]: FieldValue.increment(1),
      });
    }
    if (await addToLoyaltyCount(usageRef, shopData, shopId, dormant.loyaltyCountable ?? dormant.combinable === true, dryRun)) {
      responseExtra.loyaltyUnlocked = true;
    }
  }

  // ─── 予約クーポン ───
  else if (couponType === 'scheduled') {
    const scheduledCoupon = (shopData.scheduledCoupons || []).find((c: any) => c.id === couponId);
    if (!scheduledCoupon) {
      throw new RedeemError('COUPON_NOT_FOUND', 'この予約クーポンは見つかりません', 404);
    }
    if (scheduledCoupon.expiresAt && new Date(scheduledCoupon.expiresAt).getTime() < Date.now()) {
      throw new RedeemError('COUPON_EXPIRED', 'この予約クーポンは有効期限切れです', 400);
    }
    if ((usage.scheduledCouponUsedIds || []).includes(couponId!)) {
      throw new RedeemError('COUPON_ALREADY_USED', 'この予約クーポンは使用済みです', 400);
    }
    couponTitle = scheduledCoupon.title || '予約クーポン';
    await recordSameDayCouponUse(usageRef, shopId, sameDayCombinable, dryRun);
    if (!dryRun) {
      await usageRef.update({
        [`couponUsage.${shopId}.scheduledCouponUsedIds`]: FieldValue.arrayUnion(couponId),
        [`couponUsage.${shopId}.scheduledCouponUsedAt.${couponId}`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.lastCouponUsedAt`]: FieldValue.serverTimestamp(),
        [`couponUsage.${shopId}.totalVisits`]: FieldValue.increment(1),
      });
    }
    if (await addToLoyaltyCount(usageRef, shopData, shopId, scheduledCoupon.loyaltyCountable === true, dryRun)) {
      responseExtra.loyaltyUnlocked = true;
    }
  }

  else {
    throw new RedeemError('COUPON_UNKNOWN_TYPE', `未対応のクーポンタイプです: ${couponType}`, 400);
  }

  // ─── 利用ログの書き込み（dryRun 時はスキップ）───
  if (!dryRun) {
    let customerPhone = '';
    if (usageData.customerUid) {
      try {
        customerPhone = (await authAdmin.getUser(usageData.customerUid)).phoneNumber || '';
      } catch (error) {
        console.error('[redeem-coupon-core] 電話番号取得失敗:', error);
      }
    }
    await db.collection('shops').doc(shopId).collection('coupon_logs').add({
      couponType,
      couponTitle,
      userToken: token,
      customerUid: usageData.customerUid || null,
      customerPhone,
      usedAt: FieldValue.serverTimestamp(),
      scannedBy,
    });
  }

  return {
    couponTitle,
    usedAt: new Date().toISOString(),
    responseExtra,
  };
}
