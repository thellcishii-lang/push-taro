/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔥 ビルド時の静的生成を全体的に無効化
  output: 'standalone',

  // 🔥 Puppeteer 系は Next.js のバンドルから除外（native module のため）
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],

  experimental: {
    // App RouterでのSSGを無効化
  },
};

module.exports = nextConfig;
