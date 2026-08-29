import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#ff6b6b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'プッシュ太郎 - プッシュ通知でお届け',
  description: 'お得な情報をプッシュ通知で受け取ろう',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'プッシュ太郎',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, background: '#fafafa' }}>{children}</body>
    </html>
  );
}
