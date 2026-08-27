'use client';

import { useState, useEffect } from 'react';

export default function AgencyDashboard() {
  // ダミーのデータ（実際はFirestore等からフェッチ）
  const [agencyData, setAgencyData] = useState({
    referralCode: 'AGENCY-PRO-999',
    activeCount: 84, // 現在のアクティブ紹介数
    currentRate: 30, // 現在の還元率 (%)
    monthlyEstimatedReward: 252000, // 当月見込み報酬 (円)
  });

  // 次のステージまでの計算ロジック
  const getNextStageInfo = (count: number) => {
    if (count <= 100) {
      return { nextGoal: 101, targetRate: 36, remaining: 101 - count, title: 'ステージ2（36%還元）まで' };
    } else if (count <= 200) {
      return { nextGoal: 201, targetRate: 45, remaining: 201 - count, title: '最高ステージ（45%還元）まで' };
    } else {
      return { nextGoal: 201, targetRate: 45, remaining: 0, title: '最高ランク達成中！' };
    }
  };

  const stageInfo = getNextStageInfo(agencyData.activeCount);
  const progressPercent = agencyData.activeCount <= 100 
    ? (agencyData.activeCount / 100) * 100 
    : agencyData.activeCount <= 200 
      ? ((agencyData.activeCount - 100) / 100) * 100 
      : 100;

  const copyReferralLink = () => {
    const link = `https://pushtaro.com/signup?ref=${agencyData.referralCode}`;
    navigator.clipboard.writeText(link);
    alert('紹介用リンクをコピーしました！');
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', color: '#2d3748', background: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* ヘッダー */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1a202c', margin: 0 }}>代理店パートナー管理画面</h1>
            <p style={{ color: '#718096', fontSize: '14px', margin: '4px 0 0 0' }}>現在の実績と報酬ステータスをご確認いただけます。</p>
          </div>
          <button 
            onClick={copyReferralLink}
            style={{ background: '#3182ce', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 2px 6px rgba(49,130,206,0.3)' }}
          >
            紹介用リンクをコピー
          </button>
        </div>

        {/* スタッツ（数値カード） */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          
          {/* アクティブ紹介数 */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '13px', color: '#718096', fontWeight: '600' }}>有効紹介店舗数（アクティブ）</div>
            <div style={{ fontSize: '36px', fontWeight: '900', color: '#1a202c', margin: '8px 0' }}>
              {agencyData.activeCount} <span style={{ fontSize: '16px', fontWeight: 'normal', color: '#718096' }}>店舗</span>
            </div>
            <div style={{ fontSize: '12px', color: '#3182ce', fontWeight: '600' }}>現在の適用還元率：{agencyData.currentRate}%</div>
          </div>

          {/* 当月見込み報酬 */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '13px', color: '#718096', fontWeight: '600' }}>当月報酬見込み（PayPay送金予定）</div>
            <div style={{ fontSize: '36px', fontWeight: '900', color: '#38a169', margin: '8px 0' }}>
              ¥{agencyData.monthlyEstimatedReward.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#718096' }}>※毎月末締め・翌月送金</div>
          </div>

        </div>

        {/* ランクアップ進捗バー */}
        <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', margin: 0 }}>🚀 ランクアップ進捗 ({stageInfo.title})</h3>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#3182ce' }}>
              {stageInfo.remaining > 0 ? `あと ${stageInfo.remaining} 店舗で昇格！` : '最大ランク到達中 🎉'}
            </span>
          </div>
          
          {/* プログレスバー背景 */}
          <div style={{ background: '#edf2f7', height: '14px', borderRadius: '7px', overflow: 'hidden', width: '100%' }}>
            <div style={{ background: 'linear-gradient(90deg, #3182ce 0%, #63b3ed 100%)', height: '100%', width: `${progressPercent}%`, transition: 'width 0.4s ease' }}></div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#718096', marginTop: '8px' }}>
            <span>0件 (30%)</span>
            <span>100件 (36%)</span>
            <span>200件以降 (45%)</span>
          </div>
        </div>

        {/* 紹介コード・詳細情報 */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '12px' }}>💡 あなたの紹介情報</h3>
          <p style={{ fontSize: '13px', color: '#4a5568', margin: '0 0 10px 0' }}>
            紹介コード: <code style={{ background: '#edf2f7', padding: '4px 8px', borderRadius: '4px', fontWeight: '700', color: '#2d3748' }}>{agencyData.referralCode}</code>
          </p>
          <p style={{ fontSize: '13px', color: '#718096', margin: 0 }}>
            ※店舗様が新規登録またはSquare決済の際に、紹介コードをご入力いただくと自動であなたの紹介として紐づきます。
          </p>
        </div>

      </div>
    </div>
  );
}
