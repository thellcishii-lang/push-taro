'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import Link from 'next/link';
import PaymentFailuresSection from '@/components/PaymentFailuresSection';

export default function AffiliateDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  // ログイン用
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const idToken = await u.getIdToken();
          const res = await fetch('/api/affiliate/stats', {
            headers: { Authorization: `Bearer ${idToken}` },
          });
          if (res.ok) {
            const result = await res.json();
            setData(result);
          }
        } catch (err) {
          console.error('データ取得エラー:', err);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (err: any) {
      setLoginError('メールアドレスまたはパスワードが正しくありません。');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'sans-serif', color: '#718096' }}>
        読み込み中...
      </div>
    );
  }

  // 🔥 未ログイン時はログイン画面を表示（申し込みページには飛ばない）
  if (!user) {
    return (
      <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '40px', maxWidth: '400px', width: '100%', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1a202c', margin: '0 0 8px 0' }}>📢 アフィリエイトダッシュボード</h1>
            <p style={{ color: '#718096', fontSize: '13px', margin: 0 }}>ログインしてダッシュボードを表示</p>
          </div>

          {loginError && (
            <div style={{ background: '#fff5f5', border: '1px solid #feb2b2', color: '#c53030', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#4a5568', marginBottom: '6px' }}>メールアドレス</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="affiliate@example.com"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#4a5568', marginBottom: '6px' }}>パスワード</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              style={{
                marginTop: '8px',
                width: '100%',
                padding: '12px',
                background: '#3182ce',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: isLoggingIn ? 'wait' : 'pointer',
              }}
            >
              {isLoggingIn ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#64748b' }}>
            まだ登録していませんか？{' '}
            <Link href="/affiliate/signup" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 'bold' }}>
              今すぐ申し込む
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: '#94a3b8' }}>
            <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>トップページに戻る</Link>
          </div>
        </div>
      </div>
    );
  }

  // 🔓 ログイン後のダッシュボード（ここからは user が null でないことが保証されている）
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <main style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* ヘッダー */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a202c', margin: '0 0 6px 0' }}>
              📢 アフィリエイトダッシュボード
            </h1>
            <p style={{ color: '#718096', fontSize: '14px', margin: 0 }}>
              ログイン中: <strong>{user.email}</strong>
            </p>
          </div>
          <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#edf2f7', color: '#4a5568', border: '1px solid #cbd5e0', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
            ログアウト
          </button>
        </div>

        {/* サマリーカード */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#718096', marginBottom: '6px' }}>あなたの紹介コード</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#ff4500', fontFamily: 'monospace' }}>
              {data?.affiliate?.referralCode || '---'}
            </div>
          </div>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#718096', marginBottom: '6px' }}>累計報酬</div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#1a202c' }}>
              ¥{data?.summary?.totalEarnings?.toLocaleString() || 0}
            </div>
          </div>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#718096', marginBottom: '6px' }}>未払い報酬</div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: (data?.summary?.unpaidReward || 0) >= 5000 ? '#22c55e' : '#eab308' }}>
              ¥{data?.summary?.unpaidReward?.toLocaleString() || 0}
              {(data?.summary?.unpaidReward || 0) >= 5000 && (
                <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#22c55e', marginLeft: '8px' }}>✅ 振込対象</span>
              )}
            </div>
          </div>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#718096', marginBottom: '6px' }}>紹介した店舗数</div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#2563eb' }}>
              {data?.summary?.referralCount || 0} 件
            </div>
          </div>
        </div>

         {data?.affiliate?.id && (
        <PaymentFailuresSection referrerId={data.affiliate.id} referrerType="affiliate" />
      )}

        {/* 報酬タイプ */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>⚙️ 報酬タイプ</h2>
          <p style={{ fontSize: '14px', color: '#475569' }}>
            現在の設定：
            <span style={{
              fontWeight: 'bold',
              color: data?.affiliate?.rewardType === 'recurring' ? '#2563eb' : '#16a34a',
              marginLeft: '4px',
            }}>
              {data?.affiliate?.rewardType === 'recurring'
                ? '継続課金型（毎月5%還元）'
                : '一括報酬型（プラン別固定額）'}
            </span>
          </p>
        </div>

        {/* 紹介リンク */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px' }}>🔗 紹介リンク</h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              readOnly
              value={`${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${data?.affiliate?.referralCode || ''}`}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '13px', background: '#f8fafc' }}
            />
            <button
              onClick={() => {
                const url = `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${data?.affiliate?.referralCode || ''}`;
                navigator.clipboard.writeText(url);
                alert('紹介リンクをコピーしました！');
              }}
              style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              コピー
            </button>
          </div>
        </div>

        {/* 紹介した店舗一覧 */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>
            🏪 紹介した店舗（{data?.referrals?.length || 0}件）
          </h2>
          {!data?.referrals?.length ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>まだ紹介した店舗はありません</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>店舗名</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>プラン</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>ステータス</th>
                  </tr>
                </thead>
                <tbody>
                  {data.referrals.map((ref: any) => (
                    <tr key={ref.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>{ref.shopName}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{
                          padding: '2px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          background: ref.plan === 'pro' ? '#fef3c7' : ref.plan === 'standard' ? '#dbeafe' : '#f1f5f9',
                          color: ref.plan === 'pro' ? '#b45309' : ref.plan === 'standard' ? '#1d4ed8' : '#475569',
                        }}>
                          {ref.plan.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          background: ref.status === 'active' ? '#c6f6d5' : '#f1f5f9',
                          color: ref.status === 'active' ? '#22543d' : '#64748b',
                        }}>
                          {ref.status === 'active' ? '契約中' : '停止'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Link href="/" style={{ color: '#64748b', fontSize: '13px', textDecoration: 'none' }}>
            ← トップページに戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
