// app/guide/why-push-taro/page.tsx
import type { Metadata } from 'next';
import WhyPushTaroClient from './WhyPushTaroClient';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://push-taro.com';

export const metadata: Metadata = {
  title: '実店舗の売上が頭打ちになる、本当の理由｜既存客の囲い込みとは｜Push-taro',
  description:
    '実店舗の売上が頭打ちになる本当の原因は、「新規客獲得」と「既存リピーターの回転率」という2つの課題を混同していること。既存客の囲い込みとは何か、なぜポイントでは動かないのか、本質を整理します。',
  keywords: [
    '既存客 囲い込み',
    '既存客 リピート',
    '新規客 リピーター',
    '実店舗 売上 頭打ち',
    'ポイントカード 効果',
    '実店舗 CRM',
    'Push-taro',
  ],
  alternates: { canonical: '/guide/why-push-taro' },
  openGraph: {
    type: 'article',
    locale: 'ja_JP',
    title: '実店舗の売上が頭打ちになる、本当の理由｜既存客の囲い込みとは｜Push-taro',
    description:
      '「新規客獲得」と「既存リピーターの回転率」という2つの課題を分けて考える。実店舗の本質を整理します。',
    url: '/guide/why-push-taro',
    siteName: 'Push-taro',
  },
  twitter: {
    card: 'summary_large_image',
    title: '実店舗の売上が頭打ちになる、本当の理由｜Push-taro',
    description: '既存客の囲い込みとは何か。本質を整理します。',
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
  headline: '実店舗の売上が頭打ちになる、本当の理由｜既存客の囲い込みとは',
  description:
    '実店舗の売上が頭打ちになる本当の原因は、「新規客獲得」と「既存リピーターの回転率」という2つの課題を混同していること。既存客の囲い込みとは何か、なぜポイントでは動かないのか、本質を整理します。',
  author: { '@id': `${appUrl}/#organization` },
  publisher: { '@id': `${appUrl}/#organization` },
  datePublished: '2026-09-27',
  dateModified: '2026-10-01',
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${appUrl}/guide/why-push-taro` },
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
    { '@type': 'ListItem', position: 3, name: 'なぜPush-taroなのか', item: `${appUrl}/guide/why-push-taro` },
  ],
};

export default function Page() {
  return (
    <>
      <WhyPushTaroClient />

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
