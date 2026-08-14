'use client';

import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../lib/firebase-client';
import { requestFCMToken, onForegroundMessage } from '../lib/firebase-client';
import ImageUploader from '@/components/ImageUploader';
import { db, exportHistoryToJSON, importHistoryFromJSON, PushHistory } from '../lib/db';

export default function PushTaroPage() {
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [history, setHistory] = useState<PushHistory[]>([]);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  // 認証状態監視 + 履歴読み込み + FCM初期化
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoadingAuth(false);
      if (u) {
        await loadHistory();
        // FCMトークン取得（通知許可を求めます）
        const token = await requestFCMToken();
        setFcmToken(token);
      }
    });

    // フォアグラウンド通知受信
    const unsubMsg = onForegroundMessage((payload) => {
      console.log('フォアグラウンド通知:', payload);
      // 必要に応じてトースト表示など
    });

    return () => {
      unsub();
      unsubMsg();
    };
  }, []);

  const loadHistory = async () => {
    const all = await db.history.orderBy('sentAt').reverse().toArray();
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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/send-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, imageUrl, linkUrl }),
      });
      const data = await response.json();

      // IndexedDBに履歴保存
      await db.history.add({
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
      setMessage(`❌ エラー: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // JSONエクスポート（フォルダダウンロード）
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

  // JSONインポート（フォルダ読み込み）
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

  if (loadingAuth) {
    return (
      <main style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center' }}>
        <p>読み込み中...</p>
      </main>
    );
  }

  // 未ログイン画面
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
            style={{
              padding: '12px',
              background: '#ff4500',
              color: '#fff',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            ログイン
          </button>
          <button
            type="button"
            onClick={handleRegister}
            style={{
              padding: '12px',
              background: '#333',
              color: '#fff',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            新規登録
          </button>
        </form>
      </main>
    );
  }

  // ログイン後メイン画面
  return (
    <main style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ margin: 0 }}>🚀 プッシュ太郎</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>{user.email}</span>
          {fcmToken && (
            <span style={{ fontSize: '12px', color: '#4CAF50', background: '#e8f5e9', padding: '2px 8px', borderRadius: '12px' }}>
              通知受信OK
            </span>
          )}
          <button
            onClick={() => signOut(auth)}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            ログアウト
          </button>
        </div>
      </div>

      {/* 送信フォーム */}
      <form
        onSubmit={handleSend}
        style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px' }}
      >
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
          <p
            style={{
              marginTop: '10px',
              fontWeight: 'bold',
              color: message.includes('❌') ? '#d32f2f' : '#2e7d32',
            }}
          >
            {message}
          </p>
        )}
      </form>

      {/* 履歴管理（フォルダ機能） */}
      <div style={{ borderTop: '2px solid #eee', paddingTop: '20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <h2 style={{ margin: 0 }}>📁 送信履歴（ローカルフォルダ）</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleExport}
              style={{
                padding: '8px 16px',
                background: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              ⬇️ フォルダをダウンロード（JSON）
            </button>
            <label
              style={{
                padding: '8px 16px',
                background: '#2196F3',
                color: '#fff',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'inline-block',
              }}
            >
              ⬆️ フォルダを読み込み
              <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {history.length === 0 ? (
          <p style={{ color: '#999' }}>履歴がありません。送信するとここに溜まります。</p>
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
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <strong style={{ fontSize: '16px' }}>{h.title}</strong>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    {new Date(h.sentAt).toLocaleString('ja-JP')}
                  </span>
                </div>
                <p style={{ margin: '8px 0', fontSize: '14px', color: '#333' }}>{h.body}</p>
                {h.imageUrl && (
                  <img
                    src={h.imageUrl}
                    alt=""
                    style={{ maxHeight: '120px', borderRadius: '4px', marginBottom: '8px' }}
                  />
                )}
                {h.linkUrl && (
                  <a
                    href={h.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '13px', color: '#2196F3', wordBreak: 'break-all' }}
                  >
                    {h.linkUrl}
                  </a>
                )}
                {h.status === 'error' && (
                  <p style={{ color: '#d32f2f', fontSize: '12px', marginTop: '6px' }}>
                    エラー: {h.errorMessage}
                  </p>
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
