import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Firestore } from 'firebase-admin/firestore';

const mocks = vi.hoisted(() => ({
  update: vi.fn(),
  set: vi.fn(),
  add: vi.fn(),
  usage: {} as Record<string, unknown>,
}));

vi.mock('./firebase-admin', () => ({
  authAdmin: {},
  db: {
    runTransaction: async (callback: (transaction: unknown) => Promise<unknown>) => callback({
      get: async () => ({ data: () => ({ couponUsage: { shop: mocks.usage } }) }),
      update: (_ref: unknown, data: unknown) => mocks.update(data),
      set: mocks.set,
    }),
    collection: () => ({ doc: () => ({ collection: () => ({ add: mocks.add }) }) }),
  },
}));

import { DEFAULT_USAGE, redeemCouponCore, RedeemCouponParams } from './redeem-coupon-core';

function params(couponType: string, usage: Record<string, unknown> = {}): RedeemCouponParams {
  mocks.usage = { ...DEFAULT_USAGE, ...usage };
  const usageRef = new Firestore({ projectId: 'coupon-tests' }).doc('subscriptions/token');
  vi.spyOn(usageRef, 'update').mockImplementation(mocks.update);
  return {
    shopId: 'shop', token: 'token', couponType, couponId: 'scheduled-1', scannedBy: 'owner',
    usageRef,
    usageData: { couponUsage: { shop: mocks.usage } },
    shopData: {
      coupon: { enabled: true }, normalCoupon: { enabled: true, couponId: 'normal-1' },
      loyaltyCoupon: { enabled: true },
      proCoupons: {
        stepUp: { enabled: true, campaignId: 'step-1', steps: [{ title: 'Step one' }, { title: 'Step two' }] },
        repeat: { enabled: true, campaignId: 'repeat-1' },
        birthday: { enabled: true }, dormant: { enabled: true },
      },
      scheduledCoupons: [{ id: 'scheduled-1' }],
    },
  };
}

describe('coupon redemption', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it.each([
    ['first', {}, 'firstCouponUsedAt'],
    ['loyalty', { loyaltyCouponAvailable: true }, 'loyaltyCouponAvailable'],
    ['step-up', {}, 'stepUpIndex'],
    ['repeat', {}, 'repeatCouponUsedAt'],
    ['birthday', { birthdayNotifiedYear: String(new Date().getFullYear()) }, 'birthdayCouponUsedYear'],
    ['dormant', { dormantNotifiedAt: new Date() }, 'dormantCouponUsedAt'],
    ['scheduled', {}, 'scheduledCouponUsedIds'],
  ])('records redemption and history for %s', async (type, usage, field) => {
    const result = await redeemCouponCore(params(type, usage));
    expect(mocks.update).toHaveBeenCalledWith(expect.objectContaining({
      [`couponUsage.shop.${field}`]: expect.anything(),
    }));
    expect(mocks.add).toHaveBeenCalledWith(expect.objectContaining({ couponType: type, userToken: 'token' }));
    expect(result.usedAt).toEqual(expect.any(String));
  });

  it('records a normal coupon ID in its transaction', async () => {
    await redeemCouponCore(params('normal'));
    expect(mocks.set).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      couponUsage: { shop: expect.objectContaining({ normalCouponUsedCouponId: 'normal-1' }) },
    }), { merge: true });
  });

  it.each([
    ['first', { firstCouponUsedAt: new Date() }],
    ['normal', { normalCouponUsedCouponId: 'normal-1' }],
    ['loyalty', { loyaltyCouponAvailable: false }],
    ['repeat', { repeatCouponUsedAt: new Date() }],
    ['birthday', { birthdayNotifiedYear: String(new Date().getFullYear()), birthdayCouponUsedYear: String(new Date().getFullYear()) }],
    ['dormant', { dormantNotifiedAt: new Date(), dormantCouponUsedAt: new Date() }],
    ['scheduled', { scheduledCouponUsedIds: ['scheduled-1'] }],
    ['step-up', { stepUpCampaignId: 'step-1', stepUpIndex: 2 }],
  ])('rejects reuse of %s without recording another visit or history', async (type, usage) => {
    await expect(redeemCouponCore(params(type, usage))).rejects.toThrow();
    expect(mocks.update).not.toHaveBeenCalled();
    expect(mocks.set).not.toHaveBeenCalled();
    expect(mocks.add).not.toHaveBeenCalled();
  });

  it('resets old step-up progress and persists the new campaign ID', async () => {
    const result = await redeemCouponCore(params('step-up', { stepUpCampaignId: 'old', stepUpIndex: 2 }));
    expect(result.couponTitle).toBe('Step one');
    expect(mocks.update).toHaveBeenCalledWith(expect.objectContaining({
      'couponUsage.shop.stepUpIndex': 1, 'couponUsage.shop.stepUpCampaignId': 'step-1',
    }));
  });

  it('continues to the next step within the same campaign', async () => {
    const result = await redeemCouponCore(params('step-up', { stepUpCampaignId: 'step-1', stepUpIndex: 1 }));
    expect(result.couponTitle).toBe('Step two');
    expect(result.responseExtra.allStepsCompleted).toBe(true);
  });

  it('persists the repeat campaign ID so the status API retains its active period', async () => {
    await redeemCouponCore(params('repeat'));
    expect(mocks.update).toHaveBeenCalledWith(expect.objectContaining({
      'couponUsage.shop.repeatCampaignId': 'repeat-1',
    }));
  });
});
