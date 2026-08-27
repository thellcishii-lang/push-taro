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
    // Squareの加盟金決済URL（30万円）へリダイレクト
    window.location.href = 'https://square.link/u/your-agency-payment-link';
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', color: '#2d3748', background: '#f8fafc', minHeight: '100vh', margin: 0, padding: '40px 20px', lineHeight: 1.7 }}>
      
      {/* 戻るリンク */}
      <div style={{ maxWidth: '800px', margin: '0 auto 20px auto' }}>
        <Link href="/" style={{ color: '#3182ce', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
          ← トップページに戻る
        </Link>
      </div>

      <main style={{ maxWidth: '800px', margin: '0 auto', background: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        
        {/* ヘッダー */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ background: '#ebf8ff', color: '#3182ce', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Official Partner Program
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '16px 0 10px 0', color: '#1a202c' }}>
            公式パートナー・代理店募集
          </h1>
          <p style={{ color: '#718096', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
            導入実績を伸ばす強力なインセンティブ（超過累進報酬）と、スムーズな運用体制をご用意しています。
          </p>
        </div>

        {/* 特徴・仕組みグリッド */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{ background: '#f7fafc', p: '24px', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#3182ce', marginBottom: '8px' }}>📈 超過累進報酬</h3>
            <p style={{ fontSize: '13px', color: '#718096', lineHeight: '1.6' }}>
              1〜100件は30%、101〜200件は36%、201件以降は45%還元！実績に応じて単価がアップします。
            </p>
          </div>
          <div style={{ background: '#f7fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#3182ce', marginBottom: '8px' }}>⚡ 手数料無料の受取り</h3>
            <p style={{ fontSize: '13px', color: '#718096', lineHeight: '1.6' }}>
              運営側のPayPay銀行からあなたのPayPayへ直接送金。面倒な振込手数料やタイムラグがありません。
            </p>
          </div>
          <div style={{ background: '#f7fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#3182ce', marginBottom: '8px' }}>💻 完全自動化管理</h3>
            <p style={{ fontSize: '13px', color: '#718096', lineHeight: '1.6' }}>
              紹介店舗の管理や月別の報酬明細・CSVダウンロードも専用管理画面からいつでも確認可能です。
            </p>
          </div>
        </div>

        {/* 加盟金のご案内 */}
        <div style={{ background: 'linear-gradient(135deg, #ebf8ff 0%, #eef2ff 100%)', border: '2px solid #bee3f8', padding: '36px', borderRadius: '16px', marginBottom: '40px', textAlign: 'center' }}>
          <span style={{ background: '#e53e3e', color: '#ffffff', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '12px', textTransform: 'uppercase' }}>
            期間限定キャンペーン
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '14px 0 8px 0', color: '#1a202c' }}>代理店加盟金</h2>
          <div style={{ color: '#a0aec0', textDecoration: 'line-through', fontSize: '16px', marginBottom: '4px' }}>通常 1,000,000円 (税別)</div>
          <div style={{ fontSize: '38px', fontWeight: '900', color: '#3182ce', margin: '4px 0 12px 0' }}>
            今だけ 300,000円 <span style={{ fontSize: '15px', fontWeight: 'normal', color: '#4a5568' }}>(税別)</span>
          </div>
          <p style={{ fontSize: '12px', color: '#718096', margin: 0 }}>
            ※システム利用権および初期サポート費用を含みます。中途解約時の原則返金はいたしかねます。
          </p>
        </div>

        {/* 規約の表示エリア */}
        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e0', borderRadius: '12px', padding: '24px', marginBottom: '30px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '12px' }}>代理店利用規約（重要事項抜粋）</h3>
          <div style={{ height: '160px', overflowY: 'auto', fontSize: '12px', color: '#4a5568', background: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', lineHeight: '1.8', marginBottom: '16px' }}>
            <p style={{ margin: '0 0 10px 0' }}><strong>第1条（目的）</strong> 本規約は、当社のサービスの販売促進活動を行う代理店の条件を定めます。</p>
            <p style={{ margin: '0 0 10px 0' }}><strong>第2条（加盟金）</strong> 支払われた加盟金はシステムの利用権等の対価であり、理由の如何を問わず原則返金されません。</p>
            <p style={{ margin: '0 0 10px 0' }}><strong>第3条（報酬算定）</strong> 有効なアクティブ店舗数に応じた超過累進報酬ロジックに基づき報酬を算定し、PayPay等へ送金します。</p>
            <p style={{ margin: '0 0 10px 0' }}><strong>第4条（禁止事項）</strong> 虚偽の説明や誇大広告、その他当社の信用を傷つける行為を固く禁じます。</p>
            <p style={{ margin: 0 }}><strong>第5条（解除）</strong> 違反行為が認められた場合、直ちに契約解除およびアカウント停止の措置をとります。</p>
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
            {loading ? '処理中...' : '加盟金（30万円）を決済して代理店に申し込む'}
          </button>
        </div>

      </main>
    </div>
  );
}
