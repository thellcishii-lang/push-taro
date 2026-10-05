// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

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
  description:
    '実店舗のリピート施策を「プッシュ通知×CRM」で自動化するSaaS。7種類のクーポン自動配信・QR消込・休眠復活を標準搭載。月額1,980円〜。',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Push-taro',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={inter.variable} suppressHydrationWarning>
      <body style={{ margin: 0, background: '#fafafa' }}>
        {children}

        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QCJH31R4FJ"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QCJH31R4FJ');
          `}
        </Script>
      </body>
    </html>
  );
}
