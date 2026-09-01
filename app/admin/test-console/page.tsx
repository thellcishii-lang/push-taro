'use client';

import { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

// firebase-client への依存を排除し、直接初期化
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export default function TestConsolePage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // ⚡️ テスト用店舗アカウント即時発行用の状態
  const [dummyEmail, setDummyEmail] = useState('test-shop@example.com');
  const [createdAccount, setCreatedAccount] = useState<{ shopId: string; email: string; password: string } | null>(null);
  const [creatingShop, setCreatingShop] = useState(false);

  // 送信テスト用
  const [selectedToken, setSelectedToken] = useState('');
  const [testTitle, setTestTitle] = useState('点検テスト通知');
  const [testBody, setTestBody] = useState('特定端末への個別ピンポイント送信です');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<any>(null);

  // ⚡️ テスト用店舗発行処理
  const handleCreateTestShop = async () => {
    setCreatingShop(true);
    try {
      const res = await fetch('/api/admin/create-test-shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: dummyEmail }),
      });
      const data = await res.json();

      if (data.success) {
        setCreatedAccount({
          shopId: data.shopId,
          email: data.email,
          password: data.password,
        });
      } else {
        alert('エラー: ' + data.error);
      }
    } catch (err: any) {
      alert('通信エラーが発生しました: ' + err.message);
    } finally {
      setCreatingShop(false);
    }
  };

  // 🔍 1. subscriptions コレクションの全件取得（点検機能）
  const fetchSubscriptions = async () => {
    setLoading(true);
    setMessage('');
    try {
      const querySnapshot = await getDocs(collection(db, 'subscriptions'));
      const list: any[] = [];
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        list.push({
          id: docSnapshot.id,
          ...data,
          // 日時フォーマット整形
          updatedAtFormatted: data.updatedAt?.toDate ? data.updatedAt.toDate().toLocaleString('ja-JP') : '不明',
          createdAtFormatted: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleString('ja-JP') : '不明',
        });
      });

      // 更新日時が新しい順にソート
      list.sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0));

      setSubscriptions(list);
      if (list.length > 0 && !selectedToken) {
        setSelectedToken(list[0].token);
      }
      setMessage(`✅ 最新の登録端末データ ${list.length} 件を取得しました`);
    } catch (err: any) {
      setMessage('❌ 取得エラー: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // 🗑️ 不要・古いトークンデータの削除
  const handleDeleteSub = async (docId: string) => {
    if (!confirm(`登録データ「${docId}」を削除しますか？`)) return;
    try {
      await deleteDoc(doc(db, 'subscriptions', docId));
      setMessage(`🗑️ 「${docId}」を削除しました`);
      fetchSubscriptions();
    } catch (err: any) {
      setMessage('❌ 削除エラー: ' + err.message);
    }
  };

  // 🚀 2. 特定の単一トークンへ直接テスト送信
  const handleSendSinglePush = async () => {
    if (!selectedToken) return alert('送信先のトークンを選択してください');
    setSending(true);
    setSendResult(null);

    try {
      const user = auth.currentUser;
      const idToken = user ? await user.getIdToken() : '';

      const res = await fetch('/api/send-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          targetToken: selectedToken, // ピンポイント送信用のパラメータ
          title: testTitle,
          body: testBody,
        }),
      });

      const data = await res.json();
      setSendResult({
        status: res.status,
        data: data
      });
    } catch (err: any) {
      setSendResult({
        status: 'Error',
        error: err.message
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <main style={{ padding: 24, maxWidth: 950, margin: '0 auto', fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 22, color: '#0f172a' }}>🛠️ Webプッシュ通知 診断・点検コンソール</h1>

      {message && (
        <div style={{ padding: 12, background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: 6, marginBottom: 20, fontSize: 14 }}>
          {message}
        </div>
      )}

      {/* ⚡️ テスト用店舗アカウント即時発行フォーム */}
      <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginTop: 0, fontSize: 18, color: '#1e293b' }}>⚡️ テスト用店舗アカウント即時発行</h2>
        <p style={{ fontSize: 12, color: '#64748b', marginTop: -8, marginBottom: 16 }}>
          架空のメールアドレスを入力すると、Firebase Auth のユーザー作成と Firestore の店舗ドキュメント作成を同時に行い、テスト用の初期パスワードと shopId を発行します。
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            type="email"
            value={dummyEmail}
            onChange={(e) => setDummyEmail(e.target.value)}
            style={{ flex: 1, padding: 8, border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 14 }}
            placeholder="架空のメールアドレス"
          />
          <button
            onClick={handleCreateTestShop}
            disabled={creatingShop}
            style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: creatingShop ? 'wait' : 'pointer', fontWeight: 'bold' }}
          >
            {creatingShop ? '発行中...' : '店舗ID＆パスワード生成'}
          </button>
        </div>

        {createdAccount && (
          <div style={{ padding: 14, background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 6, color: '#166534', fontSize: 13 }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', fontSize: 14 }}>✅ アカウント発行完了</p>
            <p style={{ margin: '2px 0' }}>店舗ID (shopId): <code style={{ fontFamily: 'monospace', fontWeight: 'bold', background: '#fff', padding: '2px 6px', border: '1px solid #bbf7d0', borderRadius: 4, color: '#1d4ed8' }}>{createdAccount.shopId}</code></p>
            <p style={{ margin: '2px 0' }}>メール: {createdAccount.email}</p>
            <p style={{ margin: '2px 0' }}>発行パスワード: <code style={{ fontFamily: 'monospace', fontWeight: 'bold', background: '#fff', padding: '2px 6px', border: '1px solid #bbf7d0', borderRadius: 4, color: '#dc2626' }}>{createdAccount.password}</code></p>
          </div>
        )}
      </section>

      {/* 📊 1. subscriptions 登録データ一覧（通知が届いているかの確認） */}
      <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, color: '#1e293b' }}>📱 登録済み端末一覧 (`subscriptions`)</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#64748b' }}>
              スマホ（iPhone/Android）で「通知を受け取る」を押した際、ここにリアルタイムで反映されているか点検します。
            </p>
          </div>
          <button onClick={fetchSubscriptions} disabled={loading} style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>
            {loading ? '読み込み中...' : '🔄 最新情報に更新'}
          </button>
        </div>

        {subscriptions.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8', background: '#f1f5f9', borderRadius: 6 }}>
            登録データが存在しません。スマホ端末から `/subscribe` を開いて登録を実行してください。
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {subscriptions.map((sub) => (
              <div key={sub.id} style={{ border: selectedToken === sub.token ? '2px solid #3b82f6' : '1px solid #cbd5e1', borderRadius: 6, padding: 14, background: selectedToken === sub.token ? '#eff6ff' : '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <span style={{ fontWeight: 'bold', fontSize: 14, color: '#0f172a' }}>ID: {sub.id}</span>
                    <span style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 4, background: '#e2e8f0', fontSize: 11, fontWeight: 'bold' }}>
                      Shop: {sub.shopId || sub.shopIds?.join(', ') || '未設定'}
                    </span>
                  </div>
                  <button onClick={() => handleDeleteSub(sub.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                    削除
                  </button>
                </div>

                <div style={{ fontSize: 12, color: '#475569', marginBottom: 6 }}>
                  📅 最終更新: <strong>{sub.updatedAtFormatted}</strong> (作成: {sub.createdAtFormatted})
                </div>

                <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#64748b', background: '#f8fafc', padding: 6, borderRadius: 4, wordBreak: 'break-all' }}>
                  🔑 Token: {sub.token ? `${sub.token.substring(0, 35)}...` : 'トークンなし'}
                </div>

                <button
                  onClick={() => setSelectedToken(sub.token)}
                  style={{ marginTop: 8, padding: '4px 10px', background: selectedToken === sub.token ? '#1d4ed8' : '#64748b', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}
                >
                  {selectedToken === sub.token ? '選択中（テスト送信対象）' : 'この端末をテスト送信先に選択'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🚀 2. ピンポイント個別送信テスト領域 */}
      <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginTop: 0, fontSize: 18, color: '#1e293b' }}>🎯 選択端末への単体テスト送信</h2>
        <p style={{ fontSize: 12, color: '#64748b', marginTop: -8 }}>
          全体送信を行わず、上記で選択した1台の端末（iPhone / Android / PC）宛てにのみテスト通知を送信します。
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 'bold', color: '#334155', marginBottom: 4 }}>対象トークン</label>
            <input type="text" readOnly value={selectedToken || '端末が選択されていません'} style={{ width: '100%', padding: 8, border: '1px solid #cbd5e1', borderRadius: 4, background: '#f1f5f9', fontSize: 12, fontFamily: 'monospace' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 'bold', color: '#334155', marginBottom: 4 }}>通知タイトル</label>
            <input type="text" value={testTitle} onChange={(e) => setTestTitle(e.target.value)} style={{ width: '100%', padding: 8, border: '1px solid #cbd5e1', borderRadius: 4 }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 'bold', color: '#334155', marginBottom: 4 }}>通知本文</label>
            <input type="text" value={testBody} onChange={(e) => setTestBody(e.target.value)} style={{ width: '100%', padding: 8, border: '1px solid #cbd5e1', borderRadius: 4 }} />
          </div>
        </div>

        <button onClick={handleSendSinglePush} disabled={sending || !selectedToken} style={{ width: '100%', padding: 12, background: sending ? '#94a3b8' : '#10b981', color: '#fff', border: 'none', borderRadius: 6, cursor: sending ? 'wait' : 'pointer', fontWeight: 'bold', fontSize: 15 }}>
          {sending ? '送信中...' : '🚀 選択した端末だけにテスト送信を実行'}
        </button>

        {/* 📋 レスポンスログ表示 */}
        {sendResult && (
          <div style={{ marginTop: 20, padding: 16, background: '#0f172a', color: '#f8fafc', borderRadius: 8, fontFamily: 'monospace', fontSize: 12 }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#38bdf8', fontSize: 13 }}>📡 送信レスポンス</h3>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {JSON.stringify(sendResult, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </main>
  );
}
