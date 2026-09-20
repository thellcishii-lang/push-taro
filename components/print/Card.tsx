import type { PartnerPrintData } from '@/lib/print/types';
import QRBlock from './QRBlock';

interface Props { data: PartnerPrintData; }

export default function Card({ data }: Props) {
  const { companyName, referralCode, referralUrl } = data;

  return (
    <>
      {/* 表：紹介カード */}
      <section className="cd-page cd-front">
        <div className="cd-front-inner">
          <div className="cd-logo">Push-taro.</div>
          <div className="cd-catch">リピート施策を、仕組みに。</div>
          <div className="cd-company">{companyName}</div>
        </div>
      </section>

      {/* 裏：QR + コード */}
      <section className="cd-page cd-back">
        <div className="cd-back-inner">
          <QRBlock value={referralUrl} size={70} />
          <div className="cd-code-label">紹介コード</div>
          <div className="cd-code">{referralCode || '—'}</div>
          <div className="cd-note">こちらのQRからお申し込みください</div>
        </div>
      </section>

      <style jsx global>{`
        .cd-page { width: 91mm; height: 55mm; position: relative; }

        .cd-front { background: linear-gradient(135deg, #0f172a, #1e293b); color: #fff; }
        .cd-front-inner {
          padding: 8mm 8mm;
          height: 100%; box-sizing: border-box;
          display: flex; flex-direction: column;
        }
        .cd-logo { font-size: 13pt; font-weight: 900; letter-spacing: -0.3px; margin-bottom: auto; }
        .cd-logo::after { content: '.'; color: #ff4500; }
        .cd-catch { font-size: 12pt; font-weight: 900; line-height: 1.3; margin-bottom: 2mm; }
        .cd-company { font-size: 8pt; color: #94a3b8; }

        .cd-back { background: #fff; }
        .cd-back-inner {
          padding: 5mm;
          height: 100%; box-sizing: border-box;
          display: grid;
          grid-template-columns: 30mm 1fr;
          gap: 4mm;
          align-items: center;
        }
        .cd-code-label { font-size: 7pt; color: #64748b; font-weight: 700; }
        .cd-code {
          font-family: monospace; font-size: 12pt; font-weight: 900;
          letter-spacing: 1.5px; color: #ff4500;
        }
        .cd-note { font-size: 7pt; color: #94a3b8; margin-top: 1mm; line-height: 1.5; }
      `}</style>
    </>
  );
}
