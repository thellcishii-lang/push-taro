// lib/firebase/client.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getMessaging, isSupported } from 'firebase/messaging';

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

// メッセージングは遅延初期化 (iOS対応)
let messagingInstance: any = null;
let messagingInitPromise: Promise<void> | null = null;

export async function initMessaging() {
  if (messagingInstance) return;
  if (messagingInitPromise) return messagingInitPromise;
  
  messagingInitPromise = (async () => {
    if (typeof window === 'undefined') return;
    try {
      const supported = await isSupported();
      if (supported) {
        messagingInstance = getMessaging(app);
        console.log('[firebase-client] Messaging initialized');
      }
    } catch (err) {
      console.warn('[firebase-client] Messaging init failed:', err);
    }
  })();
  
  return messagingInitPromise;
}

export { messagingInstance as messaging };
