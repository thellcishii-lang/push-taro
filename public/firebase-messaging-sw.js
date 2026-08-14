importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

console.log('[firebase-messaging-sw.js] Service Worker 読み込み');

firebase.initializeApp({
  apiKey: "AIzaSyAh0sfGYv_jBCdv0rUEkn29ADgFbD4pnZU",
  authDomain: "push-taro-8b503.firebaseapp.com",
  projectId: "push-taro-8b503",
  storageBucket: "push-taro-8b503.firebasestorage.app",
  messagingSenderId: "977949043216",
  appId: "1:977949043216:web:e2f98530645c719c123895",
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
