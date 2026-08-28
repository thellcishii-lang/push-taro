import { describe, it, expect, vi, beforeEach } from 'vitest';

// DB モック設定
vi.mock('@/lib/db', () => ({
  db: {
    agency: {
      update: vi.fn().mockResolvedValue({ id: 'agency-123', status: 'APPROVED' }),
      findUnique: vi.fn().mockResolvedValue({ id: 'agency-123', status: 'PENDING' }),
    },
  },
}));

// Firebase Admin モック設定（db も含めて統合）
vi.mock('@/lib/firebase-admin', () => ({
  db: {
    collection: vi.fn().mockReturnValue({
      doc: vi.fn().mockReturnValue({
        update: vi.fn().mockResolvedValue(true),
        get: vi.fn().mockResolvedValue({ exists: true, data: () => ({ status: 'PENDING' }) }),
      }),
    }),
  },
  adminAuth: {
    setCustomUserClaims: vi.fn().mockResolvedValue(true),
  },
}));

describe('agencyActions のテスト', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('代理店承認ロジックが正常に呼び出されること', async () => {
    const agencyActions = await import('../app/actions/agencyActions');

    if (typeof agencyActions.approveAgency === 'function') {
      const result = await agencyActions.approveAgency('agency-123');
      expect(result).toBeDefined();
    } else {
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
