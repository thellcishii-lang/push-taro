// app/guide/mountain-push/page.tsx
import type { Metadata } from 'next';
import MountainPushClient from './MountainPushClient';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://push-taro.com';

export const metadata: Metadata = {
  title: '登山プッシュ通知の活用方法｜低山ハイキングの安全対策と下山確認｜Push-taro',
  description:
    '低山・日帰りハイキングの安全対策に使える「登山プッシュ通知」を解説。気象・熊出没の安全通知、下山確認プッシュ、圏外でも使える地図と現在地、山裾のお店のクーポンまで。低山ハイキング専用「push-taro MOUNTAIN」（近日公開）の考え方も紹介します。',
  keywords: [
    '登山プッシュ通知',
    '登山 プッシュ通知',
    '低山ハイキング 安全対策',
    '下山確認',
    '熊出没 通知',
    '登山 安全 通知',
    '山岳組合 安全対策',
    'ハイキング 安全',
    'push-taro MOUNTAIN',
  ],
  alternates: { canonical: '/guide/mountain-push' },
  openGraph: {
    type: 'article',
    locale: 'ja_JP',
    title: '登山プッシュ通知の活用方法｜Push-taro',
    description: '天候の急変、熊の出没、下山の確認を、登山者のスマホへ直接届ける。気象・熊出没の安全通知、下山確認プッシュ、圏外でも使える地図と現在地を、組合・協会向けに解説します。',
    url: '/guide/mountain-push',
    siteName: 'Push-taro',
  },
  twitter: {
    card: 'summary_large_image',
    title: '登山プッシュ通知の活用方法｜Push-taro',
    description: '天候の急変、熊の出没、下山の確認を、登山者のスマホへ直接届ける。気象・熊出没の安全通知、下山確認プッシュ、圏外でも使える地図と現在地を、組合・協会向けに解説します。',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '登山プッシュ通知の活用方法｜低山ハイキングの安全対策と下山確認',
  description: '低山・日帰りハイキングの安全対策に使える登山プッシュ通知の活用法。気象・熊出没の安全通知、下山確認プッシュ、圏外でも使える地図と現在地、山裾のお店のクーポンを、組合・協会向けに解説します。',
  author: { '@id': `${appUrl}/#organization` },
  publisher: { '@id': `${appUrl}/#organization` },
  datePublished: '2026-11-07',
  dateModified: '2026-11-07',
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${appUrl}/guide/mountain-push` },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '本格的な登山（アルパイン）向けですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '本記事の想定は、低山・日帰りハイキングです。観光客に近い層が多く訪れる山を対象としています。',
      },
    },
    {
      '@type': 'Question',
      name: '登山者は何を準備すればいいですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'スマートフォンだけです。登山口のQRコードから登録し、アプリのインストールは不要です。取得情報は電話番号のみ（SMS認証）です。',
      },
    },
    {
      '@type': 'Question',
      name: '圏外では通知は届きますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'プッシュ通知の受信には電波が必要です。圏外では、GPSによる現在地表示と、あらかじめ引き込んだ地図の閲覧が使えます。',
      },
    },
    {
      '@type': 'Question',
      name: '下山ボタンを押し忘れたら、遭難扱いになりますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'すぐに遭難扱いにはなりません。まず「下山未確認」としてリストに残り、電話での安否確認から始まります。出なかった場合に、次の確認手段（警察への報告など）へ進みます。',
      },
    },
    {
      '@type': 'Question',
      name: '登山者の電話番号は、普段から見られるのですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '見られません。下山未確認の場合に、組合の管理者が安否確認のために照会したときだけ表示され、照会にはログが残ります。登録時にも、その旨を明示して同意を得る設計です。',
      },
    },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: appUrl },
    { '@type': 'ListItem', position: 2, name: '活用ガイド', item: `${appUrl}/guide` },
    { '@type': 'ListItem', position: 3, name: '登山・低山ハイキングの活用', item: `${appUrl}/guide/mountain-push` },
  ],
};

export default function Page() {
  return (
    <>
      <MountainPushClient />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </>
  );
}
