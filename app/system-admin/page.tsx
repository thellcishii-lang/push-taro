'use client';

import { useState, useEffect } from 'react';

interface ShopData {
  id: string;
  name?: string;
  email?: string;
  plan?: string;
  status?: string;
  agencyId?: string;
  referrerId?: string;
  pushCount?: number;
  subscriberCount?: number;
  squareConnected?: boolean;
}

interface AgencyData {
  id: string;
  companyName?: string;
  ownerName?: string;
  email?: string;
  approved?: boolean;
}

export default function SystemAdminPage() {
  const [loading, setLoading] = useState(true);
  // 🔥 'payment-failures' を追加
  const [activeTab, setActiveTab] = useState<'pro' | 'all' | 'agencies' | 'payment-failures'>('all');
  const [filterType, setFilterType] = useState<'all' | 'direct' | 'referral' | 'agency'>('all');

  const [summary, setSummary] = useState({
    totalSubscribers: 0,
    lightCount: 0,
    standardCount: 0,
    proCount: 0,
    proDetails: { direct: 0, referral: 0, agency: 0 },
    agencyTotal: 0,
  });

  const [shops, setShops] = useState<ShopData[]>([]);
  const [agencies, setAgencies] = useState<AgencyData[]>([]);

  useEffect(() => {
    fetchSystemStats();
  }, []);

  const fetchSystemStats = async () => {
    try {
      const res = await fetch('/api/system-admin/stats');
      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary || summary);
        setShops(data.shops || []);
        setAgencies(data.agencies || []);
      }
    } catch (err) {
      console.error('システムデータ取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredShops = shops.filter((shop) => {
    if (activeTab === 'pro' && shop.plan?.toLowerCase() !== 'pro') return false;
    
    if (filterType === 'agency') return !!shop.agencyId;
    if (filterType === 'referral') return !!shop.referrerId && !shop.agencyId;
    if (filterType === 'direct') return !shop.agencyId && !shop.referrerId;
    
    return true;
  });

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'sans-serif', color: '#718096' }}>
        全体管理データを読み込み中...
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <main style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* ヘッダー */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a202c', margin: '0 0 6px 0' }}>
            Push-taro 全体管理画面 Dashboard
          </h1>
          <p style={{ color: '#718096', fontSize: '14px', margin: 0 }}>
            全店舗・代理店の稼働状況および顧客登録件数の全体サマリーです。
          </p>
        </div>

        {/* 📊 サマリーカードエリア */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '30px' }}>
          <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '12px', border: '2px solid #22c55e' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#15803d', marginBottom: '6px' }}>全店舗 累計登録顧客数</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#166534' }}>{summary.totalSubscribers.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>件</span></div>
          </div>

          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#718096', marginBottom: '6px' }}>ライトプラン</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#2b6cb0' }}>{summary.lightCount} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>件</span></div>
          </div>

          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#718096', marginBottom: '6px' }}>スタンダードプラン</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#2b6cb0' }}>{summary.standardCount} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>件</span></div>
          </div>

          <div style={{ background: '#ebf8ff', padding: '20px', borderRadius: '12px', border: '2px solid #3182ce' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#2b6cb0', marginBottom: '6px' }}>プロプラン（合計）</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#2b6cb0' }}>{summary.proCount} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>件</span></div>
          </div>

          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#718096', marginBottom: '6px' }}>加盟代理店数</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#38a169' }}>{summary.agencyTotal} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>社</span></div>
          </div>
        </div>

        {/* 🔥 タブ切替（4つに増えた） */}
        <div style={{ display: 'flex', gap: '20px', borderBottom: '2px solid #e2e8f0', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'all' ? '3px solid #3182ce' : 'none', fontWeight: 'bold', color: activeTab === 'all' ? '#3182ce' : '#718096', cursor: 'pointer' }}
          >
            全店舗リスト
          </button>
          <button
            onClick={() => setActiveTab('pro')}
            style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'pro' ? '3px solid #3182ce' : 'none', fontWeight: 'bold', color: activeTab === 'pro' ? '#3182ce' : '#718096', cursor: 'pointer' }}
          >
            プロプラン顧客詳細
          </button>
          <button
            onClick={() => setActiveTab('agencies')}
            style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'agencies' ? '3px solid #3182ce' : 'none', fontWeight: 'bold', color: activeTab === 'agencies' ? '#3182ce' : '#718096', cursor: 'pointer' }}
          >
            代理店一覧 & 審査
          </button>
          {/* 🔥 新しく追加 */}
          <button
            onClick={() => setActiveTab('payment-failures')}
            style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'payment-failures' ? '3px solid #ef4444' : 'none', fontWeight: 'bold', color: activeTab === 'payment-failures' ? '#ef4444' : '#718096', cursor: 'pointer' }}
          >
            ⚠️ 決済不履行一覧
          </button>
        </div>

        {/* 🔥 店舗テーブル（payment-failures の時は非表示） */}
        {activeTab !== 'agencies' && activeTab !== 'payment-failures' && (
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f7fafc', borderBottom: '2px solid #edf2f7' }}>
                    <th style={{ padding: '12px', color: '#4a5568' }}>店舗名 / ID</th>
                    <th style={{ padding: '12px', color: '#4a5568' }}>流入区分</th>
                    <th style={{ padding: '12px', color: '#4a5568' }}>登録顧客数 (Push購読)</th>
                    <th style={{ padding: '12px', color: '#4a5568' }}>月間PUSH数</th>
                    <th style={{ padding: '12px', color: '#4a5568' }}>ステータス</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShops.map((shop) => (
                    <tr key={shop.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                      <td style={{ padding: '16px 12px', fontWeight: 'bold', color: '#2d3748' }}>
                        {shop.name || shop.id}
                      </td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{
                          padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold',
                          background: shop.agencyId ? '#c6f6d5' : shop.referrerId ? '#feebc8' : '#edf2f7',
                          color: shop.agencyId ? '#22543d' : shop.referrerId ? '#742a2a' : '#4a5568'
                        }}>
                          {shop.agencyId ? '代理店経由' : shop.referrerId ? 'プロ紹介' : '直接申込'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', fontWeight: 'bold', color: '#0284c7' }}>
                        {shop.subscriberCount || 0} 件
                      </td>
                      <td style={{ padding: '16px 12px', color: '#2d3748' }}>
                        {shop.pushCount || 0} 通
                      </td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', background: '#c6f6d5', color: '#22543d' }}>
                          {shop.status || '契約中'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 🔥 代理店一覧（元々あった） */}
        {activeTab === 'agencies' && (
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h2>代理店一覧</h2>
            <p style={{ color: '#64748b' }}>現在の代理店一覧（審査機能は準備中）</p>
            {agencies.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>代理店はまだありません</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>会社名</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>担当者</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>メール</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>ステータス</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agencies.map((agency) => (
                      <tr key={agency.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{agency.companyName || '未設定'}</td>
                        <td style={{ padding: '12px' }}>{agency.ownerName || '-'}</td>
                        <td style={{ padding: '12px' }}>{agency.email || '-'}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', background: agency.approved ? '#c6f6d5' : '#fef3c7', color: agency.approved ? '#22543d' : '#d97706' }}>
                            {agency.approved ? '承認済み' : '審査中'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 🔥 決済不履行一覧（新しく追加） */}
        {activeTab === 'payment-failures' && <PaymentFailuresTab />}

      </main>
    </div>
  );
}

// ============================================================
// 🔥 決済不履行一覧タブ（新規追加）
// ============================================================
function PaymentFailuresTab() {
  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState<any[]>([]);

  useEffect(() => {
    fetchPaymentFailures();
  }, []);

  const fetchPaymentFailures = async () => {
    try {
      const res = await fetch('/api/admin/payment-failures');
      if (res.ok) {
        const data = await res.json();
        setShops(data.shops || []);
      }
    } catch (err) {
      console.error('決済不履行データ取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvoice = async (shopId: string, months: number) => {
    if (!confirm(`${months}ヶ月分の決済リンクを送信しますか？`)) return;
    try {
      const res = await fetch('/api/admin/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId, months }),
      });
      if (res.ok) {
        alert(`${months}ヶ月分の決済リンクを送信しました`);
        fetchPaymentFailures();
      } else {
        const data = await res.json();
        alert('エラー: ' + data.error);
      }
    } catch (err: any) {
      alert('通信エラー: ' + err.message);
    }
  };

  const handleDelete = async (shopId: string) => {
    if (!confirm(`店舗を完全に削除しますか？（復元できません）`)) return;
    try {
      const res = await fetch('/api/admin/delete-shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId }),
      });
      if (res.ok) {
        alert('削除しました');
        fetchPaymentFailures();
      } else {
        const data = await res.json();
        alert('エラー: ' + data.error);
      }
    } catch (err: any) {
      alert('通信エラー: ' + err.message);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>読み込み中...</div>;

  return (
    <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>決済不履行店舗一覧</h2>
        <span style={{ fontSize: '13px', color: '#64748b' }}>3回目の決済失敗で送信停止中の店舗</span>
      </div>

      {shops.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
          現在、決済不履行の店舗はありません
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>店舗名</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>店舗ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>プラン</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>不履行開始日</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>失敗回数</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>アクション</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>削除</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <tr key={shop.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{shop.name || '未設定'}</td>
                  <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '11px' }}>{shop.id.slice(0, 12)}...</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      background: shop.plan === 'pro' ? '#fef3c7' : shop.plan === 'standard' ? '#dbeafe' : '#f1f5f9',
                      color: shop.plan === 'pro' ? '#b45309' : shop.plan === 'standard' ? '#1d4ed8' : '#475569',
                    }}>
                      {shop.plan?.toUpperCase() || 'LIGHT'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {shop.failedAt ? new Date(shop.failedAt).toLocaleDateString() : '不明'}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      padding: '2px 12px',
                      borderRadius: '12px',
                      background: shop.failedCount >= 3 ? '#fecaca' : '#fef3c7',
                      color: shop.failedCount >= 3 ? '#dc2626' : '#d97706',
                      fontWeight: 'bold',
                      fontSize: '13px',
                    }}>
                      {shop.failedCount || 0}回
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleSendInvoice(shop.id, 1)}
                        style={{ padding: '4px 10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
                      >
                        1ヶ月分
                      </button>
                      <button
                        onClick={() => handleSendInvoice(shop.id, 2)}
                        style={{ padding: '4px 10px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
                      >
                        2ヶ月分
                      </button>
                      <button
                        onClick={() => handleSendInvoice(shop.id, 3)}
                        style={{ padding: '4px 10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
                      >
                        3ヶ月分
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleDelete(shop.id)}
                      style={{ padding: '4px 12px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
