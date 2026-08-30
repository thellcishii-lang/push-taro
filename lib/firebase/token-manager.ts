// lib/firebase/token-manager.ts
import { getToken } from 'firebase/messaging';
import { messaging, initMessaging } from './client';
import { detectPlatform, isStandalone } from './platform';
import { getServiceWorkerRegistration, registerServiceWorker, waitForServiceWorkerActivation } from './sw-manager';

export async function requestNotificationToken(): Promise<{ token: string; platform: string }> {
  console.log('[TokenManager] requestNotificationToken start');
  
  if (typeof window === 'undefined') {
    throw new Error('Cannot request token on server');
  }

  const platform = detectPlatform();
  console.log('[TokenManager] Platform:', platform);

  if (platform === 'ios' && !isStandalone()) {
    throw new Error('IOS_REQUIRES_STANDALONE');
  }

  await initMessaging();
  
  if (!messaging) {
    throw new Error('MESSAGING_NOT_AVAILABLE');
  }

  let token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  });
  
  if (token) {
    console.log('[TokenManager] Existing token found');
    return { token, platform };
  }

  let registration = await getServiceWorkerRegistration();
  if (!registration) {
    registration = await registerServiceWorker();
  }
  
  if (registration) {
    await waitForServiceWorkerActivation(registration);
  }

  token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration || undefined,
  });

  if (!token) {
    throw new Error('TOKEN_FETCH_FAILED');
  }

  console.log('[TokenManager] Token fetched successfully');
  return { token, platform };
}
