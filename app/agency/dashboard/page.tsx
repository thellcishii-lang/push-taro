'use client';

import { useState, useEffect, useMemo } from 'react';
import { auth } from '@/lib/firebase-client';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import PaymentFailuresSection from '@/components/PaymentFailuresSection';

interface DetailedShop {
  id: string;
  shopCode: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  subscriberCount: number;
  createdAt: string;
  status: string;
  canceledAt: string | null;
  validUntil: string | null;
  plan: string;
}

interface SummaryData {
  totalShops: number;
  monthlyNewCount: number;
  monthlyCanceledCount: number;
  planCounts: {
    light: number;
    standard: number;
    pro: number;
    other: number;
  };
}

export default function AgencyDashboardPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [summary, setSummary] = useState<SummaryData>({
    totalShops: 0,
    monthlyNewCount: 0,
    monthlyCanceledCount: 0,
    planCounts: { light: 0, standard: 0, pro: 0, other: 0 },
  });
  const [shops, setShops] = useState<DetailedShop[]>([]);

    // 🆕 紹介情報・報酬
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'shops' | 'rewards'>('shops');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // 口座情報
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [accountType, setAccountType] = useState('savings');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlanTab, setSelectedPlanTab] = useState<'all' | 'light' | 'standard' | 'pro'>('all');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const res = await fetch(`/api/agency/stats?agencyId=${currentUser.uid}`);
          if (res.ok) {
            const data = await res.json();
            if (data.summary) setSummary(data.summary);
            if (data.shops) setShops(data.shops);
          }
        } catch (err) {
          console.error('代理店データ取得エラー:', err);
        }
      } else {
        setShops([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (err: any) {
      console.error('ログインエラー:', err);
      setLoginError('メールアドレスまたはパスワードが正しくありません。');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const filteredShops = useMemo(() => {
    return shops.filter((shop) => {
      if (selectedPlanTab !== 'all' && shop.plan.toLowerCase() !== selectedPlanTab) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();
      return (
        shop.name.toLowerCase().includes(q) ||
        shop.shopCode.toLowerCase().includes(q) ||
        shop.phone.replace(/[-–—]/g, '').includes(q.replace(/[-–—]/g, '')) ||
        shop.email.toLowerCase().includes(q) ||
        shop.address.toLowerCase().includes(q)
      );
    });
  }, [shops, searchQuery, selectedPlanTab]);

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'sans-serif', color: '#718096' }}>
        読み込み中...
      </div>
    );
  }

  // 🔥 未ログイン時はログイン画面を表示（これが実装されていなかった）
  if (!user) {
    return (
      <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '40px', maxWidth: '400px', width: '100%', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1a202c', margin: '0 0 8px 0' }}>代理店コンソール</h1>
            <p style={{ color: '#718096', fontSize: '13px', margin: 0 }}>ご登録の代理店アカウントでログインしてください</p>
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
                placeholder="agency@example.com"
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
        </div>
      </div>
    );
  }

  // 🔓 ログイン後のダッシュボード（ここからは user が null でないことが保証されている）
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* ヘッダー */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a202c', margin: '0 0 6px 0' }}>
              代理店コンソール
            </h1>
            <p style={{ color: '#718096', fontSize: '14px', margin: 0 }}>
              ログイン中: <strong>{user.email}</strong>
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{ padding: '8px 16px', background: '#edf2f7', color: '#4a5568', border: '1px solid #cbd5e0', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
          >
            ログアウト
          </button>
        </div>

        {/* サマリーカード */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '30px' }}>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#718096', marginBottom: '6px' }}>全累計店舗数</div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: '#1a202c' }}>
              {summary.totalShops} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>店舗</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#38a169', marginBottom: '6px' }}>当月新規登録数</div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: '#38a169' }}>
              +{summary.monthlyNewCount} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>店舗</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#e53e3e', marginBottom: '6px' }}>当月退会件数</div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: '#e53e3e' }}>
              {summary.monthlyCanceledCount} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>店舗</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#3182ce', marginBottom: '6px' }}>プラン別内訳</div>
            <div style={{ fontSize: '13px', color: '#2d3748', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
              <span>ライト: <strong>{summary.planCounts.light}</strong>件</span>
              <span>スタンダード: <strong>{summary.planCounts.standard}</strong>件</span>
              <span>プロ: <strong>{summary.planCounts.pro}</strong>件</span>
            </div>
          </div>
        </div>

         {user?.uid && (
        <PaymentFailuresSection referrerId={user.uid} referrerType="agency" />
      )}

        {/* 検索バー & プランタブ */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: '1 1 300px' }}>
              <input
                type="text"
                placeholder="🔍 店舗名・コード・電話・メール・住所で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e0',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {(['all', 'light', 'standard', 'pro'] as const).map((tab) => {
                const labels: Record<string, string> = {
                  all: 'すべて',
                  light: 'ライト',
                  standard: 'スタンダード',
                  pro: 'プロ',
                };
                const active = selectedPlanTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setSelectedPlanTab(tab)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      cursor: 'pointer',
                      background: active ? '#3182ce' : '#edf2f7',
                      color: active ? '#ffffff' : '#4a5568',
                    }}
                  >
                    {labels[tab]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 傘下店舗詳細テーブル */}
        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#1a202c', margin: 0 }}>
              傘下店舗一覧 ({filteredShops.length}件)
            </h2>
          </div>

          {filteredShops.length === 0 ? (
            <p style={{ color: '#a0aec0', fontSize: '14px', textAlign: 'center', padding: '40px 0', margin: 0 }}>
              条件に一致する店舗が見つかりません。
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f7fafc', borderBottom: '2px solid #edf2f7', color: '#4a5568' }}>
                    <th style={{ padding: '10px' }}>店舗名</th>
                    <th style={{ padding: '10px' }}>店舗コード</th>
                    <th style={{ padding: '10px' }}>プラン</th>
                    <th style={{ padding: '10px' }}>メールアドレス</th>
                    <th style={{ padding: '10px' }}>電話番号</th>
                    <th style={{ padding: '10px' }}>住所</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>配信許可人数</th>
                    <th style={{ padding: '10px' }}>利用開始日</th>
                    <th style={{ padding: '10px' }}>退会申請状況</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShops.map((shop) => (
                    <tr key={shop.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: '#2d3748' }}>
                        {shop.name}
                      </td>
                      <td style={{ padding: '10px', fontFamily: 'monospace', color: '#4a5568' }}>
                        {shop.shopCode}
                      </td>
                      <td style={{ padding: '10px' }}>
                        <span style={{
                          padding: '2px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          background: shop.plan === 'pro' ? '#fef3c7' : shop.plan === 'standard' ? '#ebf8ff' : '#edf2f7',
                          color: shop.plan === 'pro' ? '#c05621' : shop.plan === 'standard' ? '#2b6cb0' : '#4a5568',
                        }}>
                          {shop.plan.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '10px', fontSize: '12px' }}>{shop.email}</td>
                      <td style={{ padding: '10px', fontSize: '12px' }}>{shop.phone}</td>
                      <td style={{ padding: '10px', fontSize: '12px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={shop.address}>
                        {shop.address}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#3182ce', fontSize: '15px' }}>
                        {shop.subscriberCount.toLocaleString()} 人
                      </td>
                      <td style={{ padding: '10px', color: '#4a5568' }}>
                        {shop.createdAt}
                      </td>
                      <td style={{ padding: '10px' }}>
                        {shop.status === 'canceled' ? (
                          <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', background: '#fed7d7', color: '#9b2c2c' }}>
                            退会済み ({shop.canceledAt || '日時不詳'})
                          </span>
                        ) : shop.status === 'payment_warning' ? (
                          <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', background: '#feebc8', color: '#c05621' }}>
                            決済未完了 (警告)
                          </span>
                        ) : (
                          <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', background: '#c6f6d5', color: '#22543d' }}>
                            契約中 (正常)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
