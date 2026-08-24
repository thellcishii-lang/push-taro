export const metadata = {
  title: 'プッシュ太郎 - プッシュ通知でお届け',
  description: 'お得な情報をプッシュ通知で受け取ろう',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="manifest" href="/manifest" />
        <meta name="theme-color" content="#ff6b6b" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body style={{ margin: 0, background: '#fafafa' }}>{children}</body>
    </html>
  );
}
