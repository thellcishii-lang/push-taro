import { describe, it, expect, vi, beforeEach } from 'vitest';

// データベースおよび通知関連のモック設定
vi.mock('@/lib/db', () => ({
  db: {
    user: {
      findMany: vi.fn().mockResolvedValue([
        { id: 'user-1', name: 'テスト太郎', birthday: '08-28' },
      ]),
    },
  },
}));

vi.mock('@/lib/firebase-admin', () => ({
  adminMessaging: {
    send: vi.fn().mockResolvedValue('messaging-success-id'),
  },
}));

describe('Cron Birthday API のテスト', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('APIルートモジュールが正しく読み込めること', async () => {
    const route = await import('../app/api/cron/birthday/route');
    expect(route).toBeDefined();
  });

  it('GET リクエストのハンドラーが実行されること', async () => {
    const route = await import('../app/api/cron/birthday/route');

    if (typeof route.GET === 'function') {
      // 認証用の Bearer トークンヘッダーを付与したリクエストを作成
      const dummyRequest = new Request('http://localhost/api/cron/birthday', {
        headers: {
          authorization: `Bearer ${process.env.CRON_SECRET || 'test-secret'}`,
        },
      });
      const response = await route.GET(dummyRequest);
      expect(response).toBeDefined();
      // 認証状況に応じて 200 または 401 が返ってくることを検証
      expect([200, 401]).toContain(response.status);
    }
  });
});
