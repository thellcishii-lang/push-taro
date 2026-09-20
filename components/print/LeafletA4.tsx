import type { PartnerPrintData } from '@/lib/print/types';
import QRBlock from './QRBlock';

interface Props { data: PartnerPrintData; }

export default function LeafletA4({ data }: Props) {
  const { companyName, ownerName, phone, email, referralCode, referralUrl, role } = data;
  const roleLabel = role === 'agency' ? '代理店パートナー' : 'affilishopパートナー';

  return (
    <>
      {/* 表 */}
      <section className="a4p-page a4p-front">
        <div className="a4p-front-bg" />
        <div className="a4p-front-inner">
          <div className="a4p-logo">Push-taro.</div>
          <h1 className="a4p-catch">
            既存客のリピートを、<br />
            仕組みに変える。
          </h1>
          <p className="a4p-sub">
            プッシュ通知 × CRM で、実店舗のリピート施策に必要なすべてを1つに。
          </p>
          <div className="a4p-badges">
            <span>配信無制限</span>
            <span>7種クーポン</span>
            <span>QR消込</span>
            <span>予約配信</span>
          </div>
          <div className="a4p-role">{roleLabel}</div>
        </div>
      </section>

      {/* 裏 */}
      <section className="a4p-page a4p-back">
        <div className="a4p-back-inner">
          <h2 className="a4p-section-title">主な機能</h2>
          <div className="a4p-feature-grid">
            {[
              { n: '01', t: 'プッシュ通知', d: 'iPhone・Android・PCへ一斉配信。開封率はメルマガの約6倍。' },
              { n: '02', t: '7種クーポン', d: '初回・通常・特別達成・ステップアップ・連続・誕生日・休眠復活。' },
              { n: '03', t: 'QRコード獲得', d: '店頭POPに置くだけ。アプリ不要で顧客リストを自動構築。' },
              { n: '04', t: '予約配信', d: '毎週金曜18時、毎月1日など任意のスケジュールで自動配信。（PRO）' },
              { n: '05', t: '休眠復活', d: '最終来店からN日経過した顧客に、自動で復帰クーポンを配信。（PRO）' },
              { n: '06', t: '紹介報酬', d: '他店舗を紹介すると毎月10%還元。10店舗でPROが実質無料。（PRO）' },
            ].map((f) => (
              <div key={f.n} className="a4p-feature">
                <div className="a4p-feature-num">{f.n}</div>
                <div className="a4p-feature-t">{f.t}</div>
                <div className="a4p-feature-d">{f.d}</div>
              </div>
            ))}
          </div>

          <div className="a4p-bottom">
            <div className="a4p-bottom-left">
              <QRBlock value={referralUrl} size={120} label="お申し込みはこちら" />
              <div className="a4p-code-label">紹介コード</div>
              <div className="a4p-code">{referralCode || '—'}</div>
            </div>
            <div className="a4p-bottom-right">
              <div className="a4p-contact-title">お問い合わせ</div>
              <div className="a4p-contact-company">{companyName}</div>
              <div className="a4p-contact-line">担当：{ownerName} 様</div>
              <div className="a4p-contact-line">TEL：{phone || '—'}</div>
              <div className="a4p-contact-line">MAIL：{email}</div>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .a4p-page { width: 210mm; height: 297mm; position: relative; }

        /* 表 */
        .a4p-front { background: linear-gradient(160deg, #0f172a, #1e293b); color: #fff; }
        .a4p-front-bg {
          position: absolute; inset: 0;
          background: radial-gradient(circle at 75% 25%, rgba(255,69,0,0.4), transparent 55%);
        }
        .a4p-front-inner {
          position: relative; z-index: 1;
          padding: 50mm 30mm 30mm;
          height: 100%; box-sizing: border-box;
          display: flex; flex-direction: column;
        }
        .a4p-logo { font-size: 28pt; font-weight: 900; letter-spacing: -0.6px; margin-bottom: 20mm; }
        .a4p-logo::after { content: '.'; color: #ff4500; }
        .a4p-catch {
          font-size: 38pt;
          font-weight: 900;
          line-height: 1.25;
          letter-spacing: -1.5px;
          margin: 0 0 10mm;
        }
        .a4p-sub { font-size: 13pt; color: #cbd5e1; line-height: 1.9; margin: 0 0 12mm; }
        .a4p-badges { display: flex; gap: 4mm; flex-wrap: wrap; }
        .a4p-badges span {
          font-size: 10pt; font-weight: 800;
          padding: 4px 14px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px;
        }
        .a4p-role {
          display: inline-block;
          margin-top: auto; align-self: flex-start;
          font-size: 11pt; font-weight: 800;
          padding: 6px 18px;
          background: #ff4500;
          border-radius: 20px;
        }

        /* 裏 */
        .a4p-back { background: #fff; }
        .a4p-back-inner {
          padding: 20mm 24mm;
          height: 100%; box-sizing: border-box;
          display: flex; flex-direction: column;
        }
        .a4p-section-title {
          font-size: 16pt; font-weight: 900; color: #0f172a;
          margin: 0 0 8mm;
          padding-bottom: 4mm;
          border-bottom: 3px solid #ff4500;
        }
        .a4p-feature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6mm 8mm;
          margin-bottom: 12mm;
        }
        .a4p-feature {
          padding: 4mm 5mm;
          background: #f8fafc;
          border-radius: 8px;
          border-left: 3px solid #ff4500;
        }
        .a4p-feature-num {
          font-size: 16pt; font-weight: 900;
          color: #ff4500; opacity: 0.5;
          line-height: 1; margin-bottom: 2mm;
        }
        .a4p-feature-t { font-size: 11pt; font-weight: 900; color: #0f172a; margin-bottom: 1.5mm; }
        .a4p-feature-d { font-size: 9pt; color: #475569; line-height: 1.7; }

        .a4p-bottom {
          margin-top: auto;
          padding-top: 8mm;
          border-top: 1px solid #e2e8f0;
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 10mm;
          align-items: center;
        }
        .a4p-bottom-left { text-align: center; }
        .a4p-code-label { font-size: 9pt; color: #64748b; font-weight: 700; margin-top: 3mm; }
        .a4p-code {
          font-family: monospace; font-size: 16pt; font-weight: 900;
          letter-spacing: 3px; color: #ff4500;
        }
        .a4p-bottom-right { font-size: 10pt; color: #334155; line-height: 1.8; }
        .a4p-contact-title { font-weight: 800; color: #ff4500; margin-bottom: 2mm; font-size: 11pt; }
        .a4p-contact-company { font-weight: 900; font-size: 13pt; color: #0f172a; margin-bottom: 1mm; }
        .a4p-contact-line { overflow-wrap: anywhere; }
      `}</style>
    </>
  );
}
