// scripts/build-sw.js
const fs = require('fs');
const path = require('path');

const swCode = `
importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: '${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}',
  projectId: '${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}',
  messagingSenderId: '${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}',
  appId: '${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}',
});

const messaging = firebase.messaging();

// ✅ 絶対に動くバックグラウンド通知ハンドラ
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] 受信ペイロード:', payload);

  // ✅ notification と data の両方からタイトル/本文を探す（両方対応）
  const title = payload.notification?.title || payload.data?.title || 'プッシュ太郎';
  const body = payload.notification?.body || payload.data?.body || 'お知らせがあります';

  const options = {
    body: body,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    data: payload.data || {},
    requireInteraction: true,
  };

  // 画像があれば表示
  if (payload.data?.image) {
    options.image = payload.data.image;
  }

  // 通知を表示
  self.registration.showNotification(title, options);
});

// ✅ 通知クリック時の処理（リンクがあれば開く）
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
`;

const outputPath = path.join(__dirname, '../public/firebase-messaging-sw.js');
fs.writeFileSync(outputPath, swCode);
console.log('✅ Service Worker generated at:', outputPath);
