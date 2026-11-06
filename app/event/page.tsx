// app/event/page.tsx
import type { Metadata} from 'next';
import EventClient from './EventClient';
import { faqs} from './data/faq';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://push-taro.com';
const currentUrl = `${appUrl}/event`;

/* ============================================================
Metadata
============================================================ */
export const metadata: Metadata = {
title: 'イベント専用プッシュ通知｜push-taro EVENT',
description:
'イベント・展示会専用のプッシュ通知×クーポン基盤「push-taro EVENT」は近日公開。15分刻みの予約配信と最大500件のクーポンが、出店者に販売できる「広告商品」に。主催者の新しい収益の柱を作ります。月額¥39,800（税別）から・初期費用0円。資料請求・事前相談を受付中。',
keywords: [
'イベント専用プッシュ通知',
'push-taro EVENT',
'イベント プッシュ通知',
'展示会 集客',
'イベント クーポン',
'イベント主催者',
'出店者 広告',
'予約配信',
'Push-taro',
],
alternates: { canonical: currentUrl},
openGraph: {
type: 'website',
locale: 'ja_JP',
title: 'イベント専用プッシュ通知｜push-taro EVENT',
description:
'イベント当日の「今」を、来場者のスマホへ直接届ける。15分刻みの予約配信とクーポンは、出店者に販売できる広告商品になります。',
url: currentUrl,
siteName: 'Push-taro',
},
twitter: {
card: 'summary_large_image',
title: 'イベント専用プッシュ通知｜push-taro EVENT',
description:
'イベント・展示会専用のプッシュ通知×クーポン基盤。主催者の新しい収益の柱に。資料請求・事前相談を受付中。',
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
acceptedAnswer: { '@type': 'Answer', text: f.a},
})),
};

/* ============================================================
JSON-LD: Service（push-taro EVENT）
============================================================ */
const serviceJsonLd = {
'@context': 'https://schema.org',
'@type': 'Service',
name: 'push-taro EVENT',
serviceType: 'イベント専用プッシュ通知・クーポン配信基盤',
provider: {
'@id': `${appUrl}/#organization`,
'@type': 'Organization',
name: 'the合同会社',
},
areaServed: { '@type': 'Country', name: 'Japan'},
description:
'イベント・展示会専用のプッシュ通知×クーポン基盤。15分刻みの予約配信とクーポン掲載を、出店者向けの広告商品として販売できる。購読は毎日リセット。',
offers: [
{
'@type': 'Offer',
name: '5万人プラン',
price: 39800,
priceCurrency: 'JPY',
valueAddedTaxIncluded: false,
description: '購読者5万人まで・月額¥39,800（税別）・クーポン100件込み',
url: currentUrl,
},
{
'@type': 'Offer',
name: '10万人プラン',
price: 59800,
priceCurrency: 'JPY',
valueAddedTaxIncluded: false,
description: '購読者10万人まで・月額¥59,800（税別）・クーポン100件込み',
url: currentUrl,
},
{
'@type': 'Offer',
name: '20万人プラン',
price: 78000,
priceCurrency: 'JPY',
valueAddedTaxIncluded: false,
description: '購読者20万人まで・月額¥78,000（税別）・クーポン100件込み',
url: currentUrl,
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
name: 'push-taro EVENT',
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
<EventClient />

<script
type="application/ld+json"
dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd)}}
/>
<script
type="application/ld+json"
dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd)}}
/>
<script
type="application/ld+json"
dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd)}}
/>
</>
);
}
