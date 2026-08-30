'use client';

import { useState, useEffect } from 'react';
import { requestFCMToken, onForegroundMessage } from '../lib/firebase-client';
import { QRCodeSVG } from 'qrcode.react';

export default function LandingPage() {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [shopId, setShopId] = useState('');
  
  // 画面状態管理
  const [isRegistered, setIsRegistered] = useState(false);
  const [fcmToken, setFcmToken] = useState('');
  const [shopData, setShopData] = useState<any>(null);

  // 🎂 誕生日入力用ステート（Proプラン専用）
  const [birthDate, setBirthDate] = useState('');
  
  // 折りたたみ（アコーディオン）用のステート
  const [tokenOpen, setTokenOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [couponUsed, setCouponUsed] = useState(false);

  // 🔴 iOS関連のステート
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  // URLから shopId 取得 + localStorage 復元
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('s');

    // iOS判定
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const standalone = (window.navigator as any).standalone === true;
    setIsIOS(ios);
    setIsStandalone(standalone);

    if (ios && !standalone) {
      console.log('[iOS] ホーム画面未追加状態でのアクセス');
    }

    if (s) {
      setShopId(s);
      localStorage.setItem('push_taro_shop_id', s);
    } else {
      const saved = localStorage.getItem('push_taro_shop_id');
      if (saved) {
        setShopId(saved);
      } else {
        setStatus('error');
        setMessage('無効なアクセスです。QRコードからアクセスしてください。');
      }
    }
  }, []);

  // 店舗情報の取得
  useEffect(() => {
    if (!shopId) return;

    fetch(`/api/shop-info?s=${shopId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setShopData(data.shop || data);
        }
      })
      .catch(err => console.error('店舗情報取得エラー:', err));

    // すでに登録済み（トークンがある）なら顧客画面へ直行
    const savedToken = localStorage.getItem(`push_taro_token_${shopId}`);
    if (savedToken) {
      setFcmToken(savedToken);
      setIsRegistered(true);
    }
  }, [shopId]);

  // manifest や iOS用メタタグの設定
  useEffect(() => {
    if (shopId && shopId !== 'placeholder' && shopId !== 'undefined') {
      const link = document.querySelector('link[rel="manifest"]');
      if (link) {
        link.setAttribute('href', `/manifest/${shopId}`);
      }
    }
  }, [shopId]);

  // フォアグラウンド通知受信
  useEffect(() => {
    const unsub = onForegroundMessage((payload) => {
      const title = payload.data?.title || shopData?.name || 'プッシュ太郎';
      const options = {
        body: payload.data?.body || '',
        icon: shopData?.iconUrl || '/icon-192x192.png',
        image: payload.data?.image,
        data: { url: payload.data?.url || '/' },
        tag: payload.data?.shopId || 'default',
      };

      if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, options);
        });
      }
    });

    return () => unsub();
  }, [shopData]);

  const handleSubscribe = async () => {
    let effectiveShopId = shopId;
    if (!effectiveShopId) {
      effectiveShopId = localStorage.getItem('push_taro_shop_id') || '';
    }

    if (!effectiveShopId) {
      setStatus('error');
      setMessage('店舗IDが取得できていません。QRコードからアクセスしてください。');
      return;
    }

    // 🎂 Proプランの場合は誕生日の入力を必須チェック
    if (shopData?.plan === 'pro' && !birthDate) {
      setStatus('error');
      setMessage('バースデークーポン受取のため、生年月日を選択してください。');
      return;
    }

    // iOSチェック: ホーム画面追加済みか確認（エラーメッセージ改善）
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const standalone = (window.navigator as any).standalone === true;

    if (ios && !standalone) {
      setStatus('error');
      setMessage(
        '📱 iPhoneでは「ホーム画面に追加」が必要です。\n\n' +
        '① Safariの「共有」ボタン（□に↑のアイコン）をタップ\n' +
        '② 「ホーム画面に追加」を選択\n' +
        '③ ホーム画面に追加されたアイコンから再度開いてください。'
      );
      return;
    }

    setStatus('requesting');
    setMessage('');

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setStatus('error');
        setMessage(
          '🔕 通知が許可されていません。\n\n' +
          (ios 
            ? 'iPhoneの設定 → 通知 → Safari → 通知を許可 に変更してください。'
            : 'ブラウザの設定から通知を許可してください。'
          )
        );
        return;
      }

      // requestFCMToken を try-catch でラップ（エラー処理強化）
      let token: string | null = null;
      try {
        token = await requestFCMToken();
      } catch (fcmError: any) {
        console.error('[handleSubscribe] FCM Error:', fcmError);
        
        if (fcmError.message === 'IOS_REQUIRES_STANDALONE') {
          setStatus('error');
          setMessage(
            '📱 iPhoneでは「ホーム画面に追加」が必要です。\n\n' +
            'Safariの「共有」→「ホーム画面に追加」を実行し、\n' +
            'ホーム画面のアイコンから再度開いてください。'
          );
          return;
        }
        if (fcmError.message === 'PERMISSION_BLOCKED') {
          setStatus('error');
          setMessage(
            '🔕 通知がブロックされています。\n\n' +
            'iPhoneの設定 → 通知 → Safari → 通知を許可 に変更してください。'
          );
          return;
        }
        if (fcmError.message === 'MESSAGING_NOT_AVAILABLE') {
          setStatus('error');
          setMessage(
            '⚠️ お使いのブラウザはプッシュ通知に対応していません。\n' +
            'Chrome / Safari 最新版をご使用ください。'
          );
          return;
        }
        throw fcmError;
      }

      if (!token) {
        setStatus('error');
        setMessage('トークン取得に失敗しました。\n数秒待ってからもう一度お試しください。');
        return;
      }

      // 登録API呼び出し（birthDate を追加送信）
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
      setMessage('✅ 通知の受け取りが完了しました！');

      // ⏳ 3秒後に顧客画面へ切り替え
      setTimeout(() => {
        setIsRegistered(true);
      }, 3000);

    } catch (err: any) {
      console.error('[handleSubscribe] Error:', err);
      setStatus('error');
      setMessage('❌ エラーが発生しました: ' + err.message);
    }
  };

  // --- 📱 【登録完了後の顧客画面】 ---
  if (isRegistered) {
    return (
      <main style={{ padding: 20, maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif' }}>
        {/* 1. 店舗情報（アイコン・店名・リンク） */}
        <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '20px' }}>
          {shopData?.iconUrl ? (
            <img src={shopData.iconUrl} alt="店舗アイコン" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px auto' }} />
          ) : (
            <div style={{ width: '64px', height: '64px', background: '#e0e0e0', borderRadius: '50%', margin: '0 auto 10px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              🏪
            </div>
          )}
          <h2 style={{ margin: '0 0 8px 0' }}>{shopData?.name || '登録店舗'}</h2>
          {shopData?.linkUrl && (
            <a href={shopData.linkUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2196F3', fontSize: '14px', wordBreak: 'break-all' }}>
              {shopData.linkUrl}
            </a>
          )}
        </div>

        {/* 2. 初回クーポン（使うと消える仕様） */}
        {shopData?.coupon?.enabled && !couponUsed && (
          <div style={{ background: '#fff3e0', border: '1px dashed #ffb74d', padding: '16px', borderRadius: '8px', marginBottom: '25px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#e65100' }}>🎁 {shopData.coupon.title || '初回限定クーポン'}</h3>
            <p style={{ fontSize: '14px', color: '#333', marginBottom: '12px' }}>{shopData.coupon.description}</p>
            
            <div style={{ background: '#fff', padding: '10px', display: 'inline-block', borderRadius: '6px', marginBottom: '12px' }}>
              <QRCodeSVG value={shopId} size={150} />
            </div>

            <div>
              <button
                onClick={() => setCouponUsed(true)}
                style={{ padding: '8px 16px', background: '#ff9800', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
              >
                クーポンを使用済みにする（消す）
              </button>
            </div>
          </div>
        )}

        {/* 3. 通知履歴（履歴ボタンで展開） */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            style={{ width: '100%', padding: '12px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>📜 通知履歴</span>
            <span>{historyOpen ? '▲ 閉じる' : '▼ 展開する'}</span>
          </button>

          {historyOpen && (
            <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ fontSize: '13px', color: '#666', textAlign: 'center', margin: '10px 0' }}>
                （受信した通知がここに最大20件表示されます）
              </p>
            </div>
          )}
        </div>
      </main>
    );
  }

  // --- 🔔 【初期の通知許可画面】 ---
  return (
    <main style={{ padding: 24, maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
      {/* 店舗アイコンと店舗名を動的に表示（未取得時はデフォルト） */}
      <div style={{ marginTop: 40, marginBottom: 20 }}>
        {shopData?.iconUrl ? (
          <img src={shopData.iconUrl} alt="店舗アイコン" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px auto' }} />
        ) : (
          <div style={{ width: '64px', height: '64px', background: '#f0f0f0', borderRadius: '50%', margin: '0 auto 10px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
            🏪
          </div>
        )}
        <h1 style={{ fontSize: '22px', margin: '0 0 8px 0' }}>{shopData?.name || 'プッシュ太郎'}</h1>
        <p style={{ color: '#666', fontSize: '14px' }}>お得な情報をプッシュ通知でお届けします</p>
      </div>

      {/* iOSホーム画面未追加の警告表示 */}
      {isIOS && !isStandalone && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '16px', 
          background: '#fff3cd', 
          border: '1px solid #ffc107', 
          borderRadius: '8px',
          textAlign: 'left'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#856404' }}>
            📱 iPhoneをご利用の方へ
          </p>
          <p style={{ margin: 0, fontSize: '13px', color: '#856404' }}>
            通知を受け取るには、まず <strong>「ホーム画面に追加」</strong> が必要です。<br />
            Safariの「共有」ボタン →「ホーム画面に追加」を実行してください。
          </p>
        </div>
      )}

      {/* 🎂 Proプラン店舗限定：生年月日入力フォーム */}
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
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              boxSizing: 'border-box',
              background: '#fff',
            }}
          />
          <p style={{ fontSize: '11px', color: '#64748b', margin: '6px 0 0 0' }}>
            ※お誕生月のお得なクーポンをお送りするために使用します。
          </p>
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
          style={{
            width: '100%',
            padding: 16,
            fontSize: 16,
            background: status === 'requesting' ? '#ccc' : '#ff4500',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: status === 'requesting' ? 'wait' : 'pointer',
            fontWeight: 'bold',
          }}
        >
          {status === 'requesting' ? '登録中...' : '🔔 通知を受け取る'}
        </button>
      )}

      {status === 'error' && (
        <div style={{ 
          marginTop: 16, 
          padding: '14px', 
          background: '#f8d7da', 
          borderRadius: '8px', 
          border: '1px solid #f5c6cb',
          textAlign: 'left'
        }}>
          <p style={{ 
            color: '#721c24', 
            whiteSpace: 'pre-line', 
            fontSize: '14px', 
            margin: 0,
            lineHeight: 1.6
          }}>
            {message}
          </p>
        </div>
      )}
    </main>
  );
}
