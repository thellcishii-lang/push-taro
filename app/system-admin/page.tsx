'use client';

import { useState, useEffect } from 'react';

interface ShopData {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
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
  status?: string; // 'pending_approval' | 'active' | 'suspended'
  approvedAt?: string | null;
  referralCode?: string;
  createdAt?: string | null;
}

export default function SystemAdminPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pro' | 'agencies' | 'affiliates' | 'payment-failures'>('all');
  const [filterType, setFilterType] = useState<'all' | 'direct' | 'referral' | 'agency'>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const name = (shop.name || '').toLowerCase();
      const id = shop.id.toLowerCase();
      const email = (shop.email || '').toLowerCase();
      const phone = (shop.phone || '').replace(/[-－]/g, '');
      const address = (shop.address || '').toLowerCase();
      const qClean = q.replace(/[-－]/g, '');
      return (
        name.includes(q) ||
        id.includes(q) ||
        email.includes(q) ||
        phone.includes(qClean) ||
        address.includes(q)
      );
    }

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
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* ヘッダー */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a202c', margin: '0 0 6px 0' }}>
            Push-taro 全体管理画面 Dashboard
          </h1>
          <p style={{ color: '#718096', fontSize: '14px', margin: 0 }}>
            全店舗・代理店の稼働状況および顧客登録件数の全体サマリーです。
          </p>
        </div>

        {/* サマリーカード */}
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

        {/* タブ */}
        <div style={{ display: 'flex', gap: '20px', borderBottom: '2px solid #e2e8f0', marginBottom: '20px', flexWrap: 'wrap' }}>
  <button onClick={() => setActiveTab('all')} style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'all' ? '3px solid #3182ce' : 'none', fontWeight: 'bold', color: activeTab === 'all' ? '#3182ce' : '#718096', cursor: 'pointer' }}>全店舗リスト</button>

  <button onClick={() => setActiveTab('pro')} style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'pro' ? '3px solid #3182ce' : 'none', fontWeight: 'bold', color: activeTab === 'pro' ? '#3182ce' : '#718096', cursor: 'pointer' }}>プロプラン顧客詳細</button>

  <button onClick={() => setActiveTab('agencies')} style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'agencies' ? '3px solid #3182ce' : 'none', fontWeight: 'bold', color: activeTab === 'agencies' ? '#3182ce' : '#718096', cursor: 'pointer' }}>代理店一覧 & 審査</button>

  {/* 🔥 アフィリエイト一覧（4番目） */}
  <button onClick={() => setActiveTab('affiliates')} style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'affiliates' ? '3px solid #16a34a' : 'none', fontWeight: 'bold', color: activeTab === 'affiliates' ? '#16a34a' : '#718096', cursor: 'pointer' }}>📢 アフィリエイト一覧</button>

  {/* ⚠️ 決済不履行一覧（一番最後） */}
  <button onClick={() => setActiveTab('payment-failures')} style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'payment-failures' ? '3px solid #ef4444' : 'none', fontWeight: 'bold', color: activeTab === 'payment-failures' ? '#ef4444' : '#718096', cursor: 'pointer' }}>⚠️ 決済不履行一覧</button>
</div>

        {/* 全店舗リスト / プロプラン */}
        {activeTab !== 'agencies' && activeTab !== 'payment-failures' && activeTab !== 'affiliates' && (
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            
            {/* 検索バー & 大分類フィルター */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(['all', 'direct', 'referral', 'agency'] as const).map((type) => {
                  const labels = { all: 'すべて', direct: '直接申込', referral: 'プロ紹介', agency: '代理店経由' };
                  return (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: filterType === type ? '2px solid #3182ce' : '1px solid #cbd5e0',
                        background: filterType === type ? '#ebf8ff' : '#fff',
                        fontWeight: filterType === type ? 'bold' : 'normal',
                        color: filterType === type ? '#1d4ed8' : '#475569',
                        cursor: 'pointer',
                        fontSize: '13px',
                      }}
                    >
                      {labels[type]}
                    </button>
                  );
                })}
              </div>

              <div style={{ flex: 1, minWidth: '200px' }}>
                <input
                  type="text"
                  placeholder="🔍 店舗名・ID・メール・電話・住所で検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e0',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* テーブル */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f7fafc', borderBottom: '2px solid #edf2f7' }}>
                    <th style={{ padding: '10px', color: '#4a5568' }}>店舗名</th>
                    <th style={{ padding: '10px', color: '#4a5568' }}>ID</th>
                    <th style={{ padding: '10px', color: '#4a5568' }}>プラン</th>
                    <th style={{ padding: '10px', color: '#4a5568' }}>メール</th>
                    <th style={{ padding: '10px', color: '#4a5568' }}>電話</th>
                    <th style={{ padding: '10px', color: '#4a5568' }}>住所</th>
                    <th style={{ padding: '10px', color: '#4a5568' }}>流入</th>
                    <th style={{ padding: '10px', color: '#4a5568', textAlign: 'center' }}>顧客数</th>
                    <th style={{ padding: '10px', color: '#4a5568', textAlign: 'center' }}>PUSH</th>
                    <th style={{ padding: '10px', color: '#4a5568' }}>ステータス</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShops.map((shop) => {
                    const statusMap: Record<string, { label: string; bg: string; color: string }> = {
                      'active': { label: '契約中', bg: '#c6f6d5', color: '#22543d' },
                      'payment_warning': { label: '支払い警告', bg: '#fef3c7', color: '#d97706' },
                      'send_disabled': { label: '送信停止', bg: '#fecaca', color: '#dc2626' },
                      'canceled': { label: '退会済み', bg: '#f1f5f9', color: '#64748b' },
                      'cancelled': { label: '退会済み', bg: '#f1f5f9', color: '#64748b' },
                      'pending_payment': { label: '仮登録（未決済）', bg: '#fef3c7', color: '#d97706' },
                    };
                    const s = statusMap[shop.status?.toLowerCase() || ''] || { label: '契約中', bg: '#c6f6d5', color: '#22543d' };

                    return (
                      <tr key={shop.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{shop.name || '未設定'}</td>
                        <td style={{ padding: '10px', fontFamily: 'monospace', fontSize: '11px', color: '#64748b' }}>{shop.id}</td>
                        <td style={{ padding: '10px' }}>
                          <span style={{
                            padding: '2px 10px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            background: shop.plan === 'pro' ? '#fef3c7' : shop.plan === 'standard' ? '#dbeafe' : '#f1f5f9',
                            color: shop.plan === 'pro' ? '#b45309' : shop.plan === 'standard' ? '#1d4ed8' : '#475569',
                          }}>
                            {shop.plan?.toUpperCase() || 'LIGHT'}
                          </span>
                        </td>
                        <td style={{ padding: '10px', fontSize: '12px' }}>{shop.email || '-'}</td>
                        <td style={{ padding: '10px', fontSize: '12px' }}>{shop.phone || '-'}</td>
                        <td style={{ padding: '10px', fontSize: '12px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={shop.address || ''}>
                          {shop.address || '-'}
                        </td>
                        <td style={{ padding: '10px' }}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            background: shop.agencyId ? '#c6f6d5' : shop.referrerId ? '#feebc8' : '#edf2f7',
                            color: shop.agencyId ? '#22543d' : shop.referrerId ? '#742a2a' : '#4a5568'
                          }}>
                            {shop.agencyId ? '代理店' : shop.referrerId ? '紹介' : '直接'}
                          </span>
                        </td>
                        <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#0284c7' }}>{shop.subscriberCount || 0}</td>
                        <td style={{ padding: '10px', textAlign: 'center', color: '#2d3748' }}>{shop.pushCount || 0}</td>
                        <td style={{ padding: '10px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            background: s.bg,
                            color: s.color,
                          }}>
                            {s.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredShops.length === 0 && (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
                条件に一致する店舗はありません
              </p>
            )}
          </div>
        )}

        {/* 代理店一覧 */}
        {activeTab === 'agencies' && (
  <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
    <h2>代理店一覧</h2>
    <p style={{ color: '#64748b' }}>代理店パートナー一覧</p>
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
              <th style={{ padding: '12px', textAlign: 'left' }}>紹介コード</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>ステータス</th>
            </tr>
          </thead>
          <tbody>
            {agencies.map((agency) => (
              <tr key={agency.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{agency.companyName || '未設定'}</td>
                <td style={{ padding: '12px' }}>{agency.ownerName || '-'}</td>
                <td style={{ padding: '12px' }}>{agency.email || '-'}</td>
                <td style={{ padding: '12px', fontFamily: 'monospace' }}>{agency.referralCode || '-'}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    background: agency.status === 'active' ? '#c6f6d5' : agency.status === 'approved_pending_payment' ? '#fef3c7' : '#f1f5f9',
                    color: agency.status === 'active' ? '#22543d' : agency.status === 'approved_pending_payment' ? '#d97706' : '#64748b',
                  }}>
                    {agency.status === 'active' ? '承認済み' : agency.status === 'approved_pending_payment' ? '決済待ち' : '審査中'}
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

        // ============================================================
// アフィリエイト一覧タブ（新規追加）
// ============================================================
function AffiliatesTab() {
  const [loading, setLoading] = useState(true);
  const [affiliates, setAffiliates] = useState<any[]>([]);

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    try {
      const res = await fetch('/api/admin/affiliates');
      if (res.ok) {
        const data = await res.json();
        setAffiliates(data.affiliates || []);
      }
    } catch (err) {
      console.error('アフィリエイトデータ取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>読み込み中...</div>;

  return (
    <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>アフィリエイト一覧</h2>
        <span style={{ fontSize: '13px', color: '#64748b' }}>全 {affiliates.length} 件</span>
      </div>

      {affiliates.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
          まだアフィリエイト登録はありません
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>氏名</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>メール</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>紹介コード</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>報酬タイプ</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>累計報酬</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>未払い</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>インボイス</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>ステータス</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>登録日</th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map((aff) => (
                <tr key={aff.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{aff.name}</td>
                  <td style={{ padding: '10px', fontSize: '12px' }}>{aff.email}</td>
                  <td style={{ padding: '10px', fontFamily: 'monospace', fontSize: '12px' }}>{aff.referralCode}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      background: aff.rewardType === 'recurring' ? '#dbeafe' : '#fef3c7',
                      color: aff.rewardType === 'recurring' ? '#1d4ed8' : '#d97706',
                    }}>
                      {aff.rewardType === 'recurring' ? '継続課金' : '一括'}
                    </span>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#1a202c' }}>
                    ¥{aff.totalEarnings.toLocaleString()}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: aff.unpaidReward >= 5000 ? '#22c55e' : '#eab308' }}>
                    ¥{aff.unpaidReward.toLocaleString()}
                    {aff.unpaidReward >= 5000 && (
                      <span style={{ fontSize: '10px', color: '#22c55e', marginLeft: '4px' }}>✅</span>
                    )}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      background: aff.hasInvoice ? '#c6f6d5' : '#fecaca',
                      color: aff.hasInvoice ? '#22543d' : '#dc2626',
                    }}>
                      {aff.hasInvoice ? 'あり' : 'なし'}
                    </span>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      background: aff.status === 'active' ? '#c6f6d5' : '#f1f5f9',
                      color: aff.status === 'active' ? '#22543d' : '#64748b',
                    }}>
                      {aff.status === 'active' ? '有効' : '停止'}
                    </span>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', fontSize: '11px', color: '#64748b' }}>
                    {aff.createdAt ? new Date(aff.createdAt).toLocaleDateString() : '-'}
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
　　　　　　　　　　　　　　　　　{/* アフィリエイト一覧 */}
　　　　　　　　　　　　　　　　　{activeTab === 'affiliates' && <AffiliatesTab />}

        {/* 決済不履行一覧 */}
        {activeTab === 'payment-failures' && <PaymentFailuresTab />}

      </main>
    </div>
  );
}

// ============================================================
// 決済不履行一覧タブ
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
                      <button onClick={() => handleSendInvoice(shop.id, 1)} style={{ padding: '4px 10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>1ヶ月分</button>
                      <button onClick={() => handleSendInvoice(shop.id, 2)} style={{ padding: '4px 10px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>2ヶ月分</button>
                      <button onClick={() => handleSendInvoice(shop.id, 3)} style={{ padding: '4px 10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>3ヶ月分</button>
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button onClick={() => handleDelete(shop.id)} style={{ padding: '4px 12px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>削除</button>
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
