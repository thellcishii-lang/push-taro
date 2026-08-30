import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('[firebase-client.ts] Firebase設定 projectId:', firebaseConfig.projectId);

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const storage = getStorage(app);

// ✅ メッセージングは遅延初期化（isSupported の非同期対応）
let messaging: any = null;
let messagingInitPromise: Promise<void> | null = null;

async function initMessaging() {
  if (messaging) return;
  if (messagingInitPromise) return messagingInitPromise;
  
  messagingInitPromise = (async () => {
    if (typeof window === 'undefined') return;
    try {
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
  })();
  
  return messagingInitPromise;
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
    // 既存の登録をチェック
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
        updateViaCache: 'none',
      }
    );
    
    console.log('[firebase-client] SW registered, scope:', registration.scope);
    
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

export async function requestFCMToken(): Promise<string | null> {
  console.log('[firebase-client] requestFCMToken start');
  
  if (typeof window === 'undefined') {
    console.warn('[firebase-client] Server-side rendering');
    return null;
  }

  // ✅ メッセージング初期化を待つ
  await initMessaging();

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

export function onForegroundMessage(callback: (payload: any) => void) {
  console.log('[firebase-client] onForegroundMessage 設定');
  if (!messaging) return () => {};
  return onMessage(messaging, (payload) => {
    console.log('[firebase-client] onMessage 受信:', payload);
    callback(payload);
  });
}
