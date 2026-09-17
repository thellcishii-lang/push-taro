'use client';

import Link from 'next/link';

export default function RamenGuidePage() {
  return (
    <>
      <nav className="g-nav">
        <div className="g-nav-inner">
          <Link href="/" className="g-logo">🚀 Push-taro <small>/ 使い方ガイド</small></Link>
          <Link href="/signup" className="g-nav-cta">今すぐ申し込む →</Link>
        </div>
      </nav>

      <main className="g-main">
        <div className="g-breadcrumb">
          <Link href="/guide">ガイド</Link>
          <span className="sep">/</span>
          <span className="current">ラーメン店</span>
        </div>

        <div className="g-hero">
          <span className="g-badge">🍜 ラーメン店向け</span>
          <h1>ラーメン店のための<br />Push-taro活用ガイド</h1>
          <p>
            ラーメン店は<strong>リピート率が高い業種</strong>。だからこそ、常連化の仕組みと
            <strong>「また食べたい」を刺激する情報発信</strong>が売上を大きく伸ばします。
          </p>
        </div>

        <div className="g-content">

          <h2><span className="num">1</span>ラーメン店が抱える3つの課題</h2>
          <div className="g-grid">
            <div className="g-card-simple">
              <div className="g-icon-big">📉</div>
              <h4>客単価が低い</h4>
              <p>1杯800〜1,200円。単価が低い分、回転とリピートで稼ぐ必要。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">🚶</div>
              <h4>行列のムラ</h4>
              <p>土日は行列、平日は空席。稼働にムラがある。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">🔄</div>
              <h4>他店に流れやすい</h4>
              <p>ラーメン好きは複数店舗を回る。固定客化が難しい。</p>
            </div>
          </div>

          <div className="g-callout info">
            <span className="ico">💡</span>
            <div>
              <p><strong>ラーメン店は「情報発信」が命</strong></p>
              <p>限定ラーメン・新メニュー・季節の一杯——<strong>「今、食べに行きたい」</strong>と思わせる情報を、常連に届けられるかが勝負です。</p>
            </div>
          </div>

          <h2><span className="num">2</span>「また食べたい」を仕組みに</h2>
          <div className="g-diagram">
            <div className="g-flow">
              <div className="g-flow-item">
                <div className="g-flow-circle">初来店</div>
                <p>QR登録</p>
              </div>
              <div className="g-flow-arrow">→</div>
              <div className="g-flow-item">
                <div className="g-flow-circle">2杯目</div>
                <p>次回クーポン<br />で再来</p>
              </div>
              <div className="g-flow-arrow">→</div>
              <div className="g-flow-item">
                <div className="g-flow-circle highlight">限定</div>
                <p>限定ラーメン<br />で来店</p>
              </div>
              <div className="g-flow-arrow">→</div>
              <div className="g-flow-item">
                <div className="g-flow-circle success">🎉 常連</div>
                <p>週1で<br />通う</p>
              </div>
            </div>
          </div>

          <h2><span className="num">3</span>ラーメン店向け 運用フロー</h2>
          <div className="g-steps">
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 1：券売機・テーブルにQRコードを設置</h4>
                <p>行列中・着席時に、自然に目に入る場所に。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 2：初回クーポンで2杯目を約束</h4>
                <p>「次回トッピング無料」など、低コストで喜ばれる特典を。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 3：限定ラーメンを定期配信</h4>
                <p>「今週限定・濃厚魚介豚骨」など、週替わりで配信。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 4：平日ランチクーポンで稼働UP</h4>
                <p>「平日11〜14時限定 大盛り無料」など。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 5：休眠顧客の呼び戻し</h4>
                <p>「最近お見かけしないですね」の一言と共に、復活クーポン。</p>
              </div>
            </div>
          </div>

          <h2><span className="num">4</span>ラーメン店で推奨するクーポン設計</h2>
          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr>
                  <th>クーポン種別</th>
                  <th>目的</th>
                  <th>推奨設定</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>🎫 初回限定</td><td>新規獲得</td><td>次回トッピング無料</td></tr>
                <tr><td>🔄 連続</td><td>常連化</td><td>次回大盛り無料</td></tr>
                <tr><td>📅 平日限定</td><td>稼働率UP</td><td>平日11〜14時 100円引き</td></tr>
                <tr><td>🍜 限定メニュー</td><td>来店動機</td><td>限定ラーメン割引</td></tr>
                <tr><td>🎂 誕生日</td><td>特別感</td><td>チャーシュー増量無料</td></tr>
                <tr><td>💤 休眠復活</td><td>呼び戻し</td><td>1杯300円引き</td></tr>
              </tbody>
            </table>
          </div>

          <h2><span className="num">5</span>ラーメン店ならではの活用アイデア</h2>
          <div className="g-grid">
            <div className="g-card-simple"><div className="g-icon-big">🍜</div><h4>限定ラーメン</h4><p>「今週の限定・麻辣担々麺」を毎週配信。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">🔥</div><h4>季節の一杯</h4><p>「夏限定・冷やし中華始めました」など。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">🥢</div><h4>新メニュー</h4><p>新作のつけ麺・まぜそばを画像付きで。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">⏰</div><h4>アイドルタイム</h4><p>「今、待ち時間ゼロです」を配信。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">🎉</div><h4>周年イベント</h4><p>「3周年記念・全品100円引き」など。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">🍺</div><h4>晩酌セット</h4><p>夜営業の「ラーメン＋ビール」セット告知。</p></div>
          </div>

          <div className="g-callout warn">
            <span className="ico">⚠️</span>
            <div>
              <p><strong>配信タイミングが命</strong></p>
              <p>「今週の限定ラーメン」は<strong>月曜〜水曜</strong>の配信が効果的。週後半だと、他の予定と重なりやすい。</p>
            </div>
          </div>

          <h2><span className="num">6</span>導入事例</h2>
          <div className="g-card">
            <h4>📍 東京都 ラーメン店 A様</h4>
            <p style={{ marginBottom: 12 }}>
              <strong>導入前：</strong>月商 80万円<br />
              <strong>導入後：</strong>月商 <strong style={{ color: '#16a34a' }}>145万円</strong>
            </p>
            <p>限定ラーメンの週次配信で、週末の来店が大幅アップ。常連化も進みました。</p>
          </div>

          <div className="g-card">
            <h4>📍 福岡県 ラーメン店 B様</h4>
            <p style={{ marginBottom: 12 }}>
              <strong>導入前：</strong>平日昼の稼働 40%<br />
              <strong>導入後：</strong>平日昼の稼働 <strong style={{ color: '#16a34a' }}>72%</strong>
            </p>
            <p>平日ランチクーポンで、昼の稼働率が大幅に改善しました。</p>
          </div>

          <div className="g-related">
            <h3>関連ガイド</h3>
            <div className="g-related-grid">
              <Link href="/guide/izakaya" className="g-related-card">
                <span className="ico">🍺</span>
                <div><div className="title">バー・居酒屋向け</div><div className="sub">業種別ガイド</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/themes/repeat" className="g-related-card">
                <span className="ico">🔄</span>
                <div><div className="title">リピート施策</div><div className="sub">テーマ別ガイド</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/cafe" className="g-related-card">
                <span className="ico">☕</span>
                <div><div className="title">飲食店・カフェ向け</div><div className="sub">業種別ガイド</div></div>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="g-cta">
            <h3>ラーメン店の常連を、仕組みに。</h3>
            <p>限定ラーメンの配信からリピート施策まで、Push-taroで。</p>
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
        .g-callout.info { background: #ebf8ff; border: 1px solid #90cdf4; color: #2c5282; }
        .g-callout.warn { background: #fffbeb; border: 1px solid #fcd34d; color: #78350f; }
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
        .g-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; margin-bottom: 16px; }
        .g-card h4 { margin-top: 0; font-size: 16px; color: #0f172a; margin-bottom: 10px; }
        .g-card p:last-child { margin-bottom: 0; }
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
