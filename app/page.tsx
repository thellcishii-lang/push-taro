'use client';

import { useState, useEffect } from 'react';
import { requestFCMToken, onForegroundMessage } from '../lib/firebase-client';
import { QRCodeSVG } from 'qrcode.react';

export default function LandingPage() {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [shopId, setShopId] = useState('');
  
  // 登録完了後に顧客画面を表示するためのフラグ
  const [isRegistered, setIsRegistered] = useState(false);
  const [fcmToken, setFcmToken] = useState('');
  const [shopData, setShopData] = useState<any>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [couponUsed, setCouponUsed] = useState(false);

  // URLから shopId 取得 + localStorage 復元
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('s');

    if (s) {
      setShopId(s);
      localStorage.setItem('push_taro_shop_id', s);
    } else {
      const saved = localStorage.getItem('push_taro_shop_id');
      if (saved) {
        setShopId(saved);
      } else {
        setStatus('error');
        setMessage('無効なアクセスです。QRコードからアクセスしてください。');
      }
    }
  }, []);

  // すでに登録済み（ローカルストレージにトークンがある等）の判定や店舗情報の取得
  useEffect(() => {
    if (!shopId) return;

    // 店舗情報を取得してアイコンや名前、クーポン情報を表示できるようにする
    fetch(`/api/shop-info?shopId=${shopId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setShopData(data.shop);
        }
      })
      .catch(err => console.error('店舗情報取得エラー:', err));

    // もしすでにこの端末で登録済みなら、直接顧客画面を表示するなどの分岐も可能
    const savedToken = localStorage.getItem(`push_taro_token_${shopId}`);
    if (savedToken) {
      setFcmToken(savedToken);
      setIsRegistered(true);
    }
  }, [shopId]);

  // manifest や iOS用メタタグの設定
  useEffect(() => {
    if (shopId && shopId !== 'placeholder' && shopId !== 'undefined') {
      const link = document.querySelector('link[rel="manifest"]');
      if (link) {
        link.setAttribute('href', `/manifest/${shopId}`);
      }
    }
  }, [shopId]);

  useEffect(() => {
    if (shopId && shopId !== 'placeholder' && shopId !== 'undefined') {
      let meta = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'apple-mobile-web-app-capable');
        meta.setAttribute('content', 'yes');
        document.head.appendChild(meta);
      } else {
        meta.setAttribute('content', 'yes');
      }
    }
  }, [shopId]);

  // フォアグラウンド通知受信
  useEffect(() => {
    const unsub = onForegroundMessage((payload) => {
      const title = payload.data?.title || 'プッシュ太郎';
      const options = {
        body: payload.data?.body || '',
        icon: '/icon-192x192.png',
        image: payload.data?.image,
        data: { url: payload.data?.url || '/' },
        tag: payload.data?.shopId || 'default',
      };

      if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, options);
        });
      }
    });

    return () => unsub();
  }, []);

  const handleSubscribe = async () => {
    let effectiveShopId = shopId;
    if (!effectiveShopId) {
      effectiveShopId = localStorage.getItem('push_taro_shop_id') || '';
    }

    if (!effectiveShopId) {
      setStatus('error');
      setMessage('店舗IDが取得できていません。QRコードからアクセスしてください。');
      return;
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = (window.navigator as any).standalone === true;

    if (isIOS && !isStandalone) {
      setStatus('error');
      setMessage(
        'iPhoneでは「ホーム画面に追加」が必要です。\n' +
        'Safariの「共有」→「ホーム画面に追加」を行ってから、このアプリを開いてください。'
      );
      return;
    }

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
      if (!token) {
        setStatus('error');
        setMessage('トークン取得に失敗しました。');
        return;
      }

      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, shopId: effectiveShopId }),
      });

      const resData = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(resData.error || `HTTP ${res.status}`);
      }

      // トークンを保存
      localStorage.setItem(`push_taro_token_${effectiveShopId}`, token);
      setFcmToken(token);
      setStatus('success');
      setMessage('通知の受け取りが完了しました！');

      // ⏳ 3秒後に顧客画面へ切り替え
      setTimeout(() => {
        setIsRegistered(true);
      }, 3000);

    } catch (err: any) {
      setStatus('error');
      setMessage('エラー: ' + err.message);
    }
  };

  // --- 📱 【登録完了後の顧客画面】 ---
  if (isRegistered) {
    return (
      <main style={{ padding: 20, maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif' }}>
        {/* 1. 一番上：顧客のコード（FCMトークン） */}
        <div style={{ background: '#f8f9fa', padding: '8px 12px', borderRadius: '6px', fontSize: '11px', color: '#666', wordBreak: 'break-all', marginBottom: '20px', border: '1px solid #e9ecef' }}>
          <span>🔑 端末コード: </span><code>{fcmToken}</code>
        </div>

        {/* 2. 店舗情報（アイコン・店名・リンク） */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ width: '64px', height: '64px', background: '#ddd', borderRadius: '50%', margin: '0 auto 10px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            🏪
          </div>
          <h2 style={{ margin: '0 0 8px 0' }}>{shopData?.name || '登録店舗'}</h2>
          {shopData?.linkUrl && (
            <a href={shopData.linkUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2196F3', fontSize: '14px', wordBreak: 'break-all' }}>
              {shopData.linkUrl}
            </a>
          )}
        </div>

        {/* 3. 初回クーポン（使うと消える仕様） */}
        {shopData?.coupon?.enabled && !couponUsed && (
          <div style={{ background: '#fff3e0', border: '1px dashed #ffb74d', padding: '16px', borderRadius: '8px', marginBottom: '25px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#e65100' }}>🎁 {shopData.coupon.title || '初回限定クーポン'}</h3>
            <p style={{ fontSize: '14px', color: '#333', marginBottom: '12px' }}>{shopData.coupon.description}</p>
            
            <div style={{ background: '#fff', padding: '10px', display: 'inline-block', borderRadius: '6px', marginBottom: '12px' }}>
              <QRCodeSVG value={shopData.coupon.shopId || shopId} size={150} />
            </div>

            <div>
              <button
                onClick={() => setCouponUsed(true)}
                style={{ padding: '8px 16px', background: '#ff9800', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
              >
                クーポンを使用済みにする（消す）
              </button>
            </div>
          </div>
        )}

        {/* 4. 通知履歴（履歴ボタンで展開、最大20件） */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            style={{ width: '100%', padding: '12px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>📜 通知履歴</span>
            <span>{historyOpen ? '▲ 閉じる' : '▼ 展開する'}</span>
          </button>

          {historyOpen && (
            <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ fontSize: '13px', color: '#666', textAlign: 'center', margin: '10px 0' }}>
                （受信した通知がここに最大20件表示されます）
              </p>
              {/* ※ローカル等に保存された受信履歴をここにマップして表示するエリア */}
            </div>
          )}
        </div>
      </main>
    );
  }

  // --- 🔔 【初期の通知許可画面】 ---
  return (
    <main style={{ padding: 24, maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1 style={{ marginTop: 40 }}>🚀 プッシュ太郎</h1>
      <p style={{ color: '#666', marginBottom: 30 }}>お得な情報をプッシュ通知でお届けします</p>

      {status === 'success' ? (
        <div style={{ marginTop: 40 }}>
          <div style={{ fontSize: 64 }}>✅</div>
          <p style={{ fontWeight: 'bold', color: '#2e7d32', fontSize: '18px' }}>{message}</p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>まもなく専用画面に切り替わります...</p>
        </div>
      ) : (
        <button
          onClick={handleSubscribe}
          disabled={status === 'requesting'}
          style={{
            width: '100%',
            padding: 16,
            fontSize: 18,
            background: status === 'requesting' ? '#ccc' : '#ff4500',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: status === 'requesting' ? 'wait' : 'pointer',
          }}
        >
          {status === 'requesting' ? '登録中...' : '🔔 通知を受け取る'}
        </button>
      )}

      {status === 'error' && (
        <p style={{ color: 'red', marginTop: 16, whiteSpace: 'pre-line' }}>{message}</p>
      )}
    </main>
  );
}
