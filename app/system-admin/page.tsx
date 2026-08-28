'useDemod';
'use client';

import { useState } from 'react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'plans' | 'pro' | 'referral' | 'agency'>('pro');
  const [proFilter, setProFilter] = useState<'all' | 'direct' | 'referral' | 'agency'>('all');

  return (
    <div style={{ padding: '30px', background: '#f4f6f8', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#1a202c' }}>
        Push-taro 全体管理画面 Dashboard
      </h1>

      {/* サマリーカード */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e1e1e1' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>ライトプラン</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2b6cb0' }}>12 件</div>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e1e1e1' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>スタンダードプラン</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2b6cb0' }}>28 件</div>
        </div>
        <div style={{ background: '#ebf8ff', padding: '20px', borderRadius: '8px', border: '2px solid #3182ce' }}>
          <div style={{ fontSize: '12px', color: '#2b6cb0', fontWeight: 'bold' }}>プロプラン（合計）</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2b6cb0' }}>45 件</div>
          <div style={{ fontSize: '11px', color: '#4a5568', marginTop: '5px' }}>
            直接: 15 / 紹介: 10 / 代理店: 20
          </div>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e1e1e1' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>加盟代理店数</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2f855a' }}>8 社</div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #e2e8f0', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('pro')}
          style={{
            padding: '10px 20px',
            fontWeight: 'bold',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'pro' ? '3px solid #3182ce' : 'none',
            color: activeTab === 'pro' ? '#3182ce' : '#4a5568',
            cursor: 'pointer'
          }}
        >
          プロプラン顧客管理 (詳細)
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          style={{
            padding: '10px 20px',
            fontWeight: 'bold',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'plans' ? '3px solid #3182ce' : 'none',
            color: activeTab === 'plans' ? '#3182ce' : '#4a5568',
            cursor: 'pointer'
          }}
        >
          ライト / スタンダード顧客
        </button>
        <button
          onClick={() => setActiveTab('referral')}
          style={{
            padding: '10px 20px',
            fontWeight: 'bold',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'referral' ? '3px solid #3182ce' : 'none',
            color: activeTab === 'referral' ? '#3182ce' : '#4a5568',
            cursor: 'pointer'
          }}
        >
          プロ紹介制度管理
        </button>
        <button
          onClick={() => setActiveTab('agency')}
          style={{
            padding: '10px 20px',
            fontWeight: 'bold',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'agency' ? '3px solid #3182ce' : 'none',
            color: activeTab === 'agency' ? '#3182ce' : '#4a5568',
            cursor: 'pointer'
          }}
        >
          代理店 ＆ 審査承認
        </button>
      </div>

      {/* コンテンツエリア：プロプラン管理 */}
      {activeTab === 'pro' && (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e1e1e1' }}>
          {/* フィルターボタン */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', alignSelf: 'center' }}>表示絞り込み:</span>
            <button
              onClick={() => setProFilter('all')}
              style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc', background: proFilter === 'all' ? '#2b6cb0' : '#fff', color: proFilter === 'all' ? '#fff' : '#333', cursor: 'pointer' }}
            >
              全体 (45)
            </button>
            <button
              onClick={() => setProFilter('direct')}
              style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc', background: proFilter === 'direct' ? '#2b6cb0' : '#fff', color: proFilter === 'direct' ? '#fff' : '#333', cursor: 'pointer' }}
            >
              直接申込 (15)
            </button>
            <button
              onClick={() => setProFilter('referral')}
              style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc', background: proFilter === 'referral' ? '#2b6cb0' : '#fff', color: proFilter === 'referral' ? '#fff' : '#333', cursor: 'pointer' }}
            >
              プロ紹介制度 (10)
            </button>
            <button
              onClick={() => setProFilter('agency')}
              style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc', background: proFilter === 'agency' ? '#2b6cb0' : '#fff', color: proFilter === 'agency' ? '#fff' : '#333', cursor: 'pointer' }}
            >
              代理店経由 (20)
            </button>
          </div>

          {/* テーブルデータサンプル */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f7fafc', textAlign: 'left', borderBottom: '2px solid #edf2f7' }}>
                <th style={{ padding: '12px' }}>店舗名 / オーナー</th>
                <th style={{ padding: '12px' }}>流入区分</th>
                <th style={{ padding: '12px' }}>紹介者 / 代理店</th>
                <th style={{ padding: '12px' }}>Square連携</th>
                <th style={{ padding: '12px' }}>顧客登録数</th>
                <th style={{ padding: '12px' }}>月間PUSH数</th>
                <th style={{ padding: '12px' }}>ステータス</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #edf2f7' }}>
                <td style={{ padding: '12px' }}>
                  <strong>サンプル美容室 渋谷店</strong><br />
                  <span style={{ color: '#718096', fontSize: '11px' }}>shibuya@example.com</span>
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{ background: '#c6f6d5', color: '#22543d', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>代理店経由</span>
                </td>
                <td style={{ padding: '12px' }}>株式会社サンプルエージェンシー</td>
                <td style={{ padding: '12px', color: 'green', fontWeight: 'bold' }}>連携済み</td>
                <td style={{ padding: '12px' }}>1,240 件</td>
                <td style={{ padding: '12px' }}>3,500 通</td>
                <td style={{ padding: '12px', color: '#2b6cb0', fontWeight: 'bold' }}>契約中</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #edf2f7' }}>
                <td style={{ padding: '12px' }}>
                  <strong>カフェ・ド・テスト</strong><br />
                  <span style={{ color: '#718096', fontSize: '11px' }}>cafe@example.com</span>
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{ background: '#feebc8', color: '#742a2a', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>プロ紹介</span>
                </td>
                <td style={{ padding: '12px' }}>BAR サンプル (CODE: REF001)</td>
                <td style={{ padding: '12px', color: 'green', fontWeight: 'bold' }}>連携済み</td>
                <td style={{ padding: '12px' }}>580 件</td>
                <td style={{ padding: '12px' }}>1,200 通</td>
                <td style={{ padding: '12px', color: '#2b6cb0', fontWeight: 'bold' }}>契約中</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* 代理店 ＆ 審査承認タブ（仮表示） */}
      {activeTab === 'agency' && (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e1e1e1' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#c53030' }}>
            審査待ち代理店申請 (1件)
          </h2>
          <div style={{ border: '1px solid #feb2b2', background: '#fff5f5', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>株式会社新規エージェンシー</strong> (担当: 田中 太郎)<br />
                <span style={{ fontSize: '12px', color: '#4a5568' }}>Email: tanaka@agency-new.com | TEL: 090-1234-5678</span>
              </div>
              <button
                style={{ background: '#38a169', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                承認して決済URLをメール送信
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
