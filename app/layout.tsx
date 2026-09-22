import type { Metadata, Viewport } from 'next';

export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  themeColor: '#ff6b6b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://push-taro.com';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: '実店舗のリピート施策をPush通知で自動化 | Push-taro',
  description: '実店舗のリピート施策を「プッシュ通知×CRM」で自動化するSaaS。7種類のクーポン自動配信・QR消込・休眠復活を標準搭載。月額1,980円〜。',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Push-taro',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body style={{ margin: 0, background: '#fafafa' }}>
        {children}
      </body>
    </html>
  );
}
