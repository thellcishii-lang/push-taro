// lib/firebase/sw-manager.ts
let swRegistration: ServiceWorkerRegistration | null = null;

export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (swRegistration) return swRegistration;
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return null;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const reg of registrations) {
      if (reg.active && reg.active.scriptURL.includes('firebase-messaging-sw')) {
        swRegistration = reg;
        return reg;
      }
    }
    return null;
  } catch (err) {
    console.error('[SW] getRegistrations error:', err);
    return null;
  }
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const existing = await getServiceWorkerRegistration();
    if (existing) return existing;

    const registration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js',
      { scope: '/', updateViaCache: 'none' }
    );
    
    swRegistration = registration;
    return registration;
  } catch (err) {
    console.error('[SW] Registration failed:', err);
    return null;
  }
}

export async function waitForServiceWorkerActivation(registration: ServiceWorkerRegistration): Promise<boolean> {
  return new Promise((resolve) => {
    if (registration.active) { resolve(true); return; }
    if (registration.installing) {
      registration.installing.addEventListener('statechange', (e: any) => {
        if (e.target.state === 'activated') resolve(true);
      });
    } else {
      setTimeout(() => resolve(false), 5000);
    }
  });
}
