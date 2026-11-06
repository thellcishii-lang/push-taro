// app/guide/event-marketing/page.tsx
import type { Metadata } from 'next';
import EventMarketingClient from './EventMarketingClient';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://push-taro.com';

export const metadata: Metadata = {
  title: 'イベントプッシュ通知の活用方法｜人件費削減と新たな収益源｜Push-taro',
  description:
    'フェスや展示会などの短期イベントで使える「イベントプッシュ通知」を解説。15分刻みの予約配信、即時プッシュ、クーポン、会場案内PDFで、人流案内、印刷コストの削減、出展者向け広告枠の販売を支援します。イベント専用「push-taro EVENT」の料金と導入手順も紹介します。',
  keywords: [
    'イベントプッシュ通知',
    'イベント プッシュ通知',
    '展示会 プッシュ通知',
    'イベント 来場者 通知',
    'イベント主催者 集客',
    'イベント 人件費 削減',
    'フェス 運営 効率化',
    '展示会 マネタイズ',
    'プッシュ通知 広告枠',
    'push-taro EVENT',
  ],
  alternates: { canonical: '/guide/event-marketing' },
  openGraph: {
    type: 'article',
    locale: 'ja_JP',
    title: 'イベントプッシュ通知の活用方法｜Push-taro',
    description: 'プログラム変更、混雑情報、出展者の見どころを来場者のスマホへ。15分刻みの予約配信、即時プッシュ、クーポン、会場案内PDF、料金と導入手順を主催者向けに解説します。',
    url: '/guide/event-marketing',
    siteName: 'Push-taro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'イベントプッシュ通知の活用方法｜Push-taro',
    description: 'プログラム変更、混雑情報、出展者の見どころを来場者のスマホへ。15分刻みの予約配信、即時プッシュ、クーポン、会場案内PDF、料金と導入手順を主催者向けに解説します。',
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
  headline: 'イベントプッシュ通知の活用方法｜人件費削減と新たな収益源',
  description: '短期イベントで使えるイベントプッシュ通知の活用法。15分刻みの予約配信、即時プッシュ、クーポン、会場案内PDF、出展者向け広告枠、料金と導入手順を主催者向けに解説します。',
  author: { '@id': `${appUrl}/#organization` },
  publisher: { '@id': `${appUrl}/#organization` },
  datePublished: '2026-10-28',
  dateModified: '2026-11-06',
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${appUrl}/guide/event-marketing` },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'どんなイベントで使えますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'フェス、展示会、見本市、カンファレンス、地域イベントなど、開催期間が決まっているイベントで使えます。想定来場者数に合わせて、購読者上限の異なるプランを選びます。',
      },
    },
    {
      '@type': 'Question',
      name: '来場者はアプリをインストールする必要がありますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'アプリのインストールは不要です。会場や告知に掲示されたQRコードから登録し、電話番号によるSMS認証を行います。',
      },
    },
    {
      '@type': 'Question',
      name: '会場案内やプログラムの印刷物は必要ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '会場案内、プログラム、会場マップなどはPDFで来場者の画面に掲載できるため、印刷物を実質的に減らせます。変更が出た場合も、その場で差し替えできます。',
      },
    },
    {
      '@type': 'Question',
      name: '来場者の情報はイベント後も残りますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '購読の保持期間は1〜3日の範囲でイベントごとに設定できます。期間を過ぎた購読は毎日リセットされ、次回開催へ持ち越しません。リセット前には集計レポートがメールで届きます。',
      },
    },
    {
      '@type': 'Question',
      name: '出展者向け広告の価格は決まっていますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '予約配信やクーポン掲載を出展者へ販売する場合、その価格と枠数は主催者が自由に設定できます。出店料のパッケージに含めることも、オプションとして分けることもできます。',
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
    { '@type': 'ListItem', position: 3, name: 'イベント・展示会の活用', item: `${appUrl}/guide/event-marketing` },
  ],
};

export default function Page() {
  return (
    <>
      <EventMarketingClient />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </>
  );
}
