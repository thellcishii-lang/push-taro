// app/mountain/page.tsx
import type { Metadata } from 'next';
import MountainClient from './MountainClient';
import { faqs } from './data/faq';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://push-taro.com';
const currentUrl = `${appUrl}/mountain`;

/* ============================================================
Metadata
============================================================ */
export const metadata: Metadata = {
  title: '登山・低山ハイキング専用プッシュ通知｜push-taro MOUNTAIN',
  description:
    '低山・日帰りハイキング専用のプッシュ通知基盤「push-taro MOUNTAIN」は近日公開。気象の急変や熊の出没を、そのエリアにいる登山者へ直接通知。圏外でも使える地図と現在地、下山確認プッシュで未下山者の確認を支援します。導入先は山岳・観光系の組合・協会。資料請求・事前相談を受付中。',
  keywords: [
    '登山プッシュ通知',
    'push-taro MOUNTAIN',
    '低山 ハイキング 安全対策',
    '下山確認',
    '熊出没 通知',
    '登山 安全 通知',
    '山岳組合',
    '観光協会',
    'Push-taro',
  ],
  alternates: { canonical: currentUrl },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    title: '登山・低山ハイキング専用プッシュ通知｜push-taro MOUNTAIN',
    description:
      '山の「今」を、登山者のスマホへ直接届ける。気象・熊出没の安全通知、圏外でも使える地図、下山確認の仕組みで、山の安全と山裾の賑わいを支えます。',
    url: currentUrl,
    siteName: 'Push-taro',
  },
  twitter: {
    card: 'summary_large_image',
    title: '登山・低山ハイキング専用プッシュ通知｜push-taro MOUNTAIN',
    description:
      '低山・日帰りハイキング専用のプッシュ通知基盤。安全通知と下山確認で、組合の安全対策を支援。資料請求・事前相談を受付中。',
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
JSON-LD: FAQPage
============================================================ */
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

/* ============================================================
JSON-LD: Service（push-taro MOUNTAIN）
============================================================ */
const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'push-taro MOUNTAIN',
  serviceType: '低山・日帰りハイキング専用プッシュ通知基盤',
  provider: {
    '@id': `${appUrl}/#organization`,
    '@type': 'Organization',
    name: 'the合同会社',
  },
  areaServed: { '@type': 'Country', name: 'Japan' },
  description:
    '低山・日帰りハイキング専用のプッシュ通知基盤。気象の急変・熊の出没などの安全通知、圏外でも使える地図と現在地表示、下山確認プッシュによる未下山者の確認を支援。山裾のお店のクーポン掲載も可能。',
};

/* ============================================================
JSON-LD: BreadcrumbList
============================================================ */
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'ホーム',
      item: appUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'push-taro MOUNTAIN',
      item: currentUrl,
    },
  ],
};

/* ============================================================
Page
============================================================ */
export default function Page() {
  return (
    <>
      <MountainClient />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
