import type { PartnerPrintData } from '@/lib/print/types';
import QRBlock from './QRBlock';

interface Props { data: PartnerPrintData; }

export default function Card({ data }: Props) {
  const { companyName, referralCode, referralUrl, role } = data;
  const roleLabel = role === 'agency' ? 'AUTHORIZED AGENCY' : 'AFFILISHOP PARTNER';

  return (
    <>
      {/* ========== 表 ========== */}
      <section className="p-page cd-page cd-front">
        <div className="cd-glow" />

        <div className="cd-front-top">
          <div className="cd-logo-row">
            <svg className="cd-logo-mark" viewBox="0 0 48 48" fill="none">
              <defs>
                <linearGradient id="cdLogoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ff6b6b" />
                  <stop offset="100%" stopColor="#ff4500" />
                </linearGradient>
              </defs>
              <circle cx="24" cy="24" r="23" fill="url(#cdLogoGrad)" />
              <path d="M24 8 L33 22 L28 22 L28 30 L20 30 L20 22 L15 22 Z" fill="#ffffff" />
              <circle cx="24" cy="20" r="3" fill="#ff4500" opacity="0.5" />
              <path d="M18 30 L14 38 L20 34 Z" fill="#ffffff" />
              <path d="M30 30 L34 38 L28 34 Z" fill="#ffffff" />
              <path d="M22 30 L24 40 L26 30 Z" fill="#fbbf24" />
            </svg>
            <div className="cd-logo">Push-taro<span>.</span></div>
          </div>
          <div className="cd-badge">先行登録受付中</div>
        </div>

        <div className="cd-front-mid">
          <h1 className="cd-catch">
            お客様に喜んで頂ける<br />
            <span className="accent">お店づくりのお手伝い。</span>
          </h1>
          <div className="cd-sub">実店舗のためのPush通知CRM</div>
        </div>

        <div className="cd-front-foot">
          <span className="cd-role">{roleLabel}</span>
          <span className="cd-year">2026</span>
        </div>
      </section>

      {/* ========== 裏 ========== */}
      <section className="p-page cd-page cd-back">
        <div className="cd-back-left">
          <div className="cd-offer-badge">SPECIAL OFFER</div>
          <div className="cd-offer-title">
            このコードで<br />
            <span className="accent">限定特典</span>を<br />
            受け取れます
          </div>
          <div className="cd-offer-code">{referralCode || '—'}</div>
          <div className="cd-offer-note">QRを読み取って、今すぐお申し込み</div>
        </div>
        <div className="cd-back-right">
          <div className="cd-qr">
            <QRBlock value={referralUrl} size={70} />
          </div>
        </div>
        <div className="cd-back-company">{companyName}</div>
      </section>

      <style jsx global>{`
        /* ========== カード共通 ========== */
        .cd-page {
          width: 91mm;
          height: 55mm;
          position: relative;
          overflow: hidden;
        }

        /* ========== 表 ========== */
        .cd-front {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #fff;
          padding: 6mm 7mm;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        .cd-glow {
          position: absolute; inset: 0;
          background: radial-gradient(circle at 88% 12%, rgba(255,69,0,0.5), transparent 55%);
          pointer-events: none;
        }
        .cd-front > * { position: relative; z-index: 1; }

        .cd-front-top {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: auto;
        }
        .cd-logo-row {
          display: flex; align-items: center; gap: 1.8mm;
        }
        .cd-logo-mark { width: 7mm; height: 7mm; flex-shrink: 0; }
        .cd-logo {
          font-size: 12pt; font-weight: 900;
          letter-spacing: -0.3px; line-height: 1;
        }
        .cd-logo span { color: #ff4500; }

        .cd-badge {
          font-size: 5pt; font-weight: 900; letter-spacing: 0.8px;
          padding: 0.6mm 2mm; border-radius: 6px;
          background: rgba(255,69,0,0.25);
          border: 1px solid rgba(255,69,0,0.5);
          color: #fd7e5a;
        }

        .cd-front-mid {
          margin-bottom: auto;
        }
        .cd-catch {
          font-size: 13pt; font-weight: 900;
          line-height: 1.35; letter-spacing: -0.5px;
          margin: 0 0 1.5mm;
        }
        .cd-catch .accent { color: #fd7e5a; }
        .cd-sub {
          font-size: 6.5pt;
          color: #94a3b8;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        .cd-front-foot {
          display: flex; justify-content: space-between; align-items: baseline;
          padding-top: 2mm;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .cd-role {
          font-size: 5.5pt; font-weight: 900; letter-spacing: 1.5px;
          color: #fd7e5a;
        }
        .cd-year {
          font-size: 5.5pt; color: #64748b; font-weight: 700;
        }

        /* ========== 裏 ========== */
        .cd-back {
          background: #fff;
          border: 1px solid #e2e8f0;
          padding: 4mm 5mm;
          display: grid;
          grid-template-columns: 1fr 22mm;
          gap: 3mm;
          align-items: center;
          box-sizing: border-box;
        }
        .cd-back-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .cd-offer-badge {
          display: inline-block;
          font-size: 5pt; font-weight: 900; letter-spacing: 1px;
          padding: 0.6mm 2mm; border-radius: 6px;
          background: linear-gradient(135deg, #ff4500, #f97316);
          color: #fff;
          margin-bottom: 1.5mm;
          align-self: flex-start;
        }
        .cd-offer-title {
          font-size: 7.5pt; font-weight: 900;
          color: #0f172a;
          line-height: 1.35;
          margin-bottom: 1.8mm;
        }
        .cd-offer-title .accent { color: #ff4500; }
        .cd-offer-code {
          font-family: 'Courier New', monospace;
          font-size: 11pt; font-weight: 900;
          letter-spacing: 1.8px;
          color: #0f172a;
          background: #fff7ed;
          border: 1.5px dashed #ff4500;
          border-radius: 4px;
          padding: 1.5mm 2mm;
          text-align: center;
          margin-bottom: 1.5mm;
        }
        .cd-offer-note {
          font-size: 5pt; font-weight: 700;
          color: #64748b;
          line-height: 1.35;
        }
        .cd-back-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .cd-qr {
          display: inline-block;
          padding: 3px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
        }
        .cd-back-company {
          position: absolute;
          bottom: 2mm;
          left: 5mm;
          right: 5mm;
          font-size: 5.5pt;
          color: #94a3b8;
          font-weight: 700;
          text-align: center;
          padding-top: 1.5mm;
          border-top: 1px solid #e2e8f0;
        }
      `}</style>
    </>
  );
}
