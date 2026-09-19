'use client';

import Link from 'next/link';

export default function TorisetsuIndex() {
  return (
    <>
      <nav className="t-nav">
        <div className="t-nav-inner">
          <Link href="/" className="t-logo">
            <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
              <defs>
                <linearGradient id="tLogoGrad" x1="0" y1="0" x2="48" y2="48">
                  <stop offset="0%" stopColor="#ff6b6b" />
                  <stop offset="100%" stopColor="#ff4500" />
                </linearGradient>
              </defs>
              <circle cx="24" cy="24" r="23" fill="url(#tLogoGrad)" />
              <path d="M24 8 L33 22 L28 22 L28 30 L20 30 L20 22 L15 22 Z" fill="#fff" />
              <circle cx="24" cy="20" r="3" fill="#ff4500" opacity="0.5" />
              <path d="M18 30 L14 38 L20 34 Z" fill="#fff" />
              <path d="M30 30 L34 38 L28 34 Z" fill="#fff" />
              <path d="M22 30 L24 40 L26 30 Z" fill="#fbbf24" />
            </svg>
            Push-taro<span>.</span>
          </Link>
          <Link href="/guide" className="t-nav-link">📚 活用ガイド</Link>
        </div>
      </nav>

      <main className="t-main">
        <div className="t-hero">
          <span className="t-badge">User Manual</span>
          <h1>Push-taro 取扱説明書</h1>
          <p>ご利用中のプランに合わせて、実際の画面をもとに操作を図解で解説します。</p>
        </div>

        <div className="t-plan-grid">
          <Link href="/torisetsu/light-standard" className="t-plan-card">
            <div className="t-plan-icon">📗</div>
            <div className="t-plan-name">LIGHT / STANDARD</div>
            <div className="t-plan-desc">基本機能 + 通常・特別達成クーポン</div>
            <ul className="t-plan-list">
              <li>通知送信（月5,000〜15,000通）</li>
              <li>初回クーポン / 通常クーポン / 特別達成クーポン</li>
              <li>QRコード消込</li>
              <li>顧客管理ダッシュボード</li>
            </ul>
            <span className="t-plan-btn">取扱説明書を見る →</span>
          </Link>

          <Link href="/torisetsu/pro" className="t-plan-card is-pro">
            <span className="t-plan-badge">PRO</span>
            <div className="t-plan-icon">🔥</div>
            <div className="t-plan-name">PRO</div>
            <div className="t-plan-desc">全機能 + 予約配信 + 紹介報酬</div>
            <ul className="t-plan-list">
              <li><strong>配信無制限</strong></li>
              <li>ステップアップ / 連続クーポン</li>
              <li>記念日・誕生日 / 休眠復活クーポン</li>
              <li>予約配信・定期配信</li>
              <li>紹介報酬（10%）</li>
            </ul>
            <span className="t-plan-btn">取扱説明書を見る →</span>
          </Link>
        </div>
      </main>

      <style jsx global>{`
        .t-nav { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid #e2e8f0; }
        .t-nav-inner { max-width: 960px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; }
        .t-logo { display: flex; align-items: center; gap: 8px; font-size: 22px; font-weight: 900; color: #0f172a; text-decoration: none; letter-spacing: -0.5px; }
        .t-logo span { color: #ff4500; }
        .t-nav-link { font-size: 13px; font-weight: 700; color: #64748b; text-decoration: none; padding: 8px 14px; border-radius: 8px; }
        .t-nav-link:hover { background: #f1f5f9; color: #0f172a; }

        .t-main { max-width: 960px; margin: 0 auto; padding: 48px 24px 80px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans JP", sans-serif; }

        .t-hero { text-align: center; margin-bottom: 48px; }
        .t-badge { display: inline-block; font-size: 11px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: #ff4500; background: #fff7ed; padding: 6px 16px; border-radius: 20px; margin-bottom: 20px; }
        .t-hero h1 { font-size: clamp(28px, 4vw, 42px); font-weight: 900; color: #0f172a; letter-spacing: -1px; margin: 0 0 14px; line-height: 1.2; }
        .t-hero p { font-size: 15px; color: #64748b; line-height: 1.85; margin: 0; }

        .t-plan-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; }
        .t-plan-card { position: relative; display: flex; flex-direction: column; background: #fff; border: 2px solid #e2e8f0; border-radius: 20px; padding: 36px 32px; text-decoration: none; color: inherit; transition: all 0.25s; }
        .t-plan-card:hover { border-color: #ff4500; transform: translateY(-4px); box-shadow: 0 20px 48px rgba(255,69,0,0.12); }
        .t-plan-card.is-pro { border-color: #ff4500; background: linear-gradient(180deg, #fffbf5 0%, #fff 100%); }
        .t-plan-badge { position: absolute; top: -14px; right: 24px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; font-size: 11px; font-weight: 800; padding: 5px 16px; border-radius: 20px; letter-spacing: 0.5px; }
        .t-plan-icon { font-size: 48px; margin-bottom: 16px; }
        .t-plan-name { font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; margin-bottom: 6px; }
        .t-plan-card.is-pro .t-plan-name { color: #ff4500; }
        .t-plan-desc { font-size: 13px; color: #64748b; margin-bottom: 20px; }
        .t-plan-list { list-style: none; padding: 0; margin: 0 0 24px; display: flex; flex-direction: column; gap: 8px; flex-grow: 1; }
        .t-plan-list li { font-size: 13.5px; color: #475569; line-height: 1.7; padding-left: 20px; position: relative; }
        .t-plan-list li::before { content: '✓'; position: absolute; left: 0; color: #16a34a; font-weight: 900; }
        .t-plan-list li strong { color: #0f172a; }
        .t-plan-btn { display: block; text-align: center; padding: 14px; border-radius: 10px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; font-weight: 800; font-size: 14px; box-shadow: 0 6px 20px rgba(255,69,0,0.3); }
        .t-plan-card:not(.is-pro) .t-plan-btn { background: #475569; box-shadow: none; }

        @media (max-width: 640px) {
          .t-main { padding: 32px 16px 60px; }
          .t-plan-card { padding: 28px 24px; }
          .t-plan-icon { font-size: 40px; }
          .t-plan-name { font-size: 20px; }
        }
      `}</style>
    </>
  );
}
