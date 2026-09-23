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
  ];

  // ② ガイド配下（priority 0.7）
  const guides = [
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
    '/guide/case-studies',
    '/guide/ng-actions',
    '/guide/cafe',
    '/guide/izakaya',
    '/guide/ramen',
    '/guide/sushi',
    '/guide/salon',
    '/guide/massage',
    '/guide/snack',
    '/guide/apparel',
    '/guide/themes/new-customer',
    '/guide/themes/repeat',
    '/guide/themes/birthday',
    '/guide/themes/dormant',
  ].map((path) => ({ path, priority: 0.7, freq: 'monthly' as const }));

  // ③ 法務・補助（priority 0.3）
  const legal = ['/privacy', '/terms', '/tokusho', '/torisetsu'].map((path) => ({
    path,
    priority: 0.3,
    freq: 'yearly' as const,
  }));

  // ★ 除外したもの（ログイン後画面 / 決済フロー）
  //   /pro-shop /agency /affilishop /subscribe
  //   /affiliate/signup /notification-link
  //   → sitemap に含めない

  return [...core, ...guides, ...legal].map((p) => ({
    url: new URL(p.path, appUrl).toString(),
    lastModified: now,
    changeFrequency: p.freq,
    priority: p.priority,
  }));
}
