// lib/firebase/admin.ts
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });

  // 🔥 firestore の設定は initializeApp の外で設定する！
  admin.firestore().settings({
    ignoreUndefinedProperties: true,
  });
}

export const messaging = admin.messaging();
export const db = admin.firestore();
export const authAdmin = admin.auth();
