import admin from 'firebase-admin';

console.log('[firebase-admin.ts] Admin SDK 初期化チェック。apps.length:', admin.apps.length);

if (!admin.apps.length) {
  console.log('[firebase-admin.ts] Admin SDK 初期化開始。projectId:', process.env.FIREBASE_PROJECT_ID);
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
  console.log('[firebase-admin.ts] Admin SDK 初期化完了');
} else {
  console.log('[firebase-admin.ts] Admin SDK は既に初期化済み');
}

export const messaging = admin.messaging();
export const db = admin.firestore();
export const authAdmin = admin.auth();
