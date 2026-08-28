import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

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
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

// 🔴 修正点: Service Worker を正しいスコープで登録する
async function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('[SW] サービスワーカー非対応ブラウザ');
    return null;
  }

  try {
    console.log('[SW] サービスワーカー登録開始...');
    const registration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js',
      { scope: '/' }  // ← これが重要！
    );
    console.log('[SW] 登録成功！スコープ:', registration.scope);
    return registration;
  } catch (err) {
    console.error('[SW] 登録失敗:', err);
    return null;
  }
}

export async function requestFCMToken(): Promise<string | null> {
  console.log('[firebase-client.ts] requestFCMToken 呼び出し');
  
  if (!messaging) {
    console.warn('[firebase-client.ts] messagingがnull（SSR中？）');
    return null;
  }

  try {
    // 変数 registration に代入して受け取る
    const registration = await registerServiceWorker();

    console.log('[firebase-client.ts] getToken 開始');
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration || undefined,
    });
    console.log('[firebase-client.ts] getToken 結果:', token ? '取得成功' : 'null返却');
    return token;
  } catch (err) {
    console.error('[firebase-client.ts] FCMトークン取得失敗:', err);
    return null;
  }
}

export function onForegroundMessage(callback: (payload: any) => void) {
  console.log('[firebase-client.ts] onForegroundMessage 設定');
  if (!messaging) return () => {};
  return onMessage(messaging, (payload) => {
    console.log('[firebase-client.ts] onMessage 受信:', payload);
    callback(payload);
  });
}
