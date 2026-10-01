// app/sitemap.ts
import type { MetadataRoute } from 'next';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://push-taro.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ① LP・主要CV系（priority 1.0）
  const core = [
    { path: '/', priority: 1.0, freq: 'weekly' as const },
    { path: '/guide', priority: 0.9, freq: 'weekly' as const },
    { path: '/partners', priority: 0.9, freq: 'weekly' as const },
    { path: '/signup', priority: 0.8, freq: 'monthly' as const },
    { path: '/contact', priority: 0.6, freq: 'monthly' as const },
  ];

  // ② ガイド配下（priority 0.7）
  const guides = [
    // --- 機能別 ---
    '/guide/features',
    '/guide/features/push-notification',
    '/guide/features/qr-acquisition',
    '/guide/features/coupon-first',
    '/guide/features/coupon-normal',
    '/guide/features/coupon-loyalty',
    '/guide/features/coupon-stepup',
    '/guide/features/coupon-repeat',
    '/guide/features/coupon-birthday',
    '/guide/features/coupon-dormant',
    '/guide/features/scheduled-push',
    '/guide/features/referral',

    // --- 運用ノウハウ ---
    '/guide/case-studies',
    '/guide/ng-actions',
    '/guide/segmentation',
    '/guide/existing-customers',

    // --- 業種別 ---
    '/guide/bakery',
    '/guide/cafe',
    '/guide/izakaya',
    '/guide/ramen',
    '/guide/sushi',
    '/guide/salon',
    '/guide/massage',
    '/guide/snack',
    '/guide/apparel',

    // --- テーマ別 ---
    '/guide/themes/new-customer',
    '/guide/themes/repeat',
    '/guide/themes/birthday',
    '/guide/themes/dormant',
  ].map((path) => ({ path, priority: 0.7, freq: 'monthly' as const }));

  // ③ 取扱説明書（priority 0.5）
  const manual = [
    '/torisetsu',
    '/torisetsu/light-standard',
    '/torisetsu/pro',
  ].map((path) => ({ path, priority: 0.5, freq: 'monthly' as const }));

  // ④ 法務・補助（priority 0.3）
  const legal = [
    '/privacy',
    '/terms',
    '/tokusho',
  ].map((path) => ({ path, priority: 0.3, freq: 'yearly' as const }));

  // ★ 除外（ログイン後画面 / 決済フロー / API）
  //   /pro-shop /shop /agency /affiliate /affilishop
  //   /subscribe /notification-link /payment
  //   /system-admin /print /api
  //   → sitemap に含めない

  return [...core, ...guides, ...manual, ...legal].map((p) => ({
    url: new URL(p.path, appUrl).toString(),
    lastModified: now,
    changeFrequency: p.freq,
    priority: p.priority,
  }));
}
