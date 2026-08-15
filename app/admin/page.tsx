'use client';

import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../../lib/firebase-client';
import ImageUploader from '../../components/ImageUploader';
import { db as localDb, exportHistoryToJSON, importHistoryFromJSON, PushHistory } from '../../lib/db';
import { QRCodeSVG } from 'qrcode.react';

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 店舗情報
  const [shopId, setShopId] = useState<string | null>(null);
  const [shopName, setShopName] = useState('');
  const [couponEnabled, setCouponEnabled] = useState(false);
  const [couponTitle, setCouponTitle] = useState('');
  const [couponDesc, setCouponDesc] = useState('');
  const [couponRate, setCouponRate] = useState(0);
  const [clientLinkUrl, setClientLinkUrl] = useState('');

  // 送信フォーム
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 履歴
  const [history, setHistory] = useState<PushHistory[]>([]);

  // 認証状態監視 + 店舗情報取得
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoadingAuth(false);

      if (u) {
        await loadHistory();

        // 店舗情報取得/作成
        try {
          const idToken = await u.getIdToken();
          const res = await fetch('/api/create-shop', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ name: u.email?.split('@')[0] || '未設定の店舗' }),
          });
          const data = await res.json();
          if (data.success) {
            setShopId(data.shopId);
            setShopName(data.shop?.name || '');
            if (data.shop?.coupon) {
              setCouponEnabled(data.shop.coupon.enabled);
              setCouponTitle(data.shop.coupon.title || '');
              setCouponDesc(data.shop.coupon.description || '');
              setCouponRate(data.shop.coupon.discountRate || 0);
            }
            if (data.shop?.linkUrl) setClientLinkUrl(data.shop.linkUrl);
          }
        } catch (err) {
          console.error('店舗情報取得エラー:', err);
        }
      }
    });

    return () => unsub();
  }, []);

  const loadHistory = async () => {
    const all = await localDb.history.orderBy('sentAt').reverse().toArray();
    setHistory(all);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      alert('ログイン失敗: ' + err.message);
    }
  };

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      alert('登録失敗: ' + err.message);
    }
  };

  const handleSaveSettings = async () => {
    if (!user || !shopId) return;
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/update-shop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          shopId,
          name: shopName,
          coupon: {
            enabled: couponEnabled,
            title: couponTitle,
            description: couponDesc,
            discountRate: couponRate,
          },
          linkUrl: clientLinkUrl,
        }),
      });
      if (res.ok) {
        setMessage('✅ 設定を保存しました');
      } else {
        const data = await res.json();
        throw new Error(data.error);
      }
    } catch (err: any) {
      setMessage('❌ 保存エラー: ' + err.message);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !shopId) return;
    setLoading(true);
    setMessage('');

    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/send-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ title, body, imageUrl, linkUrl }),
      });

      const data = await response.json();

      await localDb.history.add({
        title,
        body,
        imageUrl: imageUrl || undefined,
        linkUrl: linkUrl || undefined,
        sentAt: new Date(),
        status: response.ok ? 'success' : 'error',
        errorMessage: response.ok ? undefined : data.error,
      });

      await loadHistory();

      if (!response.ok) {
        throw new Error(data.error || '送信に失敗しました');
      }

      setMessage('✨ カメハメ波（プッシュ通知）を放ちました！');
      setTitle('');
      setBody('');
      setImageUrl('');
      setLinkUrl('');
    } catch (err: any) {
      console.error('送信エラー:', err);
      setMessage(`❌ エラー: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    const json = await exportHistoryToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `push-taro-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      await importHistoryFromJSON(text);
      await loadHistory();
      alert('履歴フォルダを読み込みました！');
    } catch (err) {
      alert('インポート失敗: 不正なJSONファイルです');
    }
  };

  const handleCleanup = async () => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/cleanup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert(`✅ ${data.removed}件の古いトークンを削除しました`);
      } else {
        alert('❌ クリーンアップ失敗: ' + data.error);
      }
    } catch (err: any) {
      alert('エラー: ' + err.message);
    }
  };

  if (loadingAuth) {
    return (
      <main style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center' }}>
        <p>読み込み中...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main style={{ maxWidth: '400px', margin: '60px auto', padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>🚀 プッシュ太郎</h1>
        <p style={{ color: '#666' }}>IDログインしてプッシュ通知を送信しましょう</p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '10px', fontSize: '16px' }}
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '10px', fontSize: '16px' }}
          />
          <button
            type="submit"
            style={{ padding: '12px', background: '#ff4500', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
          >
            ログイン
          </button>
          <button
            type="button"
            onClick={handleRegister}
            style={{ padding: '12px', background: '#333', color: '#fff', border: 'none', fontSize: '16px', cursor: 'pointer' }}
          >
            新規登録
          </button>
        </form>
      </main>
    );
  }

  const qrUrl = shopId ? `https://push-taro.vercel.app/?s=${shopId}` : '';

  return (
    <main style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ margin: 0 }}>🚀 プッシュ太郎</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>{user.email}</span>
          <button onClick={() => signOut(auth)} style={{ padding: '8px 16px', cursor: 'pointer' }}>
            ログアウト
          </button>
        </div>
      </div>

      {/* 店舗情報・設定 */}
      {shopId && (
        <div style={{ marginBottom: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
          <h3>🏪 店舗情報</h3>
          <p>店舗名: <strong>{shopName}</strong></p>
          <p>店舗ID: <code>{shopId}</code></p>
          <p>
            顧客用URL:{' '}
            <a href={qrUrl} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>
              {qrUrl}
            </a>
          </p>

          <h4 style={{ marginTop: '20px' }}>🎫 初回クーポン設定</h4>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={couponEnabled}
              onChange={(e) => setCouponEnabled(e.target.checked)}
            />
            初回クーポンを有効にする
          </label>

          {couponEnabled && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <input
                type="text"
                placeholder="クーポンタイトル（例: 初回限定20%OFF）"
                value={couponTitle}
                onChange={(e) => setCouponTitle(e.target.value)}
                style={{ padding: '10px', fontSize: '16px' }}
              />
              <input
                type="text"
                placeholder="説明"
                value={couponDesc}
                onChange={(e) => setCouponDesc(e.target.value)}
                style={{ padding: '10px', fontSize: '16px' }}
              />
              <input
                type="number"
                placeholder="割引率 (%)"
                value={couponRate}
                onChange={(e) => setCouponRate(Number(e.target.value))}
                style={{ padding: '10px', fontSize: '16px' }}
              />
            </div>
          )}

          <h4 style={{ marginTop: '20px' }}>🔗 クーポン使用後の遷移先URL</h4>
          <input
            type="url"
            placeholder="https://example.com/sale"
            value={clientLinkUrl}
            onChange={(e) => setClientLinkUrl(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '16px', boxSizing: 'border-box' }}
          />

          <button
            onClick={handleSaveSettings}
            style={{ marginTop: '15px', padding: '10px 20px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
          >
            💾 設定を保存
          </button>
        </div>
      )}

      {/* 送信フォーム */}
      <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="例: 新着セールのお知らせ"
            style={{ width: '100%', padding: '10px', fontSize: '16px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>本文</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={4}
            placeholder="例: 本日から全品20%OFFセール開催中！"
            style={{ width: '100%', padding: '10px', fontSize: '16px', boxSizing: 'border-box' }}
          />
        </div>
        <ImageUploader onImageUploaded={setImageUrl} currentUrl={imageUrl} />
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>リンク先URL（任意）</label>
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com/sale"
            style={{ width: '100%', padding: '10px', fontSize: '16px', boxSizing: 'border-box' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '14px',
            backgroundColor: loading ? '#ccc' : '#ff4500',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            borderRadius: '6px',
          }}
        >
          {loading ? '送信中...' : '🔥 カメハメ波（送信）'}
        </button>
        {message && (
          <p style={{ marginTop: '10px', fontWeight: 'bold', color: message.includes('❌') ? '#d32f2f' : '#2e7d32' }}>
            {message}
          </p>
        )}
      </form>

      {/* 履歴 */}
      <div style={{ borderTop: '2px solid #eee', paddingTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ margin: 0 }}>📁 送信履歴（ローカルフォルダ）</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={handleExport}
              style={{ padding: '8px 16px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
            >
              📤 エクスポート
            </button>
            <label
              style={{ padding: '8px 16px', background: '#2196F3', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', display: 'inline-block' }}
            >
              📥 インポート
              <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            </label>
            <button
              onClick={handleCleanup}
              style={{ padding: '8px 16px', background: '#ff5722', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
            >
              🧹 古いトークン削除
            </button>
          </div>
        </div>

        {history.length === 0 ? (
          <p style={{ color: '#999' }}>履歴がありません。通知を送信するとここに表示されます。</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {history.map((h) => (
              <div
                key={h.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '12px',
                  background: h.status === 'error' ? '#fff0f0' : '#f9f9f9',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <strong style={{ fontSize: '16px' }}>{h.title}</strong>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    {new Date(h.sentAt).toLocaleString('ja-JP')}
                  </span>
                </div>
                <p style={{ margin: '8px 0', fontSize: '14px', color: '#333' }}>{h.body}</p>
                {h.imageUrl && (
                  <img src={h.imageUrl} alt="" style={{ maxHeight: '120px', borderRadius: '4px', marginBottom: '8px' }} />
                )}
                {h.linkUrl && (
                  <a href={h.linkUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#2196F3', wordBreak: 'break-all' }}>
                    {h.linkUrl}
                  </a>
                )}
                {h.status === 'error' && (
                  <p style={{ color: '#d32f2f', fontSize: '12px', marginTop: '6px' }}>エラー: {h.errorMessage}</p>
                )}
                {h.status === 'success' && (
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#4CAF50',
                      background: '#e8f5e9',
                      padding: '2px 8px',
                      borderRadius: '12px',
                    }}
                  >
                    送信成功
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
