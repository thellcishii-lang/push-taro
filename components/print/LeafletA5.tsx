import type { PartnerPrintData } from '@/lib/print/types';
import QRBlock from './QRBlock';

interface Props { data: PartnerPrintData; }

export default function LeafletA5({ data }: Props) {
  const { companyName, ownerName, phone, email, referralCode, referralUrl, role } = data;
  const roleLabel = role === 'agency' ? '代理店パートナー' : 'affilishopパートナー';

  return (
    <>
      {/* 表 */}
      <section className="a5-page a5-front">
        <div className="a5-front-bg" />
        <div className="a5-front-inner">
          <div className="a5-logo">Push-taro.</div>
          <h1 className="a5-catch">
            既存客のリピートを、<br />仕組みに変える。
          </h1>
          <p className="a5-sub">プッシュ通知 × CRM で実店舗のリピート施策を自動化</p>
          <div className="a5-role">{roleLabel}</div>
        </div>
      </section>

      {/* 裏 */}
      <section className="a5-page a5-back">
        <div className="a5-back-top">
          <h2 className="a5-section-title">Push-taro でできること</h2>
          <ul className="a5-feature-list">
            <li>📢 全デバイス対応プッシュ通知</li>
            <li>🎫 7種類のクーポン自動配信</li>
            <li>📱 QRコードで顧客獲得</li>
            <li>📅 予約配信・定期配信（PRO）</li>
            <li>🤝 紹介報酬で実質無料化（PRO）</li>
          </ul>
        </div>

        <div className="a5-back-bottom">
          <div className="a5-qr-side">
            <QRBlock value={referralUrl} size={110} label="お申し込みはこちら" />
            <div className="a5-code-label">紹介コード</div>
            <div className="a5-code">{referralCode || '—'}</div>
          </div>
          <div className="a5-contact">
            <div className="a5-contact-title">お問い合わせ</div>
            <div className="a5-contact-company">{companyName}</div>
            <div className="a5-contact-owner">{ownerName}</div>
            <div className="a5-contact-line">{phone || '—'}</div>
            <div className="a5-contact-line">{email}</div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .a5-page {
          width: 148mm;
          height: 210mm;
          position: relative;
        }

        /* --- 表 --- */
        .a5-front { background: linear-gradient(160deg, #0f172a, #1e293b); color: #fff; }
        .a5-front-bg {
          position: absolute; inset: 0;
          background: radial-gradient(circle at 80% 20%, rgba(255,69,0,0.4), transparent 55%);
        }
        .a5-front-inner {
          position: relative; z-index: 1;
          padding: 24mm 16mm;
          height: 100%;
          display: flex; flex-direction: column;
          box-sizing: border-box;
        }
        .a5-logo { font-size: 20pt; font-weight: 900; letter-spacing: -0.5px; }
        .a5-logo::after { content: '.'; color: #ff4500; }
        .a5-catch {
          font-size: 24pt;
          font-weight: 900;
          line-height: 1.3;
          letter-spacing: -1.2px;
          margin: 12mm 0 4mm;
        }
        .a5-sub { font-size: 10pt; color: #cbd5e1; line-height: 1.8; margin: 0; }
        .a5-role {
          display: inline-block;
          margin-top: auto;
          align-self: flex-start;
          font-size: 9pt; font-weight: 800;
          padding: 4px 14px;
          background: #ff4500;
          border-radius: 20px;
        }

        /* --- 裏 --- */
        .a5-back {
          background: #fff;
          padding: 14mm 12mm;
          box-sizing: border-box;
          display: flex; flex-direction: column;
          justify-content: space-between;
        }
        .a5-section-title {
          font-size: 14pt;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 6mm;
          padding-bottom: 3mm;
          border-bottom: 2px solid #ff4500;
        }
        .a5-feature-list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 4mm;
          font-size: 10.5pt; color: #334155;
        }
        .a5-back-bottom {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6mm;
          padding-top: 6mm;
          border-top: 1px solid #e2e8f0;
          align-items: start;
        }
        .a5-qr-side { text-align: center; }
        .a5-code-label { font-size: 9pt; color: #64748b; font-weight: 700; margin-top: 3mm; }
        .a5-code {
          font-family: monospace;
          font-size: 14pt;
          font-weight: 900;
          letter-spacing: 2px;
          color: #ff4500;
        }
        .a5-contact { font-size: 9pt; color: #334155; line-height: 1.7; }
        .a5-contact-title { font-weight: 800; color: #ff4500; margin-bottom: 2mm; font-size: 10pt; }
        .a5-contact-company { font-weight: 900; font-size: 11pt; color: #0f172a; }
        .a5-contact-owner { margin-bottom: 2mm; color: #475569; }
        .a5-contact-line { overflow-wrap: anywhere; }
      `}</style>
    </>
  );
}
