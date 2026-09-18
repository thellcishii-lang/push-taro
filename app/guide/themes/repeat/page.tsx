'use client';

import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';

export default function RepeatPage() {
  return (
    <>
      <nav className="g-nav">
        <div className="g-nav-inner">
          <BrandLogo tagline="使い方ガイド" />
          <Link href="/signup" className="g-nav-cta">今すぐ申し込む →</Link>
        </div>
      </nav>

      <main className="g-main">
        <div className="g-breadcrumb">
          <Link href="/guide">ガイド</Link>
          <span className="sep">/</span>
          <span className="current">リピート施策</span>
        </div>

        <div className="g-hero">
          <span className="g-badge">🔄 テーマ別ガイド</span>
          <h1>3回来店で、<br />お客様は定着する。</h1>
          <p>
            「3回来店した顧客は、その後も継続して通い続ける」——これは業種を問わず、多くの店舗で実証されているデータです。
            Push-taroで、<strong>3回来店の仕組みを自動化</strong>しましょう。
          </p>
        </div>

        <div className="g-content">

          <h2><span className="num">1</span>なぜ「3回」が重要なのか</h2>

          <p>
            1回目の来店は「試し」。2回目は「気に入った」。そして<strong>3回目で「習慣」</strong>になります。
          </p>

          <div className="g-diagram">
            <div className="g-flow">
              <div className="g-flow-item">
                <div className="g-flow-circle">1回目</div>
                <p>試し</p>
              </div>
              <div className="g-flow-arrow">→</div>
              <div className="g-flow-item">
                <div className="g-flow-circle">2回目</div>
                <p>気に入った</p>
              </div>
              <div className="g-flow-arrow">→</div>
              <div className="g-flow-item">
                <div className="g-flow-circle highlight">3回目</div>
                <p>習慣化</p>
              </div>
              <div className="g-flow-arrow">→</div>
              <div className="g-flow-item">
                <div className="g-flow-circle success">🎉 定着</div>
                <p>ファン化</p>
              </div>
            </div>
          </div>

          <p>
            つまり、<strong>「いかに3回目まで来てもらうか」</strong>が、リピート施策の最重要ポイントです。
          </p>

          <h2><span className="num">2</span>3回来店の仕組みを自動化</h2>

          <div className="g-steps">
            <div className="g-step">
              <div className="g-step-body">
                <h4>1回目：初回クーポンで来店</h4>
                <p>QRコードから登録した顧客に、初回限定クーポンを自動配布。「これがあるから行こう」の動機に。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>2回目：連続クーポンで再来</h4>
                <p>初回の消込と同時に、次回使えるクーポンを即時発行。有効期限を14〜30日に設定し、来店サイクルを短縮。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>3回目：特別達成クーポン</h4>
                <p>累計3回来店で、通常より豪華な特別クーポンを解放。「あと1回」の心理が、確実な来店を促します。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>4回目以降：ファン化</h4>
                <p>誕生日クーポン・季節クーポンなどで特別感を演出。長期のファン化へ。</p>
              </div>
            </div>
          </div>

          <h2><span className="num">3</span>クーポン設計の具体例</h2>

          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr>
                  <th>来店回数</th>
                  <th>クーポン種別</th>
                  <th>推奨内容</th>
                  <th>割引率</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1回目</td>
                  <td>🎫 初回限定</td>
                  <td>次回使える割引クーポン</td>
                  <td className="yes">10〜15%OFF</td>
                </tr>
                <tr>
                  <td>2回目</td>
                  <td>🔄 連続</td>
                  <td>消込と同時に次回分発行</td>
                  <td className="yes">10〜15%OFF</td>
                </tr>
                <tr>
                  <td>3回目</td>
                  <td>🏆 特別達成</td>
                  <td>特別な達成クーポン</td>
                  <td className="yes">20〜30%OFF</td>
                </tr>
                <tr>
                  <td>4回目以降</td>
                  <td>🐾 ステップアップ</td>
                  <td>段階的に特典アップ</td>
                  <td className="yes">段階的に</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2><span className="num">4</span>リピート施策のコツ</h2>

          <div className="g-grid">
            <div className="g-card-simple">
              <div className="g-icon-big">📅</div>
              <h4>有効期限を短めに</h4>
              <p>「今月中」ではなく「14日以内」の方が、来店率が高い。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">🎁</div>
              <h4>特典を豪華に</h4>
              <p>3回目のクーポンは「特別感」が重要。通常より手厚く。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">📢</div>
              <h4>進捗を可視化</h4>
              <p>「あと2回で特別クーポン」など、進捗を伝える。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">⏰</div>
              <h4>タイミング</h4>
              <p>来店サイクルに合わせて配信。早すぎず、遅すぎず。</p>
            </div>
          </div>

          <div className="g-callout success">
            <span className="ico">✅</span>
            <div>
              <p><strong>3回来店で定着する仕組みは、Push-taroなら全自動</strong></p>
              <p>クーポンの配布・消込・次の配布まで、すべて自動。スタッフの手間はゼロです。</p>
            </div>
          </div>

          <div className="g-related">
            <h3>関連ガイド</h3>
            <div className="g-related-grid">
              <Link href="/guide/themes/new-customer" className="g-related-card">
                <span className="ico">🆕</span>
                <div><div className="title">新規顧客の獲得</div><div className="sub">前のステップ</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/themes/dormant" className="g-related-card">
                <span className="ico">💤</span>
                <div><div className="title">休眠顧客の復活</div><div className="sub">次のステップ</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/salon" className="g-related-card">
                <span className="ico">💇</span>
                <div><div className="title">美容室・サロン向け</div><div className="sub">業種別ガイド</div></div>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="g-cta">
            <h3>3回来店の仕組みを、自動化。</h3>
            <p>初回・連続・特別達成クーポンで、リピート率を劇的に改善。</p>
            <Link href="/signup" className="g-cta-btn">無料相談・資料請求 →</Link>
          </div>

        </div>
      </main>

      <style jsx global>{`
        .g-nav { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid #e2e8f0; }
        .g-nav-inner { max-width: 1100px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
        .g-logo { display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 900; color: #0f172a; text-decoration: none; letter-spacing: -0.5px; }
        .g-logo small { font-size: 11px; font-weight: 600; color: #64748b; }
        .g-nav-cta { background: #ff4500; color: #fff; padding: 10px 22px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; box-shadow: 0 4px 12px rgba(255,69,0,0.25); }
        .g-main { max-width: 860px; margin: 0 auto; padding: 40px 24px 80px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans JP", sans-serif; }
        .g-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #64748b; margin-bottom: 20px; flex-wrap: wrap; }
        .g-breadcrumb a { color: #64748b; text-decoration: none; }
        .g-breadcrumb a:hover { color: #ff4500; }
        .g-breadcrumb .sep { color: #cbd5e1; }
        .g-breadcrumb .current { color: #1e293b; font-weight: 700; }
        .g-hero { padding: 32px 0 40px; border-bottom: 1px solid #e2e8f0; margin-bottom: 40px; }
        .g-badge { display: inline-block; font-size: 11px; font-weight: 800; color: #ff4500; background: #fff7ed; padding: 5px 14px; border-radius: 20px; margin-bottom: 16px; }
        .g-hero h1 { font-size: clamp(26px, 3.4vw, 38px); font-weight: 900; color: #0f172a; letter-spacing: -1px; line-height: 1.25; margin: 0 0 14px; }
        .g-hero p { font-size: 15.5px; color: #64748b; line-height: 1.9; margin: 0; }
        .g-content { line-height: 1.9; color: #334155; font-size: 15px; }
        .g-content > h2 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 56px 0 20px; letter-spacing: -0.6px; display: flex; align-items: center; gap: 12px; }
        .g-content > h2:first-of-type { margin-top: 0; }
        .g-content > h2 .num { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; border-radius: 10px; font-size: 16px; font-weight: 900; flex-shrink: 0; }
        .g-content p { margin-bottom: 16px; }
        .g-content strong { color: #0f172a; font-weight: 800; }
        .g-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin: 24px 0; }
        .g-card-simple { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; text-align: center; }
        .g-icon-big { font-size: 32px; margin-bottom: 8px; }
        .g-card-simple h4 { font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 8px; }
        .g-card-simple p { font-size: 13px; color: #64748b; margin: 0; line-height: 1.7; }
        .g-callout { display: flex; gap: 16px; padding: 20px 24px; border-radius: 14px; margin: 24px 0; align-items: flex-start; }
        .g-callout .ico { flex-shrink: 0; font-size: 22px; line-height: 1; }
        .g-callout p { margin: 0; font-size: 14.5px; line-height: 1.85; }
        .g-callout p + p { margin-top: 8px; }
        .g-callout.success { background: #f0fdf4; border: 1px solid #86efac; color: #14532d; }
        .g-diagram { background: linear-gradient(135deg, #f8fafc, #eef2f7); border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px 24px; margin: 28px 0; overflow-x: auto; }
        .g-flow { display: flex; align-items: center; justify-content: center; gap: 12px; min-width: 600px; }
        .g-flow-item { text-align: center; flex-shrink: 0; }
        .g-flow-circle { width: 80px; height: 80px; border-radius: 50%; background: #fff7ed; border: 2px solid #ff4500; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: #ff4500; margin: 0 auto 8px; }
        .g-flow-circle.highlight { background: #ff4500; color: #fff; }
        .g-flow-circle.success { background: #f0fdf4; border-color: #16a34a; color: #16a34a; }
        .g-flow-item p { font-size: 12px; color: #64748b; margin: 0; line-height: 1.5; }
        .g-flow-arrow { font-size: 24px; color: #ff4500; font-weight: 900; flex-shrink: 0; }
        .g-steps { display: flex; flex-direction: column; gap: 20px; margin: 28px 0; counter-reset: gstep; }
        .g-step { display: flex; gap: 20px; align-items: flex-start; }
        .g-step::before { counter-increment: gstep; content: counter(gstep); flex-shrink: 0; width: 44px; height: 44px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; }
        .g-step-body { flex: 1; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; }
        .g-step-body h4 { margin: 0 0 8px; font-size: 15px; font-weight: 800; color: #0f172a; }
        .g-step-body p { margin: 0; font-size: 14px; color: #475569; }
        .g-table-wrap { overflow-x: auto; margin: 24px 0; border-radius: 12px; border: 1px solid #e2e8f0; background: #fff; }
        .g-table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 500px; }
        .g-table th, .g-table td { padding: 14px 18px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        .g-table thead th { background: #f8fafc; font-weight: 800; color: #0f172a; font-size: 13px; border-bottom: 2px solid #e2e8f0; }
        .g-table tbody tr:last-child td { border-bottom: none; }
        .g-table .yes { color: #16a34a; font-weight: 800; }
        .g-related { margin-top: 64px; padding-top: 32px; border-top: 2px solid #e2e8f0; }
        .g-related > h3 { font-size: 14px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #64748b; margin: 0 0 20px; }
        .g-related-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
        .g-related-card { display: flex; align-items: center; gap: 12px; padding: 16px 18px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; text-decoration: none; color: inherit; transition: all 0.2s; }
        .g-related-card:hover { border-color: #ff4500; transform: translateX(4px); }
        .g-related-card .ico { font-size: 24px; flex-shrink: 0; }
        .g-related-card .title { font-size: 14px; font-weight: 800; color: #0f172a; line-height: 1.3; }
        .g-related-card .sub { font-size: 11.5px; color: #64748b; margin-top: 2px; }
        .g-related-card .arrow { color: #ff4500; font-size: 16px; font-weight: 900; margin-left: auto; }
        .g-cta { margin-top: 56px; padding: 40px 32px; background: linear-gradient(160deg, #0f172a, #1e293b); color: #fff; border-radius: 20px; text-align: center; }
        .g-cta h3 { font-size: 22px; font-weight: 900; margin: 0 0 12px; color: #fff; }
        .g-cta p { font-size: 14.5px; color: #94a3b8; margin-bottom: 24px; line-height: 1.8; }
        .g-cta-btn { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; padding: 14px 32px; border-radius: 10px; font-weight: 800; font-size: 15px; text-decoration: none; box-shadow: 0 8px 24px rgba(255,69,0,0.35); }
        @media (max-width: 640px) {
          .g-main { padding: 24px 16px 60px; }
          .g-logo { font-size: 17px; }
          .g-nav-cta { padding: 8px 14px; font-size: 12px; }
          .g-flow { min-width: 0; flex-wrap: wrap; }
          .g-flow-arrow { transform: rotate(90deg); }
        }
      `}</style>
    </>
  );
}
