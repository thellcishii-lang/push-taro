'use client';

import { useState } from 'react';
import { requestFCMToken } from 'lib/firebase-client';

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
  const handleUnsubscribe = async () => {
  const token = localStorage.getItem('fcm_token');
  if (!token) {
    setMessage('トークンが見つかりません');
    return;
  }
  try {
    const res = await fetch('/api/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if (res.ok) {
      localStorage.removeItem('fcm_token');
      setMessage('✅ 通知を停止しました');
    } else {
      setMessage('❌ 停止に失敗しました');
    }
  } catch (err: any) {
    setMessage('エラー: ' + err.message);
  }
};

  return (
    <main style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🚀 プッシュ太郎</h1>
      <p style={{ color: '#666', fontSize: '16px' }}>
        お得な情報をプッシュ通知でお届けします
      </p>

      <div style={{ marginTop: '40px' }}>
        {status === 'success' ? (
          <div style={{ padding: '20px', background: '#e8f5e9', borderRadius: '8px' }}>
            <p style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '18px' }}>{message}</p>
          </div>
        ) : (
          <button
            onClick={handleSubscribe}
            disabled={status === 'requesting'}
            style={{
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: 'bold',
              background: status === 'requesting' ? '#ccc' : '#ff4500',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: status === 'requesting' ? 'not-allowed' : 'pointer',
            }}
          >
            {status === 'requesting' ? '登録中...' : '🔔 通知を受け取る'}
          </button>
        )}

        {status === 'error' && (
          <p style={{ marginTop: '20px', color: '#d32f2f', fontWeight: 'bold' }}>{message}</p>
        )}
      </div>

      <div style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
        <a href="/admin" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>
          お店の方はこちら →
        </a>
      </div>
    </main>
  );
}
