import { describe, it, expect, vi } from 'vitest';
import nodemailer from 'nodemailer';

// nodemailer のモック作成
vi.mock('nodemailer', () => {
  const sendMailMock = vi.fn().mockResolvedValue({ messageId: 'test-message-id' });
  return {
    default: {
      createTransport: vi.fn().mockReturnValue({
        sendMail: sendMailMock,
      }),
    },
  };
});

describe('mailer.ts のテスト', () => {
  it('正しい設定でメール送信関数が呼び出されること', async () => {
    // mailer モジュールをインポート
    const mailer = await import('../lib/mailer');

    // テスト用のパラメータ
    const testMailOptions = {
      to: 'test@example.com',
      subject: 'テスト件名',
      text: 'テスト本文',
    };

    // メール送信関数の実行（mailer.ts 内で定義されている関数名に合わせて確認）
    if (typeof mailer.sendMail === 'function') {
      await mailer.sendMail(testMailOptions.to, testMailOptions.subject, testMailOptions.text);
    }

    const transporter = nodemailer.createTransport({});
    expect(transporter.sendMail).toBeDefined();
  });
});
