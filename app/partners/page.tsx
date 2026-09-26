// app/partners/page.tsx
import type { Metadata } from 'next';
import PartnersClient from './PartnersClient';
import { faqs } from './data/faq';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://push-taro.com';

/* ============================================================
   Metadata
   ============================================================ */
export const metadata: Metadata = {
  title: '代理店パートナー募集｜最大45%のストック収益｜Push-taro',
  description:
    'Push-taroの代理店・紹介・アフィリエイト。3つの収益化プログラムで、あなたのネットワークを毎月の安定収益に。加盟金30万円（キャンペーン）・在庫ゼロ・店舗ゼロ・ノルマなし。',
  keywords: [
    '代理店',
    '代理店募集',
    'ストック収入',
    'ストックビジネス',
    '副業',
    'アフィリエイト',
    '紹介報酬',
    'プッシュ通知',
    'CRM',
    '実店舗',
    'Push-taro',
  ],
  alternates: { canonical: '/partners' },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    title: '代理店パートナー募集｜最大45%のストック収益｜Push-taro',
    description:
      '3つの収益化プログラムで、あなたのネットワークを毎月の安定収益に。加盟金30万円（キャンペーン）・在庫ゼロ・店舗ゼロ・ノルマなし。',
    url: '/partners',
    siteName: 'Push-taro',
  },
  twitter: {
    card: 'summary_large_image',
    title: '代理店パートナー募集｜最大45%のストック収益｜Push-taro',
    description:
      '最大45%のストック収益。在庫ゼロ・店舗ゼロ・ノルマなし。3つの収益化プログラムを標準搭載。',
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
   JSON-LD: Service（代理店プログラム）
   ============================================================ */
const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Push-taro 代理店パートナー',
  serviceType: 'SaaS代理店プログラム',
  provider: { '@id': `${appUrl}/#organization` },
  areaServed: { '@type': 'Country', name: 'Japan' },
  description:
    'Push-taroの代理店パートナー制度。紹介店舗の月額利用料から最大45%の継続報酬。在庫ゼロ・店舗ゼロ・ノルマなし。',
  offers: [
    {
      '@type': 'Offer',
      name: '代理店パートナー',
      price: '300000',
      priceCurrency: 'JPY',
      description: '加盟金30万円（キャンペーン）＋月額3万円',
      url: `${appUrl}/partners`,
    },
  ],
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
      name: '代理店パートナー',
      item: `${appUrl}/partners`,
    },
  ],
};

/* ============================================================
   Page
   ============================================================ */
export default function Page() {
  return (
    <>
      <PartnersClient />

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
