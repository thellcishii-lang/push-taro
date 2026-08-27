'Link'
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#2d3748', background: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <p style={{ marginBottom: '20px' }}><Link href="/lp" style={{ color: '#3182ce', textDecoration: 'none' }}>← LPに戻る</Link></p>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '24px', color: '#1a202c' }}>利用規約</h1>
        
        <p style={{ marginBottom: '16px', fontSize: '14px', color: '#718096' }}>この利用規約（以下、「本規約」といいます。）は、Push-taro（以下、「当サービス」といいます。）が提供する店舗向けプッシュ通知・CRMプラットフォームの利用条件を定めるものです。ご利用者様（以下、「ユーザー」といいます。）には、本規約に従って当サービスをご利用いただきます。</p>

        <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '24px', marginBottom: '8px' }}>第1条（適用）</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.7', marginBottom: '16px' }}>本規約は、ユーザーと当サービス運営者との間の当サービスの利用に関わる一切の関係に適用されるものとします。</p>

        <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '24px', marginBottom: '8px' }}>第2条（利用料金と支払い方法）</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.7', marginBottom: '16px' }}>ユーザーは、当サービスの有料プラン（ライト、スタンダード、プロ）の対価として、別途定め、本サイトに表示する利用料金を、所定の決済方法（Square等）により支払うものとします。</p>

        <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '24px', marginBottom: '8px' }}>第3条（禁止事項）</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.7', marginBottom: '16px' }}>ユーザーは、当サービスの利用にあたり、法令や公序良俗に違反する行為、または運営を妨害するおそれのある行為を行ってはならないものとします。</p>

        <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '24px', marginBottom: '8px' }}>第4条（規約の変更）</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.7', marginBottom: '16px' }}>運営者は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。</p>
      </div>
    </div>
  );
}
