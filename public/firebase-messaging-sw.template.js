importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

console.log('[firebase-messaging-sw.js] Service Worker 読み込み');

firebase.initializeApp({
  apiKey: "{{FIREBASE_API_KEY}}",
  authDomain: "{{FIREBASE_AUTH_DOMAIN}}",
  projectId: "{{FIREBASE_PROJECT_ID}}",
  storageBucket: "{{FIREBASE_STORAGE_BUCKET}}",
  messagingSenderId: "{{FIREBASE_MESSAGING_SENDER_ID}}",
  appId: "{{FIREBASE_APP_ID}}",
});

const messaging = firebase.messaging();

// ✅ data ベースで通知を構築
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] バックグラウンド通知受信:', payload);

  console.log('[DEBUG] 受信した画像URL:', payload.data?.image);
  
  const title = payload.data?.title || 'プッシュ太郎';
  const body = payload.data?.body || '';
  const image = payload.data?.image;
  const url = payload.data?.url || '/';
  
  // ✅ 送信されたタイムスタンプ（数値）を取得、無ければ現在時刻
  const notificationTime = payload.data?.timestamp ? Number(payload.data.timestamp) : Date.now();

  // ✅ メッセージごとに一意の tag を生成して過去の通知履歴の上書き・消去を防止
  const uniqueTag = payload.data?.msgId || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // ✅ 基本通知オプション
  const notificationOptions = {
    body: body,
    icon: '/icon-192x192.png',
    data: { url: url },
    tag: uniqueTag,                           // 👈 過去の通知履歴を上書き消去させない
    timestamp: notificationTime,             // 👈 日時ズレ（「2日前」等）を防止
    silent: false,                           // 👈 音を鳴らす明示設定
    renotify: true,                          // 👈 通知受信時に音・バイブを鳴らす
    requireInteraction: false,
  };

  // ⚠️ 空文字列や undefined の image をセットすると PC/Android の Chrome でエラードロップするため存在チェックを行う
  if (image && typeof image === 'string' && image.trim() !== '') {
    notificationOptions.image = image;
  }

  self.registration.showNotification(title, notificationOptions);
});

self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] install イベント');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] activate イベント');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] 通知クリック:', event);
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(self.clients.openWindow(url));
});
