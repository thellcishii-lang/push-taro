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

  // 🎂 誕生日入力用ステート（Proプラン専用）
  const [birthDate, setBirthDate] = useState('');
  
  // 折りたたみ（アコーディオン）用のステート
  const [historyOpen, setHistoryOpen] = useState(false);
  const [couponUsed, setCouponUsed] = useState(false);

  // 1. URLから shopId 取得 + localStorage 復元 (安全なクライアントサイド実行)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const params = new URLSearchParams(window.location.search);
      // ?s= または ?shopid= のどちらからでも取得可能
      const s = params.get('s') || params.get('shopid');

      if (s && s !== 'undefined' && s !== 'null') {
        setShopId(s);
        localStorage.setItem('push_taro_shop_id', s);
      } else {
        const saved = localStorage.getItem('push_taro_shop_id');
        if (saved && saved !== 'undefined' && saved !== 'null') {
          setShopId(saved);
        }
      }
    } catch (e) {
      console.error('URL解析エラー:', e);
    }
  }, []);

  // 2. 店舗情報の取得 & 登録済みチェック
  useEffect(() => {
    if (!shopId || shopId === 'undefined' || shopId === 'null') return;

    // 店舗情報取得
    fetch(`/api/shop-info?s=${shopId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setShopData(data.shop || data);
        }
      })
      .catch(err => console.error('店舗情報取得エラー:', err));

    // 登録済みチェック
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem(`push_taro_token_${shopId}`);
      if (savedToken) {
        setFcmToken(savedToken);
        setIsRegistered(true);
      }
    }
  }, [shopId]);

  // 3. manifest 設定
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (shopId && shopId !== 'placeholder' && shopId !== 'undefined' && shopId !== 'null') {
      const link = document.querySelector('link[rel="manifest"]');
      if (link) {
        link.setAttribute('href', `/manifest/${shopId}`);
      }
    }
  }, [shopId]);

  const handleSubscribe = async () => {
    let effectiveShopId = shopId;
    if (!effectiveShopId || effectiveShopId === 'undefined') {
      effectiveShopId = localStorage.getItem('push_taro_shop_id') || '';
    }

    if (!effectiveShopId) {
      setStatus('error');
      setMessage('店舗IDが取得できていません。QRコードから再度アクセスしてください。');
      return;
    }

    // Proプランの場合は誕生日の入力を必須チェック
    if (shopData?.plan === 'pro' && !birthDate) {
      setStatus('error');
      setMessage('バースデークーポン受取のため、生年月日を選択してください。');
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

      // 登録API呼び出し
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

  // --- 📱 【登録完了後の顧客画面】 ---
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

        {/* クーポン表示 */}
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
                クーポンを使用済みにする（消す）
              </button>
            </div>
          </div>
        )}

        {/* 通知履歴 */}
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

  // --- 🔔 【初期の通知許可画面】 ---
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
