// lib/constants.ts

// 紹介制度（PROプラン限定）の換金条件
export const REFERRAL_PAYOUT_THRESHOLD = 10000;

// アフィリエイト（誰でもOK）の換金条件
export const AFFILIATE_PAYOUT_THRESHOLD = 5000;

// プラン別月額
export const PLAN_PRICES: Record<string, number> = {
  light: 1980,
  standard: 3800,
  pro: 10000,
};

// アフィリエイト一括報酬（プラン別）
export const AFFILIATE_ONE_TIME_REWARDS: Record<string, number> = {
  light: 1000,
  standard: 2000,
  pro: 5000,
};

// アフィリエイト継続報酬率
export const AFFILIATE_RECURRING_RATE = 0.05; // 5%
