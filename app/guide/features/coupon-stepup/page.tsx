'use client';

import Link from 'next/link';

export default function CouponStepupFeature() {
  return (
    <>
      <nav className="g-nav">
        <div className="g-nav-inner">
          <Link href="/" className="logo">
            <svg className="logo-mark" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="stepupLogoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ff6b6b" />
                  <stop offset="100%" stopColor="#ff4500" />
                </linearGradient>
              </defs>
              <circle cx="24" cy="24" r="23" fill="url(#stepupLogoGrad)" />
              <path d="M24 8 L33 22 L28 22 L28 30 L20 30 L20 22 L15 22 Z" fill="#ffffff" />
              <circle cx="24" cy="20" r="3" fill="#ff4500" opacity="0.5" />
              <path d="M18 30 L14 38 L20 34 Z" fill="#ffffff" />
              <path d="M30 30 L34 38 L28 34 Z" fill="#ffffff" />
              <path d="M22 30 L24 40 L26 30 Z" fill="#fbbf24" />
            </svg>
            Push-taro<span>.</span>
            <small>実店舗のためのPush通知CRM</small>
          </Link>
          <Link href="/signup" className="g-nav-cta">今すぐ申し込む →</Link>
        </div>
      </nav>

      <main className="g-main">
        <div className="g-breadcrumb">
          <Link href="/guide">ガイド</Link>
          <span className="sep">/</span>
          <Link href="/guide/features">機能別</Link>
          <span className="sep">/</span>
          <span className="current">ステップアップクーポン</span>
        </div>

        <div className="g-hero">
          <span className="g-badge is-pro">🔥 PRO 限定</span>
          <h1>🐾 ステップアップクーポン</h1>
          <p>
            来店回数に応じて<strong>段階的に特典が豪華になる</strong>仕組みです。
            最大10段階まで設定でき、来店習慣を強力に後押しします。
          </p>
        </div>

        <div className="g-content">

          <h2 className="g-h2"><span className="num">1</span>この機能でできること</h2>
          <div className="g-feature-list">
            <div className="g-feature-item"><span className="ico">📈</span><div><strong>段階的に特典アップ</strong><p>1回目は小さな特典、5回目は大きな特典…と、ステップを設計できます。</p></div></div>
            <div className="g-feature-item"><span className="ico">🔟</span><div><strong>最大10段階まで設定可能</strong><p>来店回数に応じて、きめ細かく特典を設計できます。</p></div></div>
            <div className="g-feature-item"><span className="ico">📅</span><div><strong>各段階に有効期限を設定</strong><p>「出現から7日間」「日付固定」など、ステップごとに期限を設定可能。</p></div></div>
            <div className="g-feature-item"><span className="ico">🎯</span><div><strong>他クーポンとの併用可否</strong><p>各ステップで「他クーポンと併用可/不可」を選択できます。</p></div></div>
          </div>

          <h2 className="g-h2"><span className="num">2</span>仕組み</h2>
          <div className="g-flow">
            <div className="g-flow-item"><div className="g-flow-circle">1回目</div><p>¥100引き</p></div>
            <div className="g-flow-arrow">→</div>
            <div className="g-flow-item"><div className="g-flow-circle">2回目</div><p>¥200引き</p></div>
            <div className="g-flow-arrow">→</div>
            <div className="g-flow-item"><div className="g-flow-circle">3回目</div><p>¥300引き</p></div>
            <div className="g-flow-arrow">→</div>
            <div className="g-flow-item"><div className="g-flow-circle is-highlight">4回目</div><p>¥500引き</p></div>
            <div className="g-flow-arrow">→</div>
            <div className="g-flow-item"><div className="g-flow-circle is-success">🎉</div><p>5回目<br />特別特典</p></div>
          </div>

          <div className="g-callout info">
            <span className="ico">💡</span>
            <div>
              <strong>「次のステップ」が見えるから、来店が習慣化する</strong>
              <p>お客様は「あと2回来れば¥500引き」という明確な目標を持てます。
              通常クーポンより強い動機づけになり、来店頻度が自然と上がります。</p>
            </div>
          </div>

          <h2 className="g-h2"><span className="num">3</span>設定手順</h2>
          <div className="g-steps">
            <div className="g-step">
              <div className="g-step-body">
                <h4>「🔥 PRO機能」タブを開く</h4>
                <p>「🐾 ステップアップクーポン」セクションまでスクロール。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>「有効にする」にチェック</h4>
                <p>ステップ 1・2 の初期値が表示されます。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>各ステップのタイトル・有効日数を入力</h4>
                <p>「1回目来店特典」「2回目来店特典」…のように設定。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>ステップを追加（最大10段階）</h4>
                <p>「＋ステップを追加」ボタンで、必要な段階まで増やせます。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>「✅ 設定完了」をタップ</h4>
                <p>以降、通常クーポンを消し込むたびにステップが進みます。</p>
              </div>
            </div>
          </div>

          <h2 className="g-h2"><span className="num">4</span>画面イメージ</h2>
          <div className="g-mockup">
            <div className="g-mockup-tabs">
              <span>📢 即時通知</span>
              <span>🏪 店舗設定</span>
              <span className="is-active-green">🔥 PRO機能</span>
              <span>📅 予約</span>
            </div>
            <div className="g-mockup-card">
              <div className="g-mockup-h3">🐾 ステップアップクーポン</div>
              <div className="g-checkbox-row"><span className="g-checkbox is-on">✓</span><span>有効にする</span></div>
              <div className="g-step-mockup">
                <div className="g-step-title">ステップ 1</div>
                <div className="g-mockup-input">1回目来店特典</div>
                <div className="g-mockup-inline">有効日数: 7 日間</div>
              </div>
              <div className="g-step-mockup">
                <div className="g-step-title">ステップ 2</div>
                <div className="g-mockup-input">2回目来店特典</div>
                <div className="g-mockup-inline">有効日数: 14 日間</div>
              </div>
              <div className="g-mockup-addbtn">＋ ステップを追加（最大10段階）</div>
            </div>
          </div>

          <h2 className="g-h2"><span className="num">5</span>おすすめ設定</h2>
          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr><th>項目</th><th>推奨</th><th>理由</th></tr>
              </thead>
              <tbody>
                <tr><td>ステップ数</td><td className="yes">3〜5段階</td><td>多すぎると設計が複雑に。まずは3段階から</td></tr>
                <tr><td>特典内容</td><td className="yes">段階的にアップ</td><td>1回目：¥100引き → 5回目：特別メニュー無料</td></tr>
                <tr><td>有効日数</td><td className="yes">7〜14日間</td><td>「今月中に来ないと」の心理を活用</td></tr>
                <tr><td>併用可否</td><td className="yes">最初は不可</td><td>他のクーポンと重複すると割引が過剰になる</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="g-h2"><span className="num">6</span>業種別の活用例</h2>
          <div className="g-grid">
            <Link href="/guide/cafe" className="g-card"><span className="g-card-icon">☕</span><h4>飲食店・カフェ</h4><p>「1回目：ドリンク50円引き → 5回目：デザート無料」</p></Link>
            <Link href="/guide/salon" className="g-card"><span className="g-card-icon">💇</span><h4>美容室・サロン</h4><p>「1回目：トリートメント10%OFF → 5回目：ヘッドスパ無料」</p></Link>
            <Link href="/guide/ramen" className="g-card"><span className="g-card-icon">🍜</span><h4>ラーメン店</h4><p>「3回目：味玉無料 → 5回目：チャーシュー増量」</p></Link>
            <Link href="/guide/massage" className="g-card"><span className="g-card-icon">💆</span><h4>マッサージ</h4><p>「5回目：延長15分無料」</p></Link>
          </div>

          <div className="g-related">
            <h3>関連機能</h3>
            <div className="g-related-grid">
              <Link href="/guide/features/coupon-loyalty" className="g-related-card">
                <span className="ico">🏆</span>
                <div><div className="title">特別達成クーポン</div><div className="sub">1回の達成で解放</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/features/coupon-repeat" className="g-related-card">
                <span className="ico">🔄</span>
                <div><div className="title">連続クーポン</div><div className="sub">消込で次回分発行</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/themes/repeat" className="g-related-card">
                <span className="ico">📈</span>
                <div><div className="title">リピート施策</div><div className="sub">テーマ別ガイド</div></div>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="g-cta">
            <h3>ステップアップで、来店を習慣に</h3>
            <p>段階的に特典をアップして、自然なリピートサイクルを作りましょう。</p>
            <Link href="/signup" className="g-cta-btn">無料相談・資料請求 →</Link>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .g-nav { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid #e2e8f0; }
        .g-nav-inner { max-width: 960px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
        .logo { display: flex; align-items: center; font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; text-decoration: none; }
        .logo-mark { width: 34px; height: 34px; flex-shrink: 0; margin-right: 8px; }
        .logo span { color: #ff4500; margin-left: 1px; }
        .logo small { font-size: 11px; font-weight: 600; color: #64748b; letter-spacing: 0; margin-left: 8px; }
        .g-nav-cta { background: #ff4500; color: #fff; padding: 10px 22px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; box-shadow: 0 4px 12px rgba(255,69,0,0.25); }
        .g-main { max-width: 860px; margin: 0 auto; padding: 40px 24px 80px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans JP", sans-serif; }
        .g-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #64748b; margin-bottom: 20px; flex-wrap: wrap; }
        .g-breadcrumb a { color: #64748b; text-decoration: none; }
        .g-breadcrumb a:hover { color: #ff4500; }
        .g-breadcrumb .sep { color: #cbd5e1; }
        .g-breadcrumb .current { color: #1e293b; font-weight: 700; }
        .g-hero { padding: 32px 0 40px; border-bottom: 1px solid #e2e8f0; margin-bottom: 40px; }
        .g-badge { display: inline-block; font-size: 11px; font-weight: 800; padding: 5px 14px; border-radius: 20px; margin-bottom: 16px; }
        .g-badge.is-pro { background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; }
        .g-hero h1 { font-size: clamp(26px, 3.4vw, 38px); font-weight: 900; color: #0f172a; letter-spacing: -1px; line-height: 1.25; margin: 0 0 14px; }
        .g-hero p { font-size: 15.5px; color: #64748b; line-height: 1.9; margin: 0; }
        .g-hero p strong { color: #0f172a; }
        .g-content { line-height: 1.9; color: #334155; font-size: 15px; }
        .g-h2 { font-size: 22px; font-weight: 900; color: #0f172a; margin: 56px 0 20px; letter-spacing: -0.6px; display: flex; align-items: center; gap: 12px; }
        .g-h2:first-of-type { margin-top: 0; }
        .g-h2 .num { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; border-radius: 10px; font-size: 16px; font-weight: 900; flex-shrink: 0; }
        .g-feature-list { display: flex; flex-direction: column; gap: 14px; }
        .g-feature-item { display: flex; gap: 14px; padding: 18px 22px; background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; align-items: flex-start; }
        .g-feature-item .ico { font-size: 28px; flex-shrink: 0; }
        .g-feature-item strong { display: block; font-size: 15px; color: #0f172a; margin-bottom: 4px; font-weight: 800; }
        .g-feature-item p { font-size: 13.5px; color: #64748b; margin: 0; line-height: 1.7; }
        .g-flow { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; padding: 28px 24px; background: #fff; border-radius: 16px; border: 2px solid #c4b5fd; margin: 24px 0; }
        .g-flow-item { text-align: center; flex-shrink: 0; }
        .g-flow-circle { width: 72px; height: 72px; border-radius: 50%; background: #f5f3ff; border: 2px solid #8b5cf6; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: #7c3aed; margin: 0 auto 8px; }
        .g-flow-circle.is-highlight { background: #8b5cf6; color: #fff; }
        .g-flow-circle.is-success { background: #f0fdf4; border-color: #16a34a; color: #16a34a; font-size: 24px; }
        .g-flow-item p { font-size: 12px; color: #64748b; margin: 0; line-height: 1.5; }
        .g-flow-arrow { color: #8b5cf6; font-size: 20px; font-weight: 900; }
        .g-callout { display: flex; gap: 16px; padding: 20px 24px; background: #f5f3ff; border: 1px solid #c4b5fd; border-radius: 14px; margin: 24px 0; align-items: flex-start; }
        .g-callout .ico { font-size: 22px; flex-shrink: 0; }
        .g-callout strong { display: block; font-size: 15px; color: #5b21b6; margin-bottom: 6px; }
        .g-callout p { font-size: 14px; color: #6d28d9; margin: 0; line-height: 1.8; }
        .g-callout p strong { display: inline; color: #7c3aed; background: #fff; padding: 2px 6px; border-radius: 4px; }
        .g-steps { display: flex; flex-direction: column; gap: 20px; margin: 28px 0; counter-reset: gstep; }
        .g-step { display: flex; gap: 20px; align-items: flex-start; }
        .g-step::before { counter-increment: gstep; content: counter(gstep); flex-shrink: 0; width: 44px; height: 44px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; }
        .g-step-body { flex: 1; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; }
        .g-step-body h4 { margin: 0 0 8px; font-size: 15px; font-weight: 800; color: #0f172a; }
        .g-step-body p { margin: 0; font-size: 14px; color: #475569; }
        .g-mockup { background: #fff; border: 2px solid #e2e8f0; border-radius: 16px; padding: 24px; box-shadow: 0 12px 32px rgba(0,0,0,0.06); }
        .g-mockup-tabs { display: flex; gap: 2px; border-bottom: 2px solid #e2e8f0; margin-bottom: 16px; padding-bottom: 4px; overflow-x: auto; }
        .g-mockup-tabs span { font-size: 11px; font-weight: 700; color: #64748b; padding: 8px 12px; white-space: nowrap; }
        .g-mockup-tabs span.is-active-green { color: #16a34a; border-bottom: 3px solid #16a34a; margin-bottom: -6px; }
        .g-mockup-card { background: #fff; padding: 4px 0; }
        .g-mockup-h3 { font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 14px; }
        .g-mockup-input { padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; color: #1e293b; background: #fff; margin-bottom: 10px; }
        .g-mockup-inline { font-size: 12px; color: #64748b; margin-bottom: 10px; }
        .g-step-mockup { background: #f0fdf4; padding: 12px; border-radius: 8px; border: 1px solid #86efac; margin-bottom: 10px; }
        .g-step-title { font-size: 12px; font-weight: 800; color: #166534; margin-bottom: 6px; }
        .g-mockup-addbtn { padding: 10px; background: #dcfce7; border: 1px solid #86efac; color: #166534; border-radius: 8px; text-align: center; font-weight: 800; font-size: 13px; margin-top: 10px; }
        .g-checkbox-row { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; font-size: 13px; color: #334155; font-weight: 700; }
        .g-checkbox { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border: 2px solid #cbd5e1; border-radius: 4px; font-size: 12px; font-weight: 900; }
        .g-checkbox.is-on { background: #16a34a; border-color: #16a34a; color: #fff; }
        .g-table-wrap { overflow-x: auto; margin: 24px 0; border-radius: 12px; border: 1px solid #e2e8f0; background: #fff; }
        .g-table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 500px; }
        .g-table th, .g-table td { padding: 14px 18px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        .g-table thead th { background: #f8fafc; font-weight: 800; color: #0f172a; font-size: 13px; border-bottom: 2px solid #e2e8f0; }
        .g-table tbody tr:last-child td { border-bottom: none; }
        .g-table .yes { color: #16a34a; font-weight: 800; }
        .g-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
        .g-card { display: block; padding: 20px 18px; background: #fff; border: 2px solid #e2e8f0; border-radius: 14px; text-decoration: none; color: inherit; transition: all 0.2s; }
        .g-card:hover { border-color: #ff4500; transform: translateY(-3px); box-shadow: 0 12px 32px rgba(255,69,0,0.08); }
        .g-card-icon { font-size: 28px; display: block; margin-bottom: 8px; }
        .g-card h4 { font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 6px; }
        .g-card p { font-size: 12px; color: #64748b; margin: 0; line-height: 1.6; }
        .g-related { margin-top: 56px; padding-top: 32px; border-top: 2px solid #e2e8f0; }
        .g-related > h3 { font-size: 14px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #64748b; margin: 0 0 20px; }
        .g-related-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
        .g-related-card { display: flex; align-items: center; gap: 12px; padding: 16px 18px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; text-decoration: none; color: inherit; transition: all 0.2s; }
        .g-related-card:hover { border-color: #ff4500; transform: translateX(4px); }
        .g-related-card .ico { font-size: 24px; flex-shrink: 0; }
        .g-related-card .title { font-size: 14px; font-weight: 800; color: #0f172a; line-height: 1.3; }
        .g-related-card .sub { font-size: 11.5px; color: #64748b; margin-top: 2px; }
        .g-related-card .arrow { color: #ff4500; font-size: 16px; font-weight: 900; margin-left: auto; }
        .g-cta { margin-top: 48px; padding: 40px 32px; background: linear-gradient(160deg, #0f172a, #1e293b); color: #fff; border-radius: 20px; text-align: center; }
        .g-cta h3 { font-size: 20px; font-weight: 900; margin: 0 0 12px; }
        .g-cta p { font-size: 14px; color: #94a3b8; margin: 0 0 20px; line-height: 1.8; }
        .g-cta-btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; border-radius: 10px; font-weight: 800; font-size: 15px; text-decoration: none; box-shadow: 0 6px 20px rgba(255,69,0,0.3); }
        @media (max-width: 640px) {
          .g-main { padding: 24px 16px 60px; }
          .logo { font-size: 18px; }
          .logo-mark { width: 28px; height: 28px; margin-right: 6px; }
          .logo small { display: none; }
          .g-nav-cta { padding: 8px 14px; font-size: 12px; }
          .g-h2 { font-size: 18px; }
          .g-flow-arrow { display: none; }
        }
      `}</style>
    </>
  );
}
