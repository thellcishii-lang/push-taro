'use client';

import Link from 'next/link';

export default function ScheduledPushFeature() {
  return (
    <>
      <nav className="g-nav">
        <div className="g-nav-inner">
          <Link href="/" className="logo">
            <svg className="logo-mark" viewBox="0 0 48 48" fill="none">
              <defs>
                <linearGradient id="schedLogoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ff6b6b" />
                  <stop offset="100%" stopColor="#ff4500" />
                </linearGradient>
              </defs>
              <circle cx="24" cy="24" r="23" fill="url(#schedLogoGrad)" />
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
          <span className="current">予約配信</span>
        </div>

        <div className="g-hero">
          <span className="g-badge is-pro">🔥 PRO 限定</span>
          <h1>📅 予約配信・定期配信</h1>
          <p>
            「毎週金曜18時」「毎月1日」など、<strong>任意のスケジュールで自動配信</strong>できる機能です。
            一度設定すれば、あとはずっと自動で動き続けます。
          </p>
        </div>

        <div className="g-content">

          <h2 className="g-h2"><span className="num">1</span>この機能でできること</h2>
          <div className="g-feature-list">
            <div className="g-feature-item"><span className="ico">📅</span><div><strong>3種類のスケジュール</strong><p>「1回のみ」「毎月指定日」「毎週指定曜日」から選べます。</p></div></div>
            <div className="g-feature-item"><span className="ico">🤖</span><div><strong>全自動で配信</strong><p>一度設定すれば、あとは毎日Cronが自動でチェックして送信。</p></div></div>
            <div className="g-feature-item"><span className="ico">🎫</span><div><strong>クーポン付き配信も可能</strong><p>「通常通知」または「クーポン付き通知」を選べます。</p></div></div>
            <div className="g-feature-item"><span className="ico">🔄</span><div><strong>失敗時は翌日リトライ</strong><p>送信失敗した予約は、翌日自動で再試行されます（1回のみ）。</p></div></div>
          </div>

          <h2 className="g-h2"><span className="num">2</span>スケジュールの種類</h2>
          <div className="g-schedule-grid">
            <div className="g-schedule-card">
              <div className="g-schedule-icon">📌</div>
              <div className="g-schedule-name">日付指定（1回のみ）</div>
              <p>例：「2026年12月25日」にクリスマスセール告知を配信</p>
              <div className="g-schedule-tag">1回限り</div>
            </div>
            <div className="g-schedule-card">
              <div className="g-schedule-icon">🔄</div>
              <div className="g-schedule-name">毎月指定日</div>
              <p>例：「毎月1日」に月初クーポンを配信</p>
              <div className="g-schedule-tag">定期</div>
            </div>
            <div className="g-schedule-card">
              <div className="g-schedule-icon">🗓️</div>
              <div className="g-schedule-name">毎週指定曜日</div>
              <p>例：「毎週金曜18時」に週末告知を配信</p>
              <div className="g-schedule-tag">定期</div>
            </div>
          </div>

          <h2 className="g-h2"><span className="num">3</span>設定手順</h2>
          <div className="g-steps">
            <div className="g-step">
              <div className="g-step-body">
                <h4>「📅 予約配信」タブを開く</h4>
                <p>新規予約フォームが表示されます。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>配信の種別を選択</h4>
                <p>「📢 通常通知」または「🎫 クーポン付き通知」を選びます。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>スケジュール形式を選択</h4>
                <p>「1回のみ」「毎月」「毎週」から選び、日付・曜日を指定。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>タイトル・本文・リンク先URLを入力</h4>
                <p>クーポン付きの場合は、有効日数も設定します。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>「➕ 予約をセット」をタップ</h4>
                <p>予約一覧に追加され、指定日時に自動配信されます。</p>
              </div>
            </div>
          </div>

          <h2 className="g-h2"><span className="num">4</span>画面イメージ</h2>
          <div className="g-mockup">
            <div className="g-mockup-tabs">
              <span>📢 即時通知</span>
              <span>🏪 店舗設定</span>
              <span>🔥 PRO機能</span>
              <span className="is-active-amber">📅 予約</span>
            </div>
            <div className="g-mockup-card">
              <div className="g-mockup-h3">📅 新規配信予約をセット</div>
              <div className="g-mockup-label">配信の種別</div>
              <div className="g-mockup-input">📢 通常通知メッセージ</div>
              <div className="g-mockup-label">スケジュール</div>
              <div className="g-mockup-input">毎週 金曜日 18:00</div>
              <div className="g-mockup-label">タイトル</div>
              <div className="g-mockup-input">週末限定セールのお知らせ</div>
              <div className="g-mockup-label">本文</div>
              <div className="g-mockup-textarea">今週末は全品10%OFF！ご来店お待ちしております。</div>
              <div className="g-mockup-btn is-amber">➕ この内容で予約をセットする</div>
            </div>
          </div>

          <h2 className="g-h2"><span className="num">5</span>予約一覧の管理</h2>
          <p className="g-desc">設定した予約はタブ下部の一覧で確認でき、不要になったら削除できます。</p>
          <div className="g-mockup">
            <div className="g-mockup-h3">📋 現在設定されている予約配信一覧（3件）</div>
            <div className="g-reservation-item">
              <div>
                <span className="g-res-badge is-coupon">🎫 クーポン予約</span>
                <span className="g-res-schedule">毎週 金曜日</span>
                <div className="g-res-title">週末限定クーポン</div>
                <div className="g-res-body">金曜18時配信・土日限定10%OFF</div>
              </div>
              <button className="g-res-delete">🗑️ 予約を取り消す</button>
            </div>
            <div className="g-reservation-item">
              <div>
                <span className="g-res-badge">📢 通知予約</span>
                <span className="g-res-schedule">毎月 1日</span>
                <div className="g-res-title">今月のおすすめ</div>
                <div className="g-res-body">月初の新メニュー情報をお届け</div>
              </div>
              <button className="g-res-delete">🗑️ 予約を取り消す</button>
            </div>
          </div>

          <h2 className="g-h2"><span className="num">6</span>おすすめの使い方</h2>
          <div className="g-grid">
            <div className="g-card" style={{ cursor: 'default' }}><span className="g-card-icon">🗓️</span><h4>毎週金曜の週末告知</h4><p>週末の集客を毎週自動で後押し。</p></div>
            <div className="g-card" style={{ cursor: 'default' }}><span className="g-card-icon">📌</span><h4>月初の新メニュー</h4><p>毎月1日に新メニュー情報を配信。</p></div>
            <div className="g-card" style={{ cursor: 'default' }}><span className="g-card-icon">🎄</span><h4>季節イベント</h4><p>クリスマス・お正月など、1回限りの予約配信。</p></div>
            <div className="g-card" style={{ cursor: 'default' }}><span className="g-card-icon">💤</span><h4>アイドルタイム対策</h4><p>平日14時に「今空いてます」を定期配信。</p></div>
          </div>

          <div className="g-callout info">
            <span className="ico">💡</span>
            <div>
              <strong>予約配信は「仕込み」が命</strong>
              <p>忙しい日に慌てて通知を考えるのではなく、<strong>余裕のある時にまとめて仕込む</strong>のがプロの運用です。
              月末に翌月分の予約をまとめてセットしておくと、運用が楽になります。</p>
            </div>
          </div>

          <div className="g-related">
            <h3>関連機能</h3>
            <div className="g-related-grid">
              <Link href="/guide/features/push-notification" className="g-related-card">
                <span className="ico">📢</span>
                <div><div className="title">プッシュ通知</div><div className="sub">即時配信の基本</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/features/coupon-normal" className="g-related-card">
                <span className="ico">🎟️</span>
                <div><div className="title">通常クーポン</div><div className="sub">常設クーポン</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/ng-actions" className="g-related-card">
                <span className="ico">⚠️</span>
                <div><div className="title">NG行為集</div><div className="sub">深夜配信はNG</div></div>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="g-cta">
            <h3>予約配信で、仕込みを自動化</h3>
            <p>一度設定すれば、あとは自動で動き続けます。</p>
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
        .g-desc { font-size: 15px; color: #475569; line-height: 1.9; margin-bottom: 20px; }
        .g-feature-list { display: flex; flex-direction: column; gap: 14px; }
        .g-feature-item { display: flex; gap: 14px; padding: 18px 22px; background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; align-items: flex-start; }
        .g-feature-item .ico { font-size: 28px; flex-shrink: 0; }
        .g-feature-item strong { display: block; font-size: 15px; color: #0f172a; margin-bottom: 4px; font-weight: 800; }
        .g-feature-item p { font-size: 13.5px; color: #64748b; margin: 0; line-height: 1.7; }

        .g-schedule-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin: 24px 0; }
        .g-schedule-card { padding: 24px 20px; background: #fff; border: 2px solid #fde68a; border-radius: 14px; text-align: center; }
        .g-schedule-icon { font-size: 36px; margin-bottom: 10px; }
        .g-schedule-name { font-size: 15px; font-weight: 800; color: #b45309; margin-bottom: 8px; }
        .g-schedule-card p { font-size: 13px; color: #64748b; margin: 0 0 12px; line-height: 1.7; }
        .g-schedule-tag { display: inline-block; font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 10px; background: #fef3c7; color: #92400e; letter-spacing: 0.3px; }

        .g-callout { display: flex; gap: 16px; padding: 20px 24px; background: #ebf8ff; border: 1px solid #90cdf4; border-radius: 14px; margin: 24px 0; align-items: flex-start; }
        .g-callout .ico { font-size: 22px; flex-shrink: 0; }
        .g-callout strong { display: block; font-size: 15px; color: #2c5282; margin-bottom: 6px; }
        .g-callout p { font-size: 14px; color: #2c5282; margin: 0; line-height: 1.8; }
        .g-callout p strong { display: inline; color: #1e40af; background: #fff; padding: 2px 6px; border-radius: 4px; }

        .g-steps { display: flex; flex-direction: column; gap: 20px; margin: 28px 0; counter-reset: gstep; }
        .g-step { display: flex; gap: 20px; align-items: flex-start; }
        .g-step::before { counter-increment: gstep; content: counter(gstep); flex-shrink: 0; width: 44px; height: 44px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; }
        .g-step-body { flex: 1; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; }
        .g-step-body h4 { margin: 0 0 8px; font-size: 15px; font-weight: 800; color: #0f172a; }
        .g-step-body p { margin: 0; font-size: 14px; color: #475569; }

        .g-mockup { background: #fff; border: 2px solid #e2e8f0; border-radius: 16px; padding: 24px; box-shadow: 0 12px 32px rgba(0,0,0,0.06); }
        .g-mockup-tabs { display: flex; gap: 2px; border-bottom: 2px solid #e2e8f0; margin-bottom: 16px; padding-bottom: 4px; overflow-x: auto; }
        .g-mockup-tabs span { font-size: 11px; font-weight: 700; color: #64748b; padding: 8px 12px; white-space: nowrap; }
        .g-mockup-tabs span.is-active-amber { color: #d97706; border-bottom: 3px solid #d97706; margin-bottom: -6px; }
        .g-mockup-card { background: #fff; padding: 4px 0; }
        .g-mockup-h3 { font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 14px; }
        .g-mockup-label { font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 6px; }
        .g-mockup-input { padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; color: #1e293b; background: #fff; margin-bottom: 14px; }
        .g-mockup-textarea { padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; color: #1e293b; background: #fff; margin-bottom: 14px; min-height: 60px; }
        .g-mockup-btn { padding: 14px; background: #d97706; color: #fff; border-radius: 8px; text-align: center; font-weight: 800; font-size: 15px; }

        .g-reservation-item { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 10px; gap: 12px; }
        .g-res-badge { display: inline-block; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 10px; background: #dbeafe; color: #1e40af; }
        .g-res-badge.is-coupon { background: #ede9fe; color: #6d28d9; }
        .g-res-schedule { display: inline-block; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 4px; background: #fef3c7; color: #92400e; margin-left: 6px; }
        .g-res-title { font-size: 14px; font-weight: 800; color: #0f172a; margin-top: 6px; }
        .g-res-body { font-size: 12.5px; color: #64748b; margin-top: 4px; }
        .g-res-delete { padding: 8px 12px; background: #dc2626; color: #fff; border: none; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: default; flex-shrink: 0; }

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
          .g-reservation-item { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </>
  );
}
