'use client';

import { useState, useEffect } from 'react';
import { requestFCMToken, onForegroundMessage } from '../lib/firebase-client';

export default function LandingPage() {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [shopId, setShopId] = useState('');

  // CHECK 1: URLから shopId を取得 + localStorage 復元
  useEffect(() => {
    console.log('[CHECK 1] === ページ読み込み ===');
    console.log('[CHECK 1] URL:', window.location.href);
    console.log('[DEBUG] 現在の localStorage shopId:', localStorage.getItem('push_taro_shop_id'));
　　　　　　　　console.log('[DEBUG] 現在の document.cookie:', document.cookie);

    const params = new URLSearchParams(window.location.search);
    const s = params.get('s');
    console.log('[CHECK 1] URLから取得 s =', s);

    if (s) {
      // 初回アクセス: URLから取得 → localStorageに保存
      setShopId(s);
      localStorage.setItem('push_taro_shop_id', s);
      console.log('[CHECK 1] shopId設定完了(URL). localStorage保存:', s);
    } else {
      // 2回目以降(PWA): localStorageから復元
      const saved = localStorage.getItem('push_taro_shop_id');
      console.log('[CHECK 1] localStorageから復元:', saved);
      if (saved) {
        setShopId(saved);
        console.log('[CHECK 1] shopId設定完了(localStorage):', saved);
      } else {
        console.error('[CHECK 1] エラー: shopId取得不可');
        setStatus('error');
        setMessage('無効なアクセスです。QRコードからアクセスしてください。');
      }
    }
  }, []);

  // CHECK 2: フォアグラウンド通知リスナー
  useEffect(() => {
    console.log('[CHECK 2] フォアグラウンド通知リスナー設定');
    const unsub = onForegroundMessage((payload) => {
      console.log('[CHECK 2] フォアグラウンド受信:', payload);
    });
    return () => unsub();
  }, []);

  const handleSubscribe = async () => {
    console.log('[CHECK 3] === ボタン押下 ===');

    // CHECK 3: shopId確認（state → localStorageフォールバック）
    let effectiveShopId = shopId;
    if (!effectiveShopId) {
      effectiveShopId = localStorage.getItem('push_taro_shop_id') || '';
      console.log('[CHECK 3] state空 → localStorageフォールバック:', effectiveShopId);
    }

    if (!effectiveShopId) {
      console.error('[CHECK 3] エラー: shopIdが空');
      setStatus('error');
      setMessage('店舗IDが取得できていません。QRコードからアクセスしてください。');
      return;
    }

    // CHECK 4: iOS判定 + ホーム画面追加チェック
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = (window.navigator as any).standalone === true;
    console.log('[CHECK 4] iOS判定:', isIOS, '| standalone:', isStandalone);

    if (isIOS && !isStandalone) {
      console.error('[CHECK 4] エラー: iOSでホーム画面追加されていない');
      setStatus('error');
      setMessage(
        'iPhoneでは「ホーム画面に追加」が必要です。\n' +
        'Safariの「共有」→「ホーム画面に追加」を行ってから、このアプリを開いてください。'
      );
      return;
    }

    setStatus('requesting');
    setMessage('');

    try {
      // CHECK 5: 通知許可（iOS対応: ボタン直後に呼ぶ）
      console.log('[CHECK 5] Notification.requestPermission() 呼び出し...');
      const permission = await Notification.requestPermission();
      console.log('[CHECK 5] 通知許可結果:', permission);

      if (permission !== 'granted') {
        setStatus('error');
        setMessage('通知を許可しないと受け取れません。');
        return;
      }

      // CHECK 6: FCMトークン取得
      console.log('[CHECK 6] FCMトークン取得...');
      const token = await requestFCMToken();
      console.log('[CHECK 6] FCMトークン:', token ? '取得成功' : 'null/失敗');

      if (!token) {
        setStatus('error');
        setMessage('トークン取得に失敗しました。');
        return;
      }

      // CHECK 7: /api/subscribe へ送信
      console.log('[CHECK 7] /api/subscribe 送信:', {
        token: token.slice(0, 20) + '...',
        shopId: effectiveShopId,
      });

      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, shopId: effectiveShopId }),
      });

      console.log('[CHECK 7] APIレスポンス status:', res.status);
      const resData = await res.json().catch(() => ({}));
      console.log('[CHECK 7] APIレスポンス body:', resData);

      if (!res.ok) {
        throw new Error(resData.error || `HTTP ${res.status}`);
      }

      console.log('[CHECK 8] 登録成功!');
      setStatus('success');
      setMessage('✅ 通知の受け取り登録が完了しました！');

    } catch (err: any) {
      console.error('[CHECK ERROR] 例外:', err);
      setStatus('error');
      setMessage('エラー: ' + err.message);
    }
  };

  return (
    <main style={{ padding: 24, maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif' }}>
            <div style={{ background: '#f0f0f0', padding: '10px', marginBottom: '20px', fontSize: '14px', borderRadius: '8px' }}>
              <p><strong>🔍 デバッグ情報</strong></p>
              <p>shopId (state): <strong>{shopId || '（未設定）'}</strong></p>
              <p>localStorage: <strong>{localStorage.getItem('push_taro_shop_id') || '（空）'}</strong></p>
              <p>URL: <strong>{window.location.href}</strong></p>
　　　　　　　　　　　　　　　　　　　　　　　</div>
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
        <p style={{ color: 'red', marginTop: 16, whiteSpace: 'pre-line' }}>{message}</p>
      )}
    </main>
  );
}
