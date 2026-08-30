import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const storage = getStorage(app);

// 🟢 安全に Service Worker を登録する
async function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js',
      { scope: '/' }
    );
    return registration;
  } catch (err) {
    console.error('[SW] 登録失敗:', err);
    return null;
  }
}

// 🟢 FCMトークン取得（FCM未対応ブラウザ・iOS非対応モードでのクラッシュを完全防止）
export async function requestFCMToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  try {
    // ブラウザが FCM に対応しているか判定
    const supported = await isSupported().catch(() => false);
    if (!supported) {
      console.warn('[FCM] このブラウザ/環境は FCM 通知に対応していません');
      return null;
    }

    const messaging = getMessaging(app);

    // トークン取得前に SW を登録
    const swRegistration = await registerServiceWorker();

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: swRegistration || undefined,
    });

    return token;
  } catch (err) {
    console.error('[FCM ERROR] FCMトークン取得失敗:', err);
    return null;
  }
}
