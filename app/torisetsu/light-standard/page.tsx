// app/torisetsu/light-standard/page.tsx
import type { Metadata } from 'next';
import TorisetsuBasicClient from './TorisetsuBasicClient';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://push-taro.com';

export const metadata: Metadata = {
  title: 'LIGHT / STANDARDプラン 取扱説明書｜通知送信・クーポン設定の使い方｜Push-taro',
  description:
    'Push-taro LIGHT/STANDARDプランの操作マニュアル。管理画面へのログイン、プッシュ通知の送信手順、お客様のQRコード消込、初回クーポン・通常クーポン・特別達成クーポンの設定方法を画面付きで解説します。',
  keywords: [
    'Push-taro ログイン',
    'プッシュ通知 送信 方法',
    'QRコード 消込',
    '初回クーポン 設定',
    '通常クーポン 設定',
    'Push-taro 取扱説明書',
  ],
  alternates: { canonical: '/torisetsu/light-standard' },
  openGraph: {
    type: 'article',
    locale: 'ja_JP',
    title: 'LIGHT / STANDARDプラン 取扱説明書｜Push-taro',
    description: 'ログインから通知送信、クーポン設定まで、実際の画面で図解します。',
    url: '/torisetsu/light-standard',
    siteName: 'Push-taro',
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
  headline: 'LIGHT / STANDARDプラン 取扱説明書｜Push-taroの基本的な使い方',
  description: 'Push-taroのLIGHT・STANDARDプランの管理画面操作マニュアル。ログイン方法、プッシュ通知の送信、QRコード消込、クーポンの設定手順。',
  author: { '@id': `${appUrl}/#organization` },
  publisher: { '@id': `${appUrl}/#organization` },
  datePublished: '2026-10-19',
  dateModified: '2026-10-19',
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${appUrl}/torisetsu/light-standard` },
};

/* ============================================================
   JSON-LD: BreadcrumbList
   ============================================================ */
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: appUrl },
    { '@type': 'ListItem', position: 2, name: '取扱説明書', item: `${appUrl}/torisetsu` },
    { '@type': 'ListItem', position: 3, name: 'LIGHT / STANDARD版', item: `${appUrl}/torisetsu/light-standard` },
  ],
};

export default function Page() {
  return (
    <>
      <TorisetsuBasicClient />
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
