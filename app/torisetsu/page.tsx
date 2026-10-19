// app/torisetsu/page.tsx
import type { Metadata } from 'next';
import TorisetsuIndexClient from './TorisetsuIndexClient';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://push-taro.com';

export const metadata: Metadata = {
  title: 'Push-taro 取扱説明書｜プラン別の使い方・設定マニュアル｜Push-taro',
  description:
    'Push-taroの管理画面（PROコンソール）の使い方を図解で解説。LIGHT/STANDARDプランの基本機能から、PROプランの配信無制限・連続クーポン・予約配信まで、実際の画面をもとに操作手順をまとめています。',
  keywords: [
    'Push-taro 使い方',
    'Push-taro 設定',
    'Push-taro 取扱説明書',
    'プッシュ通知 設定 方法',
    '店舗 クーポン 設定',
    'PROコンソール',
  ],
  alternates: { canonical: '/torisetsu' },
  robots: {
    index: true,
    follow: true,
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: appUrl },
    { '@type': 'ListItem', position: 2, name: '取扱説明書', item: `${appUrl}/torisetsu` },
  ],
};

export default function Page() {
  return (
    <>
      <TorisetsuIndexClient />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
