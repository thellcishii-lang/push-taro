import admin from 'firebase-admin';

// 🔥 遅延初期化：初回アクセス時にのみ初期化する
function getAdminApp(): admin.app.App {
  // 既に初期化済みなら、それを返す
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  console.log('[firebase-admin.ts] Admin SDK 初期化開始。projectId:', projectId);

  if (!projectId || !clientEmail || !privateKey) {
    console.error('[firebase-admin.ts] エラー: 環境変数が不足しています', {
      hasProjectId: !!projectId,
      hasClientEmail: !!clientEmail,
      hasPrivateKey: !!privateKey,
    });
    throw new Error('Firebase Admin SDK の環境変数が不足しています');
  }

  const app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  console.log('[firebase-admin.ts] Admin SDK 初期化完了');
  return app;
}

// 🔥 getter 経由で遅延初期化（ビルド時には実行されない）
export const messaging = new Proxy({} as admin.messaging.Messaging, {
  get: (_, prop) => {
    const app = getAdminApp();
    const instance = admin.messaging(app);
    return (instance as any)[prop];
  },
});

export const db = new Proxy({} as admin.firestore.Firestore, {
  get: (_, prop) => {
    const app = getAdminApp();
    const instance = admin.firestore(app);
    return (instance as any)[prop];
  },
});

export const authAdmin = new Proxy({} as admin.auth.Auth, {
  get: (_, prop) => {
    const app = getAdminApp();
    const instance = admin.auth(app);
    return (instance as any)[prop];
  },
});
