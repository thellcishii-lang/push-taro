export const metadata = {
  title: 'プッシュ太郎',
  description: 'プッシュ通知一斉送信ツール',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
