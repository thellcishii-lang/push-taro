'use client';

import Link from 'next/link';

export default function CouponBirthdayFeature() {
  return (
    <>
      <nav className="g-nav">
        <div className="g-nav-inner">
          <Link href="/" className="logo">
            <svg className="logo-mark" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="bdayLogoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ff6b6b" />
                  <stop offset="100%" stopColor="#ff4500" />
                </linearGradient>
              </defs>
              <circle cx="24" cy="24" r="23" fill="url(#bdayLogoGrad)" />
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
          <span className="current">記念日・誕生日</span>
        </div>

        <div className="g-hero">
          <span className="g-badge is-pro">🔥 PRO 限定</span>
          <h1>🎂 記念日・誕生日クーポン</h1>
          <p>
            お客様の<strong>記念日・誕生日当日に自動でお祝い通知</strong>を配信します。
            「1年に1度の特別な日」を演出し、ファン化を加速させます。
          </p>
        </div>

        <div className="g-content">

          <h2 className="g-h2"><span className="num">1</span>この機能でできること</h2>
          <div className="g-feature-list">
            <div className="g-feature-item"><span className="ico">🎂</span><div><strong>記念日・誕生日に自動配信</strong><p>お客様が登録した月日の当日に、自動でお祝い通知が届きます。</p></div></div>
            <div className="g-feature-item"><span className="ico">🎁</span><div><strong>特別なクーポンを配布</strong><p>通常クーポンより手厚い特典を設定して、特別感を演出。</p></div></div>
            <div className="g-feature-item"><span className="ico">🔒</span><div><strong>1人1回・年1回のみ</strong><p>電話番号に紐づくため、使い回しは自動でブロックされます。</p></div></div>
            <div className="g-feature-item"><span className="ico">💬</span><div><strong>お祝いメッセージを自由に設定</strong><p>「お誕生日おめでとうございます🎉」など、店舗らしい文言を。</p></div></div>
          </div>

          <h2 className="g-h2"><span className="num">2</span>「記念日・誕生日」としている理由</h2>
          <div className="g-callout info">
            <span className="ico">💡</span>
            <div>
              <strong>誕生日だけでなく、あらゆる「年1回の特別な日」に対応</strong>
              <p>結婚記念日、ペットの誕生日、お店のオープン記念日、お子様の入学記念日など、
              お客様にとっての「特別な日」を自由に選べます。<br />
              「自分のための日」を選べることで、登録のハードルが下がり、より多くのお客様にご利用いただけます。</p>
            </div>
          </div>

          <h2 className="g-h2"><span className="num">3</span>不正利用防止の仕組み</h2>
          <p className="g-desc">
            記念日・誕生日クーポンは「1年に1度」の特別なクーポンだからこそ、
            不正利用を防ぐ仕組みが重要です。Push-taroでは以下の3つで防止しています。
          </p>

          <div className="g-fraud-grid">
            <div className="g-fraud-card">
              <div className="g-fraud-num">①</div>
              <h4>電話番号に紐づく</h4>
              <p>SMS認証で本人確認を行うため、同じ電話番号で何度も登録することはできません。</p>
            </div>
            <div className="g-fraud-card">
              <div className="g-fraud-num">②</div>
              <h4>一度登録すると変更不可</h4>
              <p>記念日を一度登録すると、お客様自身では後から変更できません。「月だけ変える」などの使い回しをブロック。</p>
            </div>
            <div className="g-fraud-card">
              <div className="g-fraud-num">③</div>
              <h4>年間重複防止機能</h4>
              <p>同じ年に同じお客様へ複数回配信されることを、システムが自動でブロックします。</p>
            </div>
          </div>

          <h2 className="g-h2"><span className="num">4</span>設定手順（店舗側）</h2>
          <div className="g-steps">
            <div className="g-step">
              <div className="g-step-body">
                <h4>「🔥 PRO機能」タブを開く</h4>
                <p>「🎂 記念日、お誕生日クーポン設定」セクションまでスクロール。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>「有効にする」にチェック</h4>
                <p>設定項目が表示されます。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>クーポンタイトル・お祝いメッセージを入力</h4>
                <p>例：タイトル「お誕生日クーポン 20%OFF」、メッセージ「お誕生日おめでとうございます🎉」</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>「✅ 設定完了」をタップ</h4>
                <p>以降、記念日を登録したお客様に当日自動配信されます。</p>
              </div>
            </div>
          </div>

          <h2 className="g-h2"><span className="num">5</span>お客様側の登録フロー</h2>
          <div className="g-steps">
            <div className="g-step">
              <div className="g-step-body">
                <h4>SMS認証を完了する</h4>
                <p>電話番号で本人確認を行います（不正利用防止のため必須）。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>記念日・誕生日を登録</h4>
                <p>顧客画面（/subscribe）で、月と日を選択。「設定する」をタップ。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>「一度設定すると変更できません」の警告を確認</h4>
                <p>改ざん防止のため、お客様にもこの点を明示しています。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>当日、自動でお祝い通知が届く</h4>
                <p>登録した月日の当日に、クーポン付きの通知が届きます。</p>
              </div>
            </div>
          </div>

          <h2 className="g-h2"><span className="num">6</span>画面イメージ</h2>
          <div className="g-mockup">
            <div className="g-mockup-tabs">
              <span>📢 即時通知</span>
              <span>🏪 店舗設定</span>
              <span className="is-active-green">🔥 PRO機能</span>
              <span>📅 予約</span>
            </div>
            <div className="g-mockup-card">
              <div className="g-mockup-h3">🎂 記念日、お誕生日クーポン</div>
              <div className="g-checkbox-row"><span className="g-checkbox is-on">✓</span><span>有効にする</span></div>
              <div className="g-mockup-label">クーポンタイトル</div>
              <div className="g-mockup-input">お誕生日クーポン 20%OFF</div>
              <div className="g-mockup-label">お祝いメッセージ</div>
              <div className="g-mockup-textarea">お誕生日おめでとうございます🎉 素敵な一年になりますように。</div>
              <div className="g-checkbox-row"><span className="g-checkbox">□</span><span>特別達成クーポンに追加する</span></div>
            </div>
          </div>

          <h2 className="g-h2"><span className="num">7</span>おすすめ設定</h2>
          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr><th>項目</th><th>推奨</th><th>理由</th></tr>
              </thead>
              <tbody>
                <tr><td>配信タイミング</td><td className="yes">当日 9:00</td><td>朝イチで届くと「今日は特別な日」と実感できる</td></tr>
                <tr><td>割引率</td><td className="yes">15〜25%OFF</td><td>通常より手厚く、特別感を演出</td></tr>
                <tr><td>有効期限</td><td className="yes">30日程度</td><td>当日来られない人も多いため</td></tr>
                <tr><td>メッセージ</td><td className="yes">お客様名を入れる</td><td>パーソナル感で特別感アップ</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="g-h2"><span className="num">8</span>業種別の活用例</h2>
          <div className="g-grid">
            <Link href="/guide/cafe" className="g-card"><span className="g-card-icon">☕</span><h4>飲食店・カフェ</h4><p>「バースデーデザート無料」</p></Link>
            <Link href="/guide/salon" className="g-card"><span className="g-card-icon">💇</span><h4>美容室・サロン</h4><p>「誕生日月は20%OFF」</p></Link>
            <Link href="/guide/massage" className="g-card"><span className="g-card-icon">💆</span><h4>マッサージ</h4><p>「記念日は施術15%OFF」</p></Link>
            <Link href="/guide/sushi" className="g-card"><span className="g-card-icon">🍣</span><h4>寿司店</h4><p>「記念日は乾杯ドリンクサービス」</p></Link>
          </div>

          <div className="g-related">
            <h3>関連機能</h3>
            <div className="g-related-grid">
              <Link href="/guide/features/coupon-dormant" className="g-related-card">
                <span className="ico">💤</span>
                <div><div className="title">休眠復活クーポン</div><div className="sub">離反客を呼び戻す</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/features/coupon-loyalty" className="g-related-card">
                <span className="ico">🏆</span>
                <div><div className="title">特別達成クーポン</div><div className="sub">N回来店で解放</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/themes/birthday" className="g-related-card">
                <span className="ico">🎂</span>
                <div><div className="title">記念日・誕生日の使い方</div><div className="sub">テーマ別ガイド</div></div>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="g-cta">
            <h3>記念日・誕生日を、最高のファン化の機会に</h3>
            <p>年1回の特別な日に、自動でお祝いクーポンを届けましょう。</p>
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

        .g-fraud-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin: 24px 0; }
        .g-fraud-card { position: relative; padding: 24px 20px 20px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 14px; }
        .g-fraud-num { position: absolute; top: -12px; left: 20px; display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: linear-gradient(135deg, #ea580c, #f97316); color: #fff; border-radius: 50%; font-size: 14px; font-weight: 900; border: 3px solid #fff; box-shadow: 0 4px 10px rgba(234,88,12,0.25); }
        .g-fraud-card h4 { font-size: 14px; font-weight: 800; color: #c2410c; margin: 0 0 8px; padding-top: 6px; }
        .g-fraud-card p { font-size: 13px; color: #7c2d12; line-height: 1.8; margin: 0; }

        .g-callout { display: flex; gap: 16px; padding: 20px 24px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 14px; margin: 24px 0; align-items: flex-start; }
        .g-callout .ico { font-size: 22px; flex-shrink: 0; }
        .g-callout strong { display: block; font-size: 15px; color: #c2410c; margin-bottom: 6px; }
        .g-callout p { font-size: 14px; color: #7c2d12; margin: 0; line-height: 1.8; }
        .g-callout p strong { display: inline; color: #ea580c; background: #fff; padding: 2px 6px; border-radius: 4px; }

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
        .g-mockup-label { font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 6px; }
        .g-mockup-input { padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; color: #1e293b; background: #fff; margin-bottom: 14px; }
        .g-mockup-textarea { padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; color: #1e293b; background: #fff; margin-bottom: 14px; min-height: 60px; }
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
        }
      `}</style>
    </>
  );
}
