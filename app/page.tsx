'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { requestFCMToken } from 'lib/firebase-client';

export default function CustomerPage() {
  const searchParams = useSearchParams();
  const shopId = searchParams.get('s');

  const [status, setStatus] = useState<'idle' | 'requesting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [shopName, setShopName] = useState('');
  const [coupon, setCoupon] = useState<any>(null);
  const [linkUrl, setLinkUrl] = useState('');

  useEffect(() => {
    if (!shopId) return;

    // 店舗情報取得
    fetch(`/api/shop-info?s=${shopId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setShopName(data.name);
          setCoupon(data.coupon);
          setLinkUrl(data.linkUrl);
        }
      });

    // 既存トークン確認
    const saved = localStorage.getItem(`fcm_token_${shopId}`);
    if (saved) {
      setStatus('success');
      setMessage('✅ すでに通知の受け取り登録が完了しています');
    }
  }, [shopId]);

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
      if (!token) {
        setStatus('error');
        setMessage('トークン取得に失敗しました。');
        return;
      }

      localStorage.setItem(`fcm_token_${shopId}`, token);

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

  const handleUnsubscribe = async () => {
    if (!shopId) return;
    const token = localStorage.getItem(`fcm_token_${shopId}`);
    if (!token) {
      setMessage('トークンが見つかりません');
      return;
    }
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, shopId }),
      });
      if (res.ok) {
        localStorage.removeItem(`fcm_token_${shopId}`);
        setStatus('idle');
        setMessage('✅ 通知を停止しました');
      } else {
        setMessage('❌ 停止に失敗しました');
      }
    } catch (err: any) {
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

      {/* 初回クーポン表示 */}
      {status === 'success' && coupon?.enabled && (
        <div style={{ marginTop: '20px', padding: '20px', background: '#fff3e0', borderRadius: '8px', border: '2px dashed #ff9800' }}>
          <h2>🎫 {coupon.title || '初回限定クーポン'}</h2>
          <p>{coupon.description}</p>
          {coupon.discountRate > 0 && <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#e65100' }}>{coupon.discountRate}% OFF</p>}
          <p style={{ fontSize: '12px', color: '#666' }}>※ クーポンは通知受信後、ホーム画面からアクセスできます</p>
        </div>
      )}

      <div style={{ marginTop: '40px' }}>
        {status === 'success' ? (
          <div style={{ padding: '20px', background: '#e8f5e9', borderRadius: '8px' }}>
            <p style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '18px' }}>{message}</p>
            <button
              onClick={handleUnsubscribe}
              style={{ marginTop: '16px', padding: '10px 24px', fontSize: '16px', background: '#666', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              🔔 通知を停止する
            </button>
          </div>
        ) : (
          <button
            onClick={handleSubscribe}
            disabled={status === 'requesting'}
            style={{ padding: '16px 32px', fontSize: '18px', fontWeight: 'bold', background: status === 'requesting' ? '#ccc' : '#ff4500', color: '#fff', border: 'none', borderRadius: '8px', cursor: status === 'requesting' ? 'not-allowed' : 'pointer' }}
          >
            {status === 'requesting' ? '登録中...' : '🔔 通知を受け取る'}
          </button>
        )}

        {status === 'error' && (
          <p style={{ marginTop: '20px', color: '#d32f2f', fontWeight: 'bold' }}>{message}</p>
        )}
      </div>
    </main>
  );
}
