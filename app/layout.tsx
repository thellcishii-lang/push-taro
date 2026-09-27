import type { Metadata, Viewport } from 'next';
import Script from 'next/script';   // ★ これに変更

// 既存の metadata, viewport はそのまま

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, background: '#fafafa' }}>
        {children}

        {/* GA4 by Script tag */}
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
