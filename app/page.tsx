'use client';

import { useState } from 'react';
import { requestFCMToken } from './lib/firebase-client';

export default function LandingPage() {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async () => {
    setStatus('requesting');
    setMessage('');

    try {
      // ブラウザの通知許可を求める
      const permission = await Notification.requestPermission();
      console.log('[LP] 通知許可:', permission);

      if (permission !== 'granted') {
        setStatus('error');
        setMessage('通知を許可しないと受け取れません。ブラウザの設定から通知をオンにしてください。');
        return;
      }

      // FCMトークン取得
      const token = await requestFCMToken();
      console.log('[LP] FCMトークン:', token ? '取得成功' : 'null');

      if (!token) {
        setStatus('error');
        setMessage('通知の設定に失敗しました。iPhoneの場合は「ホーム画面に追加」から開いてください。');
        return;
      }

      // all_users トピックに登録
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      console.log('[LP] subscribe API:', data);

      if (!res.ok) {
        throw new Error(data.error || '登録失敗');
      }

      setStatus('success');
      setMessage('✅ 通知の受け取り登録が完了しました！お得な情報をお届けします。');
    } catch (err: any) {
      console.error('[LP] エラー:', err);
      setStatus('error');
      setMessage('エラーが発生しました: ' + err.message);
    }
  };

  return (
    <main style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '60px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>🚀 プッシュ太郎</h1>
      <p style={{ color: '#666', fontSize: '18px', marginBottom: '40px' }}>
        お得な情報をプッシュ通知でお届けします。<br />
        下のボタンから通知を受け取る設定をしてください。
      </p>

      {status === 'success' ? (
        <div style={{ padding: '30px', background: '#e8f5e9', borderRadius: '12px' }}>
          <h2 style={{ color: '#2e7d32', margin: '0 0 10px' }}>🎉 登録完了！</h2>
          <p style={{ color: '#333', margin: 0 }}>{message}</p>
        </div>
      ) : (
        <button
          onClick={handleSubscribe}
          disabled={status === 'requesting'}
          style={{
            padding: '18px 48px',
            fontSize: '20px',
            fontWeight: 'bold',
            background: status === 'requesting' ? '#ccc' : '#ff4500',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: status === 'requesting' ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          {status === 'requesting' ? '設定中...' : '🔔 通知を受け取る'}
        </button>
      )}

      {status === 'error' && (
        <p style={{ color: '#d32f2f', marginTop: '20px', fontWeight: 'bold' }}>{message}</p>
      )}

      <div style={{ marginTop: '60px', padding: '20px', background: '#f9f9f9', borderRadius: '8px', textAlign: 'left' }}>
        <h3 style={{ margin: '0 0 10px', fontSize: '16px' }}>📱 対応端末</h3>
        <ul style={{ color: '#666', fontSize: '14px', lineHeight: 1.8, paddingLeft: '20px' }}>
          <li>Android Chrome</li>
          <li>iPhone Safari（ホーム画面に追加が必要）</li>
          <li>PC Chrome</li>
        </ul>
      </div>

      <footer style={{ marginTop: '40px', color: '#999', fontSize: '12px' }}>
        © プッシュ太郎
      </footer>
    </main>
  );
}
