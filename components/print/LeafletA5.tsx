import type { PartnerPrintData } from '@/lib/print/types';
import QRBlock from './QRBlock';

interface Props { data: PartnerPrintData; }

export default function LeafletA5({ data }: Props) {
  const {
    companyName, ownerName, phone, email,
    referralCode, referralUrl, role,
  } = data;

  const roleLabel = role === 'agency' ? 'AUTHORIZED AGENCY' : 'AFFILISHOP PARTNER';

  return (
    <>
      {/* ========== 表 ========== */}
      <section className="p-page a5-page a5-front">
        <div className="a5-front-glow" />
        <div className="a5-front-top">
          <div className="a5-logo-row">
            <svg className="a5-logo-mark" viewBox="0 0 48 48" fill="none">
              <defs>
                <linearGradient id="a5LogoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ff6b6b" />
                  <stop offset="100%" stopColor="#ff4500" />
                </linearGradient>
              </defs>
              <circle cx="24" cy="24" r="23" fill="url(#a5LogoGrad)" />
              <path d="M24 8 L33 22 L28 22 L28 30 L20 30 L20 22 L15 22 Z" fill="#ffffff" />
              <circle cx="24" cy="20" r="3" fill="#ff4500" opacity="0.5" />
              <path d="M18 30 L14 38 L20 34 Z" fill="#ffffff" />
              <path d="M30 30 L34 38 L28 34 Z" fill="#ffffff" />
              <path d="M22 30 L24 40 L26 30 Z" fill="#fbbf24" />
            </svg>
            <div className="a5-logo">Push-taro<span>.</span></div>
          </div>
          <div className="a5-badge">先行登録受付中</div>
        </div>
        <div className="a5-front-mid">
          <div className="a5-lead">実店舗のためのPush通知CRM</div>
          <h1 className="a5-catch">
            お客様に<br />喜んで頂ける<br />
            <span className="accent">お店づくりの<br />お手伝い。</span>
          </h1>
          <div className="a5-stats">
            <div className="a5-stat">
              <div className="a5-stat-num">6<span>倍</span></div>
              <div className="a5-stat-label">メルマガ比<br />開封率</div>
            </div>
            <div className="a5-stat">
              <div className="a5-stat-num">7<span>種</span></div>
              <div className="a5-stat-label">クーポン<br />自動配信</div>
            </div>
            <div className="a5-stat">
              <div className="a5-stat-num">0<span>円</span></div>
              <div className="a5-stat-label">導入費用<br />追加課金なし</div>
            </div>
          </div>
          <p className="a5-sub">
            良いサービス、良い商品。<br />
            それだけでは、お客様には伝わりません。<br />
            <strong>「喜んで頂ける仕組み」</strong>が、<br />
            お店とお客様を、もっと強く繋ぎます。
          </p>
        </div>
        <div className="a5-front-foot">
          <span className="a5-role">{roleLabel}</span>
          <span className="a5-year">2026</span>
        </div>
      </section>

      {/* ========== 裏 ========== */}
      <section className="p-page a5-page a5-back">
        {/* 機能 */}
        <div className="a5-sec">
          <h3 className="a5-sec-title">
            <span className="accent">すべてオンオフ可能。</span>
            <small>ALL FEATURES</small>
          </h3>
          <div className="a5-feature-grid">
            {[
              { ico: '📢', name: 'プッシュ通知', badges: ['all'] },
              { ico: '📱', name: 'QRコード登録', badges: ['all'] },
              { ico: '🎫', name: '初回クーポン', badges: ['all'] },
              { ico: '🎟️', name: '通常クーポン', badges: ['std', 'pro'] },
              { ico: '🏆', name: '特別達成', badges: ['std', 'pro'] },
              { ico: '📊', name: '開封率確認', badges: ['std', 'pro'] },
              { ico: '🐾', name: 'ステップアップ', badges: ['pro'] },
              { ico: '🔄', name: '連続クーポン', badges: ['pro'] },
              { ico: '🎂', name: '記念日・誕生日', badges: ['pro'] },
              { ico: '💤', name: '休眠復活', badges: ['pro'] },
              { ico: '📅', name: '予約配信', badges: ['pro'] },
            ].map((f) => {
              const cls = f.badges.includes('pro') ? 'is-pro' : f.badges.includes('std') ? 'is-std' : 'is-all';
              return (
                <div key={f.name} className={`a5-feature-item ${cls}`}>
                  <span className="a5-feature-ico">{f.ico}</span>
                  <span className="a5-feature-name">
                    {f.name}
                    {f.badges.includes('std') && <span className="badge is-std">STD</span>}
                    {f.badges.includes('pro') && <span className="badge is-pro">PRO</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 価格 */}
        <div className="a5-sec" style={{ marginTop: '2mm' }}>
          <h3 className="a5-sec-title">
            <span className="accent">明快な3プラン。</span>
            <small>PRICING</small>
          </h3>
          <div className="a5-price-list">
            <div className="a5-price-item is-pro">
              <span className="a5-price-recommend">おすすめ</span>
              <span className="a5-price-name">PRO</span>
              <span className="a5-price-value">¥10,000<span>/月（税別）</span></span>
            </div>
            <div className="a5-price-item">
              <span className="a5-price-name">STANDARD</span>
              <span className="a5-price-value">¥3,800<span>/月（税別）</span></span>
            </div>
            <div className="a5-price-item">
              <span className="a5-price-name">LIGHT</span>
              <span className="a5-price-value">¥1,980<span>/月（税別）</span></span>
            </div>
          </div>
          <div className="a5-perks">
            <div className="a5-perk">
              <div className="a5-perk-ico">💰</div>
              <div className="a5-perk-text">導入費用<br />0円</div>
            </div>
            <div className="a5-perk">
              <div className="a5-perk-ico">🔓</div>
              <div className="a5-perk-text">いつでも<br />解約OK</div>
            </div>
          </div>
        </div>

        {/* 会社情報 + QR */}
        <div className="a5-contact-row">
          <div>
            <div className="a5-contact-label">CONTACT</div>
            <div className="a5-contact-company">{companyName}</div>
            <div className="a5-contact-owner">{ownerName} 様</div>
            <div className="a5-contact-info">
              TEL　{phone || '—'}<br />
              MAIL　{email}
            </div>
            <div className="a5-contact-url">https://push-taro.com</div>
          </div>

          <div className="a5-offer-side">
            <div className="a5-offer-side-badge">SPECIAL OFFER</div>
            <div className="a5-offer-side-title">
              このコードで<br />
              <span className="accent">限定特典</span>を<br />
              受け取れます
            </div>
            <div className="a5-offer-side-qr">
              <QRBlock value={referralUrl} size={62} />
            </div>
            <div className="a5-offer-side-note">QRを読み取って<br />今すぐお申し込み</div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        /* A5 */
        .a5-page {
          width: 148mm;
          height: 210mm;
          display: flex;
          flex-direction: column;
        }

        /* ========== 表 ========== */
        .a5-front {
          background: linear-gradient(160deg, #0f172a 0%, #1e293b 100%);
          color: #fff;
          padding: 16mm 13mm;
        }
        .a5-front-glow {
          position: absolute; inset: 0;
          background: radial-gradient(circle at 75% 15%, rgba(255,69,0,0.4), transparent 55%);
          pointer-events: none;
        }
        .a5-front > * { position: relative; z-index: 1; }
        .a5-front-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .a5-logo-row { display: flex; align-items: center; gap: 2.5mm; }
        .a5-logo-mark { width: 11mm; height: 11mm; flex-shrink: 0; }
        .a5-logo { font-size: 19pt; font-weight: 900; letter-spacing: -0.5px; line-height: 1; }
        .a5-logo span { color: #ff4500; }
        .a5-badge {
          font-size: 7pt; font-weight: 900; letter-spacing: 1px;
          padding: 1.2mm 3mm; border-radius: 10px;
          background: rgba(255,69,0,0.2); border: 1px solid rgba(255,69,0,0.5);
          color: #fd7e5a;
        }
        .a5-front-mid { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .a5-lead {
          font-size: 9.5pt; color: #fd7e5a; font-weight: 900;
          letter-spacing: 0.5px; margin-bottom: 5mm;
          display: flex; align-items: center; gap: 3mm;
        }
        .a5-lead::before { content: ''; width: 7mm; height: 1.5px; background: #ff4500; display: inline-block; }
        .a5-catch { font-size: 26pt; font-weight: 900; line-height: 1.3; letter-spacing: -1.2px; margin: 0 0 8mm; }
        .a5-catch .accent { color: #fd7e5a; }
        .a5-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3mm; margin-bottom: 8mm; }
        .a5-stat {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 3.5mm 2mm; text-align: center;
        }
        .a5-stat-num {
          font-size: 22pt; font-weight: 900; line-height: 0.9; letter-spacing: -1px;
          background: linear-gradient(135deg, #ff4500, #fb923c);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .a5-stat-num span { font-size: 11pt; margin-left: 0.5mm; -webkit-text-fill-color: #fd7e5a; }
        .a5-stat-label { font-size: 7pt; color: #94a3b8; font-weight: 700; margin-top: 1.5mm; line-height: 1.35; }
        .a5-sub {
          font-size: 10pt; color: #cbd5e1; line-height: 1.9; margin: 0;
          padding-top: 5mm; border-top: 1px solid rgba(255,255,255,0.15);
        }
        .a5-sub strong { color: #fff; font-weight: 900; }
        .a5-front-foot {
          margin-top: auto; padding-top: 6mm;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex; justify-content: space-between; align-items: baseline;
        }
        .a5-role { font-size: 8pt; font-weight: 900; letter-spacing: 1.5px; color: #fd7e5a; }
        .a5-year { font-size: 8pt; color: #64748b; font-weight: 700; }

        /* ========== 裏 ========== */
        .a5-back {
          background: #fff;
          padding: 10mm 10mm;
          display: flex;
          flex-direction: column;
        }
        .a5-sec { margin-bottom: 3mm; }
        .a5-sec-title {
          font-size: 11pt; font-weight: 900; line-height: 1.4;
          letter-spacing: -0.3px; margin-bottom: 3mm;
          display: flex; align-items: baseline; gap: 2mm;
        }
        .a5-sec-title .accent { color: #ff4500; }
        .a5-sec-title small {
          font-size: 6.5pt; font-weight: 800;
          color: #94a3b8; letter-spacing: 1.5px;
        }
        .a5-feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5mm; }
        .a5-feature-item {
          background: #f8fafc; border-radius: 5px;
          padding: 1.5mm; display: flex; align-items: center; gap: 1.8mm;
          border-left: 2px solid #64748b;
        }
        .a5-feature-item.is-std { border-left-color: #0284c7; }
        .a5-feature-item.is-pro { border-left-color: #ff4500; }
        .a5-feature-item.is-all { border-left-color: #64748b; }
        .a5-feature-ico { font-size: 11pt; line-height: 1; flex-shrink: 0; }
        .a5-feature-name {
          font-size: 7pt; font-weight: 800; color: #0f172a; line-height: 1.25;
        }
        .a5-feature-name .badge {
          display: inline-block; font-size: 4.5pt; font-weight: 900;
          padding: 0.2mm 1mm; border-radius: 4px;
          color: #fff; margin-left: 1mm;
          vertical-align: middle; letter-spacing: 0.2px;
        }
        .a5-feature-name .badge.is-pro { background: linear-gradient(135deg, #ff4500, #f97316); }
        .a5-feature-name .badge.is-std { background: #0284c7; }

        .a5-price-list { display: flex; flex-direction: column; gap: 1.5mm; margin: 0; }
        .a5-price-item {
          background: #fff; border: 1px solid #e2e8f0;
          border-radius: 6px; padding: 2mm 2.5mm;
          display: flex; justify-content: space-between; align-items: baseline;
        }
        .a5-price-item.is-pro {
          border: 2px solid #ff4500; background: #fffbf5; position: relative;
        }
        .a5-price-recommend {
          position: absolute; top: -1.8mm; right: 2.5mm;
          font-size: 5pt; font-weight: 900;
          padding: 0.5mm 1.5mm;
          background: #ff4500; color: #fff;
          border-radius: 6px; letter-spacing: 0.3px;
        }
        .a5-price-name { font-size: 8pt; font-weight: 900; color: #64748b; letter-spacing: 0.5px; }
        .a5-price-item.is-pro .a5-price-name { color: #ff4500; }
        .a5-price-value { font-size: 11pt; font-weight: 900; color: #0f172a; letter-spacing: -0.3px; }
        .a5-price-value span { font-size: 6pt; font-weight: 600; color: #64748b; margin-left: 0.5mm; }
        .a5-perks { display: grid; grid-template-columns: 1fr 1fr; gap: 2mm; margin-top: 2.5mm; }
        .a5-perk {
          background: #fff7ed; border: 1px solid #fed7aa;
          border-radius: 6px; padding: 2mm 1.5mm; text-align: center;
        }
        .a5-perk-ico { font-size: 11pt; line-height: 1; margin-bottom: 0.8mm; }
        .a5-perk-text { font-size: 6.5pt; font-weight: 900; color: #7c2d12; line-height: 1.3; }

        .a5-contact-row {
          margin-top: auto;
          padding-top: 4mm;
          border-top: 2px solid #0f172a;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 4mm;
          align-items: center;
        }
        .a5-contact-label {
          font-size: 6.5pt; font-weight: 900; letter-spacing: 2px;
          color: #ff4500; margin-bottom: 1.5mm;
        }
        .a5-contact-company {
          font-size: 11pt; font-weight: 900;
          color: #0f172a; line-height: 1.35;
          margin-bottom: 0.8mm;
        }
        .a5-contact-owner {
          font-size: 8.5pt; color: #475569;
          margin-bottom: 2mm;
        }
        .a5-contact-info {
          font-size: 7pt; color: #334155;
          line-height: 1.65;
        }
        .a5-contact-url {
          margin-top: 2mm;
          font-size: 7pt; font-family: 'Courier New', monospace;
          font-weight: 900; color: #ff4500;
          letter-spacing: 0.3px;
        }

        .a5-offer-side {
          background: #fff;
          border: 2px dashed #ff4500;
          border-radius: 8px;
          padding: 2.5mm;
          text-align: center;
          width: 40mm;
        }
        .a5-offer-side-badge {
          display: inline-block;
          font-size: 5.5pt; font-weight: 900; letter-spacing: 1px;
          padding: 0.6mm 2mm; border-radius: 8px;
          background: linear-gradient(135deg, #ff4500, #f97316);
          color: #fff;
          margin-bottom: 2mm;
        }
        .a5-offer-side-title {
          font-size: 7pt; font-weight: 900;
          color: #0f172a;
          line-height: 1.4;
          margin-bottom: 2mm;
        }
        .a5-offer-side-title .accent { color: #ff4500; }
        .a5-offer-side-qr {
          display: flex; justify-content: center;
          margin-bottom: 1.5mm;
        }
        .a5-offer-side-note {
          font-size: 5.5pt; font-weight: 700;
          color: #64748b;
          line-height: 1.4;
        }
      `}</style>
    </>
  );
}
