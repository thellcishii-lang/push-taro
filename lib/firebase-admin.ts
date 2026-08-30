import admin from 'firebase-admin';

console.log('[firebase-admin.ts] Admin SDK 初期化チェック。apps.length:', admin.apps.length);

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  console.log('[firebase-admin.ts] Admin SDK 初期化開始。projectId:', projectId);

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    console.log('[firebase-admin.ts] Admin SDK 初期化完了');
  } else {
    console.error('[firebase-admin.ts] エラー: 環境変数が不足しています', {
      hasProjectId: !!projectId,
      hasClientEmail: !!clientEmail,
      hasPrivateKey: !!privateKey,
    });
  }
} else {
  console.log('[firebase-admin.ts] Admin SDK は既に初期化済み');
}

export const messaging = admin.messaging();
export const db = admin.firestore();
export const authAdmin = admin.auth();
