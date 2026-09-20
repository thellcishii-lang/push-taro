import type { PartnerPrintData } from '@/lib/print/types';
import QRBlock from './QRBlock';

interface Props { data: PartnerPrintData; }

/**
 * 三つ折りパンフレット
 * A4ヨコ (297×210mm) を3等分 (99×210mm)
 * ページ1 = 外側、ページ2 = 内側
 */
export default function TrifoldBrochure({ data }: Props) {
  const { companyName, ownerName, phone, email, referralCode, referralUrl, role } = data;
  const roleLabel = role === 'agency' ? '代理店パートナー' : 'affilishopパートナー';

  return (
    <>
      {/* ============ 外側 ============ */}
      <section className="p-page t-page" data-size="A4横">
        <div className="t-side t-side-outer">
          {/* 右：表紙 */}
          <div className="t-panel t-panel-cover">
            <div className="t-cover-bg" />
            <div className="t-cover-inner">
              <div className="t-logo">Push-taro.</div>
              <div className="t-cover-catch">
                実店舗のリピートを、<br />仕組みに変える。
              </div>
              <div className="t-cover-sub">
                プッシュ通知 × CRM で<br />
                既存客のリピートを自動化
              </div>
              <div className="t-cover-role">{roleLabel}</div>
            </div>
          </div>

          {/* 中：紹介コード + QR */}
          <div className="t-panel t-panel-code">
            <div className="t-panel-title">紹介コード</div>
            <div className="t-code">{referralCode || '—'}</div>
            <QRBlock value={referralUrl} size={130} label="こちらのQRから登録" />
            <p className="t-code-note">
              新規店舗がご契約されると、<br />
              毎月の紹介報酬が発生します。
            </p>
          </div>

          {/* 左：パートナー情報（裏表紙） */}
          <div className="t-panel t-panel-back">
            <div className="t-back-title">お問い合わせ</div>
            <div className="t-back-company">{companyName}</div>
            <div className="t-back-owner">{ownerName} 様</div>
            <dl className="t-back-info">
              <dt>TEL</dt><dd>{phone || '—'}</dd>
              <dt>MAIL</dt><dd>{email}</dd>
            </dl>
            <div className="t-back-note">
              Push-taro の導入・ご紹介について<br />
              お気軽にご相談ください。
            </div>
            <div className="t-back-logo">Push-taro.</div>
          </div>
        </div>
      </section>

      {/* ============ 内側 ============ */}
      <section className="p-page t-page" data-size="A4横">
        <div className="t-side t-side-inner">
          {/* 左：機能① */}
          <div className="t-panel">
            <div className="t-feature-num">01</div>
            <h3 className="t-feature-title">プッシュ通知</h3>
            <p className="t-feature-text">
              iPhone・Android・PCへ一斉配信。開封率はメルマガの6倍。
              画像付き・リンク遷移にも対応。
            </p>
          </div>

          {/* 中：機能② */}
          <div className="t-panel">
            <div className="t-feature-num">02</div>
            <h3 className="t-feature-title">クーポン自動配信</h3>
            <p className="t-feature-text">
              初回・通常・特別達成・連続・誕生日・休眠復活。
              7種類のクーポンで来店サイクルを設計。
            </p>
          </div>

          {/* 右：機能③ */}
          <div className="t-panel">
            <div className="t-feature-num">03</div>
            <h3 className="t-feature-title">QRコードで顧客獲得</h3>
            <p className="t-feature-text">
              店頭POPにQRを置くだけ。お客様はアプリ不要で登録完了。
              顧客リストが自動で貯まります。
            </p>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .t-page {
          width: 297mm;
          height: 210mm;
        }
        .t-side {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          width: 100%;
          height: 100%;
        }
        .t-panel {
          padding: 18mm 12mm;
          position: relative;
          overflow: hidden;
        }
        .t-side-inner .t-panel {
          border-right: 1px dashed #e2e8f0;
        }
        .t-side-inner .t-panel:last-child { border-right: none; }

        /* --- 表紙 --- */
        .t-panel-cover {
          background: linear-gradient(160deg, #0f172a, #1e293b);
          color: #fff;
          padding: 20mm 14mm;
        }
        .t-cover-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 80% 20%, rgba(255,69,0,0.35), transparent 60%);
        }
        .t-cover-inner { position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; justify-content: space-between; }
        .t-logo { font-size: 22pt; font-weight: 900; letter-spacing: -0.5px; }
        .t-logo::after { content: '.'; color: #ff4500; }
        .t-cover-catch {
          font-size: 22pt;
          font-weight: 900;
          line-height: 1.3;
          letter-spacing: -1px;
          margin: 10mm 0;
        }
        .t-cover-sub { font-size: 10pt; color: #cbd5e1; line-height: 1.8; }
        .t-cover-role {
          display: inline-block;
          margin-top: 6mm;
          font-size: 9pt;
          font-weight: 800;
          padding: 3px 12px;
          background: #ff4500;
          border-radius: 20px;
        }

        /* --- 紹介コード --- */
        .t-panel-code { text-align: center; }
        .t-panel-title {
          font-size: 11pt;
          font-weight: 800;
          color: #ff4500;
          letter-spacing: 0.5px;
          margin-bottom: 4mm;
        }
        .t-code {
          font-family: monospace;
          font-size: 22pt;
          font-weight: 900;
          letter-spacing: 3px;
          color: #0f172a;
          background: #fff7ed;
          border: 2px solid #fdba74;
          border-radius: 8px;
          padding: 4mm;
          margin-bottom: 6mm;
        }
        .t-code-note {
          font-size: 9pt;
          color: #475569;
          line-height: 1.7;
          margin-top: 6mm;
        }

        /* --- 裏表紙 --- */
        .t-panel-back { background: #f8fafc; display: flex; flex-direction: column; }
        .t-back-title {
          font-size: 10pt;
          font-weight: 800;
          color: #ff4500;
          letter-spacing: 1px;
          margin-bottom: 4mm;
        }
        .t-back-company { font-size: 14pt; font-weight: 900; margin-bottom: 2mm; }
        .t-back-owner { font-size: 11pt; color: #475569; margin-bottom: 6mm; }
        .t-back-info {
          font-size: 9pt;
          color: #334155;
          border-top: 1px solid #cbd5e1;
          padding-top: 4mm;
          margin: 0 0 6mm;
          display: grid;
          grid-template-columns: 14mm 1fr;
          row-gap: 2mm;
        }
        .t-back-info dt { font-weight: 800; color: #64748b; }
        .t-back-info dd { margin: 0; overflow-wrap: anywhere; }
        .t-back-note { font-size: 9pt; color: #475569; line-height: 1.8; margin-top: auto; }
        .t-back-logo { font-size: 11pt; font-weight: 900; margin-top: 6mm; }
        .t-back-logo::after { content: '.'; color: #ff4500; }

        /* --- 内側の機能説明 --- */
        .t-feature-num {
          font-size: 32pt;
          font-weight: 900;
          color: #ff4500;
          opacity: 0.25;
          line-height: 1;
          margin-bottom: 4mm;
        }
        .t-feature-title { font-size: 13pt; font-weight: 900; margin: 0 0 4mm; }
        .t-feature-text { font-size: 9.5pt; color: #475569; line-height: 1.85; margin: 0; }
      `}</style>
    </>
  );
}
