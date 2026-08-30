'use client';

import { useState, useEffect } from 'react';
import { requestFCMToken } from '../lib/firebase-client';
import { QRCodeSVG } from 'qrcode.react';

export default function LandingPage() {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [shopId, setShopId] = useState('');
  
  // 画面状態管理
  const [isRegistered, setIsRegistered] = useState(false);
  const [fcmToken, setFcmToken] = useState('');
  const [shopData, setShopData] = useState<any>(null);

  // 生年月日（Proプラン専用）
  const [birthDate, setBirthDate] = useState('');
  
  // アコーディオン・クーポン表示用
  const [historyOpen, setHistoryOpen] = useState(false);
  const [couponUsed, setCouponUsed] = useState(false);

  // 1. URLから shopId を強力かつ最優先で取得
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const resolveShopId = () => {
      // URLから取得
      const urlParams = new URLSearchParams(window.location.search);
      let s = urlParams.get('s') || urlParams.get('shopid');

      // # ハッシュ対策
      if (!s && window.location.href.includes('?')) {
        const queryString = window.location.href.split('?')[1];
        if (queryString) {
          const params = new URLSearchParams(queryString.split('#')[0]);
          s = params.get('s') || params.get('shopid');
        }
      }

      if (s && s !== 'undefined' && s !== 'null' && s.trim() !== '') {
        const cleanId = s.trim();
        setShopId(cleanId);
        localStorage.setItem('push_taro_shop_id', cleanId);
        return cleanId;
      }

      // URLに無ければ localStorage から復元
      const saved = localStorage.getItem('push_taro_shop_id');
      if (saved && saved !== 'undefined' && saved !== 'null' && saved.trim() !== '') {
        setShopId(saved);
        return saved;
      }

      return '';
    };

    resolveShopId();
  }, []);

  // 2. 店舗情報の取得 & 登録済みチェック
  useEffect(() => {
    if (!shopId || shopId === 'undefined' || shopId === 'null') return;

    fetch(`/api/shop-info?s=${shopId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setShopData(data);
        }
      })
      .catch(err => console.error('店舗情報取得エラー:', err));

    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem(`push_taro_token_${shopId}`);
      if (savedToken) {
        setFcmToken(savedToken);
        setIsRegistered(true);
      }
    }
  }, [shopId]);

  // 3. PWA Manifest 設定
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (shopId && shopId !== 'placeholder' && shopId !== 'undefined' && shopId !== 'null') {
      const link = document.querySelector('link[rel="manifest"]');
      if (link) {
        link.setAttribute('href', `/manifest/${shopId}`);
      }
    }
  }, [shopId]);

  // 🔔 登録ボタンを押した時の処理
  const handleSubscribe = async () => {
    // 実行時に再度 URL / LocalStorage を確認
    let effectiveShopId = shopId;

    if (!effectiveShopId || effectiveShopId === 'undefined' || effectiveShopId === 'null') {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        effectiveShopId = urlParams.get('s') || urlParams.get('shopid') || localStorage.getItem('push_taro_shop_id') || '';
      }
    }

    if (!effectiveShopId || effectiveShopId === 'undefined' || effectiveShopId === 'null') {
      setStatus('error');
      setMessage('店舗IDが取得できていません。URLに ?s=店舗ID が含まれているか確認してください。');
      return;
    }

    // Proプラン生年月日チェック
    if (shopData?.plan === 'pro' && !birthDate) {
      setStatus('error');
      setMessage('バースデークーポン受取のため、生年月日を選択してください。');
      return;
    }

    // iPhone Home画面追加チェック
    const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = typeof window !== 'undefined' && (window.navigator as any).standalone === true;

    if (isIOS && !isStandalone) {
      setStatus('error');
      setMessage(
        'iPhoneでは「ホーム画面に追加」が必要です。\n' +
        'Safariの「共有ボタン」→「ホーム画面に追加」を行ってから、ホーム画面のアイコンより開いてください。'
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

      // 登録APIへ送信
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          shopId: effectiveShopId,
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
      setMessage('通知の受け取りが完了しました！');

      setTimeout(() => {
        setIsRegistered(true);
      }, 2000);

    } catch (err: any) {
      setStatus('error');
      setMessage('エラー: ' + err.message);
    }
  };

  // 📱 【登録完了後の画面】
  if (isRegistered) {
    return (
      <main style={{ padding: 20, maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '20px' }}>
          {shopData?.iconUrl ? (
            <img src={shopData.iconUrl} alt="店舗アイコン" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px auto' }} />
          ) : (
            <div style={{ width: '64px', height: '64px', background: '#e0e0e0', borderRadius: '50%', margin: '0 auto 10px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              🏪
            </div>
          )}
          <h2 style={{ margin: '0 0 8px 0' }}>{shopData?.name || '登録店舗'}</h2>
          {shopData?.linkUrl && (
            <a href={shopData.linkUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2196F3', fontSize: '14px', wordBreak: 'break-all' }}>
              {shopData.linkUrl}
            </a>
          )}
        </div>

        {shopData?.coupon?.enabled && !couponUsed && (
          <div style={{ background: '#fff3e0', border: '1px dashed #ffb74d', padding: '16px', borderRadius: '8px', marginBottom: '25px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#e65100' }}>🎁 {shopData.coupon.title || '初回限定クーポン'}</h3>
            <p style={{ fontSize: '14px', color: '#333', marginBottom: '12px' }}>{shopData.coupon.description}</p>
            
            <div style={{ background: '#fff', padding: '10px', display: 'inline-block', borderRadius: '6px', marginBottom: '12px' }}>
              <QRCodeSVG value={shopId} size={150} />
            </div>

            <div>
              <button
                onClick={() => setCouponUsed(true)}
                style={{ padding: '8px 16px', background: '#ff9800', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
              >
                クーポンを使用済みにする
              </button>
            </div>
          </div>
        )}

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
                （受信した通知が表示されます）
              </p>
            </div>
          )}
        </div>
      </main>
    );
  }

  // 🔔 【初期の登録画面】
  return (
    <main style={{ padding: 24, maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <div style={{ marginTop: 40, marginBottom: 20 }}>
        {shopData?.iconUrl ? (
          <img src={shopData.iconUrl} alt="店舗アイコン" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px auto' }} />
        ) : (
          <div style={{ width: '64px', height: '64px', background: '#f0f0f0', borderRadius: '50%', margin: '0 auto 10px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
            🏪
          </div>
        )}
        <h1 style={{ fontSize: '22px', margin: '0 0 8px 0' }}>{shopData?.name || 'プッシュ太郎'}</h1>
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
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              boxSizing: 'border-box',
              background: '#fff',
            }}
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
        <button
          onClick={handleSubscribe}
          disabled={status === 'requesting'}
          style={{
            width: '100%',
            padding: 16,
            fontSize: 16,
            background: status === 'requesting' ? '#ccc' : '#ff4500',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: status === 'requesting' ? 'wait' : 'pointer',
            fontWeight: 'bold',
          }}
        >
          {status === 'requesting' ? '登録中...' : '🔔 通知を受け取る'}
        </button>
      )}

      {status === 'error' && (
        <p style={{ color: 'red', marginTop: 16, whiteSpace: 'pre-line', fontSize: '14px' }}>{message}</p>
      )}
    </main>
  );
}
