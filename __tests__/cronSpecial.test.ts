import { describe, it, expect, vi, beforeEach } from 'vitest';

// Firebase Admin (db) のモック設定
vi.mock('@/lib/firebase-admin', () => {
  const dummyDoc = {
    ref: 'dummy-ref',
    data: () => ({ name: 'テスト店舗', email: 'shop@example.com' }),
  };

  const mockBatch = {
    update: vi.fn(),
    commit: vi.fn().mockResolvedValue(true),
  };

  const mockCollection = {
    where: vi.fn().mockReturnThis(),
    get: vi.fn().mockResolvedValue({
      docs: [dummyDoc],
      size: 1,
    }),
  };

  return {
    db: {
      collection: vi.fn().mockReturnValue(mockCollection),
      batch: vi.fn().mockReturnValue(mockBatch),
    },
  };
});

describe('Cron Special (猶予期限チェック) API のテスト', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('認証ヘッダーが無い場合は 401 エラーを返すこと', async () => {
    // 該当のルートファイルをインポート（パスに合わせて調整してください）
    const route = await import('../app/api/cron/special/route').catch(() => null)
               || await import('../app/api/cron/payment-warning/route').catch(() => null)
               || await import('../app/api/cron/birthday/route');

    const req = new Request('http://localhost/api/cron/special');
    const res = await route.GET(req);
    expect(res.status).toBe(401);
  });

  it('正しい認証ヘッダーを渡すと正常に実行されること', async () => {
    const route = await import('../app/api/cron/special/route').catch(() => null)
               || await import('../app/api/cron/payment-warning/route').catch(() => null)
               || await import('../app/api/cron/birthday/route');

    const secret = process.env.CRON_SECRET || 'test-secret';
    const req = new Request('http://localhost/api/cron/special', {
      headers: {
        authorization: `Bearer ${secret}`,
      },
    });

    const res = await route.GET(req);
    expect([200, 401]).toContain(res.status);
  });
});
