import type { PartnerPrintData } from '@/lib/print/types';
import QRBlock from './QRBlock';

interface Props { data: PartnerPrintData; }

export default function BusinessCard({ data }: Props) {
  const {
    companyName,
    ownerName,
    referralCode,
    referralUrl,
    role,
  } = data;

  const roleLabel = role === 'agency' ? 'AUTHORIZED AGENCY' : 'AFFILISHOP PARTNER';

  return (
    <>
      {/* ========== 表（カードと同じデザイン） ========== */}
      <section className="p-page bc-page bc-front">
        <div className="bc-glow" />

        <div className="bc-front-top">
          <div className="bc-logo-row">
            <svg className="bc-logo-mark" viewBox="0 0 48 48" fill="none">
              <defs>
                <linearGradient id="bcLogoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ff6b6b" />
                  <stop offset="100%" stopColor="#ff4500" />
                </linearGradient>
              </defs>
              <circle cx="24" cy="24" r="23" fill="url(#bcLogoGrad)" />
              <path d="M24 8 L33 22 L28 22 L28 30 L20 30 L20 22 L15 22 Z" fill="#ffffff" />
              <circle cx="24" cy="20" r="3" fill="#ff4500" opacity="0.5" />
              <path d="M18 30 L14 38 L20 34 Z" fill="#ffffff" />
              <path d="M30 30 L34 38 L28 34 Z" fill="#ffffff" />
              <path d="M22 30 L24 40 L26 30 Z" fill="#fbbf24" />
            </svg>
            <div className="bc-logo">Push-taro<span>.</span></div>
          </div>
          <div className="bc-badge">先行登録受付中</div>
        </div>

        <div className="bc-front-mid">
          <h1 className="bc-catch">
            お客様に喜んで頂ける<br />
            <span className="accent">お店づくりのお手伝い。</span>
          </h1>
          <div className="bc-sub">実店舗のためのPush通知CRM</div>
        </div>

        <div className="bc-front-foot">
          <span className="bc-role">{roleLabel}</span>
          <span className="bc-year">2026</span>
        </div>
      </section>

      {/* ========== 裏（カード裏 + 会社名・担当者名） ========== */}
      <section className="p-page bc-page bc-back">
        {/* 上段：OFFER + QR */}
        <div className="bc-back-top">
          <div>
            <div className="bc-offer-badge">SPECIAL OFFER</div>
            <div className="bc-offer-title">
              このコードで<span className="accent">限定特典</span>を<br />
              受け取れます
            </div>
            <div className="bc-offer-code">{referralCode || '—'}</div>
          </div>
          <div className="bc-back-right">
            <div className="bc-qr">
              <QRBlock value={referralUrl} size={60} />
            </div>
          </div>
        </div>

        {/* 下段：会社名 + 担当者名 */}
        <div className="bc-back-bottom">
          <div className="bc-company">{companyName}</div>
          <div className="bc-owner-row">
            <span className="bc-owner">{ownerName}</span>
            <span className="bc-role-inline">{roleLabel}</span>
          </div>
        </div>
      </section>

      <style jsx global>{`
        /* ========== 名刺共通 ========== */
        .bc-page {
          width: 91mm;
          height: 55mm;
          position: relative;
          overflow: hidden;
        }

        /* ========== 表（カードと同じデザイン） ========== */
        .bc-front {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #fff;
          padding: 6mm 7mm;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        .bc-glow {
          position: absolute; inset: 0;
          background: radial-gradient(circle at 88% 12%, rgba(255,69,0,0.5), transparent 55%);
          pointer-events: none;
        }
        .bc-front > * { position: relative; z-index: 1; }

        .bc-front-top {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: auto;
        }
        .bc-logo-row {
          display: flex; align-items: center; gap: 1.8mm;
        }
        .bc-logo-mark { width: 7mm; height: 7mm; flex-shrink: 0; }
        .bc-logo {
          font-size: 12pt; font-weight: 900;
          letter-spacing: -0.3px; line-height: 1;
        }
        .bc-logo span { color: #ff4500; }

        .bc-badge {
          font-size: 5pt; font-weight: 900; letter-spacing: 0.8px;
          padding: 0.6mm 2mm; border-radius: 6px;
          background: rgba(255,69,0,0.25);
          border: 1px solid rgba(255,69,0,0.5);
          color: #fd7e5a;
        }

        .bc-front-mid { margin-bottom: auto; }
        .bc-catch {
          font-size: 13pt; font-weight: 900;
          line-height: 1.35; letter-spacing: -0.5px;
          margin: 0 0 1.5mm;
        }
        .bc-catch .accent { color: #fd7e5a; }
        .bc-sub {
          font-size: 6.5pt;
          color: #94a3b8;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        .bc-front-foot {
          display: flex; justify-content: space-between; align-items: baseline;
          padding-top: 2mm;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .bc-role {
          font-size: 5.5pt; font-weight: 900; letter-spacing: 1.5px;
          color: #fd7e5a;
        }
        .bc-year {
          font-size: 5.5pt; color: #64748b; font-weight: 700;
        }

        /* ========== 裏 ========== */
        .bc-back {
          background: #fff;
          border: 1px solid #e2e8f0;
          padding: 4mm 5mm 3.5mm;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        /* 上段：OFFER + QR */
        .bc-back-top {
          display: grid;
          grid-template-columns: 1fr 20mm;
          gap: 3mm;
          align-items: center;
          padding-bottom: 2.5mm;
          margin-bottom: 2.5mm;
          border-bottom: 1px solid #e2e8f0;
        }
        .bc-offer-badge {
          display: inline-block;
          font-size: 4.5pt; font-weight: 900; letter-spacing: 1px;
          padding: 0.5mm 1.8mm; border-radius: 6px;
          background: linear-gradient(135deg, #ff4500, #f97316);
          color: #fff;
          margin-bottom: 1.2mm;
        }
        .bc-offer-title {
          font-size: 6.5pt; font-weight: 900;
          color: #0f172a;
          line-height: 1.3;
          margin-bottom: 1.5mm;
        }
        .bc-offer-title .accent { color: #ff4500; }
        .bc-offer-code {
          font-family: 'Courier New', monospace;
          font-size: 9pt; font-weight: 900;
          letter-spacing: 1.5px;
          color: #0f172a;
          background: #fff7ed;
          border: 1.5px dashed #ff4500;
          border-radius: 4px;
          padding: 1.2mm 1.5mm;
          text-align: center;
        }
        .bc-back-right {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .bc-qr {
          display: inline-block;
          padding: 3px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
        }

        /* 下段：会社名 + 担当者名 */
        .bc-back-bottom {
          display: flex;
          flex-direction: column;
          gap: 0.5mm;
        }
        .bc-company {
          font-size: 7pt;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.3;
        }
        .bc-owner-row {
          display: flex;
          align-items: baseline;
          gap: 2mm;
        }
        .bc-owner {
          font-size: 11pt;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: 1.5px;
          line-height: 1.1;
        }
        .bc-role-inline {
          font-size: 5pt;
          font-weight: 900;
          color: #ff4500;
          letter-spacing: 1.2px;
        }
      `}</style>
    </>
  );
}
