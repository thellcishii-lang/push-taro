import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#ff6b6b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
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
      <body style={{ margin: 0, background: '#fafafa' }}>{children}</body>
    </html>
  );
}
