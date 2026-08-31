import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shopName = searchParams.get('shopName') || 'Push-taro';
  const iconUrl = searchParams.get('iconUrl') || '/icon-192x192.png';

  const swScript = `
    importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
    importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

    firebase.initializeApp({
      apiKey: "${process.env.NEXT_PUBLIC_FIREBASE_API_KEY || ''}",
      authDomain: "${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || ''}",
      projectId: "${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || ''}",
      storageBucket: "${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || ''}",
      messagingSenderId: "${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || ''}",
      appId: "${process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''}"
    });

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log('[firebase-messaging-sw.js] バックグラウンド通知受信:', payload);

      // タイトルの優先順位: 1.送られたtitle 2.送られたnotification.title 3.店舗名 4.Push-taro
      const title = payload.data?.title || payload.notification?.title || ${JSON.stringify(shopName)};
      const body = payload.data?.body || payload.notification?.body || '';
      const image = payload.data?.image || payload.notification?.image;
      const icon = payload.data?.icon || payload.notification?.icon || ${JSON.stringify(iconUrl)};
      const url = payload.data?.url || '/';

      self.registration.showNotification(title, {
        body: body,
        icon: icon,
        image: image,
        data: { url: url },
        tag: payload.data?.shopId || 'default',
        requireInteraction: true,
        vibrate: [200, 100, 200, 100, 200],
        silent: false
      });
    });

    self.addEventListener('install', () => self.skipWaiting());
    self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

    self.addEventListener('notificationclick', (event) => {
      event.notification.close();
      const url = event.notification.data?.url || '/';

      event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
          for (const client of clientList) {
            if (client.url.includes(url) && 'focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(url);
          }
        })
      );
    });
  `;

  return new NextResponse(swScript, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
