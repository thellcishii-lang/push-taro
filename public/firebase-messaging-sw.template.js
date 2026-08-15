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

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] バックグラウンド通知受信:', payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icon-192x192.png',
    image: payload.notification.image,
    data: payload.data,
    tag: payload.data?.messageId || 'default',
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

// ✅ 追加：通知クリックで遷移
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] 通知クリック:', event);
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(self.clients.openWindow(url));
});
