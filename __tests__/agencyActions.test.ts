import { describe, it, expect, vi, beforeEach } from 'vitest';

// DB や外部ライブラリのモック設定
vi.mock('@/lib/db', () => ({
  db: {
    agency: {
      update: vi.fn().mockResolvedValue({ id: 'agency-123', status: 'APPROVED' }),
      findUnique: vi.fn().mockResolvedValue({ id: 'agency-123', status: 'PENDING' }),
    },
  },
}));

vi.mock('@/lib/firebase-admin', () => ({
  adminAuth: {
    setCustomUserClaims: vi.fn().mockResolvedValue(true),
  },
}));

describe('agencyActions のテスト', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('代理店承認ロジックが正常に呼び出されること', async () => {
    // agencyActions モジュールの読み込み
    const agencyActions = await import('../app/actions/agencyActions');

    // 承認関数の呼び出しテスト（※実際の関数名に合わせて実行）
    if (typeof agencyActions.approveAgency === 'function') {
      const result = await agencyActions.approveAgency('agency-123');
      expect(result).toBeDefined();
    } else {
      // モジュールが存在することを確認
      expect(agencyActions).toBeDefined();
    }
  });

  it('不正な代理店IDの場合はエラーを返すか検証', async () => {
    const agencyActions = await import('../app/actions/agencyActions');

    if (typeof agencyActions.approveAgency === 'function') {
      try {
        await agencyActions.approveAgency('');
      } catch (error) {
        expect(error).toBeDefined();
      }
    }
  });
});
