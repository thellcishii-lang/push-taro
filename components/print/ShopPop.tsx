import type { ShopPopData } from '@/lib/print/types';
import QRBlock from './QRBlock';

interface Props {
  data: ShopPopData;
  size: 'a4' | 'a5';
}

export default function ShopPop({ data, size }: Props) {
  const { shopName, subscribeUrl, firstCoupon } = data;

  // 初回クーポンが有効なときだけ表示
  const showPerk = firstCoupon?.enabled === true;
  const perkTitle = firstCoupon?.title || '初回限定クーポン';
  const perkDesc = firstCoupon?.description || '';

  return (
    <section className={`p-page shop-pop shop-pop--${size}`}>
      {/* 店舗名 */}
      <h1 className="shop-pop-name">{shopName}</h1>

      {/* メイン */}
      <div className="shop-pop-mid">
        <div className="shop-pop-lead">＼ スマホで読み取るだけ ／</div>
        <h2 className="shop-pop-catch">
          お得な情報を<br />
          <span className="accent">プッシュ通知</span>で<br />
          お届けします
        </h2>

        <div className="shop-pop-qr">
          <QRBlock value={subscribeUrl} size={size === 'a4' ? 285 : 210} />
        </div>
      </div>

      {/* 初回クーポン（有効時のみ） */}
      {showPerk && (
        <div className="shop-pop-perk">
          <span className="shop-pop-perk-badge">初回限定</span>
          <div className="shop-pop-perk-title">🎁 {perkTitle}</div>
          {perkDesc && <div className="shop-pop-perk-desc">{perkDesc}</div>}
        </div>
      )}

      <style jsx global>{`
        .shop-pop {
          background: #fff;
          position: relative;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          font-family: -apple-system, BlinkMacSystemFont, "Noto Sans JP", sans-serif;
          color: #0f172a;
          box-sizing: border-box;
          border: 0.6mm solid #0f172a;
          overflow: hidden;
        }
        .shop-pop--a4 {
          width: 210mm;
          height: 297mm;
          padding: 18mm 16mm;
          page: page-a4v;
        }
        .shop-pop--a5 {
          width: 148mm;
          height: 210mm;
          padding: 12mm 11mm;
          page: page-a5v;
        }

        /* 店舗名 */
        .shop-pop-name {
          font-weight: 900;
          letter-spacing: -0.02em;
          line-height: 1.25;
          text-align: center;
          padding-bottom: 6mm;
          border-bottom: 0.4mm solid #e2e8f0;
          margin: 0;
          flex-shrink: 0;
        }
        .shop-pop--a4 .shop-pop-name { font-size: 26pt; }
        .shop-pop--a5 .shop-pop-name { font-size: 18pt; }

        /* メイン */
        .shop-pop-mid {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 6mm 0;
        }
        .shop-pop--a5 .shop-pop-mid { padding: 4mm 0; }

        .shop-pop-lead {
          display: inline-block;
          background: #0f172a;
          color: #fff;
          font-weight: 900;
          border-radius: 20mm;
          padding: 1.8mm 6mm;
          margin-bottom: 6mm;
          letter-spacing: 0.05em;
        }
        .shop-pop--a4 .shop-pop-lead { font-size: 12pt; }
        .shop-pop--a5 .shop-pop-lead { font-size: 9pt; padding: 1.4mm 5mm; }

        .shop-pop-catch {
          font-weight: 900;
          line-height: 1.3;
          letter-spacing: -0.03em;
          margin: 0 0 8mm;
        }
        .shop-pop--a4 .shop-pop-catch { font-size: 30pt; }
        .shop-pop--a5 .shop-pop-catch { font-size: 22pt; margin-bottom: 6mm; }
        .shop-pop-catch .accent { color: #ff4500; }

        .shop-pop-qr {
          padding: 5mm;
          background: #fff;
          border: 0.5mm solid #e2e8f0;
          border-radius: 3mm;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 0;
        }
        .shop-pop--a5 .shop-pop-qr { padding: 4mm; }

        /* 初回クーポン */
        .shop-pop-perk {
          margin-top: 6mm;
          padding: 5mm 6mm;
          background: #fff7ed;
          border: 0.6mm dashed #ff4500;
          border-radius: 3mm;
          text-align: center;
          flex-shrink: 0;
        }
        .shop-pop--a5 .shop-pop-perk {
          margin-top: 4mm;
          padding: 4mm 5mm;
        }

        .shop-pop-perk-badge {
          display: inline-block;
          background: #ff4500;
          color: #fff;
          font-weight: 900;
          border-radius: 2mm;
          padding: 1mm 3.5mm;
          margin-bottom: 2.5mm;
          letter-spacing: 0.08em;
        }
        .shop-pop--a4 .shop-pop-perk-badge { font-size: 10pt; }
        .shop-pop--a5 .shop-pop-perk-badge { font-size: 8pt; padding: 0.8mm 3mm; }

        .shop-pop-perk-title {
          color: #c2410c;
          font-weight: 900;
          line-height: 1.3;
        }
        .shop-pop--a4 .shop-pop-perk-title { font-size: 20pt; }
        .shop-pop--a5 .shop-pop-perk-title { font-size: 14pt; }

        .shop-pop-perk-desc {
          color: #7c2d12;
          margin-top: 2mm;
          font-weight: 700;
          line-height: 1.5;
        }
        .shop-pop--a4 .shop-pop-perk-desc { font-size: 10pt; }
        .shop-pop--a5 .shop-pop-perk-desc { font-size: 8pt; margin-top: 1.5mm; }

        @media print {
          .shop-pop { box-shadow: none; }
        }
      `}</style>
    </section>
  );
}
