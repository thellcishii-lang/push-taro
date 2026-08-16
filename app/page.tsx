'use client';

import { useState, useEffect } from 'react';
import { requestFCMToken, onForegroundMessage } from '../lib/firebase-client';

export default function LandingPage() {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [shopId, setShopId] = useState('');

  // CHECK 1: URLから shopId を取得
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('s');
    console.log('[CHECK 1] URLパラメータ s =', s);

    if (!s) {
      console.error('[CHECK 1] shopId がURLにない');
      setStatus('error');
      setMessage('無効なアクセスです。QRコードからアクセスしてください。');
      return;
    }
    setShopId(s);
  }, []);

  // CHECK 2: フォアグラウンド通知受信（アプリ起動中も通知を検知）
  useEffect(() => {
    console.log('[CHECK 2] フォアグラウンド通知リスナー設定');
    const unsub = onForegroundMessage((payload) => {
      console.log('[CHECK 2] フォアグラウンド受信:', payload);
      if (payload.data?.title) {
        setMessage(`📢 ${payload.data.title}`);
        setTimeout(() => setMessage(''), 5000);
      }
    });
    return () => unsub();
  }, []);

  const handleSubscribe = async () => {
    // CHECK 3: shopId が取得できているか
    console.log('[CHECK 3] ボタン押下。shopId =', shopId);
    if (!shopId) {
      console.error('[CHECK 3] shopId が空');
      setStatus('error');
      setMessage('店舗IDが取得できていません。QRコードからアクセスしてください。');
      return;
    }

    setStatus('requesting');
    setMessage('');

    try {
      // CHECK 4: 通知許可
      const permission = await Notification.requestPermission();
      console.log('[CHECK 4] 通知許可結果:', permission);
      if (permission !== 'granted') {
        setStatus('error');
        setMessage('通知を許可しないと受け取れません。');
        return;
      }

      // CHECK 5: FCMトークン取得
      const token = await requestFCMToken();
      console.log('[CHECK 5] FCMトークン:', token ? '取得成功' : 'null/失敗');
      if (!token) {
        setStatus('error');
        setMessage('トークン取得に失敗しました。');
        return;
      }

      // CHECK 6: /api/subscribe へ送信（shopId を含める！）
      console.log('[CHECK 6] /api/subscribe 送信:', {
        token: token.slice(0, 20) + '...',
        shopId: shopId,
      });

      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, shopId }), // ← 修正点：shopId を追加
      });

      console.log('[CHECK 6] APIレスポンス status:', res.status);
      const resData = await res.json().catch(() => ({}));
      console.log('[CHECK 6] APIレスポンス body:', resData);

      if (!res.ok) {
        throw new Error(resData.error || `HTTP ${res.status}`);
      }

      setStatus('success');
      setMessage('✅ 通知の受け取り登録が完了しました！');
    } catch (err: any) {
      console.error('[CHECK 7] エラー:', err);
      setStatus('error');
      setMessage('エラー: ' + err.message);
    }
  };

  return (
    <main style={{ padding: 24, maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>🚀 プッシュ太郎</h1>
      <p>お得な情報をプッシュ通知でお届けします</p>

      {status === 'success' ? (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <div style={{ fontSize: 64 }}>✅</div>
          <p>{message}</p>
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

      {status === 'error' && (
        <p style={{ color: 'red', marginTop: 16 }}>{message}</p>
      )}
    </main>
  );
}
