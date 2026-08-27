'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AgencyPage() {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApply = () => {
    if (!agreed) {
      alert('代理店利用規約への同意が必要です。');
      return;
    }
    setLoading(true);
    // Squareの代理店初期費用（加盟金30万円＋初月月額等）の決済URLへリダイレクト
    window.location.href = 'https://square.link/u/your-agency-payment-link';
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', color: '#2d3748', background: '#f8fafc', minHeight: '100vh', margin: 0, padding: 0, lineHeight: 1.7 }}>
      
      {/* LP共通ヘッダー */}
      <nav style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: '20px', fontWeight: '800', color: '#1a202c', letterSpacing: '-0.5px' }}>
          <Link href="/" style={{ color: '#1a202c', textDecoration: 'none' }}>
            Push-taro<span style={{ color: '#3182ce', fontSize: '14px', marginLeft: '8px', fontWeight: 'normal' }}>本格派CRMツール</span>
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/#pro-referral" style={{ fontSize: '14px', fontWeight: '600', color: '#dd6b20', textDecoration: 'none' }}>
            プロ紹介制度
          </Link>
          <Link href="/#pricing" style={{ fontSize: '14px', fontWeight: '600', color: '#4a5568', textDecoration: 'none' }}>
            料金プラン
          </Link>
          <Link href="/signup" style={{ background: '#3182ce', color: '#fff', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
            お申し込み
          </Link>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main style={{ maxWidth: '850px', margin: '50px auto', background: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        
        {/* ヘッダー */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ background: '#ebf8ff', color: '#3182ce', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Official Partner Program
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '16px 0 10px 0', color: '#1a202c' }}>
            代理店パートナーお申し込み
          </h1>
          <p style={{ color: '#718096', fontSize: '16px', maxWidth: '650px', margin: '0 auto' }}>
            本気で収益を伸ばし、事業の柱を作るための超過累進型代理店制度です。専用アカウントによる万全のサポートと管理体制をご提供します。
          </p>
        </div>

        {/* 費用と条件のボックス */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {/* 加盟金 */}
          <div style={{ background: 'linear-gradient(135deg, #ebf8ff 0%, #eef2ff 100%)', border: '2px solid #bee3f8', padding: '30px', borderRadius: '14px', textAlign: 'center' }}>
            <span style={{ background: '#e53e3e', color: '#ffffff', fontSize: '10px', fontWeight: '700', padding: '4px 10px', borderRadius: '10px', textTransform: 'uppercase' }}>
              期間限定キャンペーン
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '12px 0 6px 0', color: '#1a202c' }}>代理店加盟金（初期費用）</h3>
            <div style={{ color: '#a0aec0', textDecoration: 'line-through', fontSize: '14px' }}>通常 1,000,000円 (税別)</div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: '#3182ce', margin: '4px 0 0 0' }}>
              300,000円 <span style={{ fontSize: '13px', fontWeight: 'normal', color: '#4a5568' }}>(税別)</span>
            </div>
          </div>

          {/* 月額費用 */}
          <div style={{ background: '#f7fafc', border: '2px solid #cbd5e0', padding: '30px', borderRadius: '14px', textAlign: 'center' }}>
            <span style={{ background: '#4a5568', color: '#ffffff', fontSize: '10px', fontWeight: '700', padding: '4px 10px', borderRadius: '10px', textTransform: 'uppercase' }}>
              パートナー専用プラン
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '12px 0 6px 0', color: '#1a202c' }}>代理店月額費用</h3>
            <div style={{ color: '#718096', fontSize: '14px', visibility: 'hidden' }}>dummy</div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: '#1a202c', margin: '4px 0 0 0' }}>
              30,000円 <span style={{ fontSize: '13px', fontWeight: 'normal', color: '#4a5568' }}>/月 (税別)</span>
            </div>
            <p style={{ fontSize: '11px', color: '#718096', margin: '6px 0 0 0' }}>※活動意欲を高め、手厚い運営サポートを維持するための費用となります。</p>
          </div>
        </div>

        {/* 特徴・報酬モデルの再確認 */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '30px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c', marginBottom: '10px' }}>📈 超過累進型の魅力的な報酬設計</h3>
          <ul style={{ fontSize: '13px', color: '#4a5568', paddingLeft: '20px', margin: 0, lineHeight: '1.8' }}>
            <li><strong>1〜100件目</strong>：30%還元</li>
            <li><strong>101〜200件目</strong>：36%還元（上乗せ）</li>
            <li><strong>201件目以降</strong>：45%還元（最大上乗せ）</li>
            <li><strong>受取方法</strong>：運営のPayPay銀行からあなたのPayPayへ手数料無料で自動送金！</li>
          </ul>
        </div>

        {/* 規約の表示エリア（別ページに飛ばさずここで完結） */}
        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e0', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '12px' }}>代理店利用規約（必ずお読みください）</h3>
          <div style={{ height: '180px', overflowY: 'auto', fontSize: '12px', color: '#4a5568', background: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', lineHeight: '1.8', marginBottom: '16px' }}>
            <p style={{ margin: '0 0 10px 0' }}><strong>第1条（目的）</strong> 本規約は、当社のCRMツール「Push-taro」の販売促進活動を行う代理店（パートナー）の条件、報酬、および権利義務関係を定めることを目的とします。</p>
            <p style={{ margin: '0 0 10px 0' }}><strong>第2条（契約成立と費用）</strong> パートナー契約は、所定の申し込み後、初期加盟金（30万円）および月額費用（30,000円）の決済が確認された時に成立します。支払われた加盟金は、理由の如何を問わず原則返金されません。</p>
            <p style={{ margin: '0 0 10px 0' }}><strong>第3条（紹介報酬の算定）</strong> アクティブな紹介店舗数に応じた超過累進報酬ロジック（30%〜45%）に基づき報酬を算定し、PayPay等へ送金します。</p>
            <p style={{ margin: '0 0 10px 0' }}><strong>第4条（禁止事項）</strong> 虚偽の説明や誇大広告、その他当社の信用を傷つける行為、不当な勧誘を固く禁じます。</p>
            <p style={{ margin: 0 }}><strong>第5条（契約解除）</strong> 違反行為や月額費用の滞納等が認められた場合、直ちに契約解除およびアカウント停止の措置をとります。</p>
          </div>
          
          {/* 同意チェックボックス */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="agreement"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="agreement" style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748', cursor: 'pointer' }}>
              上記「代理店利用規約」の内容を確認し、同意します。
            </label>
          </div>
        </div>

        {/* 申込ボタン */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleApply}
            disabled={!agreed || loading}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '16px',
              color: '#ffffff',
              border: 'none',
              background: agreed && !loading ? '#3182ce' : '#cbd5e0',
              cursor: agreed && !loading ? 'pointer' : 'not-allowed',
              boxShadow: agreed && !loading ? '0 4px 12px rgba(49, 130, 206, 0.4)' : 'none',
              transition: 'background 0.2s'
            }}
          >
            {loading ? '処理中...' : '加盟金（30万円）＆ 月額手続きへ進む'}
          </button>
        </div>

      </main>

      {/* LP共通フッター */}
      <footer style={{ background: '#1a202c', color: '#a0aec0', padding: '50px 20px', textAlign: 'center', fontSize: '14px', marginTop: '80px' }}>
        <p style={{ margin: '0 0 10px 0', color: '#fff', fontWeight: '700', fontSize: '18px' }}>Push-taro</p>
        <p style={{ margin: '0 0 20px 0' }}>店舗専用プッシュ通知・CRMプラットフォーム</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
          <Link href="/terms" style={{ color: '#cbd5e0', textDecoration: 'none', fontSize: '13px' }}>利用規約</Link>
          <Link href="/privacy" style={{ color: '#cbd5e0', textDecoration: 'none', fontSize: '13px' }}>プライバシーポリシー</Link>
          <Link href="/tokusho" style={{ color: '#cbd5e0', textDecoration: 'none', fontSize: '13px' }}>特定商取引法に基づく表記</Link>
        </div>

        <p style={{ margin: 0, fontSize: '12px', color: '#718096' }}>© 2026 Push-taro All Rights Reserved.</p>
        <div style={{ marginTop: '20px' }}>
          <Link href="/admin" style={{ color: '#cbd5e0', textDecoration: 'none', fontSize: '13px' }}>
            管理者ログイン
          </Link>
        </div>
      </footer>

    </div>
  );
}
