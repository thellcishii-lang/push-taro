'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import Link from 'next/link';

export default function AffiliateDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [affiliateData, setAffiliateData] = useState<any>(null);

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
            const data = await res.json();
            setAffiliateData(data);
          }
        } catch (err) {
          console.error('データ取得エラー:', err);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

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

  if (!user) {
    router.push('/affiliate/signup');
    return null;
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <main style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '30px' }}>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#718096', marginBottom: '6px' }}>あなたの紹介コード</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#ff4500', fontFamily: 'monospace' }}>
              {affiliateData?.referralCode || '取得中...'}
            </div>
          </div>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#718096', marginBottom: '6px' }}>累計報酬</div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#1a202c' }}>
              ¥{affiliateData?.totalEarnings?.toLocaleString() || 0}
            </div>
          </div>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#718096', marginBottom: '6px' }}>未払い報酬</div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: affiliateData?.unpaidReward >= 5000 ? '#22c55e' : '#eab308' }}>
              ¥{affiliateData?.unpaidReward?.toLocaleString() || 0}
              {affiliateData?.unpaidReward >= 5000 && (
                <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#22c55e', marginLeft: '8px' }}>✅ 振込対象</span>
              )}
            </div>
          </div>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#718096', marginBottom: '6px' }}>紹介した店舗数</div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#2563eb' }}>
              {affiliateData?.referralCount || 0} 件
            </div>
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>紹介リンク</h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              readOnly
              value={`${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${affiliateData?.referralCode || ''}`}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '13px', background: '#f8fafc' }}
            />
            <button
              onClick={() => {
                const url = `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${affiliateData?.referralCode || ''}`;
                navigator.clipboard.writeText(url);
                alert('紹介リンクをコピーしました！');
              }}
              style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              コピー
            </button>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
            💡 このリンクをブログ・SNSでシェアして、紹介報酬を獲得しましょう！
          </p>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link href="/" style={{ color: '#64748b', fontSize: '13px', textDecoration: 'none' }}>
            ← トップページに戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
