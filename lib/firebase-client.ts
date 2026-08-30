// firebase-client.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = { /* ... */ };

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const storage = getStorage(app);

// ✅ メッセージングはブラウザチェック後に初期化
let messaging: any = null;
if (typeof window !== 'undefined') {
  try {
    // iOS対応: isSupported() で対応状況をチェック
    const supported = await isSupported();
    if (supported) {
      messaging = getMessaging(app);
      console.log('[firebase-client] Messaging initialized');
    } else {
      console.warn('[firebase-client] FCM not supported on this browser');
    }
  } catch (err) {
    console.warn('[firebase-client] Messaging init failed:', err);
  }
}

export async function requestFCMToken(): Promise<string | null> {
  console.log('[firebase-client] requestFCMToken start');
  
  if (typeof window === 'undefined') {
    console.warn('[firebase-client] Server-side rendering');
    return null;
  }

  // ✅ iOSチェック: ホーム画面追加済みか確認
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = (window.navigator as any).standalone === true;
  
  if (isIOS && !isStandalone) {
    console.warn('[firebase-client] iOS but not standalone - need home screen add');
    throw new Error('IOS_REQUIRES_STANDALONE');
  }

  if (!messaging) {
    console.warn('[firebase-client] Messaging not available');
    throw new Error('MESSAGING_NOT_AVAILABLE');
  }

  try {
    // ✅ 1. まず既存のトークンを確認
    let currentToken = null;
    try {
      currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
      if (currentToken) {
        console.log('[firebase-client] Existing token found');
        return currentToken;
      }
    } catch (err) {
      console.log('[firebase-client] No existing token, fetching new one');
    }

    // ✅ 2. Service Worker登録（再試行付き）
    let registration = await getServiceWorkerRegistration();
    if (!registration) {
      console.log('[firebase-client] No SW registration, registering...');
      registration = await registerServiceWorker();
    }

    // ✅ 3. トークン取得（SW登録完了を待つ）
    if (!registration || !registration.active) {
      console.log('[firebase-client] Waiting for SW activation...');
      await new Promise((resolve) => {
        if (registration?.installing) {
          registration.installing.addEventListener('statechange', (e: any) => {
            if (e.target.state === 'activated') resolve(null);
          });
        } else {
          setTimeout(resolve, 3000);
        }
      });
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration || undefined,
    });

    if (!token) {
      throw new Error('TOKEN_FETCH_FAILED');
    }

    console.log('[firebase-client] Token fetched successfully');
    return token;

  } catch (err: any) {
    console.error('[firebase-client] Token error:', err);
    
    // ✅ エラータイプ別の対応
    if (err.code === 'messaging/permission-blocked') {
      throw new Error('PERMISSION_BLOCKED');
    }
    if (err.code === 'messaging/unsupported-browser') {
      throw new Error('UNSUPPORTED_BROWSER');
    }
    if (err.message === 'IOS_REQUIRES_STANDALONE') {
      throw new Error('IOS_REQUIRES_STANDALONE');
    }
    throw err;
  }
}

// ✅ Service Worker管理 (シングルトン)
let swRegistration: ServiceWorkerRegistration | null = null;

async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (swRegistration) return swRegistration;
  
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const reg of registrations) {
      if (reg.active && reg.active.scriptURL.includes('firebase-messaging-sw')) {
        swRegistration = reg;
        return reg;
      }
    }
    return null;
  } catch (err) {
    console.error('[firebase-client] SW getRegistrations error:', err);
    return null;
  }
}

async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    throw new Error('Service Worker not supported');
  }

  try {
    // ✅ 既存の登録をチェック
    const existing = await getServiceWorkerRegistration();
    if (existing) {
      swRegistration = existing;
      return existing;
    }

    console.log('[firebase-client] Registering Service Worker...');
    const registration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js',
      { 
        scope: '/',
        // ✅ iOS対応: updateViaCache を設定
        updateViaCache: 'none',
      }
    );
    
    console.log('[firebase-client] SW registered, scope:', registration.scope);
    
    // ✅ SWの状態を監視
    if (registration.installing) {
      console.log('[firebase-client] SW installing...');
    } else if (registration.waiting) {
      console.log('[firebase-client] SW waiting...');
    } else if (registration.active) {
      console.log('[firebase-client] SW active!');
    }

    swRegistration = registration;
    return registration;
  } catch (err) {
    console.error('[firebase-client] SW registration failed:', err);
    throw err;
  }
}
