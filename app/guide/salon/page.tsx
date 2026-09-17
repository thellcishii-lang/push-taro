'use client';

import Link from 'next/link';

export default function SalonGuidePage() {
  return (
    <>
      {/* ヘッダー */}
      <nav className="s-nav">
        <div className="s-nav-inner">
          <Link href="/" className="s-logo">🚀 Push-taro <small>/ 使い方ガイド</small></Link>
          <Link href="/signup" className="s-nav-cta">今すぐ申し込む →</Link>
        </div>
      </nav>

      <main className="s-main">
        {/* パンくず */}
        <div className="s-breadcrumb">
          <Link href="/guide">ガイド</Link>
          <span className="sep">/</span>
          <span className="current">美容室・サロン</span>
        </div>

        {/* ヘッダー */}
        <div className="s-hero">
          <span className="s-badge">💇 美容室・サロン向け</span>
          <h1>美容室・サロンのための<br />Push-taro活用ガイド</h1>
          <p>
            美容サロンの新規客獲得コストは、1人あたり<strong>平均30,000円</strong>。
            新規獲得に頼り続ける経営から脱却し、既存客のリピートで安定した売上を作る方法を解説します。
          </p>
        </div>

        <div className="s-content">

          {/* 課題 */}
          <h2><span className="num">1</span>美容サロン業界が抱える3つの課題</h2>
          <div className="s-grid">
            <div className="s-card-simple">
              <div className="s-icon-big">💸</div>
              <h4>新規獲得コストが高い</h4>
              <p>ホットペッパー等で1人あたり<strong>3万円</strong>。毎月の重い負担に。</p>
            </div>
            <div className="s-card-simple">
              <div className="s-icon-big">🔄</div>
              <h4>リピート率が低い</h4>
              <p>新規客の<strong>7割が1回で離反</strong>。「また来たい」仕組みがない。</p>
            </div>
            <div className="s-card-simple">
              <div className="s-icon-big">💤</div>
              <h4>休眠客の放置</h4>
              <p>3ヶ月来ていない顧客に、<strong>何もできていない</strong>。</p>
            </div>
          </div>

          <div className="s-callout info">
            <span className="ico">💡</span>
            <div>
              <p><strong>美容サロンの成功は、リピート率で決まる</strong></p>
              <p>新規獲得に頼る経営から、既存客のリピートで安定させる経営へ。</p>
            </div>
          </div>

          {/* 3回来店で定着 */}
          <h2><span className="num">2</span>3回来店で、お客様は定着する</h2>
          <p>
            美容サロン業界では、<strong>「3回来店した顧客は、その後も継続して通い続ける」</strong>というデータがあります。
            逆に言えば、<strong>3回まで来店させられれば、その顧客は離反しない</strong>ということです。
          </p>

          <div className="s-diagram">
            <div className="s-flow">
              <div className="s-flow-item">
                <div className="s-flow-circle">1回目</div>
                <p>初回クーポンで来店</p>
              </div>
              <div className="s-flow-arrow">→</div>
              <div className="s-flow-item">
                <div className="s-flow-circle">2回目</div>
                <p>連続クーポンで再来</p>
              </div>
              <div className="s-flow-arrow">→</div>
              <div className="s-flow-item">
                <div className="s-flow-circle highlight">3回目</div>
                <p>特別達成クーポン</p>
              </div>
              <div className="s-flow-arrow">→</div>
              <div className="s-flow-item">
                <div className="s-flow-circle success">🎉 定着</div>
                <p>ファン化</p>
              </div>
            </div>
          </div>

          <div className="s-callout success">
            <span className="ico">✅</span>
            <div>
              <p><strong>「あと1回行くと特別クーポンがもらえる」</strong>という仕組みが、来店のきっかけを作ります。</p>
            </div>
          </div>

          {/* 運用フロー */}
          <h2><span className="num">3</span>美容サロン向け 運用フロー</h2>
          <div className="s-steps">
            <div className="s-step">
              <div className="s-step-body">
                <h4>STEP 1：QRコードを店頭に設置</h4>
                <p>管理画面から生成した店舗専用QRコードを、POPに印刷して設置。</p>
              </div>
            </div>
            <div className="s-step">
              <div className="s-step-body">
                <h4>STEP 2：初回クーポンで顧客獲得</h4>
                <p>通知登録と同時に、初回限定クーポンを自動配布。</p>
              </div>
            </div>
            <div className="s-step">
              <div className="s-step-body">
                <h4>STEP 3：連続クーポンで2回目来店</h4>
                <p>消込と同時に、次回クーポンを即時発行。14日間の有効期限で来店サイクルを短縮。</p>
              </div>
            </div>
            <div className="s-step">
              <div className="s-step-body">
                <h4>STEP 4：3回目で特別達成クーポン</h4>
                <p>累計3回来店で、特別な達成クーポンを解放。</p>
              </div>
            </div>
            <div className="s-step">
              <div className="s-step-body">
                <h4>STEP 5：誕生日・休眠復活で長期化</h4>
                <p>誕生日クーポンで特別感を演出。60日来店が無い顧客には休眠復活クーポン。</p>
              </div>
            </div>
          </div>

          {/* 関連ページ */}
          <div className="s-related">
            <h3>関連ガイド</h3>
            <div className="s-related-grid">
              <Link href="/guide/ng-actions" className="s-related-card">
                <span className="ico">⚠️</span>
                <div>
                  <div className="title">NG行為集</div>
                  <div className="sub">炎上・離反を招く行為</div>
                </div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/cafe" className="s-related-card">
                <span className="ico">☕</span>
                <div>
                  <div className="title">飲食店・カフェ向け</div>
                  <div className="sub">業種別ガイド</div>
                </div>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="s-cta">
            <h3>美容サロンのリピート施策を、仕組みに。</h3>
            <p>Push-taroなら、3回来店で定着する仕組みを全自動で運用できます。</p>
            <Link href="/signup" className="s-cta-btn">無料相談・資料請求 →</Link>
          </div>

        </div>
      </main>

      {/* スタイル */}
      <style jsx global>{`
        .s-nav { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid #e2e8f0; }
        .s-nav-inner { max-width: 1100px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
        .s-logo { display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 900; color: #0f172a; text-decoration: none; letter-spacing: -0.5px; }
        .s-logo small { font-size: 11px; font-weight: 600; color: #64748b; }
        .s-nav-cta { background: #ff4500; color: #fff; padding: 10px 22px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; box-shadow: 0 4px 12px rgba(255,69,0,0.25); }
        .s-main { max-width: 860px; margin: 0 auto; padding: 40px 24px 80px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans JP", sans-serif; }
        .s-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #64748b; margin-bottom: 20px; flex-wrap: wrap; }
        .s-breadcrumb a { color: #64748b; text-decoration: none; }
        .s-breadcrumb a:hover { color: #ff4500; }
        .s-breadcrumb .sep { color: #cbd5e1; }
        .s-breadcrumb .current { color: #1e293b; font-weight: 700; }
        .s-hero { padding: 32px 0 40px; border-bottom: 1px solid #e2e8f0; margin-bottom: 40px; }
        .s-badge { display: inline-block; font-size: 11px; font-weight: 800; letter-spacing: 0.8px; color: #ff4500; background: #fff7ed; padding: 5px 14px; border-radius: 20px; margin-bottom: 16px; }
        .s-hero h1 { font-size: clamp(26px, 3.4vw, 38px); font-weight: 900; color: #0f172a; letter-spacing: -1px; line-height: 1.25; margin: 0 0 14px; }
        .s-hero p { font-size: 15.5px; color: #64748b; line-height: 1.9; margin: 0; }
        .s-content { max-width: 100%; line-height: 1.9; color: #334155; font-size: 15px; }
        .s-content > h2 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 56px 0 20px; letter-spacing: -0.6px; display: flex; align-items: center; gap: 12px; }
        .s-content > h2:first-of-type { margin-top: 0; }
        .s-content > h2 .num { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; border-radius: 10px; font-size: 16px; font-weight: 900; flex-shrink: 0; }
        .s-content p { margin-bottom: 16px; }
        .s-content strong { color: #0f172a; font-weight: 800; }
        .s-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin: 24px 0; }
        .s-card-simple { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; text-align: center; }
        .s-icon-big { font-size: 32px; margin-bottom: 8px; }
        .s-card-simple h4 { font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 8px; }
        .s-card-simple p { font-size: 13px; color: #64748b; margin: 0; line-height: 1.7; }
        .s-callout { display: flex; gap: 16px; padding: 20px 24px; border-radius: 14px; margin: 24px 0; align-items: flex-start; }
        .s-callout .ico { flex-shrink: 0; font-size: 22px; line-height: 1; }
        .s-callout p { margin: 0; font-size: 14.5px; line-height: 1.85; }
        .s-callout p + p { margin-top: 8px; }
        .s-callout.info { background: #ebf8ff; border: 1px solid #90cdf4; color: #2c5282; }
        .s-callout.success { background: #f0fdf4; border: 1px solid #86efac; color: #14532d; }
        .s-diagram { background: linear-gradient(135deg, #f8fafc, #eef2f7); border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px 24px; margin: 28px 0; overflow-x: auto; }
        .s-flow { display: flex; align-items: center; justify-content: center; gap: 12px; min-width: 600px; }
        .s-flow-item { text-align: center; flex-shrink: 0; }
        .s-flow-circle { width: 80px; height: 80px; border-radius: 50%; background: #fff7ed; border: 2px solid #ff4500; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: #ff4500; margin: 0 auto 8px; }
        .s-flow-circle.highlight { background: #ff4500; color: #fff; }
        .s-flow-circle.success { background: #f0fdf4; border-color: #16a34a; color: #16a34a; }
        .s-flow-item p { font-size: 12px; color: #64748b; margin: 0; }
        .s-flow-arrow { font-size: 24px; color: #ff4500; font-weight: 900; flex-shrink: 0; }
        .s-steps { display: flex; flex-direction: column; gap: 20px; margin: 28px 0; counter-reset: sstep; }
        .s-step { display: flex; gap: 20px; align-items: flex-start; position: relative; }
        .s-step::before { counter-increment: sstep; content: counter(sstep); flex-shrink: 0; width: 44px; height: 44px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; }
        .s-step-body { flex: 1; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; }
        .s-step-body h4 { margin: 0 0 8px; font-size: 15px; font-weight: 800; color: #0f172a; }
        .s-step-body p { margin: 0; font-size: 14px; color: #475569; }
        .s-related { margin-top: 64px; padding-top: 32px; border-top: 2px solid #e2e8f0; }
        .s-related > h3 { font-size: 14px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #64748b; margin: 0 0 20px; }
        .s-related-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
        .s-related-card { display: flex; align-items: center; gap: 12px; padding: 16px 18px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; text-decoration: none; color: inherit; transition: all 0.2s; }
        .s-related-card:hover { border-color: #ff4500; transform: translateX(4px); }
        .s-related-card .ico { font-size: 24px; flex-shrink: 0; }
        .s-related-card .title { font-size: 14px; font-weight: 800; color: #0f172a; line-height: 1.3; }
        .s-related-card .sub { font-size: 11.5px; color: #64748b; margin-top: 2px; }
        .s-related-card .arrow { color: #ff4500; font-size: 16px; font-weight: 900; margin-left: auto; }
        .s-cta { margin-top: 56px; padding: 40px 32px; background: linear-gradient(160deg, #0f172a, #1e293b); color: #fff; border-radius: 20px; text-align: center; }
        .s-cta h3 { font-size: 22px; font-weight: 900; margin: 0 0 12px; color: #fff; }
        .s-cta p { font-size: 14.5px; color: #94a3b8; margin-bottom: 24px; line-height: 1.8; }
        .s-cta-btn { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; padding: 14px 32px; border-radius: 10px; font-weight: 800; font-size: 15px; text-decoration: none; box-shadow: 0 8px 24px rgba(255,69,0,0.35); }
        @media (max-width: 640px) {
          .s-main { padding: 24px 16px 60px; }
          .s-logo { font-size: 17px; }
          .s-nav-cta { padding: 8px 14px; font-size: 12px; }
          .s-flow { min-width: 0; flex-wrap: wrap; }
          .s-flow-arrow { transform: rotate(90deg); }
        }
      `}</style>
    </>
  );
}
