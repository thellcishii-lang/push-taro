// app/guide/page.tsx
import type { Metadata } from 'next';
import GuideClient from './GuideClient';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://push-taro.com';

export const metadata: Metadata = {
  title: '実店舗のためのプッシュ通知 活用ガイド｜業種別・機能別｜Push-taro',
  description:
    '実店舗のプッシュ通知・CRM活用ガイド。パン屋・飲食店・カフェ・美容サロンなど業種別の実践マニュアルと、クーポン・休眠復活・誕生日配信などの機能別ガイドを網羅。現場から導いたノウハウを公開。',
  keywords: [
    '実店舗 プッシュ通知',
    'プッシュ通知 活用',
    '店舗 CRM ガイド',
    '飲食店 集客',
    'パン屋 集客',
    'カフェ 集客',
    'クーポン 活用',
    '休眠復活',
    '誕生日クーポン',
    'Push-taro',
  ],
  alternates: { canonical: '/guide' },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    title: '実店舗のためのプッシュ通知 活用ガイド｜Push-taro',
    description:
      '業種別・機能別の実践マニュアル。現場から導いたノウハウを公開。',
    url: '/guide',
    siteName: 'Push-taro',
  },
  twitter: {
    card: 'summary_large_image',
    title: '実店舗のためのプッシュ通知 活用ガイド｜Push-taro',
    description: '業種別・機能別の実践マニュアル。現場から導いたノウハウ。',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

/* ============================================================
   JSON-LD: BreadcrumbList
   ============================================================ */
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: appUrl },
    { '@type': 'ListItem', position: 2, name: '活用ガイド', item: `${appUrl}/guide` },
  ],
};

/* ============================================================
   JSON-LD: CollectionPage（ガイド一覧）
   ============================================================ */
const collectionJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: '実店舗のためのプッシュ通知 活用ガイド',
  description:
    '業種別・機能別の実践マニュアル。現場から導いたノウハウを公開。',
  url: `${appUrl}/guide`,
  inLanguage: 'ja-JP',
  publisher: { '@id': `${appUrl}/#organization` },
  hasPart: [
  // 業種別ガイド
  { '@type': 'Article', name: 'スーパー・小売店', url: `${appUrl}/guide/super` },
  { '@type': 'Article', name: 'パン屋・ベーカリー', url: `${appUrl}/guide/bakery` },
  { '@type': 'Article', name: '飲食店・カフェ', url: `${appUrl}/guide/cafe` },
  { '@type': 'Article', name: 'アパレル・雑貨', url: `${appUrl}/guide/apparel` },
  { '@type': 'Article', name: 'スナック・パブ', url: `${appUrl}/guide/snack` },

  // 機能別・運用
  { '@type': 'Article', name: '機能別ガイド', url: `${appUrl}/guide/features` },
  { '@type': 'Article', name: '導入事例', url: `${appUrl}/guide/case-studies` },
  { '@type': 'Article', name: 'NG行為集', url: `${appUrl}/guide/ng-actions` },

  // 店舗マーケティングの本質
  { '@type': 'Article', name: '実店舗の集客、オススメの施策', url: `${appUrl}/guide/store-marketing` },
  { '@type': 'Article', name: 'LINE公式アカウントとの比較', url: `${appUrl}/guide/line-comparison` },
  { '@type': 'Article', name: 'プッシュ通知のCVRは、何%あればいいのか', url: `${appUrl}/guide/push-notification-metrics` },
  { '@type': 'Article', name: 'CTRを、CVRに繋げる方法', url: `${appUrl}/guide/ctr-to-cvr` },
  { '@type': 'Article', name: 'セグメント配信とは', url: `${appUrl}/guide/segmentation` },
  { '@type': 'Article', name: 'なぜ、顧客情報を取らないのか', url: `${appUrl}/guide/security` },
],
};

/* ============================================================
   Page
   ============================================================ */
export default function Page() {
  return (
    <>
      <GuideClient />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
    </>
  );
}
