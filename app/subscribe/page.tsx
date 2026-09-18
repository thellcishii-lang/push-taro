'use client';

import { useState, useEffect } from 'react';
import { requestFCMToken } from '../../lib/firebase-client';
import { firebaseApp } from '../../lib/firebase-client';
import { getMessaging, onMessage } from 'firebase/messaging';
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

  const [birthDate, setBirthDate] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [couponUsed, setCouponUsed] = useState(false);
  const [couponExpired, setCouponExpired] = useState(false);
  const [normalCouponUsed, setNormalCouponUsed] = useState(false);
  const [normalCouponExpired, setNormalCouponExpired] = useState(false);
  const [loyaltyCouponAvailable, setLoyaltyCouponAvailable] = useState(false);
  const [loyaltyCouponExpired, setLoyaltyCouponExpired] = useState(false);
  const [hiddenCouponTypes, setHiddenCouponTypes] = useState<string[]>([]);
  const [customerUid, setCustomerUid] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [phoneAuthLoading, setPhoneAuthLoading] = useState(false);

  // 📜 通知履歴用ステート
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [displayCount, setDisplayCount] = useState<number>(10);

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

      // ユーザーのクーポン使用状況を取得
      fetch(`/api/subscribe-status?shopId=${shopId}&token=${encodeURIComponent(savedToken)}`)
        .then(res => res.json())
        .then(data => {
          console.log('ステータス確認結果:', data);
          if (data.success && (data.firstCouponUsed || data.couponUsed)) {
            setCouponUsed(true);
          }
          if (data.success && data.normalCouponUsed) setNormalCouponUsed(true);
          if (data.success) setLoyaltyCouponAvailable(data.loyaltyCouponAvailable === true);
        })
        .catch(err => console.error('ステータス確認エラー:', err));
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
    setLoyaltyCouponExpired(Boolean(loyaltyExpiredAt && new Date(`${loyaltyExpiredAt}T23:59:59`).getTime() < Date.now()));
  }, [shopData]);

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

  // 店舗側でクーポンが消し込まれた状態を、顧客画面へ自動反映する。
  useEffect(() => {
    if (!shopId || !fcmToken || !isRegistered) return;

    const messaging = getMessaging(firebaseApp);
    const unsubscribeMessage = onMessage(messaging, async (payload) => {
      const title = payload.data?.title || payload.notification?.title || '新着通知';
      const body = payload.data?.body || payload.notification?.body || '';
      const rawUrl = payload.data?.url || payload.data?.linkUrl || '/';
      const url = new URL(rawUrl, window.location.origin).toString();
      const request = indexedDB.open('PushTaroDB', 3);
      request.onsuccess = (event: any) => {
        const historyDb = event.target.result;
        if (!historyDb.objectStoreNames.contains('notifications')) return;
        const transaction = historyDb.transaction('notifications', 'readwrite');
        transaction.objectStore('notifications').add({ title, body, url, timestamp: Date.now() });
        transaction.oncomplete = () => historyDb.close();
      };
    });

    const refreshCouponStatus = async () => {
      try {
        const res = await fetch(
          `/api/subscribe-status?shopId=${encodeURIComponent(shopId)}&token=${encodeURIComponent(fcmToken)}`
        );
        const data = await res.json();
        if (data.success && (data.firstCouponUsed || data.couponUsed)) {
          setCouponUsed(true);
        }
        if (data.success && data.normalCouponUsed) setNormalCouponUsed(true);
        if (data.success) setLoyaltyCouponAvailable(data.loyaltyCouponAvailable === true);
      } catch (err) {
        console.error('クーポン状態の自動更新エラー:', err);
      }
    };

    const intervalId = window.setInterval(refreshCouponStatus, 3000);
    document.addEventListener('visibilitychange', refreshCouponStatus);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', refreshCouponStatus);
      unsubscribeMessage();
    };
  }, [shopId, fcmToken, isRegistered]);

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

    if (shopData?.plan === 'pro' && !birthDate) {
      setStatus('error');
      setMessage('⚠️ バースデークーポン受取のため、生年月日を選択してください。');
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
          birthDate: shopData?.plan === 'pro' ? birthDate : null,
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

        {/* 🎁 初回限定クーポンエリア */}
{shopData?.coupon?.enabled && !hiddenCouponTypes.includes('first') && (
  <div style={{ background: couponUsed || couponExpired ? '#f1f5f9' : '#fff3e0', border: couponUsed || couponExpired ? '1px solid #cbd5e1' : '1px dashed #ffb74d', padding: '16px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
    <span style={{ fontSize: '11px', background: couponUsed || couponExpired ? '#64748b' : '#e65100', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>初回限定</span>
    <h3 style={{ margin: '6px 0 8px 0', color: couponUsed || couponExpired ? '#64748b' : '#e65100' }}>
      🎁 {shopData.coupon.title || '初回限定クーポン'}
    </h3>

    {shopData.coupon.expiresAt && (
      <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px' }}>有効期限: {shopData.coupon.expiresAt}</p>
    )}

    {couponUsed ? (
      <div style={{ padding: '12px', background: '#e2e8f0', borderRadius: '6px', color: '#475569', fontSize: '14px', marginTop: '10px' }}>
        <strong>✅ こちらのクーポンは使用済みです</strong>
        <button type="button" onClick={() => hideCoupon('first')} style={{ display: 'block', margin: '10px auto 0', padding: '7px 12px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>削除</button>
      </div>
    ) : couponExpired ? (
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
{shopData?.loyaltyCoupon?.enabled && loyaltyCouponAvailable && !hiddenCouponTypes.includes('loyalty') && (
  <div style={{ background: loyaltyCouponExpired ? '#f1f5f9' : '#fff7ed', border: loyaltyCouponExpired ? '1px solid #cbd5e1' : '1px dashed #fb923c', padding: '16px', borderRadius: '8px', marginBottom: '25px', textAlign: 'center' }}>
    <span style={{ fontSize: '11px', background: loyaltyCouponExpired ? '#64748b' : '#ea580c', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>特別達成クーポン</span>
    <h3 style={{ margin: '6px 0 8px 0', color: loyaltyCouponExpired ? '#64748b' : '#c2410c' }}>
      🏆 {shopData.loyaltyCoupon.title || '特別達成クーポン'}
    </h3>
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
        {/* 📜 【通知履歴エリア】 */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <button
            onClick={() => {
              setHistoryOpen(!historyOpen);
              if (!historyOpen) loadNotificationHistory();
            }}
            style={{ width: '100%', padding: '12px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>📜 通知履歴 ({historyList.length}件)</span>
            <span>{historyOpen ? '▲ 閉じる' : '▼ 展開する'}</span>
          </button>

          {historyOpen && (
            <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {historyList.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#888', textAlign: 'center', margin: '15px 0' }}>
                  受信した通知履歴はまだありません。
                </p>
              ) : (
                <>
                  {historyList.slice(0, displayCount).map((item, index) => (
                    <div key={index} style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px', background: '#fff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <h4 style={{ margin: 0, fontSize: '14px', color: '#1e293b' }}>{item.title}</h4>
                        <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                          {new Date(item.timestamp).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#475569', whiteSpace: 'pre-wrap' }}>{item.body}</p>
                      {item.url && item.url !== '/' && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '6px', fontSize: '12px', color: '#2563eb' }}>
                          詳細を見る 🔗
                        </a>
                      )}
                    </div>
                  ))}

                  {/* 10件ずつ増やす「もっと見る」ボタン */}
                  {displayCount < historyList.length && (
                    <button
                      onClick={() => setDisplayCount(prev => prev + 10)}
                      style={{ width: '100%', padding: '10px', background: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', marginTop: '5px' }}
                    >
                      もっと見る ({historyList.length - displayCount}件)
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
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

      {shopData?.plan === 'pro' && status !== 'success' && (
        <div style={{ marginBottom: '20px', textAlign: 'left', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px', color: '#334155' }}>
            🎂 生年月日（バースデークーポン受取用）
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', fontSize: '16px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', background: '#fff' }}
          />
        </div>
      )}

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
