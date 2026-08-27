import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#2d3748', background: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <p style={{ marginBottom: '20px' }}><Link href="/lp" style={{ color: '#3182ce', textDecoration: 'none' }}>← LPに戻る</Link></p>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '24px', color: '#1a202c' }}>プライバシーポリシー</h1>
        
        <p style={{ marginBottom: '16px', fontSize: '14px', color: '#718096' }}>Push-taro（以下、「当サービス」といいます。）は、ユーザーの個人情報について以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。</p>

        <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '24px', marginBottom: '8px' }}>第1条（収集する情報）</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.7', marginBottom: '16px' }}>当サービスは、店舗登録時やプロプランの申し込み時に、氏名、メールアドレス、店舗名、インボイス登録番号、銀行口座情報などの個人情報・事業者情報を取得することがあります。</p>

        <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '24px', marginBottom: '8px' }}>第2条（利用目的）</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.7', marginBottom: '16px' }}>収集した個人情報は、サービスの提供・運営、問い合わせへの対応、料金請求、およびプロプランの紹介報酬の振込手続きの目的にのみ利用します。</p>

        <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '24px', marginBottom: '8px' }}>第3条（安全管理措置）</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.7', marginBottom: '16px' }}>当サービスは、個人情報の漏洩、滅失、き損の防止其の他の個人情報の安全管理のために必要かつ適切な措置を講じます。</p>
      </div>
    </div>
  );
}
