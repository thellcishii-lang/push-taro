// firebase-messaging-sw.template.js (修正後)

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
  
  // ✅ 送信されたタイムスタンプがあれば使用、無ければ現在時刻
  const notificationTime = payload.data?.timestamp ? Number(payload.data.timestamp) : Date.now();

  // ✅ 固定の shopId ではなく、メッセージごとに一意の tag を生成して履歴消去を防止
  const uniqueTag = payload.data?.msgId || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  self.registration.showNotification(title, {
    body: body,
    icon: '/icon-192x192.png',
    image: image,
    data: { url: url },
    tag: uniqueTag,                           // 👈 修正: 過去の通知履歴を削除させない
    timestamp: notificationTime,             // 👈 修正: 日時ズレ（「2日前」等）を防止
    silent: false,                           // 👈 修正: 音を鳴らす明示設定
    renotify: true,                          // 👈 修正: 通知受信時に音・バイブを鳴らす
    requireInteraction: false,
  });
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
