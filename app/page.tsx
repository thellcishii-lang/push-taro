'use client';

import { useState, useEffect } from 'react';
import { requestFCMToken, onForegroundMessage } from '../lib/firebase-client';

interface ShopInfo {
  name: string;
  coupon?: {
    enabled: boolean;
    title: string;
    description: string;
    discountRate: number;
  };
  linkUrl?: string;
}

export default function LandingPage() {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [shopId, setShopId] = useState('');
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null);
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponUsed, setCouponUsed] = useState(false);

  // URLから shopId を取得 & 店舗情報取得
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('s');
    if (!s) {
      setStatus('error');
      setMessage('無効なアクセスです。QRコードからアクセスしてください。');
      return;
    }
    setShopId(s);
    fetch(`/api/shop-info?s=${s}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.success) setShopInfo(data);
      });
  }, []);

  // フォアグラウンド通知受信（アプリ起動中も通知を検知）
  useEffect(() => {
    const unsub = onForegroundMessage((payload) => {
      console.log('フォアグラウンド受信:', payload);
      if (payload.data?.title) {
        // 簡易トースト表示
        setMessage(`📢 ${payload.data.title}`);
        setTimeout(() => setMessage(''), 5000);
      }
    });
    return () => unsub();
  }, []);

  // クーポン使用済み判定
  useEffect(() => {
    if (shopId && shopInfo?.coupon?.enabled) {
      const used = localStorage.getItem(`coupon_used_${shopId}`);
      setCouponUsed(!!used);
    }
  }, [shopId, shopInfo]);

  const handleSubscribe = async () => {
    if (!shopId) return;
    setStatus('requesting');
    setMessage('');

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setStatus('error');
        setMessage('通知を許可しないと受け取れません。');
        return;
      }

      const token = await requestFCMToken();
      if (!token) throw new Error('トークン取得に失敗');

      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, shopId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '登録失敗');
      }

      setStatus('success');
      setMessage(`✅ ${shopInfo?.name || '店舗'}の通知を受け取ります！`);

      // 初回クーポンが有効なら表示
      if (shopInfo?.coupon?.enabled && !localStorage.getItem(`coupon_used_${shopId}`)) {
        setShowCoupon(true);
      }
    } catch (err: any) {
      setStatus('error');
      setMessage('エラー: ' + err.message);
    }
  };

  const handleUseCoupon = () => {
    localStorage.setItem(`coupon_used_${shopId}`, 'true');
    setCouponUsed(true);
    setShowCoupon(false);
  };

  const handleHomeAction = () => {
    if (couponUsed && shopInfo?.linkUrl) {
      window.location.href = shopInfo.linkUrl;
    } else if (!couponUsed && shopInfo?.coupon?.enabled) {
      setShowCoupon(true);
    }
  };

  if (status === 'error' && !shopId) {
    return (
      <main style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1>⚠️ アクセスエラー</h1>
        <p>{message}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>🍑 プッシュ太郎</h1>
      <p>{shopInfo?.name ? `${shopInfo.name}からのお知らせを受け取ろう！` : 'お得な情報をプッシュ通知でお届けします'}</p>

      {status === 'success' ? (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <div style={{ fontSize: 64 }}>✅</div>
          <p>{message}</p>

          {/* クーポン表示エリア */}
          {showCoupon && shopInfo?.coupon && (
            <div style={{ marginTop: 24, padding: 20, border: '2px dashed #ff6b6b', borderRadius: 12, background: '#fff0f0' }}>
              <h2>🎫 {shopInfo.coupon.title}</h2>
              <p>{shopInfo.coupon.description}</p>
              <p style={{ fontSize: 24, fontWeight: 'bold', color: '#ff6b6b' }}>
                {shopInfo.coupon.discountRate}% OFF
              </p>
              <button onClick={handleUseCoupon} style={{ padding: '12px 24px', fontSize: 16, background: '#ff6b6b', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                クーポンを使う
              </button>
            </div>
          )}

          {/* ホーム画面風ボタン（PWA想定） */}
          {!showCoupon && (
            <button onClick={handleHomeAction} style={{ marginTop: 24, padding: '16px 32px', fontSize: 18, background: '#333', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
              {couponUsed ? '店舗ページを開く' : 'クーポンを見る'}
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={handleSubscribe}
          disabled={status === 'requesting'}
          style={{
            width: '100%',
            padding: 16,
            fontSize: 18,
            background: status === 'requesting' ? '#ccc' : '#ff6b6b',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: status === 'requesting' ? 'wait' : 'pointer',
            marginTop: 24,
          }}
        >
          {status === 'requesting' ? '登録中...' : '🔔 通知を受け取る'}
        </button>
      )}

      {status === 'error' && <p style={{ color: 'red', marginTop: 16 }}>{message}</p>}
    </main>
  );
}
