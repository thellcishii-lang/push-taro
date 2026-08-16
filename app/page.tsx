'use client';

import { useState, useEffect } from 'react';
import { requestFCMToken, onForegroundMessage } from '../lib/firebase-client';

export default function LandingPage() {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [shopId, setShopId] = useState('');
  const [isIos, setIsIos] = useState(false);

  // CHECK 1: URLから shopId を取得 + iOS判定
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('s');
    console.log('[CHECK 1] URLパラメータ s =', s);

    if (!s) {
      setStatus('error');
      setMessage('無効なアクセスです。QRコードからアクセスしてください。');
      return;
    }
    setShopId(s);

    // iOS判定
    const ua = navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua);
    setIsIos(ios);
    console.log('[CHECK 1] iOS判定:', ios);
  }, []);

  // CHECK 2: フォアグラウンド通知受信
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
    console.log('[CHECK 3] ボタン押下。shopId =', shopId);

    if (!shopId) {
      setStatus('error');
      setMessage('店舗IDが取得できていません。QRコードからアクセスしてください。');
      return;
    }

    // ✅ iOS Safari対応: Notification API がない場合
    if (typeof Notification === 'undefined') {
      console.log('[CHECK 3] Notification API なし（iOS Safari）');
      setStatus('error');
      setMessage(
        'iPhoneのSafariでは、まず「ホーム画面に追加」してください。' +
        'Safari下部の「共有」→「ホーム画面に追加」を押し、' +
        '追加したアプリから再度アクセスしてください。'
      );
      return;
    }

    setStatus('requesting');
    setMessage('');

    try {
      const permission = await Notification.requestPermission();
      console.log('[CHECK 4] 通知許可結果:', permission);
      if (permission !== 'granted') {
        setStatus('error');
        setMessage('通知を許可しないと受け取れません。');
        return;
      }

      const token = await requestFCMToken();
      console.log('[CHECK 5] FCMトークン:', token ? '取得成功' : 'null/失敗');
      if (!token) {
        setStatus('error');
        setMessage('トークン取得に失敗しました。');
        return;
      }

      console.log('[CHECK 6] /api/subscribe 送信:', {
        token: token.slice(0, 20) + '...',
        shopId: shopId,
      });

      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, shopId }),
      });

      console.log('[CHECK 6] APIレスポンス status:', res.status);
      const resData = await res.json().catch(() => ({}));
      console.log('[CHECK 6] APIレスポンス body:', resData);

      if (!res.ok) throw new Error(resData.error || `HTTP ${res.status}`);

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

      {isIos && (
        <div style={{ background: '#fff3cd', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
          📱 <strong>iPhoneをお使いの方へ</strong><br />
          通知を受け取るには、Safariの「共有」→「ホーム画面に追加」を押してから、このアプリを開いてください。
        </div>
      )}

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
        <p style={{ color: 'red', marginTop: 16, whiteSpace: 'pre-line' }}>{message}</p>
      )}
    </main>
  );
}
