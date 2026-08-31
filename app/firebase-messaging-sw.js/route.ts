import { NextResponse } from 'next/server';

export async function GET() {
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
      
      const title = payload.data?.title || 'プッシュ太郎';
      const body = payload.data?.body || '';
      const image = payload.data?.image;
      const url = payload.data?.url || '/';
      
      self.registration.showNotification(title, {
        body: body,
        icon: '/icon-192x192.png',
        image: image,
        data: { url: url },
        tag: payload.data?.shopId || 'default',
        requireInteraction: false,
      });
    });

    self.addEventListener('install', () => self.skipWaiting());
    self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

    self.addEventListener('notificationclick', (event) => {
      event.notification.close();
      const url = event.notification.data?.url || '/';
      event.waitUntil(self.clients.openWindow(url));
    });
  `;

  return new NextResponse(swScript, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
