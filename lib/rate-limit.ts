import crypto from 'crypto';
import { db } from './firebase-admin';

export function getClientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')?.trim()
    || 'unknown';
}

export async function enforceRateLimit(
  request: Request,
  scope: string,
  limit: number,
  windowMs: number
): Promise<number | null> {
  const identifier = getClientIp(request);
  const key = crypto.createHash('sha256').update(`${scope}:${identifier}`).digest('hex');
  const ref = db.collection('rate_limits').doc(key);

  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const now = Date.now();
    const data = snapshot.data();
    const resetAt = data?.resetAt?.toMillis?.() || 0;

    if (!snapshot.exists || resetAt <= now) {
      transaction.set(ref, {
        scope,
        count: 1,
        resetAt: new Date(now + windowMs),
        updatedAt: new Date(now),
      });
      return null;
    }

    if (Number(data?.count || 0) >= limit) {
      return Math.max(1, Math.ceil((resetAt - now) / 1000));
    }

    transaction.update(ref, {
      count: Number(data?.count || 0) + 1,
      updatedAt: new Date(now),
    });
    return null;
  });
}