'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth } from '@/lib/firebase/client';
import { onAuthStateChanged } from 'firebase/auth';

interface ReferredShop {
  id: string;
  name?: string;
  plan?: string;
  status?: string;
  createdAt?: any;
}

interface AgencyStats {
  referredShopCount: number;
  pendingPayout: number;
  totalEarned: number;
}

export default function AgencyDashboardPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [agencyData, setAgencyData] = useState<any>(null);
  const [stats, setStats] = useState<AgencyStats>({
    referredShopCount: 0,
    pendingPayout: 0,
    totalEarned: 0,
  });
  const [shops, setShops] = useState<ReferredShop[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const res = await fetch(`/api/agency/stats?agencyId=${user.uid}`);
          if (res.ok) {
            const data = await res.json();
            setAgencyData(data.agency || null);
            if (data.stats) {
              setStats(data.stats);
            }
            setShops(data.shops || []);
          }
        } catch (err) {
          console.error('代理店データ取得エラー:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const referralCode = agencyData?.referralCode || agencyData?.id || 'AGENCY-PRO-999';

  const handleCopyLink = () => {
    const link = `https://push-taro.com/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 還元率と進捗計算（リアル数値に基づく計算）
  const activeCount = stats.referredShopCount;
  const currentRate = activeCount >= 200 ? 45 : activeCount >= 100 ? 36 : 30;
  const nextTarget = activeCount >= 100 ? 200 : 100;
  const remainingForNext = Math.max(0, nextTarget - activeCount);
  const progressPercent = Math.min(100, (activeCount / nextTarget) * 100);

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'sans-serif', color: '#718096' }}>
        データを読み込み中...
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <main style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* ヘッダー */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a202c', margin: '0 0 6px 0' }}>
              代理店パートナー管理画面
            </h1>
            <p style={{ color: '#718096', fontSize: '14px', margin: 0 }}>
              現在の実績と報酬ステータスをご確認いただけます。
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => {
                if (agencyData?.id) {
                  window.open(`/api/referrals/export-csv?referrer_id=${agencyData.id}`, '_blank');
                }
              }}
              style={{ padding: '10px 18px', background: '#edf2f7', color: '#2d3748', border: '1px solid #cbd5e0', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>📊</span> 明細CSV出力
            </button>
            <button
              onClick={handleCopyLink}
              style={{ padding: '10px 20px', background: '#3182ce', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', boxShadow: '0 2px 6px rgba(49,130,206,0.3)' }}
            >
              {copied ? '✨ コピーしました！' : '紹介用リンクをコピー'}
            </button>
          </div>
        </div>

        {/* 2カラム表示（有効紹介店舗数 / 当月報酬見込み） */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '25px' }}>
          {/* 左カード */}
          <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#718096', marginBottom: '12px' }}>
              有効紹介店舗数（アクティブ）
            </div>
            <div style={{ fontSize: '40px', fontWeight: '900', color: '#1a202c', lineHeight: 1 }}>
              {activeCount} <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#4a5568' }}>店舗</span>
            </div>
            <div style={{ fontSize: '13px', color: '#3182ce', fontWeight: 'bold', marginTop: '16px' }}>
              現在の適用還元率 : {currentRate}%
            </div>
          </div>

          {/* 右カード */}
          <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#718096', marginBottom: '12px' }}>
              当月報酬見込み（一括請求・相殺予定）
            </div>
            <div style={{ fontSize: '40px', fontWeight: '900', color: '#38a169', lineHeight: 1 }}>
              ¥{stats.pendingPayout.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#a0aec0', marginTop: '16px' }}>
              ※毎月末締め・まとめて請求精算に統合
            </div>
          </div>
        </div>

        {/* 🚀 ランクアップ進捗バー */}
        <div style={{ background: '#ffffff', padding: '24px 28px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontWeight: '800', fontSize: '15px', color: '#1a202c' }}>
              🚀 ランクアップ進捗（ステージ{currentRate === 30 ? '2 (36%還元)' : '3 (45%還元)'} まで）
            </div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#3182ce' }}>
              {remainingForNext > 0 ? `あと ${remainingForNext} 店舗で昇格！` : '最高ステージ到達！'}
            </div>
          </div>

          <div style={{ height: '12px', background: '#edf2f7', borderRadius: '6px', overflow: 'hidden', marginBottom: '10px' }}>
            <div style={{ width: `${progressPercent}%`, background: '#3182ce', height: '100%', borderRadius: '6px', transition: 'width 0.5s ease' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#718096' }}>
            <span>0件 (30%)</span>
            <span>100件 (36%)</span>
            <span>200件以降 (45%)</span>
          </div>
        </div>

        {/* 💡 あなたの紹介情報 */}
        <div style={{ background: '#ffffff', padding: '24px 28px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '25px' }}>
          <div style={{ fontWeight: '800', fontSize: '15px', color: '#1a202c', marginBottom: '12px' }}>
            💡 あなたの紹介情報
          </div>
          <div style={{ fontSize: '14px', color: '#4a5568', marginBottom: '8px' }}>
            紹介コード: <code style={{ background: '#edf2f7', padding: '4px 10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontWeight: 'bold', color: '#2b6cb0' }}>
              {referralCode}
            </code>
          </div>
          <p style={{ fontSize: '12px', color: '#718096', margin: 0, lineHeight: 1.6 }}>
            ※店舗様が新規登録またはSquare決済の際に、紹介コードをご入力いただくと自動であなたの紹介として紐づきます。代理店アカウントでの報酬は毎月の請求まとめて精算時に自動で控除・相殺されます。
          </p>
        </div>

        {/* 紹介店舗一覧テーブル */}
        <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#1a202c', marginBottom: '20px' }}>
            紹介顧客リスト（店舗一覧）
          </h2>

          {shops.length === 0 ? (
            <p style={{ color: '#a0aec0', fontSize: '14px', textAlign: 'center', padding: '30px 0', margin: 0 }}>
              現在、紹介コード経由で登録された店舗はありません。
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f7fafc', borderBottom: '2px solid #edf2f7' }}>
                    <th style={{ padding: '12px', color: '#4a5568' }}>店舗ID / 店舗名</th>
                    <th style={{ padding: '12px', color: '#4a5568' }}>プラン</th>
                    <th style={{ padding: '12px', color: '#4a5568' }}>ステータス</th>
                  </tr>
                </thead>
                <tbody>
                  {shops.map((shop) => (
                    <tr key={shop.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                      <td style={{ padding: '16px 12px', fontWeight: 'bold', color: '#2d3748' }}>
                        {shop.name || shop.id}
                      </td>
                      <td style={{ padding: '16px 12px', color: '#3182ce', fontWeight: 'bold' }}>
                        {shop.plan ? shop.plan.toUpperCase() : 'STANDARD'}
                      </td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          background: shop.status === 'active' || !shop.status ? '#c6f6d5' : '#fed7d7',
                          color: shop.status === 'active' || !shop.status ? '#22543d' : '#9b2c2c'
                        }}>
                          {shop.status === 'active' || !shop.status ? '契約中' : '解約 / 停止'}
                        </span>
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
