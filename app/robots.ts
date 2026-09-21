// app/robots.ts
import type { MetadataRoute } from 'next';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://push-taro.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 通常の検索エンジン
      { userAgent: '*', allow: '/' },

      // ★ AI系クローラーを明示的に許可（引用されやすくする）
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },

      // 管理画面・API は除外
      {
        userAgent: '*',
        disallow: ['/pro-shop', '/agency', '/affilishop', '/api/'],
      },
    ],
    sitemap: new URL('/sitemap.xml', appUrl).toString(),
    host: appUrl,
  };
}
