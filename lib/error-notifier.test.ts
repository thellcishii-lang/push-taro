import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  sendEmail: vi.fn(),
  add: vi.fn(),
}));

vi.mock('./mailer', () => ({ sendEmail: mocks.sendEmail }));
vi.mock('./firebase-admin', () => ({
  db: { collection: () => ({ add: mocks.add }) },
}));

import { notifyAdmins } from './error-notifier';

describe('notifyAdmins', () => {
  beforeEach(() => {
    mocks.sendEmail.mockReset();
    mocks.sendEmail.mockResolvedValue({ success: true });
    mocks.add.mockReset();
    mocks.add.mockResolvedValue({ id: 'log-id' });
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('always sends error notifications to the operator Gmail address', async () => {
    await notifyAdmins(new Error('chunk load failed'), { source: 'frontend' });

    const recipients = mocks.sendEmail.mock.calls.map((call) => call[0].to);
    // 環境変数未設定時のフォールバック宛先
    expect(recipients).toContain('info@push-taro.com');
    // 運営者アドレスは環境変数に依存せず常時含まれる
    expect(recipients).toContain('pushtaro.info@gmail.com');
    const operatorMail = mocks.sendEmail.mock.calls.find(
      (call) => call[0].to === 'pushtaro.info@gmail.com'
    );
    expect(operatorMail?.[0].subject).toContain('システムエラー');
  });

  it('keeps ADMIN_EMAILS entries and still adds the operator address', async () => {
    vi.resetModules();
    vi.stubEnv('ADMIN_EMAILS', 'extra@example.com, info@push-taro.com');
    try {
      const { notifyAdmins: freshNotifyAdmins } = await import('./error-notifier');
      await freshNotifyAdmins(new Error('another failure'), { source: 'frontend' });

      const recipients = mocks.sendEmail.mock.calls.map((call) => call[0].to);
      expect(recipients).toContain('extra@example.com');
      expect(recipients).toContain('info@push-taro.com');
      expect(recipients).toContain('pushtaro.info@gmail.com');
      // 重複は除かれる
      expect(recipients.filter((to) => to === 'info@push-taro.com')).toHaveLength(1);
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
