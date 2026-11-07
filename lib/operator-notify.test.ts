import { beforeEach, describe, expect, it, vi} from 'vitest';

const mocks = vi.hoisted(() => ({
sendEmail: vi.fn(),
}));

vi.mock('./mailer', () => ({ sendEmail: mocks.sendEmail}));

import { notifyOperatorOfSignup} from './operator-notify';
import { OPERATOR_NOTIFICATION_EMAIL} from './constants';

describe('notifyOperatorOfSignup', () => {
beforeEach(() => {
mocks.sendEmail.mockReset();
mocks.sendEmail.mockResolvedValue({ success: true});
vi.spyOn(console, 'error').mockImplementation(() => {});
});

it('sends the notification to the operator address with the given subject and fields', async () => {
await notifyOperatorOfSignup({
subject: '店舗申込：テスト店（PRO）',
heading: '新規店舗申込（決済待ち）',
fields: [
{ label: '店名', value: 'テスト店'},
{ label: 'プラン', value: 'PRO'},
{ label: '電話番号', value: ''},
{ label: '住所', value: null},
],
adminPath: '/system-admin',
});

expect(mocks.sendEmail).toHaveBeenCalledTimes(1);
const arg = mocks.sendEmail.mock.calls[0][0];
expect(arg.to).toBe(OPERATOR_NOTIFICATION_EMAIL);
expect(arg.to).toBe('pushtaro.info@gmail.com');
expect(arg.subject).toBe('店舗申込：テスト店（PRO）');
expect(arg.html).toContain('新規店舗申込（決済待ち）');
expect(arg.html).toContain('テスト店');
expect(arg.html).toContain('申込日時');
// 空の項目は本文に出さない
expect(arg.html).not.toContain('電話番号');
expect(arg.html).not.toContain('住所');
expect(arg.html).toContain('/system-admin');
});

it('does not throw when the mailer reports a failure', async () => {
mocks.sendEmail.mockResolvedValue({ success: false, error: 'SMTP unavailable'});
await expect(
notifyOperatorOfSignup({
subject: '代理店申込：テスト',
heading: '新規代理店申込',
fields: [{ label: '担当者', value: 'テスト'}],
})
).resolves.toBeUndefined();
expect(console.error).toHaveBeenCalled();
});

it('does not throw when the mailer throws', async () => {
mocks.sendEmail.mockRejectedValue(new Error('boom'));
await expect(
notifyOperatorOfSignup({
subject: 'アフィリエイト申込：テスト',
heading: '新規アフィリエイト申込',
fields: [],
})
).resolves.toBeUndefined();
expect(console.error).toHaveBeenCalled();
});
});
