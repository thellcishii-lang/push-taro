'use client';

import Link from 'next/link';

export default function QrAcquisitionFeature() {
  return (
    <>
      <nav className="g-nav">
        <div className="g-nav-inner">
          <Link href="/" className="logo">
            <svg className="logo-mark" viewBox="0 0 48 48" fill="none">
              <defs>
                <linearGradient id="qrLogoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ff6b6b" />
                  <stop offset="100%" stopColor="#ff4500" />
                </linearGradient>
              </defs>
              <circle cx="24" cy="24" r="23" fill="url(#qrLogoGrad)" />
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
          <span className="current">QRコード顧客獲得</span>
        </div>

        <div className="g-hero">
          <span className="g-badge is-all">全プラン対応</span>
          <h1>📱 QRコード顧客獲得</h1>
          <p>
            店頭POPにQRコードを置くだけで、お客様は<strong>スマホで読み取るだけ</strong>で通知登録が完了。
            アプリのインストール不要で、顧客リストが自動で構築されていきます。
          </p>
        </div>

        <div className="g-content">

          <h2 className="g-h2"><span className="num">1</span>この機能でできること</h2>
          <div className="g-feature-list">
            <div className="g-feature-item"><span className="ico">📱</span><div><strong>アプリ不要で登録完了</strong><p>お客様はブラウザからQRを読み取って「通知を許可」するだけ。</p></div></div>
            <div className="g-feature-item"><span className="ico">🎫</span><div><strong>登録と同時に初回クーポン配布</strong><p>登録完了と同時に、初回限定クーポンが自動配信されます。</p></div></div>
            <div className="g-feature-item"><span className="ico">🏪</span><div><strong>店舗ごとに独立したPWA</strong><p>店舗名・アイコンがホーム画面に追加され、専用アプリのように動作。</p></div></div>
            <div className="g-feature-item"><span className="ico">📊</span><div><strong>登録数の自動集計</strong><p>ダッシュボードで現在の登録者数がいつでも確認できます。</p></div></div>
          </div>

          <h2 className="g-h2"><span className="num">2</span>お客様の登録フロー</h2>
          <div className="g-flow">
            <div className="g-flow-item"><div className="g-flow-circle">1</div><p>QRスキャン</p></div>
            <div className="g-flow-arrow">→</div>
            <div className="g-flow-item"><div className="g-flow-circle is-highlight">2</div><p>iPhoneは<br />ホーム画面追加</p></div>
            <div className="g-flow-arrow">→</div>
            <div className="g-flow-item"><div className="g-flow-circle is-highlight">3</div><p>SMS認証</p></div>
            <div className="g-flow-arrow">→</div>
            <div className="g-flow-item"><div className="g-flow-circle is-success">🎉</div><p>登録完了<br />クーポン配布</p></div>
          </div>

          <div className="g-callout warn">
            <span className="ico">⚠️</span>
            <div>
              <strong>iPhoneは「ホーム画面に追加」が必須</strong>
              <p>iOSの仕様上、Safariの通常タブからではWebプッシュ通知を受け取れません。
              Safari下部の<strong>共有ボタン（□に↑）→「ホーム画面に追加」</strong>をタップし、
              ホーム画面のアイコンから開いて登録する必要があります。<br />
              登録画面には、この手順を自動表示するのでご安心ください。</p>
            </div>
          </div>

          <h2 className="g-h2"><span className="num">3</span>SMS認証について</h2>
          <p className="g-desc">
            Push-taroでは、<strong>不正利用防止のためSMS認証</strong>を採用しています。
            クーポンの使い回しを防ぎ、店舗の貴重なクーポンを守ります。
          </p>
          <div className="g-sms-grid">
            <div className="g-sms-card is-bad">
              <div className="g-sms-badge is-bad">SMS認証なしの場合</div>
              <ul>
                <li>同じ人が何度も登録し直せる</li>
                <li>初回クーポンを何度も使い回せる</li>
                <li>店舗のクーポンが不正消費される</li>
              </ul>
            </div>
            <div className="g-sms-card is-good">
              <div className="g-sms-badge is-good">SMS認証ありの場合</div>
              <ul>
                <li>電話番号1つにつき<strong>1回のみ</strong>登録可能</li>
                <li>初回クーポンの使い回しを完全ブロック</li>
                <li>お客様は安心してご利用いただける</li>
              </ul>
            </div>
          </div>

          <h2 className="g-h2"><span className="num">4</span>設定手順</h2>
          <div className="g-steps">
            <div className="g-step">
              <div className="g-step-body">
                <h4>「🏪 店舗・基本クーポン」タブを開く</h4>
                <p>店舗名とアイコンを設定し、「💾 基本設定を保存」をタップ。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>QRコードをダウンロード or 印刷</h4>
                <p>画面に表示されるQRコードを、POPに印刷して店頭に設置。</p>
              </div>
            </div>
            <div class="g-step">
              <div className="g-step-body">
                <h4>初回クーポンを設定</h4>
                <p>登録と同時に配布される初回クーポンを有効化。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>店頭POPにQRを設置</h4>
                <p>レジ横・テーブル・鏡前など、目につく場所に複数設置がおすすめ。</p>
              </div>
            </div>
          </div>

          <h2 className="g-h2"><span className="num">5</span>画面イメージ</h2>
          <div className="g-mockup">
            <div className="g-mockup-tabs">
              <span>📢 即時通知</span>
              <span className="is-active">🏪 店舗・基本クーポン</span>
              <span>🔥 PRO機能</span>
              <span>📅 予約</span>
            </div>
            <div className="g-mockup-card">
              <div className="g-mockup-h3">🏪 店舗基本情報 & クーポン設定</div>
              <div className="g-mockup-label">店舗名</div>
              <div className="g-mockup-input">Patisserie Taro</div>
              <div className="g-mockup-label">店舗ID</div>
              <div className="g-mockup-input">example1234567890</div>
              <div className="g-qr-preview">
                <div className="g-qr-box">
                  <div className="g-qr-dots"></div>
                </div>
                <p className="g-qr-caption">📱 スマホで読み取って通知を受け取れます</p>
              </div>
            </div>
          </div>

          <h2 className="g-h2"><span className="num">6</span>QRコード設置のコツ</h2>
          <div className="g-grid">
            <div className="g-card" style={{ cursor: 'default' }}><span className="g-card-icon">📍</span><h4>複数箇所に設置</h4><p>レジ横・テーブル・鏡前・トイレなど、目につく場所に。</p></div>
            <div className="g-card" style={{ cursor: 'default' }}><span className="g-card-icon">🎁</span><h4>特典を明記</h4><p>「登録で10%OFF」など、登録メリットを大きく表示。</p></div>
            <div className="g-card" style={{ cursor: 'default' }}><span className="g-card-icon">📢</span><h4>スタッフの声かけ</h4><p>会計時に「よろしければこちらから」と自然に案内。</p></div>
            <div className="g-card" style={{ cursor: 'default' }}><span className="g-card-icon">⏰</span><h4>タイミング</h4><p>満足度が高い会計直後が最も登録率が高い。</p></div>
          </div>

          <div className="g-related">
            <h3>関連機能</h3>
            <div className="g-related-grid">
              <Link href="/guide/features/coupon-first" className="g-related-card">
                <span className="ico">🎫</span>
                <div><div className="title">初回クーポン</div><div className="sub">登録時の特典</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/themes/new-customer" className="g-related-card">
                <span className="ico">🆕</span>
                <div><div className="title">新規顧客の獲得</div><div className="sub">テーマ別ガイド</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/ng-actions" className="g-related-card">
                <span className="ico">⚠️</span>
                <div><div className="title">NG行為集</div><div className="sub">強引な誘導はNG</div></div>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="g-cta">
            <h3>QRコードで、顧客リストを自動構築</h3>
            <p>店頭POPに置くだけで、お客様が自然に登録してくれます。</p>
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
        .g-badge.is-all { background: #f1f5f9; color: #64748b; }
        .g-hero h1 { font-size: clamp(26px, 3.4vw, 38px); font-weight: 900; color: #0f172a; letter-spacing: -1px; line-height: 1.25; margin: 0 0 14px; }
        .g-hero p { font-size: 15.5px; color: #64748b; line-height: 1.9; margin: 0; }
        .g-hero p strong { color: #0f172a; }
        .g-content { line-height: 1.9; color: #334155; font-size: 15px; }
        .g-h2 { font-size: 22px; font-weight: 900; color: #0f172a; margin: 56px 0 20px; letter-spacing: -0.6px; display: flex; align-items: center; gap: 12px; }
        .g-h2:first-of-type { margin-top: 0; }
        .g-h2 .num { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; border-radius: 10px; font-size: 16px; font-weight: 900; flex-shrink: 0; }
        .g-desc { font-size: 15px; color: #475569; line-height: 1.9; margin-bottom: 20px; }
        .g-desc strong { color: #0f172a; }
        .g-feature-list { display: flex; flex-direction: column; gap: 14px; }
        .g-feature-item { display: flex; gap: 14px; padding: 18px 22px; background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; align-items: flex-start; }
        .g-feature-item .ico { font-size: 28px; flex-shrink: 0; }
        .g-feature-item strong { display: block; font-size: 15px; color: #0f172a; margin-bottom: 4px; font-weight: 800; }
        .g-feature-item p { font-size: 13.5px; color: #64748b; margin: 0; line-height: 1.7; }
        .g-flow { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; padding: 28px 24px; background: #fff; border-radius: 16px; border: 2px solid #bae6fd; margin: 24px 0; }
        .g-flow-item { text-align: center; flex-shrink: 0; }
        .g-flow-circle { width: 72px; height: 72px; border-radius: 50%; background: #f0f9ff; border: 2px solid #0284c7; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 900; color: #0284c7; margin: 0 auto 8px; }
        .g-flow-circle.is-highlight { background: #0284c7; color: #fff; }
        .g-flow-circle.is-success { background: #f0fdf4; border-color: #16a34a; color: #16a34a; font-size: 24px; }
        .g-flow-item p { font-size: 12px; color: #64748b; margin: 0; line-height: 1.5; }
        .g-flow-arrow { color: #0284c7; font-size: 20px; font-weight: 900; }
        .g-callout { display: flex; gap: 16px; padding: 20px 24px; border-radius: 14px; margin: 24px 0; align-items: flex-start; }
        .g-callout.warn { background: #fffbeb; border: 1px solid #fcd34d; }
        .g-callout .ico { font-size: 22px; flex-shrink: 0; }
        .g-callout strong { display: block; font-size: 15px; color: #78350f; margin-bottom: 6px; }
        .g-callout p { font-size: 14px; color: #78350f; margin: 0; line-height: 1.8; }
        .g-callout p strong { display: inline; color: #92400e; background: #fff; padding: 2px 6px; border-radius: 4px; }
        .g-sms-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0; }
        .g-sms-card { padding: 20px; border-radius: 14px; }
        .g-sms-card.is-bad { background: #fef2f2; border: 1px solid #fecaca; }
        .g-sms-card.is-good { background: #f0fdf4; border: 1px solid #86efac; }
        .g-sms-badge { display: inline-block; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 12px; margin-bottom: 12px; color: #fff; }
        .g-sms-badge.is-bad { background: #dc2626; }
        .g-sms-badge.is-good { background: #16a34a; }
        .g-sms-card ul { margin: 0; padding-left: 20px; font-size: 13.5px; line-height: 1.9; }
        .g-sms-card.is-bad ul { color: #7f1d1d; }
        .g-sms-card.is-good ul { color: #14532d; }
        .g-sms-card strong { font-weight: 800; }
        .g-steps { display: flex; flex-direction: column; gap: 20px; margin: 28px 0; counter-reset: gstep; }
        .g-step { display: flex; gap: 20px; align-items: flex-start; }
        .g-step::before { counter-increment: gstep; content: counter(gstep); flex-shrink: 0; width: 44px; height: 44px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; }
        .g-step-body { flex: 1; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; }
        .g-step-body h4 { margin: 0 0 8px; font-size: 15px; font-weight: 800; color: #0f172a; }
        .g-step-body p { margin: 0; font-size: 14px; color: #475569; }
        .g-mockup { background: #fff; border: 2px solid #e2e8f0; border-radius: 16px; padding: 24px; box-shadow: 0 12px 32px rgba(0,0,0,0.06); }
        .g-mockup-tabs { display: flex; gap: 2px; border-bottom: 2px solid #e2e8f0; margin-bottom: 16px; padding-bottom: 4px; overflow-x: auto; }
        .g-mockup-tabs span { font-size: 11px; font-weight: 700; color: #64748b; padding: 8px 12px; white-space: nowrap; }
        .g-mockup-tabs span.is-active { color: #0284c7; border-bottom: 3px solid #0284c7; margin-bottom: -6px; }
        .g-mockup-card { background: #fff; padding: 4px 0; }
        .g-mockup-h3 { font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 14px; }
        .g-mockup-label { font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 6px; }
        .g-mockup-input { padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; color: #1e293b; background: #fff; margin-bottom: 14px; }
        .g-qr-preview { text-align: center; padding: 20px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; margin-top: 16px; }
        .g-qr-box { display: inline-block; width: 180px; height: 180px; background: repeating-linear-gradient(45deg, #0f172a, #0f172a 10px, #fff 10px, #fff 20px); border-radius: 8px; margin-bottom: 10px; }
        .g-qr-caption { font-size: 12px; color: #64748b; margin: 0; }
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
          .g-sms-grid { grid-template-columns: 1fr; }
          .g-flow-arrow { display: none; }
        }
      `}</style>
    </>
  );
}
