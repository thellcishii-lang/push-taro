'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { requestFCMToken } from 'lib/firebase-client';

function CustomerPageContent() {
  const searchParams = useSearchParams();
  const urlShopId = searchParams.get('s');

  const [shopId, setShopId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'requesting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [shopName, setShopName] = useState('');
  const [coupon, setCoupon] = useState<any>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [notificationSupported, setNotificationSupported] = useState(true);

  // shopId取得（URL or localStorage）
  useEffect(() => {
    let s = urlShopId;
    if (!s) {
      s = localStorage.getItem('last_shop_id');
    }
    if (s) {
      localStorage.setItem('last_shop_id', s);
      setShopId(s);
    }
  }, [urlShopId]);

  // 店舗情報取得 + Notification対応チェック
  useEffect(() => {
    if (!shopId) return;

    fetch(`/api/shop-info?s=${shopId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setShopName(data.name);
          setCoupon(data.coupon);
          setLinkUrl(data.linkUrl);
        }
      });

    if (typeof Notification === 'undefined') {
      setNotificationSupported(false);
    }
  }, [shopId]);

  const handleSubscribe = async () => {
    if (!shopId) return;

    if (!notificationSupported) {
      setStatus('error');
      setMessage('このブラウザは通知に対応していません。Safariで「ホーム画面に追加」後にお試しください。');
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
        body: JSON.stringify({ token, shopId }),
      });

      if (!res.ok) throw new Error('登録失敗');

      setStatus('success');
      setMessage('✅ 通知の受け取り登録が完了しました！');
    } catch (err: any) {
      setStatus('error');
      setMessage('エラー: ' + err.message);
    }
  };

  if (!shopId) {
    return (
      <main style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center', padding: '20px' }}>
        <h1>🚀 プッシュ太郎</h1>
        <p style={{ color: '#d32f2f' }}>QRコードからアクセスしてください</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🚀 {shopName || '...'} のお知らせ</h1>
      <p style={{ color: '#666', fontSize: '16px' }}>
        お得な情報をプッシュ通知でお届けします
      </p>

      {!notificationSupported && (
        <div style={{ marginTop: '15px', padding: '15px', background: '#fff3e0', borderRadius: '8px', fontSize: '14px', color: '#e65100', textAlign: 'left' }}>
          <strong>📱 iPhoneをお使いの方へ</strong><br />
          1. Safariの<strong>共有ボタン</strong>（□に↑）をタップ<br />
          2. <strong>「ホーム画面に追加」</strong>を選択<br />
          3. ホーム画面のアイコンから開いて通知登録
        </div>
      )}

      {coupon?.enabled && (
        <div style={{ marginTop: '20px', padding: '20px', background: '#fff3e0', borderRadius: '8px', border: '2px dashed #ff9800' }}>
          <h2>🎫 {coupon.title || '初回限定クーポン'}</h2>
          <p>{coupon.description}</p>
          {coupon.discountRate > 0 && <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#e65100' }}>{coupon.discountRate}% OFF</p>}
          <p style={{ fontSize: '12px', color: '#666' }}>※ クーポンは通知受信後、ホーム画面からアクセスできます</p>
        </div>
      )}

      <div style={{ marginTop: '40px' }}>
        <button
          onClick={handleSubscribe}
          disabled={status === 'requesting' || !notificationSupported}
          style={{
            padding: '16px 32px',
            fontSize: '18px',
            fontWeight: 'bold',
            background: status === 'requesting' ? '#ccc' : !notificationSupported ? '#ccc' : '#ff4500',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: status === 'requesting' || !notificationSupported ? 'not-allowed' : 'pointer',
          }}
        >
          {!notificationSupported ? 'Safariでホーム画面に追加してください' : status === 'requesting' ? '登録中...' : '🔔 通知を受け取る'}
        </button>

        {message && (
          <p style={{ marginTop: '20px', fontWeight: 'bold', color: message.includes('❌') || message.includes('エラー') ? '#d32f2f' : '#2e7d32' }}>
            {message}
          </p>
        )}
      </div>
    </main>
  );
}

export default function CustomerPage() {
  return (
    <Suspense fallback={<main style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center' }}><p>読み込み中...</p></main>}>
      <CustomerPageContent />
    </Suspense>
  );
}
