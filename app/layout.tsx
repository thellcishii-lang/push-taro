export const metadata = {
  title: 'プッシュ太郎',
  description: 'プッシュ通知送信ツール',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
