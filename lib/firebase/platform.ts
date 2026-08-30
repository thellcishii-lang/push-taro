// lib/firebase/platform.ts
export type Platform = 'ios' | 'android' | 'web' | 'unknown';

export function detectPlatform(): Platform {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'web';
}

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (window.navigator as any).standalone === true;
}

export function getPlatformRequirements(): { 
  needsHomeScreenAdd: boolean; 
  message?: string;
} {
  if (detectPlatform() === 'ios' && !isStandalone()) {
    return {
      needsHomeScreenAdd: true,
      message: '📱 iPhoneでは「ホーム画面に追加」が必要です。\n\nSafariの「共有」→「ホーム画面に追加」を実行してください。'
    };
  }
  return { needsHomeScreenAdd: false };
}
