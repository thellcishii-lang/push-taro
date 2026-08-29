'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ShopData {
  id: string;
  name?: string;
  email?: string;
  plan?: string;
  status?: string;
  agencyId?: string;
  referrerId?: string;
  pushCount?: number;
  squareConnected?: boolean;
}

interface AgencyData {
  id: string;
  companyName?: string;
  ownerName?: string;
  email?: string;
  approved?: boolean;
  createdAt?: any;
}

export default function SystemAdminPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pro' | 'all' | 'agencies'>('pro');
  const [filterType, setFilterType] = useState<'all' | 'direct' | 'referral' | 'agency'>('all');

  const [summary, setSummary] = useState({
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

  // 絞り込みフィルター処理
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
            全店舗・代理店の稼働状況および契約数の全体サマリーです。
          </p>
        </div>

        {/* 📊 サマリーカードエリア（リアルタイム集計数値） */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '30px' }}>
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
            <div style={{ fontSize: '11px', color: '#4a5568', marginTop: '6px' }}>
              直接: {summary.proDetails.direct} / 紹介: {summary.proDetails.referral} / 代理店: {summary.proDetails.agency}
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#718096', marginBottom: '6px' }}>加盟代理店数</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#38a169' }}>{summary.agencyTotal} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>社</span></div>
          </div>
        </div>

        {/* タブ切り替え */}
        <div style={{ display: 'flex', gap: '20px', borderBottom: '2px solid #e2e8f0', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('pro')}
            style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'pro' ? '3px solid #3182ce' : 'none', fontWeight: 'bold', color: activeTab === 'pro' ? '#3182ce' : '#718096', cursor: 'pointer' }}
          >
            プロプラン顧客管理（詳細）
          </button>
          <button
            onClick={() => setActiveTab('all')}
            style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'all' ? '3px solid #3182ce' : 'none', fontWeight: 'bold', color: activeTab === 'all' ? '#3182ce' : '#718096', cursor: 'pointer' }}
          >
            全店舗リスト
          </button>
          <button
            onClick={() => setActiveTab('agencies')}
            style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'agencies' ? '3px solid #3182ce' : 'none', fontWeight: 'bold', color: activeTab === 'agencies' ? '#3182ce' : '#718096', cursor: 'pointer' }}
          >
            代理店一覧 & 審査
          </button>
        </div>

        {/* 絞り込みボタン（店舗表示時） */}
        {activeTab !== 'agencies' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#4a5568' }}>表示絞り込み:</span>
            <button onClick={() => setFilterType('all')} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #cbd5e0', background: filterType === 'all' ? '#3182ce' : '#fff', color: filterType === 'all' ? '#fff' : '#2d3748', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>全体 ({shops.length})</button>
            <button onClick={() => setFilterType('direct')} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #cbd5e0', background: filterType === 'direct' ? '#3182ce' : '#fff', color: filterType === 'direct' ? '#fff' : '#2d3748', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>直接申込</button>
            <button onClick={() => setFilterType('referral')} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #cbd5e0', background: filterType === 'referral' ? '#3182ce' : '#fff', color: filterType === 'referral' ? '#fff' : '#2d3748', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>プロ紹介</button>
            <button onClick={() => setFilterType('agency')} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #cbd5e0', background: filterType === 'agency' ? '#3182ce' : '#fff', color: filterType === 'agency' ? '#fff' : '#2d3748', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>代理店経由</button>
          </div>
        )}

        {/* 店舗テーブル表示 */}
        {activeTab !== 'agencies' ? (
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            {filteredShops.length === 0 ? (
              <p style={{ color: '#a0aec0', fontSize: '14px', textAlign: 'center', padding: '30px 0' }}>該当する店舗データが存在しません。</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: '#f7fafc', borderBottom: '2px solid #edf2f7' }}>
                      <th style={{ padding: '12px', color: '#4a5568' }}>店舗名 / オーナー</th>
                      <th style={{ padding: '12px', color: '#4a5568' }}>流入区分</th>
                      <th style={{ padding: '12px', color: '#4a5568' }}>紹介者 / 代理店ID</th>
                      <th style={{ padding: '12px', color: '#4a5568' }}>Square連携</th>
                      <th style={{ padding: '12px', color: '#4a5568' }}>月間PUSH数</th>
                      <th style={{ padding: '12px', color: '#4a5568' }}>ステータス</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredShops.map((shop) => (
                      <tr key={shop.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                        <td style={{ padding: '16px 12px', fontWeight: 'bold', color: '#2d3748' }}>
                          {shop.name || shop.id}
                          {shop.email && <div style={{ fontSize: '12px', color: '#718096', fontWeight: 'normal' }}>{shop.email}</div>}
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
                        <td style={{ padding: '16px 12px', color: '#4a5568' }}>
                          {shop.agencyId || shop.referrerId || '-'}
                        </td>
                        <td style={{ padding: '16px 12px', color: shop.squareConnected ? '#38a169' : '#a0aec0', fontWeight: 'bold' }}>
                          {shop.squareConnected ? '連携済み' : '未連携'}
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
            )}
          </div>
        ) : (
          /* 代理店一覧表示 */
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            {agencies.length === 0 ? (
              <p style={{ color: '#a0aec0', fontSize: '14px', textAlign: 'center', padding: '30px 0' }}>代理店データが存在しません。</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: '#f7fafc', borderBottom: '2px solid #edf2f7' }}>
                      <th style={{ padding: '12px', color: '#4a5568' }}>代理店ID / 会社名</th>
                      <th style={{ padding: '12px', color: '#4a5568' }}>担当者名</th>
                      <th style={{ padding: '12px', color: '#4a5568' }}>メールアドレス</th>
                      <th style={{ padding: '12px', color: '#4a5568' }}>ステータス</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agencies.map((agency) => (
                      <tr key={agency.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                        <td style={{ padding: '16px 12px', fontWeight: 'bold', color: '#2d3748' }}>
                          {agency.companyName || agency.id}
                        </td>
                        <td style={{ padding: '16px 12px', color: '#4a5568' }}>{agency.ownerName || '-'}</td>
                        <td style={{ padding: '16px 12px', color: '#3182ce' }}>{agency.email || '-'}</td>
                        <td style={{ padding: '16px 12px' }}>
                          <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', background: agency.approved ? '#c6f6d5' : '#feebc8', color: agency.approved ? '#22543d' : '#9c4221' }}>
                            {agency.approved ? '承認済み' : '審査中 / 申請中'}
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
      </main>
    </div>
  );
}
