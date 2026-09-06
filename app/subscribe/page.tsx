'use client';

import { useState, useEffect } from 'react';
import { requestFCMToken } from '../../lib/firebase-client';
import { QRCodeSVG } from 'qrcode.react';

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

  // 📜 通知履歴用ステート
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [displayCount, setDisplayCount] = useState<number>(10);

  // 1. IndexedDB から通知履歴を取得する関数
  const loadNotificationHistory = () => {
    if (typeof window === 'undefined') return;
    const request = indexedDB.open('PushTaroDB', 1);

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

  // 3. 店舗情報取得 & 履歴の定期読み込み
  useEffect(() => {
    if (!shopId) return;

    fetch(`/api/shop-info?s=${shopId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setShopData(data);
        }
      })
      .catch(err => console.error('通信エラー:', err));

    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem(`push_taro_token_${shopId}`);
      if (savedToken) {
        setFcmToken(savedToken);
        setIsRegistered(true);
      }
      loadNotificationHistory();
    }
  }, [shopId]);

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
  const handleSubscribe = async () => {
    let effectiveShopId = shopId;

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
            <a href={shopData.linkUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2196F3', fontSize: '14px', wordBreak: 'break-all' }}>
              {shopData.linkUrl}
            </a>
          )}
        </div>

        {/* 🎁 初回限定クーポンエリア */}
{shopData?.coupon?.enabled && (
  <div style={{ background: firstCouponUsed ? '#f1f5f9' : '#fff3e0', border: firstCouponUsed ? '1px solid #cbd5e1' : '1px dashed #ffb74d', padding: '16px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
    <span style={{ fontSize: '11px', background: firstCouponUsed ? '#64748b' : '#e65100', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>初回限定</span>
    <h3 style={{ margin: '6px 0 8px 0', color: firstCouponUsed ? '#64748b' : '#e65100' }}>
      🎁 {shopData.coupon.title || '初回限定クーポン'}
    </h3>

    {firstCouponUsed ? (
      <div style={{ padding: '12px', background: '#e2e8f0', borderRadius: '6px', color: '#475569', fontWeight: 'bold', fontSize: '14px', marginTop: '10px' }}>
        ✅ こちらのクーポンは使用済みです
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
{shopData?.normalCoupon?.enabled && (
  <div style={{ background: '#f0fdf4', border: '1px dashed #4ade80', padding: '16px', borderRadius: '8px', marginBottom: '25px', textAlign: 'center' }}>
    <span style={{ fontSize: '11px', background: '#16a34a', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>常設メンバー特典</span>
    <h3 style={{ margin: '6px 0 8px 0', color: '#15803d' }}>
      🎟️ {shopData.normalCoupon.title || '通常クーポン'}
    </h3>
    <p style={{ fontSize: '13px', color: '#333', marginBottom: '12px' }}>{shopData.normalCoupon.description}</p>
    <div style={{ background: '#fff', padding: '10px', display: 'inline-block', borderRadius: '6px', marginBottom: '8px' }}>
      <QRCodeSVG value={JSON.stringify({ shopId, couponType: 'normal', token: fcmToken })} size={150} />
    </div>
    <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>会計時にこちらのQRコードをスタッフにご提示ください（常設特典）</p>
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
        <button
          onClick={handleSubscribe}
          disabled={status === 'requesting'}
          style={{ width: '100%', padding: 16, fontSize: 16, background: status === 'requesting' ? '#ccc' : '#ff4500', color: '#fff', border: 'none', borderRadius: 8, cursor: status === 'requesting' ? 'wait' : 'pointer', fontWeight: 'bold' }}
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
