import type { MetadataRoute } from 'next';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://push-taro.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '',
    '/guide',
    '/partners',
    '/privacy',
    '/terms',
    '/signup',
    '/subscribe',
    '/agency',
    '/affiliate/signup',
    '/affilishop',
    '/pro-shop',
    '/torisetsu',
    '/tokusho',
    '/notification-link',
  ];

  const guidePages = [
    '/guide/apparel',
    '/guide/cafe',
    '/guide/case-studies',
    '/guide/features',
    '/guide/features/coupon-birthday',
    '/guide/features/coupon-dormant',
    '/guide/features/coupon-first',
    '/guide/features/coupon-loyalty',
    '/guide/features/coupon-normal',
    '/guide/features/coupon-repeat',
    '/guide/features/coupon-stepup',
    '/guide/features/push-notification',
    '/guide/features/qr-acquisition',
    '/guide/features/referral',
    '/guide/features/scheduled-push',
    '/guide/izakaya',
    '/guide/massage',
    '/guide/ng-actions',
    '/guide/ramen',
    '/guide/salon',
    '/guide/snack',
    '/guide/sushi',
    '/guide/themes/birthday',
    '/guide/themes/dormant',
    '/guide/themes/new-customer',
    '/guide/themes/repeat',
  ];

  const pages = [...staticPages, ...guidePages].map((path) => ({
    url: new URL(path || '/', appUrl).toString(),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }));

  return pages;
}
