'use client';

import { useState } from 'react';
import { requestFCMToken } from '../lib/firebase-client';

export default function LandingPage() {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async () => {
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
        body: JSON.stringify({ token }),
      });

      if (!res.ok) throw new Error('登録失敗');

      setStatus('success');
      setMessage('✅ 通知の受け取り登録が完了しました！');
    } catch (err: any) {
      setStatus('error');
      setMessage('エラー: ' + err.message);
    }
  };

  return (
    <main style={{ textAlign: 'center', padding: '60px 20px', fontFamily: 'sans-serif' }}>
      <h1>🚀 プッシュ太郎</h1>
      <p style={{ color: '#666', fontSize: '18px', marginBottom: '40px' }}>
        お得な情報をプッシュ通知でお届けします
      </p>

      {status === 'success' ? (
        <div style={{ padding: '20px', background: '#e8f5e9', borderRadius: '8px' }}>
          <p style={{ color: '#2e7d32', fontWeight: 'bold', margin: 0 }}>{message}</p>
        </div>
      ) : (
        <button
          onClick={handleSubscribe}
          disabled={status === 'requesting'}
          style={{
            padding: '16px 48px',
            fontSize: '20px',
            fontWeight: 'bold',
            background: status === 'requesting' ? '#ccc' : '#ff4500',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          {status === 'requesting' ? '設定中...' : '🔔 通知を受け取る'}
        </button>
      )}

      {status === 'error' && (
        <p style={{ color: '#d32f2f', marginTop: '20px' }}>{message}</p>
      )}
    </main>
  );
}
