// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  isSupported: vi.fn(),
  getMessaging: vi.fn(),
  onMessage: vi.fn(),
}));

vi.mock('../../lib/firebase-client', () => ({
  firebaseApp: {},
  auth: { currentUser: null },
  requestFCMToken: vi.fn(),
}));
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: () => () => {},
  RecaptchaVerifier: vi.fn(),
  signInWithPhoneNumber: vi.fn(),
}));
vi.mock('firebase/messaging', () => mocks);
vi.mock('qrcode.react', () => ({
  QRCodeSVG: ({ value }: { value: string }) => <div data-qr={value} />,
}));

import SubscribePage from './page';

const shop = {
  success: true,
  name: 'Test shop',
  coupon: { enabled: true, title: 'First offer' },
  normalCoupon: { enabled: true, title: 'Normal offer', couponId: 'normal-1' },
  loyaltyCoupon: { enabled: true, title: 'Loyalty offer' },
  proCoupons: {
    birthday: { enabled: true, title: 'Birthday offer' },
    dormant: { enabled: true, title: 'Dormant offer' },
    repeat: { enabled: true, title: 'Repeat offer' },
    stepUp: { enabled: true, steps: [{ title: 'Step one' }, { title: 'Step two' }] },
  },
  scheduledCoupons: [{ id: 'scheduled-1', title: 'Scheduled offer' }],
};

describe('customer coupon redemption display', () => {
  let container: HTMLDivElement;
  let root: Root;
  let status: Record<string, unknown>;
  let statusResponse: () => Response;
  let fetchMock: ReturnType<typeof vi.fn>;
  let couponHistories: Array<{ id: string; title: string; usedAt: string }>;

  const qrTypes = () => [...container.querySelectorAll('[data-qr]')]
    .map((element) => JSON.parse(element.getAttribute('data-qr')!).couponType);

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    window.history.replaceState({}, '', '/subscribe?s=shop-1');
    localStorage.clear();
    localStorage.setItem('push_taro_token_shop-1', 'customer-token');
    vi.stubGlobal('indexedDB', { open: () => ({}) });
    mocks.isSupported.mockResolvedValue(false);
    mocks.getMessaging.mockReturnValue({});
    mocks.onMessage.mockReturnValue(vi.fn());
    status = {
      success: true, registered: true, loyaltyCouponAvailable: true,
      birthdayNotifiedYear: String(new Date().getFullYear()),
      dormantNotifiedAt: new Date().toISOString(),
    };
    statusResponse = () => Response.json(status);
    couponHistories = [];
    fetchMock = vi.fn(async (url: string) => {
      if (url.startsWith('/api/shop-info')) return Response.json(shop);
      if (url === '/api/customer-session') return Response.json({ sessionToken: 'session' });
      if (url.startsWith('/api/subscribe-status')) return statusResponse();
      if (url.startsWith('/api/coupon-history')) return Response.json({ histories: couponHistories });
      throw new Error(`Unexpected request: ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  async function mount() {
    await act(async () => root.render(<SubscribePage />));
  }

  it('refreshes all coupon types even when messaging is unsupported and reuses the session', async () => {
    await mount();
    expect(qrTypes().sort()).toEqual(['birthday', 'dormant', 'first', 'loyalty', 'normal', 'repeat', 'scheduled', 'step-up']);
    expect(mocks.getMessaging).not.toHaveBeenCalled();

    status = {
      ...status, firstCouponUsed: true, normalCouponUsed: true,
      loyaltyCouponAvailable: false, stepUpIndex: 1, repeatCouponUsed: true,
      birthdayCouponUsed: true, dormantCouponUsed: true,
      scheduledCouponUsedIds: ['scheduled-1'],
    };
    await act(async () => { await vi.advanceTimersByTimeAsync(10_000); });
    expect(container.textContent).not.toContain('First offer');
    expect(container.textContent).not.toContain('Loyalty offer');
    expect(container.textContent).not.toContain('Step one');
    expect(container.textContent).toContain('Step two');
    expect(qrTypes()).toEqual(['step-up']);
    expect(container.textContent).toContain('本日は使用済みです');

    status = { ...status, stepUpIndex: 2, repeatCouponUsed: false };
    await act(async () => { await vi.advanceTimersByTimeAsync(10_000); });
    expect(qrTypes()).toEqual(['repeat']);
    await act(async () => { await vi.advanceTimersByTimeAsync(600_000); });
    expect(fetchMock.mock.calls.filter(([url]) => url === '/api/customer-session')).toHaveLength(1);
  });

  it('does not redisplay a used first coupon on reload', async () => {
    status = { ...status, firstCouponUsed: true };
    await mount();
    expect(container.textContent).not.toContain('First offer');
    expect(qrTypes()).not.toContain('first');
  });

  it('keeps polling after messaging initialization fails and refreshes on focus', async () => {
    mocks.isSupported.mockResolvedValue(true);
    mocks.getMessaging.mockImplementationOnce(() => { throw new Error('Messaging unavailable'); });
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      await mount();
      status = { ...status, firstCouponUsed: true };
      await act(async () => { window.dispatchEvent(new Event('focus')); });
      expect(qrTypes()).not.toContain('first');
      expect(error).toHaveBeenCalledWith('通知受信の初期化エラー:', expect.any(Error));
    } finally {
      error.mockRestore();
    }
  });

  it('shows refresh errors, honors Retry-After, and recovers without stale QR codes', async () => {
    await mount();
    statusResponse = () => Response.json({ error: 'Too Many Requests' }, {
      status: 429, headers: { 'Retry-After': '30' },
    });
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      await act(async () => { await vi.advanceTimersByTimeAsync(10_000); });
      expect(container.querySelector('[role="alert"]')).not.toBeNull();
      expect(qrTypes()).toEqual([]);
      const calls = fetchMock.mock.calls.length;
      status = { ...status, firstCouponUsed: true };
      statusResponse = () => Response.json(status);
      await act(async () => { await vi.advanceTimersByTimeAsync(20_000); });
      expect(fetchMock.mock.calls).toHaveLength(calls);
      await act(async () => { await vi.advanceTimersByTimeAsync(10_000); });
      expect(container.querySelector('[role="alert"]')).toBeNull();
      expect(qrTypes()).toContain('normal');
      expect(qrTypes()).not.toContain('first');
    } finally {
      error.mockRestore();
    }
  });
  it('shows only the selected history and refreshes coupon history after redemption', async () => {
    await mount();
    const tab = (name: string) => [...container.querySelectorAll('[role=tab]')]
      .find((element) => element.textContent?.includes(name)) as HTMLButtonElement;
    const panel = () => container.querySelector('[role=tabpanel]')!.textContent;

    expect(panel()).toContain('受信した通知はまだありません');
    expect(fetchMock.mock.calls.some(([url]) => String(url).startsWith('/api/coupon-history'))).toBe(false);

    await act(async () => { tab('クーポン使用').click(); });
    expect(tab('クーポン使用').getAttribute('aria-selected')).toBe('true');
    expect(panel()).toContain('まだクーポンを使用していません');
    expect(panel()).not.toContain('通知');
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/api/coupon-history?shopId=shop-1&token=session'), expect.anything());

    couponHistories = [{ id: 'log-1', title: 'First offer', usedAt: '2026-10-25T04:00:00.000Z' }];
    status = { ...status, firstCouponUsed: true };
    await act(async () => { await vi.advanceTimersByTimeAsync(10_000); });
    expect(panel()).toContain('First offer');
    expect(panel()).toContain('に使用');

    await act(async () => { tab('通知').click(); });
    expect(panel()).not.toContain('First offer');
    expect(panel()).toContain('受信した通知はまだありません');
  });
});
