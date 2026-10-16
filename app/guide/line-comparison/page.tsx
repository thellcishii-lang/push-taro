// app/guide/line-comparison/page.tsx
import type { Metadata } from 'next';
import LineComparisonClient from './LineComparisonClient';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://push-taro.com';

export const metadata: Metadata = {
  title: 'LINE公式アカウントの配信上限と、Push-taroとの比較｜実店舗のための判断ガイド｜Push-taro',
  description:
    'LINE公式アカウントの配信通数は「友だち数 × 配信回数」で消費されます。クーポンを別送すると、通数はさらに増える。週2回配信・月8回をベースに、LINEライト・スタンダード・プロとPush-taroのコストを登録者数別に比較。あなたの店舗に、どちらが合うかを数字で判断できます。',
  keywords: [
    'LINE公式アカウント 配信上限',
    'LINE 配信 通数',
    'LINE スタンダード 料金',
    'LINE ライト 料金',
    'LINE クーポン 配信',
    'LINE プッシュ通知 比較',
    'プッシュ通知 CRM',
    '実店舗 集客 ツール',
    'Push-taro',
  ],
  alternates: { canonical: '/guide/line-comparison' },
  openGraph: {
    type: 'article',
    locale: 'ja_JP',
    title: 'LINE公式アカウントの配信上限と、Push-taroとの比較｜Push-taro',
    description:
      '週2回配信・月8回をベースに、LINEとPush-taroのコストを登録者数別に比較。あなたの店舗に、どちらが合うか。',
    url: '/guide/line-comparison',
    siteName: 'Push-taro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LINE公式アカウントの配信上限と、Push-taroとの比較｜Push-taro',
    description: 'LINEの配信上限という壁を、数字で解説。',
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
   JSON-LD: Article
   ============================================================ */
const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'LINE公式アカウントの配信上限と、Push-taroとの比較',
  description:
    'LINE公式アカウントの配信通数は「友だち数 × 配信回数」で消費されます。クーポンを別送すると、通数はさらに増える。週2回配信・月8回をベースに、LINEとPush-taroのコストを登録者数別に比較。',
  author: { '@id': `${appUrl}/#organization` },
  publisher: { '@id': `${appUrl}/#organization` },
  datePublished: '2026-10-16',
  dateModified: '2026-10-16',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${appUrl}/guide/line-comparison`,
  },
  inLanguage: 'ja-JP',
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
    {
      '@type': 'ListItem',
      position: 3,
      name: 'LINE公式アカウントとの比較',
      item: `${appUrl}/guide/line-comparison`,
    },
  ],
};

export default function Page() {
  return (
    <>
      <LineComparisonClient />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
