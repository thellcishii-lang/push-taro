/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔥 ビルド時の静的生成を全体的に無効化
  output: 'standalone',

  // 🔥 全てのページを動的に扱う（推奨）
  experimental: {
    // App RouterでのSSGを無効化
  },

  // 🔥 旧URL → 新URL のリダイレクト
  async redirects() {
    return [
      // ★ 追加：www付きURL → wwwなしURL へ301リダイレクト
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.push-taro.com' }],
        destination: 'https://push-taro.com/:path*',
        permanent: true, // 301リダイレクト（SEO的にも正しい）
      },

      // 既存：旧URL → 新URL
      {
        source: '/program',
        destination: '/partners',
        permanent: true,
      },
      {
        source: '/program/:path*',
        destination: '/partners/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
