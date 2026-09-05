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
  // 🔍 shop-info 検証用ステート
const [inspectShopId, setInspectShopId] = useState('');
const [shopInfoResult, setShopInfoResult] = useState<any>(null);
const [inspecting, setInspecting] = useState(false);

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

  // 強制アクティベーション用
const [targetShopId, setTargetShopId] = useState('');
const [activating, setActivating] = useState(false);
const [activationResult, setActivationResult] = useState<any>(null);

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

  // 🔍 shop-info API 直接取得処理
const handleInspectShopInfo = async () => {
  if (!inspectShopId.trim()) {
    alert('店舗IDを入力してください');
    return;
  }
  setInspecting(true);
  setShopInfoResult(null);

  try {
    const res = await fetch(`/api/shop-info?s=${inspectShopId.trim()}`, { cache: 'no-store' });
    const data = await res.json();
    setShopInfoResult(data);
  } catch (err: any) {
    setShopInfoResult({ success: false, error: err.message });
  } finally {
    setInspecting(false);
  }
};

  const fetchPendingShops = async () => {
  setLoading(true);
  try {
    const res = await fetch('/api/admin/pending-shops');
    const data = await res.json();
    // 店舗一覧を表示するためのステートがあればそれを使う
    // ここでは簡易的に alert で表示するか、別途リスト表示用のステートを作る
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const handleForceActivate = async () => {
  if (!targetShopId) {
    alert('店舗IDを入力してください');
    return;
  }
  setActivating(true);
  setActivationResult(null);
  try {
    const res = await fetch('/api/admin/force-activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopId: targetShopId }),
    });
    const data = await res.json();
    setActivationResult(data);
    alert(`✅ アクティベーション完了: ${JSON.stringify(data, null, 2)}`);
  } catch (err: any) {
    alert('❌ エラー: ' + err.message);
  } finally {
    setActivating(false);
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
            {/* ============================================================ */}
      {/* 🧪 今回追加した新機能のテストセクション */}
      {/* ============================================================ */}
      <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginTop: 0, fontSize: 18, color: '#1e293b' }}>🧪 新機能テスト（紹介・アップグレード）</h2>
        <p style={{ fontSize: 12, color: '#64748b', marginTop: -8, marginBottom: 16 }}>
          各APIを直接呼び出して、決済前後のフローを実機なしで検証できます。
          {auth.currentUser ? (
            <span style={{ color: '#22c55e', fontWeight: 'bold' }}> ✅ 認証済み（{auth.currentUser.email}）</span>
          ) : (
            <span style={{ color: '#ef4444', fontWeight: 'bold' }}> ⚠️ 未認証（アップグレードテストにはログインが必要）</span>
          )}
        </p>

        {/* -------- ① 紹介コード付き新規申し込みテスト -------- */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 16, marginBottom: 16, background: '#f8fafc' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 15, fontWeight: 'bold', color: '#0f172a' }}>① 紹介コード付き新規申し込み</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="紹介コード（例: ABC123）"
                id="test-ref-code"
                style={{ flex: 1, minWidth: 150, padding: 8, border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 13 }}
              />
              <input
                type="email"
                placeholder="テスト用メール"
                id="test-ref-email"
                style={{ flex: 1, minWidth: 200, padding: 8, border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 13 }}
              />
              <select
                id="test-ref-plan"
                style={{ padding: 8, border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 13 }}
              >
                <option value="light">LIGHT</option>
                <option value="standard">STANDARD</option>
                <option value="pro">PRO</option>
              </select>
            </div>
            <button
              onClick={async () => {
                const code = (document.getElementById('test-ref-code') as HTMLInputElement)?.value;
                const email = (document.getElementById('test-ref-email') as HTMLInputElement)?.value;
                const plan = (document.getElementById('test-ref-plan') as HTMLSelectElement)?.value;
                if (!email) { alert('メールアドレスを入力してください'); return; }
                try {
                  const res = await fetch('/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email,
                      plan,
                      companyName: 'テスト店舗',
                      address: 'テスト住所',
                      phone: '000-0000-0000',
                      referralCode: code || undefined,
                    }),
                  });
                  const data = await res.json();
                  alert(`✅ 申し込みレスポンス:\n${JSON.stringify(data, null, 2)}`);
                } catch (err: any) {
                  alert('❌ エラー: ' + err.message);
                }
              }}
              style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}
            >
              🚀 テスト実行（紹介コード付き申込）
            </button>
          </div>
        </div>

        {/* -------- ② Standardアップグレードテスト -------- */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 16, marginBottom: 16, background: '#f0f9ff' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 15, fontWeight: 'bold', color: '#0284c7' }}>② Standardアップグレード</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              type="text"
              placeholder="店舗ID"
              id="test-up-standard-shopid"
              style={{ padding: 8, border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 13 }}
            />
            <button
              onClick={async () => {
                const shopId = (document.getElementById('test-up-standard-shopid') as HTMLInputElement)?.value;
                if (!shopId) { alert('店舗IDを入力してください'); return; }
                const user = auth.currentUser;
                if (!user) { alert('アップグレードテストにはログインが必要です'); return; }
                try {
                  const idToken = await user.getIdToken();
                  const res = await fetch('/api/upgrade-request', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({ shopId }),
                  });
                  const data = await res.json();
                  alert(`✅ Standardアップグレードレスポンス:\n${JSON.stringify(data, null, 2)}`);
                } catch (err: any) {
                  alert('❌ エラー: ' + err.message);
                }
              }}
              style={{ padding: '8px 16px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}
            >
              🚀 テスト実行（Standardアップグレード）
            </button>
          </div>
        </div>

        {/* -------- ③ PROアップグレードテスト -------- */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 16, marginBottom: 16, background: '#fff7ed' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 15, fontWeight: 'bold', color: '#ea580c' }}>③ PROアップグレード</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              type="text"
              placeholder="店舗ID"
              id="test-up-pro-shopid"
              style={{ padding: 8, border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 13 }}
            />
            <button
              onClick={async () => {
                const shopId = (document.getElementById('test-up-pro-shopid') as HTMLInputElement)?.value;
                if (!shopId) { alert('店舗IDを入力してください'); return; }
                const user = auth.currentUser;
                if (!user) { alert('アップグレードテストにはログインが必要です'); return; }
                try {
                  const idToken = await user.getIdToken();
                  const res = await fetch('/api/upgrade-request/pro', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({
                      shopId,
                      companyName: 'テスト会社',
                      invoiceNumber: 'T1234567890123',
                      address: 'テスト住所',
                      phone: '000-0000-0000',
                      bankAccount: {
                        bankName: 'テスト銀行',
                        branchName: 'テスト支店',
                        accountType: 'savings',
                        accountNumber: '1234567',
                        accountHolder: 'テスト タロウ',
                      },
                    }),
                  });
                  const data = await res.json();
                  alert(`✅ PROアップグレードレスポンス:\n${JSON.stringify(data, null, 2)}`);
                } catch (err: any) {
                  alert('❌ エラー: ' + err.message);
                }
              }}
              style={{ padding: '8px 16px', background: '#ea580c', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}
            >
              🚀 テスト実行（PROアップグレード）
            </button>
          </div>
        </div>

        {/* -------- ④ 紹介コード検証テスト -------- */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 16, background: '#f5f3ff' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 15, fontWeight: 'bold', color: '#7c3aed' }}>④ 紹介コード検証</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              type="text"
              placeholder="紹介コード"
              id="test-verify-code"
              style={{ padding: 8, border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 13 }}
            />
            <button
              onClick={async () => {
                const code = (document.getElementById('test-verify-code') as HTMLInputElement)?.value;
                if (!code) { alert('紹介コードを入力してください'); return; }
                try {
                  const res = await fetch(`/api/test/verify-referral?code=${code}`);
                  const data = await res.json();
                  alert(`✅ 検証結果:\n${JSON.stringify(data, null, 2)}`);
                } catch (err: any) {
                  alert('❌ エラー: ' + err.message);
                }
              }}
              style={{ padding: '8px 16px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}
            >
              🔍 検証実行
            </button>
          </div>
        </div>
      </section>

      {/* 強制アクティベーション */}
<section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20, marginBottom: 24 }}>
  <h2>⚡ 強制アクティベーション（決済シミュレート）</h2>
  <p style={{ fontSize: 12, color: '#64748b' }}>
    pending_payment の店舗を強制的に active にします（実際の決済なしで本登録完了を再現）
  </p>
  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
    <input
      type="text"
      placeholder="店舗ID（例: abc123）"
      value={targetShopId}
      onChange={(e) => setTargetShopId(e.target.value)}
      style={{ flex: 1, padding: 8, border: '1px solid #cbd5e1', borderRadius: 4 }}
    />
    <button
      onClick={handleForceActivate}
      disabled={activating}
      style={{ padding: '8px 16px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
    >
      {activating ? '実行中...' : '🚀 強制アクティベート'}
    </button>
  </div>
  {activationResult && (
    <pre style={{ marginTop: 12, background: '#f1f5f9', padding: 12, borderRadius: 4, fontSize: 12 }}>
      {JSON.stringify(activationResult, null, 2)}
    </pre>
  )}
</section>

      {/* ============================================================ */}
{/* アップグレード強制アクティベーション */}
{/* ============================================================ */}
<section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20, marginBottom: 24 }}>
  <h2 style={{ marginTop: 0, fontSize: 18, color: '#1e293b' }}>⚡ アップグレード強制アクティベーション</h2>
  <p style={{ fontSize: 12, color: '#64748b', marginTop: -8, marginBottom: 16 }}>
    upgradeStatus が pending_payment の店舗を、決済をスキップして Webhook 経由でアップグレード完了状態にします。
  </p>

  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <input
        type="text"
        placeholder="店舗ID"
        id="test-force-upgrade-shopid"
        style={{ flex: 1, minWidth: 200, padding: 8, border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 13 }}
      />
    </div>
    <button
      onClick={async () => {
        const shopId = (document.getElementById('test-force-upgrade-shopid') as HTMLInputElement)?.value;
        if (!shopId) { alert('店舗IDを入力してください'); return; }
        try {
          // 残した force-activate 側の API に向ける
          const res = await fetch('/api/admin/force-activate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shopId }),
          });
          const data = await res.json();
          alert(`✅ レスポンス:\n${JSON.stringify(data, null, 2)}`);
        } catch (err: any) {
          alert('❌ エラー: ' + err.message);
        }
      }}
      style={{ padding: '8px 16px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}
    >
      🚀 強制アップグレード実行（Webhook模擬）
    </button>
    <span style={{ fontSize: 11, color: '#94a3b8' }}>※ 事前に管理画面でアップグレード申請（pending_payment状態）を作成してください。</span>
  </div>
</section>

      {/* ============================================================ */}
      {/* 🔍 店舗データ（shop-info）リアルタイム確認コンソール */}
      {/* ============================================================ */}
      <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginTop: 0, fontSize: 18, color: '#1e293b' }}>🔍 店舗データ（shop-info）確認</h2>
        <p style={{ fontSize: 12, color: '#64748b', marginTop: -8, marginBottom: 16 }}>
          shopId を入力して、/api/shop-info が今どのようなステータス（status, upgradeStatus 等）を返しているかを直接検証します。
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            type="text"
            placeholder="店舗ID（例: shop_12345）"
            value={inspectShopId}
            onChange={(e) => setInspectShopId(e.target.value)}
            style={{ flex: 1, padding: 8, border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 13 }}
          />
          <button
            onClick={handleInspectShopInfo}
            disabled={inspecting}
            style={{ padding: '8px 16px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: 6, cursor: inspecting ? 'wait' : 'pointer', fontWeight: 'bold' }}
          >
            {inspecting ? '取得中...' : '🔍 データを取得'}
          </button>
        </div>

        {shopInfoResult && (
          <div style={{ marginTop: 12, padding: 14, background: '#0f172a', color: '#f8fafc', borderRadius: 6, fontFamily: 'monospace', fontSize: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#38bdf8', fontWeight: 'bold' }}>
              <span>📡 /api/shop-info レスポンス結果</span>
              <span>success: {String(shopInfoResult.success)}</span>
            </div>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {JSON.stringify(shopInfoResult, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </main>
  );
}
