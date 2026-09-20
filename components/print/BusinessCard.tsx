import type { PartnerPrintData } from '@/lib/print/types';
import QRBlock from './QRBlock';

interface Props { data: PartnerPrintData; }

export default function BusinessCard({ data }: Props) {
  const { companyName, ownerName, email, phone, website, referralUrl, role } = data;
  const roleLabel = role === 'agency' ? '代理店パートナー' : 'affilishopパートナー';

  return (
    <>
      {/* 表 */}
      <section className="bc-page bc-front">
        <div className="bc-front-inner">
          <div className="bc-company">{companyName}</div>
          <div className="bc-owner">{ownerName}</div>
          <div className="bc-role">{roleLabel}</div>
          <div className="bc-logo">Push-taro.</div>
        </div>
      </section>

      {/* 裏 */}
      <section className="bc-page bc-back">
        <div className="bc-back-inner">
          <div className="bc-info">
            <div className="bc-info-line">TEL　{phone || '—'}</div>
            <div className="bc-info-line">MAIL　{email}</div>
            {website && <div className="bc-info-line">WEB　{website}</div>}
          </div>
          <div className="bc-qr">
            <QRBlock value={referralUrl} size={60} />
          </div>
        </div>
      </section>

      <style jsx global>{`
        .bc-page { width: 91mm; height: 55mm; position: relative; }

        .bc-front { background: #fff; border: 1px solid #e2e8f0; }
        .bc-front-inner {
          padding: 7mm 8mm;
          height: 100%; box-sizing: border-box;
          display: flex; flex-direction: column;
          border-left: 3mm solid #ff4500;
        }
        .bc-company { font-size: 10pt; font-weight: 900; color: #0f172a; margin-bottom: 3mm; }
        .bc-owner { font-size: 14pt; font-weight: 900; color: #0f172a; letter-spacing: 1px; }
        .bc-role { font-size: 8pt; color: #ff4500; font-weight: 800; margin-top: 1mm; }
        .bc-logo { font-size: 11pt; font-weight: 900; color: #0f172a; margin-top: auto; }
        .bc-logo::after { content: '.'; color: #ff4500; }

        .bc-back { background: #f8fafc; }
        .bc-back-inner {
          padding: 6mm 7mm;
          height: 100%; box-sizing: border-box;
          display: grid;
          grid-template-columns: 1fr 22mm;
          gap: 4mm;
          align-items: center;
        }
        .bc-info { font-size: 8pt; color: #334155; line-height: 1.9; }
        .bc-info-line { overflow-wrap: anywhere; }
        .bc-qr { text-align: right; }
      `}</style>
    </>
  );
}
