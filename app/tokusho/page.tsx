import Link from 'next/link';

export default function TokushoPage() {
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#2d3748', background: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <p style={{ marginBottom: '20px' }}><Link href="/lp" style={{ color: '#3182ce', textDecoration: 'none' }}>← LPに戻る</Link></p>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '24px', color: '#1a202c' }}>特定商取引法に基づく表記</h1>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ textAlign: 'left', padding: '16px', width: '30%', color: '#4a5568', background: '#f7fafc' }}>販売業者 / 運営統括責任者</th>
              <td style={{ padding: '16px', color: '#2d3748' }}>[運営者名または会社名を記載]</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ textAlign: 'left', padding: '16px', color: '#4a5568', background: '#f7fafc' }}>所在地</th>
              <td style={{ padding: '16px', color: '#2d3748' }}>[店舗・事務所の住所を記載]</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ textAlign: 'left', padding: '16px', color: '#4a5568', background: '#f7fafc' }}>連絡先</th>
              <td style={{ padding: '16px', color: '#2d3748' }}>メールアドレス: support@pushtaro.com<br />（電話番号は請求があった場合に遅滞なく開示いたします）</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ textAlign: 'left', padding: '16px', color: '#4a5568', background: '#f7fafc' }}>適格請求書発行事業者登録番号</th>
              <td style={{ padding: '16px', color: '#dd6b20', fontWeight: '700' }}>T1234567890123（※プロプラン等のインボイス対応用）</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ textAlign: 'left', padding: '16px', color: '#4a5568', background: '#f7fafc' }}>販売価格</th>
              <td style={{ padding: '16px', color: '#2d3748' }}>各プランページに記載（表示価格は税込）</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ textAlign: 'left', padding: '16px', color: '#4a5568', background: '#f7fafc' }}>代金の支払方法・時期</th>
              <td style={{ padding: '16px', color: '#2d3748' }}>クレジットカード決済（Square等）。契約時に即時決済され、毎月自動更新されます。</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ textAlign: 'left', padding: '16px', color: '#4a5568', background: '#f7fafc' }}>サービス提供時期</th>
              <td style={{ padding: '16px', color: '#2d3748' }}>決済完了後、直ちにご利用いただけます。</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', padding: '16px', color: '#4a5568', background: '#f7fafc' }}>解約・返金について</th>
              <td style={{ padding: '16px', color: '#2d3748' }}>管理画面よりいつでも解約手続きが行えます（日割り分での返金は承っておりません）。</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
