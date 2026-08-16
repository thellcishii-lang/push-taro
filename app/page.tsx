'use client';

'use client';

import { useState, useEffect } from 'react';
import { requestFCMToken, onForegroundMessage } from '../lib/firebase-client';

export default function LandingPage() {
  // === 切り分け用: ページ読み込み確認 ===
  const [debugInfo, setDebugInfo] = useState('ページ読み込み中...');

  const [status, setStatus] = useState<'idle' | 'requesting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [shopId, setShopId] = useState('');

  useEffect(() => {
    setDebugInfo('JSは動いています');
    
    const params = new URLSearchParams(window.location.search);
    const s = params.get('s');
    setDebugInfo(prev => prev + ` | s=${s || 'なし'}`);
    
    if (!s) {
      setStatus('error');
      setMessage('無効なアクセスです');
      return;
    }
    setShopId(s);
    setDebugInfo(prev => prev + ` | shopId設定完了`);
  }, []);

  // ... 以降は同じ

  const handleSubscribe = async () => {
    console.log('[PAGE CHECK 3] === ボタン押下 ===');
    console.log('[PAGE CHECK 3] shopId =', shopId);

    if (!shopId) {
      console.error('[PAGE CHECK 3] エラー: shopIdが空');
      setStatus('error');
      setMessage('店舗IDが取得できていません。QRコードからアクセスしてください。');
      return;
    }

    setStatus('requesting');
    setMessage('');

    try {
      // CHECK 4: 通知許可（iPhone対策なし・以前のまま）
      console.log('[PAGE CHECK 4] 通知許可要求...');
      const permission = await Notification.requestPermission();
      console.log('[PAGE CHECK 4] 通知許可結果:', permission);
      
      if (permission !== 'granted') {
        setStatus('error');
        setMessage('通知を許可しないと受け取れません。');
        return;
      }

      // CHECK 5: FCMトークン取得
      console.log('[PAGE CHECK 5] FCMトークン取得...');
      const token = await requestFCMToken();
      console.log('[PAGE CHECK 5] FCMトークン:', token ? '取得成功' : 'null/失敗');
      
      if (!token) {
        setStatus('error');
        setMessage('トークン取得に失敗しました。');
        return;
      }

      // CHECK 6: APIへ送信（shopIdを含める）
      console.log('[PAGE CHECK 6] /api/subscribe 送信:', {
        token: token.slice(0, 20) + '...',
        shopId: shopId
      });

      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, shopId }),
      });

      console.log('[PAGE CHECK 6] APIレスポンス status:', res.status);
      const resData = await res.json().catch(() => ({}));
      console.log('[PAGE CHECK 6] APIレスポンス body:', resData);

      if (!res.ok) {
        throw new Error(resData.error || `HTTP ${res.status}`);
      }

      console.log('[PAGE CHECK 7] 登録成功!');
      setStatus('success');
      setMessage('✅ 通知の受け取り登録が完了しました！');

    } catch (err: any) {
      console.error('[PAGE CHECK ERROR] 例外:', err);
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
