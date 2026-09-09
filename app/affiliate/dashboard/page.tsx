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

        {/* 紹介した店舗一覧 */}
<div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '20px' }}>
  <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>
    🏪 紹介した店舗一覧（{affiliateData?.referrals?.length || 0}件）
  </h2>
  {affiliateData?.referrals?.length === 0 ? (
    <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>
      まだ紹介した店舗はありません
    </p>
  ) : (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>店舗名</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>プラン</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>報酬タイプ</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>報酬額</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>ステータス</th>
          </tr>
        </thead>
        <tbody>
          {affiliateData.referrals.map((ref: any) => (
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
              <td style={{ padding: '10px' }}>
                {ref.rewardType === 'recurring' ? '継続課金 (5%)' : '一括報酬'}
              </td>
              <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#16a34a' }}>
                ¥{ref.rewardType === 'recurring' ? ref.rewardRate : ref.oneTimeAmount}
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

        {/* 報酬履歴 */}
<div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '20px' }}>
  <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>
    📊 報酬履歴（{affiliateData?.rewards?.length || 0}件）
  </h2>
  {affiliateData?.rewards?.length === 0 ? (
    <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>
      まだ報酬履歴はありません
    </p>
  ) : (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>対象月</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>店舗名</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>金額</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>ステータス</th>
          </tr>
        </thead>
        <tbody>
          {affiliateData.rewards.map((reward: any) => (
            <tr key={reward.id} style={{ borderBottom: '1px solid #edf2f7' }}>
              <td style={{ padding: '10px' }}>{reward.billingMonth}</td>
              <td style={{ padding: '10px' }}>{reward.sourceShopName || '-'}</td>
              <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                ¥{reward.amount.toLocaleString()}
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  background: reward.status === 'paid' ? '#c6f6d5' : '#fef3c7',
                  color: reward.status === 'paid' ? '#22543d' : '#d97706',
                }}>
                  {reward.status === 'paid' ? '支払済み' : '未払い'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
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
