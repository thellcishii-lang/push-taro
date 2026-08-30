'use client';

// app/page.tsx - 整理版

'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { requestNotificationToken } from '@/lib/firebase/token-manager';
import { getPlatformRequirements } from '@/lib/firebase/platform';

export default function LandingPage() {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [shopId, setShopId] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [fcmToken, setFcmToken] = useState('');
  const [shopData, setShopData] = useState<any>(null);
  const [birthDate, setBirthDate] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [couponUsed, setCouponUsed] = useState(false);

  // ============================================================
  // 1. shopId を取得（iOS対応）
  // ============================================================
  useEffect(() => {
    // URLのクエリパラメータから shopId を抽出
    const urlParams = new URLSearchParams(window.location.search);
    let s = urlParams.get('s');
    
    // iOSのホーム画面から開いた場合、window.location.search が空になることがある
    // → URL全体から正規表現で抽出する
    if (!s) {
      const match = window.location.href.match(/[?&]s=([^&]+)/);
      s = match ? match[1] : null;
    }

    console.log('[debug] shopId:', s, 'from URL:', window.location.href);

    if (s) {
      setShopId(s);
      localStorage.setItem('push_taro_shop_id', s);
    } else {
      // ローカルストレージから復元
      const saved = localStorage.getItem('push_taro_shop_id');
      if (saved) {
        setShopId(saved);
        console.log('[debug] shopId restored from localStorage:', saved);
      } else {
        setStatus('error');
        setMessage('店舗IDが取得できませんでした。\nQRコードから再度アクセスしてください。');
      }
    }
  }, []);

  // ============================================================
  // 2. 店舗情報を取得
  // ============================================================
  useEffect(() => {
    if (!shopId) return;

    fetch(`/api/shop-info?s=${shopId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setShopData(data.shop || data);
        }
      })
      .catch(err => console.error('店舗情報取得エラー:', err));

    // 既にトークンがあれば登録済みと見なす
    const savedToken = localStorage.getItem(`push_taro_token_${shopId}`);
    if (savedToken) {
      setFcmToken(savedToken);
      setIsRegistered(true);
    }
  }, [shopId]);

  // ============================================================
  // 3. manifest 設定（PWA用）
  // ============================================================
  useEffect(() => {
    if (shopId && shopId !== 'placeholder' && shopId !== 'undefined') {
      const link = document.querySelector('link[rel="manifest"]');
      if (link) {
        link.setAttribute('href', `/manifest/${shopId}`);
      }
    }
  }, [shopId]);

  // ============================================================
  // 4. 通知登録処理
  // ============================================================
  const handleSubscribe = async () => {
    // shopIdを取得（優先順位: state → localStorage）
    const effectiveShopId = shopId || localStorage.getItem('push_taro_shop_id') || '';

    if (!effectiveShopId) {
      setStatus('error');
      setMessage('店舗IDが取得できていません。QRコードからアクセスしてください。');
      return;
    }

    // Proプラン: 誕生日必須
    if (shopData?.plan === 'pro' && !birthDate) {
      setStatus('error');
      setMessage('バースデークーポン受取のため、生年月日を選択してください。');
      return;
    }

    // iOS: ホーム画面追加チェック
    const requirements = getPlatformRequirements();
    if (requirements.needsHomeScreenAdd) {
      setStatus('error');
      setMessage(requirements.message || '');
      return;
    }

    setStatus('requesting');
    setMessage('');

    try {
      // 通知許可
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setStatus('error');
        setMessage('通知を許可しないと受け取れません。');
        return;
      }

      // FCMトークン取得
      const { token, platform } = await requestNotificationToken();
      if (!token) {
        setStatus('error');
        setMessage('トークン取得に失敗しました。');
        return;
      }

      // サーバーに登録
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

      // ローカル保存
      localStorage.setItem(`push_taro_token_${effectiveShopId}`, token);
      setFcmToken(token);
      setStatus('success');
      setMessage('✅ 通知の受け取りが完了しました！');

      // 3秒後に登録完了画面へ
      setTimeout(() => {
        setIsRegistered(true);
      }, 3000);

    } catch (err: any) {
      console.error('登録エラー:', err);
      setStatus('error');
      setMessage('エラー: ' + err.message);
    }
  };

  // ============================================================
  // 5. 登録完了後の画面（JSX）
  // ============================================================
  if (isRegistered) {
    // ... 既存の登録完了画面 ...
  }

  // ============================================================
  // 6. 通知許可画面（JSX）
  // ============================================================
  return (
  );
}

  // ============================================================
  // 🔴 ここからJSX（元の315行を完全復元）
  // ============================================================

  if (isRegistered) {
    return (
      <main style={{ padding: 20, maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif' }}>
        {/* 店舗情報 */}
        <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '20px' }}>
          {shopData?.iconUrl ? (
            <img src={shopData.iconUrl} alt="店舗アイコン" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px auto' }} />
          ) : (
            <div style={{ width: '64px', height: '64px', background: '#e0e0e0', borderRadius: '50%', margin: '0 auto 10px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🏪</div>
          )}
          <h2 style={{ margin: '0 0 8px 0' }}>{shopData?.name || '登録店舗'}</h2>
          {shopData?.linkUrl && (
            <a href={shopData.linkUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2196F3', fontSize: '14px', wordBreak: 'break-all' }}>
              {shopData.linkUrl}
            </a>
          )}
        </div>

        {/* 初回クーポン */}
        {shopData?.coupon?.enabled && !couponUsed && (
          <div style={{ background: '#fff3e0', border: '1px dashed #ffb74d', padding: '16px', borderRadius: '8px', marginBottom: '25px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#e65100' }}>🎁 {shopData.coupon.title || '初回限定クーポン'}</h3>
            <p style={{ fontSize: '14px', color: '#333', marginBottom: '12px' }}>{shopData.coupon.description}</p>
            <div style={{ background: '#fff', padding: '10px', display: 'inline-block', borderRadius: '6px', marginBottom: '12px' }}>
              <QRCodeSVG value={shopId} size={150} />
            </div>
            <div>
              <button onClick={() => setCouponUsed(true)} style={{ padding: '8px 16px', background: '#ff9800', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                クーポンを使用済みにする
              </button>
            </div>
          </div>
        )}

        {/* 通知履歴 */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <button onClick={() => setHistoryOpen(!historyOpen)} style={{ width: '100%', padding: '12px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>📜 通知履歴</span>
            <span>{historyOpen ? '▲ 閉じる' : '▼ 展開する'}</span>
          </button>
          {historyOpen && (
            <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ fontSize: '13px', color: '#666', textAlign: 'center', margin: '10px 0' }}>
                （受信した通知がここに最大20件表示されます）
              </p>
            </div>
          )}
        </div>
      </main>
    );
  }

  // ============================================================
  // 通知許可画面
  // ============================================================
  return (
    <main style={{ padding: 24, maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
      {/* 店舗アイコンと店舗名 */}
      <div style={{ marginTop: 40, marginBottom: 20 }}>
        {shopData?.iconUrl ? (
          <img src={shopData.iconUrl} alt="店舗アイコン" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px auto' }} />
        ) : (
          <div style={{ width: '64px', height: '64px', background: '#f0f0f0', borderRadius: '50%', margin: '0 auto 10px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>🏪</div>
        )}
        <h1 style={{ fontSize: '22px', margin: '0 0 8px 0' }}>{shopData?.name || 'プッシュ太郎'}</h1>
        <p style={{ color: '#666', fontSize: '14px' }}>お得な情報をプッシュ通知でお届けします</p>
      </div>

      {/* Proプラン店舗限定：生年月日入力フォーム */}
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
          <p style={{ fontSize: '11px', color: '#64748b', margin: '6px 0 0 0' }}>
            ※お誕生月のお得なクーポンをお送りするために使用します。
          </p>
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
