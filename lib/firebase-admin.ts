import admin from 'firebase-admin';

console.log('[firebase-admin.ts] Admin SDK 初期化チェック。apps.length:', admin.apps.length);

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  console.log('[firebase-admin.ts] Admin SDK 初期化開始。projectId:', projectId);

  try {
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
  } catch (error) {
    console.error('[firebase-admin.ts] 初期化失敗:', error);
  }
} else {
  console.log('[firebase-admin.ts] Admin SDK は既に初期化済み');
}

// 🔥 各インスタンスは初期化失敗時にも安全に取得できるようガード
let messaging: admin.messaging.Messaging;
let db: admin.firestore.Firestore;
let authAdmin: admin.auth.Auth;

try {
  messaging = admin.messaging();
  db = admin.firestore();
  authAdmin = admin.auth();
} catch (error) {
  console.error('[firebase-admin.ts] Firebase サービスの取得に失敗:', error);
  throw error;
}

export { messaging, db, authAdmin };
