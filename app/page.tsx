'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase-client';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import ImageUploader from '@/components/ImageUploader';
import { db, exportHistoryToJSON, importHistoryFromJSON, PushHistory } from '@/lib/db';

export default function PushTaroPage() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<PushHistory[]>([]);

  // 認証状態監視 + 履歴読み込み
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) loadHistory();
    });
    return () => unsub();
  }, []);

  const loadHistory = async () => {
    const all = await db.history.orderBy('sentAt').reverse().toArray();
    setHistory(all);
  };

  // ログイン
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      alert('ログイン失敗: ' + err.message);
    }
  };

  // 新規登録
  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      alert('登録失敗: ' + err.message);
    }
  };

  // 送信
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

      if (!response.ok) throw new Error(data.error || '送信に失敗しました');

      setMessage('✨ カメハメ波（プッシュ通知）を放ちました！');
      setTitle(''); setBody(''); setImageUrl(''); setLinkUrl('');
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
      alert('履歴をインポートしました！');
    } catch (err) {
      alert('インポート失敗: 不正なJSONファイルです');
    }
  };

  // 未ログイン時
  if (!user) {
    return (
      <main style={{ maxWidth: '400px', margin: '60px auto', padding: '20px' }}>
        <h1>🚀 プッシュ太郎</h1>
        <p>IDログインしてプッシュ通知を送信しましょう</p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="email" placeholder="メールアドレス" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '10px' }} />
          <input type="password" placeholder="パスワード" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '10px' }} />
          <button type="submit" style={{ padding: '12px', background: '#ff4500', color: '#fff', border: 'none', fontWeight: 'bold' }}>ログイン</button>
          <button type="button" onClick={handleRegister} style={{ padding: '12px', background: '#333', color: '#fff', border: 'none' }}>新規登録</button>
        </form>
      </main>
    );
  }

  // ログイン後
  return (
    <main style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>🚀 プッシュ太郎</h1>
        <div>
          <span style={{ marginRight: '15px' }}>{user.email}</span>
          <button onClick={() => signOut(auth)} style={{ padding: '8px 16px' }}>ログアウト</button>
        </div>
      </div>

      {/* 送信フォーム */}
      <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px' }}>
        <div>
          <label style={{ fontWeight: 'bold' }}>タイトル</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="例: 新着セールのお知らせ" style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label style={{ fontWeight: 'bold' }}>本文</label>
          <textarea value={body} onChange={e => setBody(e.target.value)} required rows={4} placeholder="例: 本日から全品20%OFF！" style={{ width: '100%', padding: '8px' }} />
        </div>
        
        {/* ドラッグ＆ドロップ画像アップロード */}
        <ImageUploader onImageUploaded={setImageUrl} />
        {imageUrl && <p style={{ fontSize: '12px' }}>アップロード済み: {imageUrl}</p>}
        
        <div>
          <label style={{ fontWeight: 'bold' }}>リンク先URL（任意）</label>
          <input type="url" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://example.com/sale" style={{ width: '100%', padding: '8px' }} />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '12px', backgroundColor: '#ff4500', color: '#fff', fontWeight: 'bold', border: 'none', fontSize: '16px' }}>
          {loading ? '送信中...' : '🔥 カメハメ波（送信）'}
        </button>
        {message && <p style={{ fontWeight: 'bold' }}>{message}</p>}
      </form>

      {/* 履歴管理（フォルダ機能） */}
      <div style={{ borderTop: '2px solid #eee', paddingTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2>📁 送信履歴（ローカルフォルダ）</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleExport} style={{ padding: '8px 16px', background: '#4CAF50', color: '#fff', border: 'none' }}>
              ⬇️ フォルダをダウンロード（JSON）
            </button>
            <label style={{ padding: '8px 16px', background: '#2196F3', color: '#fff', cursor: 'pointer' }}>
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
              <div key={h.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '12px', background: h.status === 'error' ? '#fff0f0' : '#f9f9f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{h.title}</strong>
                  <span style={{ fontSize: '12px', color: '#666' }}>{new Date(h.sentAt).toLocaleString('ja-JP')}</span>
                </div>
                <p style={{ margin: '8px 0', fontSize: '14px' }}>{h.body}</p>
                {h.imageUrl && <img src={h.imageUrl} alt="" style={{ maxHeight: '100px', borderRadius: '4px' }} />}
                {h.linkUrl && <a href={h.linkUrl} target="_blank" style={{ fontSize: '12px', color: '#2196F3' }}>{h.linkUrl}</a>}
                {h.status === 'error' && <p style={{ color: 'red', fontSize: '12px' }}>エラー: {h.errorMessage}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
