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
  title: 'Push-taro - プッシュ通知でお届け',
  description: 'お得な情報をプッシュ通知で受け取ろう',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Push-taro',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, background: '#fafafa' }}>
        {children}
      </body>
    </html>
  );
}
