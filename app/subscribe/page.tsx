'use client';

import { useState, useEffect, useRef } from 'react';
import { requestFCMToken } from '../../lib/firebase-client';
import { firebaseApp } from '../../lib/firebase-client';
import { getMessaging, isSupported, onMessage } from 'firebase/messaging';
import { QRCodeSVG } from 'qrcode.react';
import { auth } from '../../lib/firebase-client';
import { ConfirmationResult, onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export default function SubscribePage() {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [shopId, setShopId] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  
  const [isRegistered, setIsRegistered] = useState(false);
  const [fcmToken, setFcmToken] = useState('');
  const [shopData, setShopData] = useState<any>(null);

  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [savedBirthMonth, setSavedBirthMonth] = useState<number | null>(null);
  const [savedBirthDay, setSavedBirthDay] = useState<number | null>(null);
  const [birthdaySetStatus, setBirthdaySetStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [birthdaySetMessage, setBirthdaySetMessage] = useState('');
  const [historyTab, setHistoryTab] = useState<'notifications' | 'coupons'>('notifications');
  const [couponUsed, setCouponUsed] = useState(false);
  const [couponExpired, setCouponExpired] = useState(false);
  const [normalCouponUsed, setNormalCouponUsed] = useState(false);
  const [normalCouponExpired, setNormalCouponExpired] = useState(false);
  const [loyaltyCouponAvailable, setLoyaltyCouponAvailable] = useState(false);
  const [loyaltyCouponExpired, setLoyaltyCouponExpired] = useState(false);
  const [loyaltyAchievedAt, setLoyaltyAchievedAt] = useState<string | null>(null);
  const [stepUpIndex, setStepUpIndex] = useState(0);
  const [stepUpIndexAppearedAt, setStepUpIndexAppearedAt] = useState<string | null>(null);
  const [repeatCouponActiveUntil, setRepeatCouponActiveUntil] = useState<string | null>(null);
  const [repeatCouponUsedToday, setRepeatCouponUsedToday] = useState(false);
  const [birthdayCouponAvailable, setBirthdayCouponAvailable] = useState(false);
  const [birthdayCouponUsed, setBirthdayCouponUsed] = useState(false);
  const [dormantCouponAvailable, setDormantCouponAvailable] = useState(false);
  const [dormantCouponUsed, setDormantCouponUsed] = useState(false);
  const [dormantNotifiedAt, setDormantNotifiedAt] = useState<string | null>(null);
  const [scheduledCouponUsedIds, setScheduledCouponUsedIds] = useState<string[]>([]);
  const [hiddenCouponTypes, setHiddenCouponTypes] = useState<string[]>([]);
  const [customerUid, setCustomerUid] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [phoneAuthLoading, setPhoneAuthLoading] = useState(false);

  // 📜 通知履歴用ステート
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [displayCount, setDisplayCount] = useState<number>(10);
  const [couponHistory, setCouponHistory] = useState<Array<{ id: string; title: string; usedAt: string | null }>>([]);
  const [couponHistoryLoaded, setCouponHistoryLoaded] = useState(false);
  const [couponStatusVersion, setCouponStatusVersion] = useState(0);
  const lastCouponStatus = useRef('');
  const [couponHistoryError, setCouponHistoryError] = useState('');
  const [couponHistoryLoading, setCouponHistoryLoading] = useState(false);
  const sessionCache = useRef<{ shopId: string; fcmToken: string; token: string } | null>(null);
  const [couponStatusLoaded, setCouponStatusLoaded] = useState(false);
  const [couponStatusError, setCouponStatusError] = useState('');

  // FCMトークンからセッショントークンを取得（期限付き・URLに載せても安全）
  const ensureSessionToken = async (): Promise<string> => {
    const cached = sessionCache.current;
    if (cached?.shopId === shopId && cached.fcmToken === fcmToken) return cached.token;
    if (!fcmToken || !shopId) return '';
    try {
      const res = await fetch('/api/customer-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: fcmToken, shopId }),
      });
      const data = await res.json();
      if (res.ok && data.sessionToken) {
        sessionCache.current = { shopId, fcmToken, token: data.sessionToken };
        return data.sessionToken;
      }
      throw new Error(data.error || 'セッショントークンを取得できませんでした');
    } catch (err) {
      console.error('セッショントークン取得エラー:', err);
    }
    return '';
  };

  const loadCouponHistory = async () => {
    if (!shopId || !fcmToken) return;
    setCouponHistoryLoading(true);
    setCouponHistoryError('');
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const session = await ensureSessionToken();
      const tokenParam = session || fcmToken;
      const response = await fetch(`/api/coupon-history?shopId=${encodeURIComponent(shopId)}&token=${encodeURIComponent(tokenParam)}`, {
        headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '履歴を取得できませんでした');
      setCouponHistory(data.histories);
      setCouponHistoryLoaded(true);
    } catch (error) {
      setCouponHistoryError(error instanceof Error ? error.message : '履歴を取得できませんでした');
    } finally {
      setCouponHistoryLoading(false);
    }
  };

  useEffect(() => onAuthStateChanged(auth, (user) => {
    setCustomerUid(user?.uid || '');
  }), []);

  const normalizePhoneNumber = (value: string): string => {
    const compact = value
      .replace(/[０-９]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0xfee0))
      .replace(/[\s().-]/g, '');
    if (compact.startsWith('00')) return `+${compact.slice(2)}`;
    if (compact.startsWith('0')) return `+81${compact.slice(1)}`;
    if (compact.startsWith('81')) return `+${compact}`;
    return compact;
  };

  // 1. IndexedDB から通知履歴を取得する関数
  const loadNotificationHistory = () => {
    if (typeof window === 'undefined') return;
    const request = indexedDB.open('PushTaroDB', 3);
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      const upgradeTransaction = e.target.transaction;
      if (!db.objectStoreNames.contains('notifications')) {
        const store = db.createObjectStore('notifications', { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
      if (!db.objectStoreNames.contains('history')) {
        const history = db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
        history.createIndex('sentAt', 'sentAt', { unique: false });
      } else if (!upgradeTransaction.objectStore('history').indexNames.contains('sentAt')) {
        upgradeTransaction.objectStore('history').createIndex('sentAt', 'sentAt', { unique: false });
      }
    };

    request.onsuccess = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('notifications')) return;

      const tx = db.transaction('notifications', 'readonly');
      const store = tx.objectStore('notifications');
      const getAllReq = store.getAll();

      getAllReq.onsuccess = () => {
        const items = getAllReq.result || [];
        // 降順（新しい順）に並び替え
        items.sort((a: any, b: any) => b.timestamp - a.timestamp);
        setHistoryList(items);
      };
    };
  };

  // 2. URLから shopId を抽出
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let detectedId = '';
    try {
      const searchParams = new URLSearchParams(window.location.search);
      detectedId = searchParams.get('s') || searchParams.get('shopid') || '';

      if (!detectedId && window.location.href.includes('?')) {
        const fullUrl = new URL(window.location.href);
        detectedId = fullUrl.searchParams.get('s') || fullUrl.searchParams.get('shopid') || '';
      }

      if (!detectedId) {
        const saved = localStorage.getItem('push_taro_shop_id');
        if (saved && saved !== 'undefined' && saved !== 'null') {
          detectedId = saved;
        }
      }

      if (detectedId && detectedId !== 'undefined' && detectedId !== 'null') {
        const cleanId = detectedId.trim();
        setShopId(cleanId);
        localStorage.setItem('push_taro_shop_id', cleanId);
      }
    } catch (e) {
      console.error('ID取得例外:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 3. 店舗情報取得 & 顧客ステータス取得
useEffect(() => {
  if (!shopId) return;

  fetch(`/api/shop-info?s=${shopId}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setShopData(data);
      }
    })
    .catch(err => console.error('店舗情報通信エラー:', err));

  if (typeof window !== 'undefined') {
    const savedToken = localStorage.getItem(`push_taro_token_${shopId}`);
    if (savedToken) {
      setFcmToken(savedToken);
      setIsRegistered(true);

    }
    loadNotificationHistory();
  }
}, [shopId]);

  useEffect(() => {
    const expiresAt = shopData?.coupon?.expiresAt;
    setCouponExpired(Boolean(expiresAt && new Date(`${expiresAt}T23:59:59`).getTime() < Date.now()));
    const normalExpiresAt = shopData?.normalCoupon?.expiresAt;
    setNormalCouponExpired(Boolean(normalExpiresAt && new Date(`${normalExpiresAt}T23:59:59`).getTime() < Date.now()));
    const loyalty = shopData?.loyaltyCoupon;
    const loyaltyExpiredAt = loyalty?.expireType === 'date' ? loyalty.expireDate : '';
    const loyaltyExpiresByDate = Boolean(loyaltyExpiredAt && new Date(`${loyaltyExpiredAt}T23:59:59`).getTime() < Date.now());
    const loyaltyExpiresByDays = loyalty?.expireType === 'days' && loyaltyAchievedAt
      ? new Date(loyaltyAchievedAt).getTime() + Math.max(1, Number(loyalty.expireDays) || 1) * 24 * 60 * 60 * 1000 < Date.now()
      : false;
    setLoyaltyCouponExpired(loyaltyExpiresByDate || loyaltyExpiresByDays);
  }, [shopData, loyaltyAchievedAt]);

  useEffect(() => {
    if (!shopId) return;
    const saved = localStorage.getItem(`push_taro_hidden_coupons_${shopId}`);
    setHiddenCouponTypes(saved ? JSON.parse(saved) : []);
  }, [shopId]);

  const hideCoupon = (couponType: string) => {
    const next = Array.from(new Set([...hiddenCouponTypes, couponType]));
    setHiddenCouponTypes(next);
    localStorage.setItem(`push_taro_hidden_coupons_${shopId}`, JSON.stringify(next));
  };

  useEffect(() => {
    if (!shopId || !fcmToken || !isRegistered) return;

    let disposed = false;
    let unsubscribeMessage: (() => void) | undefined;
    void (async () => {
      if (!await isSupported() || disposed) return;
      const messaging = getMessaging(firebaseApp);
      unsubscribeMessage = onMessage(messaging, async (payload) => {
        const title = payload.data?.title || payload.notification?.title || '新着通知';
        const body = payload.data?.body || payload.notification?.body || '';
        const rawUrl = payload.data?.url || payload.data?.linkUrl || '/';
        const url = new URL(rawUrl, window.location.origin).toString();
        const notificationId = payload.data?.notificationId || '';
        const openToken = payload.data?.openToken || '';
        if (notificationId && openToken) {
          await fetch('/api/notification-open', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              notificationId,
              openToken,
              openReceiptId: crypto.randomUUID(),
              eventType: 'opened',
            }),
          }).catch(() => undefined);
        }
        const request = indexedDB.open('PushTaroDB', 3);
        request.onsuccess = (event: any) => {
          const historyDb = event.target.result;
          if (!historyDb.objectStoreNames.contains('notifications')) return;
          const transaction = historyDb.transaction('notifications', 'readwrite');
          transaction.objectStore('notifications').add({ title, body, url, timestamp: Date.now() });
          transaction.oncomplete = () => historyDb.close();
        };
      });
    })().catch((error) => console.error('通知受信の初期化エラー:', error));

    return () => {
      disposed = true;
      unsubscribeMessage?.();
    };
  }, [shopId, fcmToken, isRegistered]);

  // 通知機能の対応状況にかかわらず、店舗での消し込みを反映する。
  useEffect(() => {
    if (!shopId || !fcmToken || !isRegistered) return;

    let disposed = false;
    let refreshing = false;
    let retryAt = 0;
    setCouponStatusLoaded(false);
    setCouponStatusError('');

    const refreshCouponStatus = async () => {
      if (refreshing || Date.now() < retryAt) return;
      refreshing = true;
      try {
        const session = await ensureSessionToken();
        const tokenParam = session || fcmToken;
        const res = await fetch(
          `/api/subscribe-status?shopId=${encodeURIComponent(shopId)}&token=${encodeURIComponent(tokenParam)}`,
          { cache: 'no-store' },
        );
        if (res.status === 429) {
          retryAt = Date.now() + Math.max(10, Number(res.headers.get('Retry-After')) || 60) * 1000;
        }
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'クーポン状態を取得できませんでした');
        if (!disposed) {
          setCouponUsed(Boolean(data.firstCouponUsed || data.couponUsed));
          setNormalCouponUsed(data.normalCouponUsed === true);
          setLoyaltyCouponAvailable(data.loyaltyCouponAvailable === true);
          setLoyaltyAchievedAt(data.loyaltyAchievedAt || null);
          setStepUpIndex(data.stepUpIndex || 0);
          setStepUpIndexAppearedAt(data.stepUpIndexAppearedAt || null);
          setRepeatCouponActiveUntil(data.repeatCouponActiveUntil || null);
          setRepeatCouponUsedToday(data.repeatCouponUsed === true);
          setBirthdayCouponAvailable(String(data.birthdayNotifiedYear) === String(new Date().getFullYear()));
          setBirthdayCouponUsed(data.birthdayCouponUsed === true);
          setDormantCouponAvailable(Boolean(data.dormantNotifiedAt));
          setDormantCouponUsed(data.dormantCouponUsed === true);
          setDormantNotifiedAt(data.dormantNotifiedAt || null);
          setScheduledCouponUsedIds(data.scheduledCouponUsedIds || []);
          setSavedBirthMonth(data.birthMonth || null);
          setSavedBirthDay(data.birthDay || null);
          setCouponStatusLoaded(true);
          setCouponStatusError('');
          const statusSignature = JSON.stringify(data);
          if (statusSignature !== lastCouponStatus.current) {
            lastCouponStatus.current = statusSignature;
            setCouponStatusVersion((version) => version + 1);
          }
        }
      } catch (err) {
        console.error('クーポン状態の自動更新エラー:', err);
        if (!disposed) setCouponStatusError('クーポンの使用状況を確認できません。通信状況を確認してください。自動で再試行します。');
      } finally {
        refreshing = false;
      }
    };

    void refreshCouponStatus();
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshCouponStatus();
      }
    }, 10_000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshCouponStatus();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);
    
    return () => {
      disposed = true;
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, [shopId, fcmToken, isRegistered]);

  // クーポン使用履歴タブ表示中は、店舗での消し込みを検知したら履歴も再取得する。
  useEffect(() => {
    if (historyTab === 'coupons' && isRegistered && fcmToken) void loadCouponHistory();
  }, [historyTab, couponStatusVersion, isRegistered, fcmToken]);

  // 4. 動的 PWA Manifest & iPhone用メタタグの適用
  useEffect(() => {
    if (typeof window === 'undefined' || !shopId) return;

    // ① Manifest リンクのセット [source: 3]
    let link = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'manifest';
      document.head.appendChild(link);
    }
    link.href = `/manifest/${shopId}`;

    // ② iPhone用 ホーム画面アイコン（apple-touch-icon）の動的セット
    if (shopData?.iconUrl) {
      let appleIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
      if (!appleIcon) {
        appleIcon = document.createElement('link');
        appleIcon.rel = 'apple-touch-icon';
        document.head.appendChild(appleIcon);
      }
      appleIcon.href = shopData.iconUrl;
    }

    // ③ iPhone用 ホーム画面追加時の名前（apple-mobile-web-app-title）の動的セット
    if (shopData?.name) {
      let appleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]') as HTMLMetaElement;
      if (!appleTitle) {
        appleTitle = document.createElement('meta');
        appleTitle.name = 'apple-mobile-web-app-title';
        document.head.appendChild(appleTitle);
      }
      appleTitle.content = shopData.name;
    }
  }, [shopId, shopData]);

  // 🔔 登録ボタン押下処理
  const handleSendVerificationCode = async () => {
    if (!phoneNumber.trim()) {
      setStatus('error');
      setMessage('電話番号を入力してください。');
      return;
    }

    const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
    if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhoneNumber)) {
      setStatus('error');
      setMessage('電話番号は09012345678、または+819012345678の形式で入力してください。');
      return;
    }

    setPhoneAuthLoading(true);
    setMessage('');
    try {
      const previousVerifier = (window as any).__phoneRecaptchaVerifier as RecaptchaVerifier | undefined;
      previousVerifier?.clear();
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'normal' });
      (window as any).__phoneRecaptchaVerifier = verifier;
      const result = await signInWithPhoneNumber(auth, normalizedPhoneNumber, verifier);
      setConfirmationResult(result);
      setStatus('idle');
      setMessage('SMSで届いた認証コードを入力してください。');
    } catch (error: any) {
      setStatus('error');
      console.error('[phone-auth] SMS送信失敗:', error);
      setMessage(`認証コードの送信に失敗しました（${error.code || 'unknown'}）。Firebase Authenticationで電話番号ログインを有効にしてください。`);
    } finally {
      setPhoneAuthLoading(false);
    }
  };

  const handleConfirmVerificationCode = async () => {
    if (!confirmationResult || !verificationCode.trim()) return;

    setPhoneAuthLoading(true);
    try {
      const result = await confirmationResult.confirm(verificationCode.trim());
      setCustomerUid(result.user.uid);
      setConfirmationResult(null);
      setMessage('電話番号の認証が完了しました。通知登録を続けます。');
    } catch (error: any) {
      setStatus('error');
      console.error('[phone-auth] コード確認失敗:', error);
      setMessage(`認証コードが正しくありません（${error.code || 'unknown'}）。`);
    } finally {
      setPhoneAuthLoading(false);
    }
  };

  const handleSetBirthday = async () => {
    if (!birthMonth || !birthDay) {
      setBirthdaySetStatus('error');
      setBirthdaySetMessage('誕生日または記念日の月日を選択してください。');
      return;
    }

    setBirthdaySetStatus('saving');
    setBirthdaySetMessage('');

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('電話番号認証が必要です');
      }

      const res = await fetch('/api/set-birthday', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await currentUser.getIdToken()}`,
        },
        body: JSON.stringify({ token: fcmToken, birthMonth, birthDay }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      setSavedBirthMonth(data.birthMonth);
      setSavedBirthDay(data.birthDay);
      setBirthdaySetStatus('idle');
      setBirthdaySetMessage('');
    } catch (err: any) {
      setBirthdaySetStatus('error');
      setBirthdaySetMessage('❌ ' + err.message);
    }
  };

  const handleSubscribe = async () => {
    let effectiveShopId = shopId;

    if (!customerUid) {
      setStatus('error');
      setMessage('電話番号の認証を完了してください。');
      return;
    }

    if (!effectiveShopId && typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      effectiveShopId = searchParams.get('s') || localStorage.getItem('push_taro_shop_id') || '';
    }

    if (!effectiveShopId) {
      setStatus('error');
      setMessage('❌ 店舗IDが取得できていません。URLの末尾に ?s=店舗ID がついているかご確認ください。');
      return;
    }

    const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = typeof window !== 'undefined' && ((window.navigator as any).standalone === true || window.matchMedia('(display-mode: standalone)').matches);

    if (isIOS && !isStandalone) {
      setStatus('error');
      setMessage(
        '📱 iPhoneではWeb通知の受け取りに「ホーム画面に追加」が必要です。\n\n' +
        '1. Safari下部の「共有ボタン（□に↑）」をタップ\n' +
        '2. 「ホーム画面に追加」を選択\n' +
        '3. ホーム画面に作成されたアイコンから開いて再操作してください。'
      );
      return;
    }

    setStatus('requesting');
    setMessage('');

    try {
      const deviceIdKey = 'push_taro_device_id';
      let deviceId = localStorage.getItem(deviceIdKey);
      if (!deviceId) {
        deviceId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        localStorage.setItem(deviceIdKey, deviceId);
      }
      const customerIdKey = 'push_taro_customer_id';
      let customerId = localStorage.getItem(customerIdKey);
      if (!customerId) {
        customerId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        localStorage.setItem(customerIdKey, customerId);
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setStatus('error');
        setMessage('❌ 通知が拒否されました。ブラウザの設定から通知を許可してください。');
        return;
      }

      let token: string | null = '';
      try {
        token = await requestFCMToken({
          shopName: shopData?.name || 'Push-taro',
          iconUrl: shopData?.iconUrl || '/icon-192x192.png',
        });
      } catch (fcmErr: any) {
        throw new Error(`FCMトークン取得エラー: ${fcmErr.message || fcmErr}`);
      }

      if (!token) {
        setStatus('error');
        setMessage('❌ トークンの発行に失敗しました。');
        return;
      }

      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(auth.currentUser ? { Authorization: `Bearer ${await auth.currentUser.getIdToken()}` } : {}),
        },
        body: JSON.stringify({
          token,
          shopId: effectiveShopId,
          deviceId,
          customerId,
          customerUid,
        }),
      });

      const resData = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(resData.error || `HTTP ${res.status}`);
      }

      localStorage.setItem(`push_taro_token_${effectiveShopId}`, token);
      setFcmToken(token);
      setStatus('success');
      setMessage('✨ 通知の受け取りが完了しました！');

      setTimeout(() => {
        setIsRegistered(true);
        loadNotificationHistory();
      }, 2000);

    } catch (err: any) {
      setStatus('error');
      setMessage('❌ ' + err.message);
    }
  };

  if (!isLoaded || (shopId && !shopData)) {
  return (
    <main style={{ padding: 24, textAlign: 'center', fontFamily: 'sans-serif' }}>
      <p>読み込み中...</p>
    </main>
  );
}

  // 📱 【登録完了画面】
  if (isRegistered) {
    return (
      <main style={{ padding: 20, maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif' }}>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{ marginBottom: '16px', padding: '8px 14px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#334155', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ↻ 画面を更新
        </button>
        <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '20px' }}>
          {shopData?.iconUrl && (
  <img
    src={shopData.iconUrl}
    alt={shopData?.name || '店舗アイコン'}
    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px auto' }}
  />
)}
<h2 style={{ margin: '0 0 8px 0' }}>{shopData?.name}</h2>
          {shopData?.linkUrl && (
            <a href={shopData.linkUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '10px 18px', background: '#2563eb', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
              🌐 サイトはこちらから
            </a>
          )}
        </div>

        {/* � 記念日・誕生日設定エリア（PROプランのみ／一度設定すると変更不可） */}
        {shopData?.plan === 'pro' && (
          <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#9a3412' }}>🎂 記念日・誕生日設定</h3>
            {savedBirthMonth && savedBirthDay ? (
              <p style={{ margin: 0, fontSize: '14px', color: '#334155' }}>
                記念日・誕生日設定月日: <strong>{savedBirthMonth}月{savedBirthDay}日</strong>
              </p>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <select value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)} style={{ flex: 1, padding: '12px', fontSize: '16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}>
                    <option value="">月</option>
                    {Array.from({ length: 12 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}月</option>)}
                  </select>
                  <select value={birthDay} onChange={(e) => setBirthDay(e.target.value)} style={{ flex: 1, padding: '12px', fontSize: '16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}>
                    <option value="">日</option>
                    {Array.from({ length: 31 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}日</option>)}
                  </select>
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#c2410c', fontWeight: 'bold' }}>
                  ⚠️ 一度設定すると後から変更できませんのでご注意ください。
                </p>
                <button
                  type="button"
                  onClick={handleSetBirthday}
                  disabled={birthdaySetStatus === 'saving'}
                  style={{ width: '100%', padding: '10px', fontSize: '14px', background: birthdaySetStatus === 'saving' ? '#cbd5e1' : '#ea580c', color: '#fff', border: 'none', borderRadius: '6px', cursor: birthdaySetStatus === 'saving' ? 'wait' : 'pointer', fontWeight: 'bold' }}
                >
                  {birthdaySetStatus === 'saving' ? '設定中...' : '設定する'}
                </button>
                {birthdaySetMessage && (
                  <p style={{ marginTop: '8px', fontSize: '12px', color: '#dc2626' }}>{birthdaySetMessage}</p>
                )}
              </>
            )}
          </div>
        )}

        {couponStatusError && <p role="alert" style={{ color: '#dc2626' }}>{couponStatusError}</p>}
        {!couponStatusLoaded && !couponStatusError && <p>クーポンの使用状況を確認中...</p>}
        {couponStatusLoaded && !couponStatusError && <>
        {/* �🎁 初回限定クーポンエリア */}
{shopData?.coupon?.enabled && !couponUsed && !hiddenCouponTypes.includes('first') && (
  <div style={{ background: couponExpired ? '#f1f5f9' : '#fff3e0', border: couponExpired ? '1px solid #cbd5e1' : '1px dashed #ffb74d', padding: '16px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
    <span style={{ fontSize: '11px', background: couponExpired ? '#64748b' : '#e65100', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>初回限定</span>
    <h3 style={{ margin: '6px 0 8px 0', color: couponExpired ? '#64748b' : '#e65100' }}>
      🎁 {shopData.coupon.title || '初回限定クーポン'}
    </h3>

    {shopData.coupon.expiresAt && (
      <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px' }}>有効期限: {shopData.coupon.expiresAt}</p>
    )}

    {couponExpired ? (
      <div style={{ padding: '12px', background: '#e2e8f0', borderRadius: '6px', color: '#475569', fontWeight: 'bold', fontSize: '14px', marginTop: '10px' }}>
        ⚠️ こちらのクーポンは有効期限切れです
      </div>
    ) : (
      <>
        <p style={{ fontSize: '13px', color: '#333', marginBottom: '12px' }}>{shopData.coupon.description}</p>
        <div style={{ background: '#fff', padding: '10px', display: 'inline-block', borderRadius: '6px', marginBottom: '8px' }}>
          <QRCodeSVG value={JSON.stringify({ shopId, couponType: 'first', token: fcmToken })} size={150} />
        </div>
        <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>会計時にこちらのQRコードをスタッフにご提示ください</p>
      </>
    )}
  </div>
)}

{/* 🎟️ 常設：通常クーポンエリア（STANDARD / PRO プラン限定） */}
{shopData?.normalCoupon?.enabled && !hiddenCouponTypes.includes(`normal:${shopData.normalCoupon.couponId || 'legacy'}`) && (
  <div style={{ background: normalCouponUsed || normalCouponExpired ? '#f1f5f9' : '#f0fdf4', border: normalCouponUsed || normalCouponExpired ? '1px solid #cbd5e1' : '1px dashed #4ade80', padding: '16px', borderRadius: '8px', marginBottom: '25px', textAlign: 'center' }}>
    <span style={{ fontSize: '11px', background: normalCouponUsed || normalCouponExpired ? '#64748b' : '#16a34a', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>通常クーポン</span>
    <h3 style={{ margin: '6px 0 8px 0', color: normalCouponUsed || normalCouponExpired ? '#64748b' : '#15803d' }}>
      🎟️ {shopData.normalCoupon.title || '通常クーポン'}
    </h3>
    {shopData.normalCoupon.expiresAt && (
      <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px' }}>有効期限: {shopData.normalCoupon.expiresAt}</p>
    )}
    {normalCouponUsed ? (
      <div style={{ padding: '12px', background: '#e2e8f0', borderRadius: '6px', color: '#475569', fontSize: '14px', marginTop: '10px' }}>
        <strong>✅ こちらのクーポンは使用済みです</strong>
        <button type="button" onClick={() => hideCoupon(`normal:${shopData.normalCoupon.couponId || 'legacy'}`)} style={{ display: 'block', margin: '10px auto 0', padding: '7px 12px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>削除</button>
      </div>
    ) : normalCouponExpired ? (
      <div style={{ padding: '12px', background: '#e2e8f0', borderRadius: '6px', color: '#475569', fontWeight: 'bold', fontSize: '14px', marginTop: '10px' }}>⚠️ こちらのクーポンは有効期限切れです</div>
    ) : (
      <>
        <p style={{ fontSize: '13px', color: '#333', marginBottom: '12px' }}>{shopData.normalCoupon.description}</p>
        <div style={{ background: '#fff', padding: '10px', display: 'inline-block', borderRadius: '6px', marginBottom: '8px' }}>
          <QRCodeSVG value={JSON.stringify({ shopId, couponType: 'normal', token: fcmToken })} size={150} />
        </div>
        <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>会計時にこちらのQRコードをスタッフにご提示ください</p>
      </>
    )}
  </div>
)}
{shopData?.proCoupons?.birthday?.enabled && birthdayCouponAvailable && !hiddenCouponTypes.includes('birthday') && (
  <div style={{ background: birthdayCouponUsed ? '#f1f5f9' : '#fff7ed', border: birthdayCouponUsed ? '1px solid #cbd5e1' : '1px dashed #fb923c', padding: '16px', borderRadius: '8px', marginBottom: '25px', textAlign: 'center' }}>
    <span style={{ fontSize: '11px', background: birthdayCouponUsed ? '#64748b' : '#ea580c', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>記念日、お誕生日クーポン</span>
    <h3 style={{ margin: '6px 0 8px 0', color: birthdayCouponUsed ? '#64748b' : '#c2410c' }}>🎂 {shopData.proCoupons.birthday.title || '記念日、お誕生日クーポン'}</h3>
    {birthdayCouponUsed ? (
      <div style={{ padding: '12px', background: '#e2e8f0', borderRadius: '6px', color: '#475569', fontSize: '14px', marginTop: '10px' }}>
        <strong>✅ こちらのクーポンは使用済みです</strong>
        <button type="button" onClick={() => hideCoupon('birthday')} style={{ display: 'block', margin: '10px auto 0', padding: '7px 12px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>削除</button>
      </div>
    ) : <>
      <p style={{ fontSize: '13px', color: '#333', marginBottom: '12px' }}>{shopData.proCoupons.birthday.message || '特別な日のクーポンです。'}</p>
      <div style={{ background: '#fff', padding: '10px', display: 'inline-block', borderRadius: '6px', marginBottom: '8px' }}>
        <QRCodeSVG value={JSON.stringify({ shopId, couponType: 'birthday', token: fcmToken })} size={150} />
      </div>
      <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>会計時にこちらのQRコードをスタッフにご提示ください</p>
    </>}
  </div>
)}
{shopData?.proCoupons?.dormant?.enabled && dormantCouponAvailable && !hiddenCouponTypes.includes('dormant') && (
  <div style={{ background: dormantCouponUsed ? '#f1f5f9' : '#f8fafc', border: dormantCouponUsed ? '1px solid #cbd5e1' : '1px dashed #94a3b8', padding: '16px', borderRadius: '8px', marginBottom: '25px', textAlign: 'center' }}>
    <span style={{ fontSize: '11px', background: '#64748b', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>休眠復活クーポン</span>
    <h3 style={{ margin: '6px 0 8px 0', color: '#475569' }}>💤 {shopData.proCoupons.dormant.title || '復帰クーポン'}</h3>
    <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px' }}>有効期限: {dormantNotifiedAt ? new Date(new Date(dormantNotifiedAt).getTime() + Math.max(1, Number(shopData.proCoupons.dormant.expireDays) || 14) * 24 * 60 * 60 * 1000).toLocaleDateString('ja-JP') : `配信から ${Math.max(1, Number(shopData.proCoupons.dormant.expireDays) || 14)} 日間`}</p>
    {dormantCouponUsed ? (
      <div style={{ padding: '12px', background: '#e2e8f0', borderRadius: '6px', color: '#475569', fontSize: '14px', marginTop: '10px' }}>
        <strong>✅ こちらのクーポンは使用済みです</strong>
        <button type="button" onClick={() => hideCoupon('dormant')} style={{ display: 'block', margin: '10px auto 0', padding: '7px 12px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>削除</button>
      </div>
    ) : <>
      <p style={{ fontSize: '13px', color: '#333', marginBottom: '12px' }}>{shopData.proCoupons.dormant.message || 'お久しぶりの方限定クーポンです。'}</p>
      <div style={{ background: '#fff', padding: '10px', display: 'inline-block', borderRadius: '6px', marginBottom: '8px' }}>
        <QRCodeSVG value={JSON.stringify({ shopId, couponType: 'dormant', token: fcmToken })} size={150} />
      </div>
      <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>会計時にこちらのQRコードをスタッフにご提示ください</p>
    </>}
  </div>
)}
{(shopData?.scheduledCoupons || []).filter((coupon: any) => (!coupon.expiresAt || new Date(coupon.expiresAt).getTime() >= Date.now()) && !hiddenCouponTypes.includes(`scheduled:${coupon.id}`)).map((coupon: any) => {
  const used = scheduledCouponUsedIds.includes(coupon.id);
  return (
    <div key={coupon.id} style={{ background: used ? '#f1f5f9' : '#fefce8', border: used ? '1px solid #cbd5e1' : '1px dashed #eab308', padding: '16px', borderRadius: '8px', marginBottom: '25px', textAlign: 'center' }}>
      <span style={{ fontSize: '11px', background: used ? '#64748b' : '#ca8a04', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>予約クーポン</span>
      <h3 style={{ margin: '6px 0 8px 0', color: used ? '#64748b' : '#854d0e' }}>🎫 {coupon.title || '予約クーポン'}</h3>
      {coupon.expiresAt && <p style={{ fontSize: '12px', color: '#64748b' }}>有効期限: {new Date(coupon.expiresAt).toLocaleDateString('ja-JP')}</p>}
      {used ? (
        <div style={{ padding: '12px', background: '#e2e8f0', borderRadius: '6px', color: '#475569', fontWeight: 'bold' }}>
          <strong>✅ こちらのクーポンは使用済みです</strong>
          <button type="button" onClick={() => hideCoupon(`scheduled:${coupon.id}`)} style={{ display: 'block', margin: '10px auto 0', padding: '7px 12px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>削除</button>
        </div>
      ) : (
        <>
          <p style={{ fontSize: '13px', color: '#333', marginBottom: '12px' }}>{coupon.body}</p>
          <div style={{ background: '#fff', padding: '10px', display: 'inline-block', borderRadius: '6px', marginBottom: '8px' }}>
            <QRCodeSVG value={JSON.stringify({ shopId, couponType: 'scheduled', couponId: coupon.id, token: fcmToken })} size={150} />
          </div>
          <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>会計時にこちらのQRコードをスタッフにご提示ください</p>
        </>
      )}
    </div>
  );
})}
{shopData?.proCoupons?.stepUp?.enabled && shopData.proCoupons.stepUp.steps?.[stepUpIndex] && !hiddenCouponTypes.includes(`step-up:${shopData.proCoupons.stepUp.campaignId || 'legacy'}`) && (
  <div style={{ background: '#f5f3ff', border: '1px dashed #8b5cf6', padding: '16px', borderRadius: '8px', marginBottom: '25px', textAlign: 'center' }}>
    <span style={{ fontSize: '11px', background: '#7c3aed', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>ステップアップクーポン</span>
    <h3 style={{ margin: '6px 0 8px 0', color: '#6d28d9' }}>🐾 {shopData.proCoupons.stepUp.steps[stepUpIndex].title || `ステップ${stepUpIndex + 1}`}</h3>
    {shopData.proCoupons.stepUp.steps[stepUpIndex].expireType === 'date' && shopData.proCoupons.stepUp.steps[stepUpIndex].expireDate && <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px' }}>有効期限: {shopData.proCoupons.stepUp.steps[stepUpIndex].expireDate}</p>}
    {shopData.proCoupons.stepUp.steps[stepUpIndex].expireType === 'days' && <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px' }}>有効期限: {stepUpIndexAppearedAt ? new Date(new Date(stepUpIndexAppearedAt).getTime() + Math.max(1, Number(shopData.proCoupons.stepUp.steps[stepUpIndex].expireDays) || 1) * 24 * 60 * 60 * 1000).toLocaleDateString('ja-JP') : `出現から ${Math.max(1, Number(shopData.proCoupons.stepUp.steps[stepUpIndex].expireDays) || 1)} 日間`}</p>}
    <p style={{ fontSize: '13px', color: '#333', marginBottom: '12px' }}>ステップ {stepUpIndex + 1} の特典です。</p>
    <div style={{ background: '#fff', padding: '10px', display: 'inline-block', borderRadius: '6px', marginBottom: '8px' }}>
      <QRCodeSVG value={JSON.stringify({ shopId, couponType: 'step-up', token: fcmToken })} size={150} />
    </div>
    <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>会計時にこちらのQRコードをスタッフにご提示ください</p>
  </div>
)}
{shopData?.proCoupons?.repeat?.enabled && !hiddenCouponTypes.includes(`repeat:${shopData.proCoupons.repeat.campaignId || 'legacy'}`) && (
  <div style={{ background: '#eff6ff', border: '1px dashed #0ea5e9', padding: '16px', borderRadius: '8px', marginBottom: '25px', textAlign: 'center' }}>
    <span style={{ fontSize: '11px', background: '#0284c7', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>連続クーポン</span>
    <h3 style={{ margin: '6px 0 8px 0', color: '#0369a1' }}>🔄 {shopData.proCoupons.repeat.title || '連続クーポン'}</h3>
    {shopData.proCoupons.repeat.expireType === 'date' && shopData.proCoupons.repeat.expireDate && <p style={{ fontSize: '12px', color: '#64748b' }}>有効期限: {shopData.proCoupons.repeat.expireDate}</p>}
    {repeatCouponActiveUntil && <p style={{ fontSize: '12px', color: '#64748b' }}>今回の有効期限: {new Date(repeatCouponActiveUntil).toLocaleDateString('ja-JP')}</p>}
    {repeatCouponUsedToday ? <p>本日は使用済みです。次回は翌日から利用できます。</p> : <>
      <div style={{ background: '#fff', padding: '10px', display: 'inline-block', borderRadius: '6px', marginBottom: '8px' }}>
        <QRCodeSVG value={JSON.stringify({ shopId, couponType: 'repeat', token: fcmToken })} size={150} />
      </div>
      <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>会計時にこちらのQRコードをスタッフにご提示ください</p>
    </>}
  </div>
)}
{shopData?.loyaltyCoupon?.enabled && loyaltyCouponAvailable && !hiddenCouponTypes.includes('loyalty') && (
  <div style={{ background: loyaltyCouponExpired ? '#f1f5f9' : '#fff7ed', border: loyaltyCouponExpired ? '1px solid #cbd5e1' : '1px dashed #fb923c', padding: '16px', borderRadius: '8px', marginBottom: '25px', textAlign: 'center' }}>
    <span style={{ fontSize: '11px', background: loyaltyCouponExpired ? '#64748b' : '#ea580c', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>特別達成クーポン</span>
    <h3 style={{ margin: '6px 0 8px 0', color: loyaltyCouponExpired ? '#64748b' : '#c2410c' }}>
      🏆 {shopData.loyaltyCoupon.title || '特別達成クーポン'}
    </h3>
    {shopData.loyaltyCoupon.expireType === 'date' && shopData.loyaltyCoupon.expireDate && <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px' }}>有効期限: {shopData.loyaltyCoupon.expireDate}</p>}
    {shopData.loyaltyCoupon.expireType === 'days' && <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px' }}>有効期限: {loyaltyAchievedAt ? new Date(new Date(loyaltyAchievedAt).getTime() + Math.max(1, Number(shopData.loyaltyCoupon.expireDays) || 1) * 24 * 60 * 60 * 1000).toLocaleDateString('ja-JP') : `出現から ${Math.max(1, Number(shopData.loyaltyCoupon.expireDays) || 1)} 日間`}</p>}
    {loyaltyCouponExpired ? (
      <div style={{ padding: '12px', background: '#e2e8f0', borderRadius: '6px', color: '#475569', fontWeight: 'bold', fontSize: '14px' }}>⚠️ こちらのクーポンは有効期限切れです</div>
    ) : (
      <>
        <p style={{ fontSize: '13px', color: '#333', marginBottom: '12px' }}>通常クーポンを規定回数ご利用いただいた特典です。</p>
        <div style={{ background: '#fff', padding: '10px', display: 'inline-block', borderRadius: '6px', marginBottom: '8px' }}>
          <QRCodeSVG value={JSON.stringify({ shopId, couponType: 'loyalty', token: fcmToken })} size={150} />
        </div>
        <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>会計時にこちらのQRコードをスタッフにご提示ください</p>
      </>
    )}
  </div>
)}
        </>}
        {/* 📜 【履歴エリア】通知履歴 / クーポン使用履歴をタブで切り替え */}
        <section style={{ marginTop: '28px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>履歴</h2>
          <div role="tablist" aria-label="履歴の種類" style={{ display: 'flex', gap: '4px', padding: '4px', background: '#f1f5f9', borderRadius: '12px' }}>
            {([
              ['notifications', '🔔 通知', historyList.length],
              ['coupons', '🎟️ クーポン使用', couponHistoryLoaded ? couponHistory.length : null],
            ] as const).map(([tab, label, count]) => {
              const active = historyTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setHistoryTab(tab);
                    if (tab === 'notifications') loadNotificationHistory();
                  }}
                  style={{
                    flex: 1, padding: '10px 8px', border: 'none', borderRadius: '9px', cursor: 'pointer',
                    fontSize: '14px', fontWeight: 700,
                    background: active ? '#fff' : 'transparent',
                    color: active ? '#0f172a' : '#64748b',
                    boxShadow: active ? '0 1px 3px rgba(15, 23, 42, 0.12)' : 'none',
                  }}
                >
                  {label}
                  {count !== null && (
                    <span style={{ marginLeft: '6px', fontSize: '12px', fontWeight: 600, padding: '1px 7px', borderRadius: '999px', background: '#e2e8f0', color: '#475569' }}>{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div role="tabpanel" style={{ marginTop: '12px' }}>
            {historyTab === 'coupons' ? (
              <>
                {couponHistoryError && (
                  <p role="alert" style={{ fontSize: '13px', color: '#dc2626', background: '#fef2f2', padding: '10px 12px', borderRadius: '8px', margin: '0 0 10px' }}>{couponHistoryError}</p>
                )}
                {!couponHistoryLoaded && couponHistoryLoading ? (
                  <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', padding: '24px 0', margin: 0 }}>読み込み中...</p>
                ) : couponHistory.length === 0 ? (
                  !couponHistoryError && (
                    <div style={{ textAlign: 'center', padding: '28px 12px', color: '#94a3b8' }}>
                      <div style={{ fontSize: '28px', marginBottom: '6px' }}>🎟️</div>
                      <p style={{ fontSize: '13px', margin: 0 }}>まだクーポンを使用していません</p>
                    </div>
                  )
                ) : (
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
                    {couponHistory.map((entry, index) => (
                      <li key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderTop: index === 0 ? 'none' : '1px solid #f1f5f9' }}>
                        <span aria-hidden style={{ flexShrink: 0, width: '36px', height: '36px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>✓</span>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.title}</p>
                          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                            {entry.usedAt
                              ? `${new Date(entry.usedAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })} に使用`
                              : '使用日時不明'}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : historyList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '28px 12px', color: '#94a3b8' }}>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>🔔</div>
                <p style={{ fontSize: '13px', margin: 0 }}>受信した通知はまだありません</p>
              </div>
            ) : (
              <>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
                  {historyList.slice(0, displayCount).map((item, index) => (
                    <li key={item.id ?? index} style={{ padding: '12px 14px', borderTop: index === 0 ? 'none' : '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{item.title}</p>
                        <span style={{ flexShrink: 0, fontSize: '11px', color: '#94a3b8' }}>
                          {new Date(item.timestamp).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {item.body && <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#475569', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{item.body}</p>}
                      {item.url && item.url !== '/' && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '6px', fontSize: '12px', fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>
                          詳細を見る →
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
                {displayCount < historyList.length && (
                  <button
                    type="button"
                    onClick={() => setDisplayCount(prev => prev + 10)}
                    style={{ width: '100%', marginTop: '10px', padding: '10px', background: '#fff', color: '#334155', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                  >
                    もっと見る（残り{historyList.length - displayCount}件）
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    );
  }

  // 🔔 【初期登録画面】
  return (
    <main style={{ padding: 24, maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <div style={{ marginTop: 40, marginBottom: 20 }}>
        {shopData?.iconUrl && (
  <img
    src={shopData.iconUrl}
    alt={shopData?.name || '店舗アイコン'}
    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px auto' }}
  />
)}
<h1 style={{ fontSize: '22px', margin: '0 0 8px 0' }}>{shopData?.name}</h1>
<p style={{ color: '#666', fontSize: '14px' }}>お得な情報をプッシュ通知でお届けします</p>
      </div>

      {status === 'success' ? (
        <div style={{ marginTop: 30 }}>
          <div style={{ fontSize: 54 }}>✅</div>
          <p style={{ fontWeight: 'bold', color: '#2e7d32', fontSize: '16px', marginTop: '10px' }}>通知の受け取りが完了しました！</p>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>まもなく専用画面に切り替わります...</p>
        </div>
      ) : (
        <>
          {!customerUid && !confirmationResult && (
            <div style={{ textAlign: 'left', marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>電話番号認証</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+81 90 1234 5678"
                style={{ width: '100%', padding: '12px', fontSize: '16px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
              <button type="button" onClick={handleSendVerificationCode} disabled={phoneAuthLoading} style={{ width: '100%', marginTop: '8px', padding: '12px', fontSize: '15px', background: phoneAuthLoading ? '#cbd5e1' : '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: phoneAuthLoading ? 'wait' : 'pointer', fontWeight: 'bold' }}>
                {phoneAuthLoading ? '送信中...' : 'SMS認証コードを送る'}
              </button>
            </div>
          )}
          {confirmationResult && (
            <div style={{ textAlign: 'left', marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>SMS認証コード</label>
              <input
                type="text"
                inputMode="numeric"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="6桁のコード"
                style={{ width: '100%', padding: '12px', fontSize: '16px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
              <button type="button" onClick={handleConfirmVerificationCode} disabled={phoneAuthLoading} style={{ width: '100%', marginTop: '8px', padding: '12px', fontSize: '15px', background: phoneAuthLoading ? '#cbd5e1' : '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: phoneAuthLoading ? 'wait' : 'pointer', fontWeight: 'bold' }}>
                {phoneAuthLoading ? '確認中...' : '認証する'}
              </button>
            </div>
          )}
          {customerUid && (
            <button
              onClick={handleSubscribe}
              disabled={status === 'requesting'}
              style={{ width: '100%', padding: 16, fontSize: 16, background: status === 'requesting' ? '#ccc' : '#ff4500', color: '#fff', border: 'none', borderRadius: 8, cursor: status === 'requesting' ? 'wait' : 'pointer', fontWeight: 'bold' }}
            >
              {status === 'requesting' ? '登録中...' : '🔔 通知を受け取る'}
            </button>
          )}
          <div id="recaptcha-container" />
        </>
      )}

      {status === 'error' && (
        <p style={{ color: 'red', marginTop: 16, whiteSpace: 'pre-line', fontSize: '14px' }}>{message}</p>
      )}
    </main>
  );
}
