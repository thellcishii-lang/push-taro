'use client';

import Link from 'next/link';

export default function TorisetsuBasic() {
  return (
    <>
      <nav className="t-nav">
        <div className="t-nav-inner">
          <Link href="/torisetsu" className="t-back">← 取扱説明書TOP</Link>
          <span className="t-nav-title">LIGHT / STANDARD 版</span>
        </div>
      </nav>

      <main className="t-main">
        <div className="t-hero">
          <span className="t-badge">LIGHT / STANDARD</span>
          <h1>LIGHT / STANDARDプラン<br />取扱説明書</h1>
          <p>店舗オーナー様向けの操作を、実際の画面で図解します。</p>
        </div>

        {/* 全体像 */}
        <section className="t-section">
          <div className="t-sec-head">
            <span className="t-sec-num">0</span>
            <h2>このプランでできること</h2>
          </div>
          <div className="t-flow">
            <div className="t-flow-item"><div className="t-flow-icon">🔐</div><div className="t-flow-label">ログイン</div></div>
            <div className="t-flow-arrow">→</div>
            <div className="t-flow-item"><div className="t-flow-icon">🎫</div><div className="t-flow-label">クーポン設定</div></div>
            <div className="t-flow-arrow">→</div>
            <div className="t-flow-item"><div className="t-flow-icon">📱</div><div className="t-flow-label">QR配布</div></div>
            <div className="t-flow-arrow">→</div>
            <div className="t-flow-item"><div className="t-flow-icon">📢</div><div className="t-flow-label">通知送信</div></div>
            <div className="t-flow-arrow">→</div>
            <div className="t-flow-item"><div className="t-flow-icon">✅</div><div className="t-flow-label">消込</div></div>
          </div>
        </section>

        {/* Step 1: ログイン */}
        <section className="t-section">
          <div className="t-sec-head">
            <span className="t-sec-num">1</span>
            <h2>ログインする</h2>
          </div>
          <p className="t-desc">ブラウザで <code>/shop</code> を開き、登録時のメールアドレスとパスワードを入力します。</p>
          <div className="t-mockup-row">
            <div className="t-mockup">
              <div className="t-mockup-top">
                <div className="t-mockup-circle">🍰</div>
                <div className="t-mockup-h1">Push-taro</div>
                <div className="t-mockup-sub">オーナー専用ログイン画面</div>
              </div>
              <div className="t-mockup-input">✉️ メールアドレス</div>
              <div className="t-mockup-input">🔑 パスワード</div>
              <div className="t-mockup-btn">ログイン</div>
              <span className="t-mockup-anno" style={{ top: '58%', left: '-10px' }}>①</span>
              <span className="t-mockup-anno" style={{ top: '72%', left: '-10px' }}>②</span>
              <span className="t-mockup-anno" style={{ top: '87%', left: '-10px' }}>③</span>
            </div>
            <div className="t-annos">
              <div className="t-anno"><span className="t-anno-num">①</span>登録時のメールアドレス</div>
              <div className="t-anno"><span className="t-anno-num">②</span>登録時のパスワード</div>
              <div className="t-anno"><span className="t-anno-num">③</span>ログインボタン</div>
            </div>
          </div>
        </section>

        {/* Step 2: 通知送信 */}
        <section className="t-section">
          <div className="t-sec-head">
            <span className="t-sec-num">2</span>
            <h2>プッシュ通知を送る</h2>
          </div>
          <p className="t-desc">「📢 即時通知・消し込み」タブから、タイトル・本文を入力して送信ボタンを押すだけです。</p>
          <div className="t-mockup-row">
            <div className="t-mockup">
              <div className="t-mockup-tabs">
                <span className="is-active">📢 即時通知</span>
                <span>🏪 店舗設定</span>
              </div>
              <div className="t-mockup-card">
                <div className="t-mockup-h3">📢 プッシュ通知を作成</div>
                <div className="t-mockup-label">タイトル</div>
                <div className="t-mockup-input">例: 新着セールのお知らせ</div>
                <div className="t-mockup-label">本文</div>
                <div className="t-mockup-textarea">例: 本日から全品20%OFF！</div>
                <div className="t-mockup-btn">🔥 Push 通知送信</div>
              </div>
              <span className="t-mockup-anno" style={{ top: '38%', left: '-10px' }}>①</span>
              <span className="t-mockup-anno" style={{ top: '58%', left: '-10px' }}>②</span>
              <span className="t-mockup-anno" style={{ top: '82%', left: '-10px' }}>③</span>
            </div>
            <div className="t-annos">
              <div className="t-anno"><span className="t-anno-num">①</span>通知のタイトル（30文字以内推奨）</div>
              <div className="t-anno"><span className="t-anno-num">②</span>通知の本文（伝えたい内容）</div>
              <div className="t-anno"><span className="t-anno-num">③</span>タップで送信</div>
              <div className="t-anno-note">💡 画像付き通知も送りたい場合は、画像URLを本文と一緒に送ることができます</div>
            </div>
          </div>
        </section>

        {/* Step 3: 消込 */}
        <section className="t-section">
          <div className="t-sec-head">
            <span className="t-sec-num">3</span>
            <h2>クーポンを消し込む</h2>
          </div>
          <p className="t-desc">お客様が提示したQRコードを、スマホのカメラでスキャンするだけで消込完了です。</p>
          <div className="t-mockup-row">
            <div className="t-mockup">
              <div className="t-mockup-btn is-green" style={{ marginBottom: '16px' }}>📷 クーポンQRコードを読み取る</div>
              <div className="t-mockup-scan">
                <div className="t-scan-frame">
                  <div className="t-scan-corner tl"></div>
                  <div className="t-scan-corner tr"></div>
                  <div className="t-scan-corner bl"></div>
                  <div className="t-scan-corner br"></div>
                </div>
              </div>
              <div className="t-mockup-success">✅ 消し込み完了！<br />【初回クーポン】を適用</div>
              <span className="t-mockup-anno" style={{ top: '8%', left: '-10px' }}>①</span>
              <span className="t-mockup-anno" style={{ top: '40%', left: '-10px' }}>②</span>
              <span className="t-mockup-anno" style={{ top: '78%', left: '-10px' }}>③</span>
            </div>
            <div className="t-annos">
              <div className="t-anno"><span className="t-anno-num">①</span>緑のボタンをタップ</div>
              <div className="t-anno"><span className="t-anno-num">②</span>お客様のQRコードを枠内に収める</div>
              <div className="t-anno"><span className="t-anno-num">③</span>自動で消込完了</div>
              <div className="t-anno-note">💡 二重利用は自動でブロックされます</div>
            </div>
          </div>
        </section>

        {/* Step 4: クーポン設定 */}
        <section className="t-section">
          <div className="t-sec-head">
            <span className="t-sec-num">4</span>
            <h2>クーポンを設定する</h2>
          </div>
          <p className="t-desc">「🏪 店舗・基本クーポン」タブで、各種クーポンを設定できます。</p>

          <div className="t-coupon-grid">
            <div className="t-coupon-card">
              <div className="t-coupon-head">
                <span className="t-coupon-badge is-all">全プラン</span>
                <h4>🎫 初回クーポン</h4>
              </div>
              <p>通知登録したお客様に自動配布される初回特典。登録と同時に配信されます。</p>
              <div className="t-coupon-setting">
                <div className="t-setting-row"><span>タイトル</span><strong>初回10%OFF</strong></div>
                <div className="t-setting-row"><span>説明文</span><strong>次回ご来店時に使えます</strong></div>
              </div>
            </div>

            <div className="t-coupon-card">
              <div className="t-coupon-head">
                <span className="t-coupon-badge is-std">STANDARD+</span>
                <h4>🎟️ 通常クーポン</h4>
              </div>
              <p>登録者全員が何度でも使える常設クーポン。LINE公式の「友だち特典」と同じ役割です。</p>
              <div className="t-coupon-setting">
                <div className="t-setting-row"><span>タイトル</span><strong>会員様10%OFF</strong></div>
                <div className="t-setting-row"><span>有効期限</span><strong>2026-12-31</strong></div>
              </div>
            </div>

            <div className="t-coupon-card">
              <div className="t-coupon-head">
                <span className="t-coupon-badge is-std">STANDARD+</span>
                <h4>🏆 特別達成クーポン</h4>
              </div>
              <p>累計N回来店で解放される特別報酬。ポイントカードのデジタル版です。</p>
              <div className="t-coupon-setting">
                <div className="t-setting-row"><span>達成回数</span><strong>3回</strong></div>
                <div className="t-setting-row"><span>特典</span><strong>20%OFF</strong></div>
              </div>
            </div>
          </div>

          <div className="t-callout">
            <span className="t-callout-icon">💡</span>
            <div>
              <strong>クーポンの設定手順</strong>
              <ol>
                <li>「🏪 店舗・基本クーポン」タブを開く</li>
                <li>使いたいクーポンの「有効にする」にチェック</li>
                <li>タイトル・説明文・有効期限を入力</li>
                <li>「💾 基本設定を保存」をタップ</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Step 5: 顧客側の画面 */}
        <section className="t-section">
          <div className="t-sec-head">
            <span className="t-sec-num">5</span>
            <h2>お客様側の画面</h2>
          </div>
          <p className="t-desc">お客様はQRコードを読み取るだけで、クーポン付きの専用画面が開きます。</p>
          <div className="t-mockup-row">
            <div className="t-mockup">
              <div className="t-mockup-shop-icon">🍰</div>
              <div className="t-mockup-h2">Patisserie Taro</div>
              <div className="t-mockup-link-btn">🌐 サイトはこちらから</div>
              <div className="t-coupon-preview is-orange">
                <span className="t-cp-badge">初回限定</span>
                <div className="t-cp-title">🎁 初回限定クーポン</div>
                <div className="t-cp-qr"></div>
                <div className="t-cp-note">会計時にQRを提示</div>
              </div>
              <span className="t-mockup-anno" style={{ top: '12%', left: '-10px' }}>①</span>
              <span className="t-mockup-anno" style={{ top: '32%', left: '-10px' }}>②</span>
              <span className="t-mockup-anno" style={{ top: '68%', left: '-10px' }}>③</span>
            </div>
            <div className="t-annos">
              <div className="t-anno"><span className="t-anno-num">①</span>店舗ロゴと店舗名</div>
              <div className="t-anno"><span className="t-anno-num">②</span>店舗サイトへのリンク（任意）</div>
              <div className="t-anno"><span className="t-anno-num">③</span>利用可能なクーポンとQRコード</div>
              <div className="t-anno-note">💡 クーポンは自動的に最新状態に更新されます</div>
            </div>
          </div>
        </section>

        {/* Step 6: アップグレード */}
        <section className="t-section">
          <div className="t-sec-head">
            <span className="t-sec-num">6</span>
            <h2>PROプランへアップグレード</h2>
          </div>
          <p className="t-desc">「📢 即時通知」タブ上部の「プラン比較・変更」ボタンから、PROプランへ変更できます。</p>
          <div className="t-upgrade-box">
            <div className="t-upgrade-icon">🚀</div>
            <div className="t-upgrade-text">
              <strong>PROプランでできること</strong>
              <ul>
                <li>配信無制限（LIGHT 5,000 / STANDARD 15,000 の上限解除）</li>
                <li>ステップアップ・連続・誕生日・休眠復活クーポン</li>
                <li>予約配信・定期配信</li>
                <li>紹介報酬制度（毎月10%還元）</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 関連リンク */}
        <div className="t-related">
          <h3>関連ページ</h3>
          <div className="t-related-grid">
            <Link href="/torisetsu/pro" className="t-related-card">
              <span className="ico">🔥</span>
              <div><div className="title">PROプラン取扱説明書</div><div className="sub">全機能の使い方</div></div>
              <span className="arrow">→</span>
            </Link>
            <Link href="/guide" className="t-related-card">
              <span className="ico">📚</span>
              <div><div className="title">業種別 活用ガイド</div><div className="sub">業種ごとの運用ノウハウ</div></div>
              <span className="arrow">→</span>
            </Link>
          </div>
        </div>

        <div className="t-cta">
          <h3>困ったときは</h3>
          <p>操作で分からないことがあれば、お気軽にお問い合わせください。</p>
          <a href="mailto:pushtaro-info@gmail.com" className="t-cta-btn">お問い合わせ →</a>
        </div>
      </main>

      <style jsx global>{`
        .t-nav { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid #e2e8f0; }
        .t-nav-inner { max-width: 960px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; }
        .t-back { font-size: 13px; font-weight: 700; color: #64748b; text-decoration: none; }
        .t-back:hover { color: #ff4500; }
        .t-nav-title { font-size: 13px; font-weight: 800; color: #0f172a; }

        .t-main { max-width: 960px; margin: 0 auto; padding: 40px 24px 80px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans JP", sans-serif; }

        .t-hero { text-align: center; margin-bottom: 56px; padding-bottom: 40px; border-bottom: 1px solid #e2e8f0; }
        .t-badge { display: inline-block; font-size: 11px; font-weight: 800; letter-spacing: 1.2px; color: #0284c7; background: #e0f2fe; padding: 6px 16px; border-radius: 20px; margin-bottom: 20px; }
        .t-hero h1 { font-size: clamp(26px, 3.6vw, 40px); font-weight: 900; color: #0f172a; letter-spacing: -1px; margin: 0 0 14px; line-height: 1.25; }
        .t-hero p { font-size: 15px; color: #64748b; margin: 0; }

        .t-section { margin-bottom: 72px; }
        .t-sec-head { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
        .t-sec-num { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; border-radius: 12px; font-size: 20px; font-weight: 900; box-shadow: 0 6px 16px rgba(255,69,0,0.25); flex-shrink: 0; }
        .t-sec-head h2 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -0.6px; }
        .t-desc { font-size: 15px; color: #475569; line-height: 1.9; margin-bottom: 28px; }
        .t-desc code { background: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-family: monospace; font-size: 13px; color: #dc2626; }

        /* Flow */
        .t-flow { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; padding: 24px; background: linear-gradient(135deg, #f8fafc, #eef2f7); border-radius: 16px; border: 1px solid #e2e8f0; }
        .t-flow-item { text-align: center; flex-shrink: 0; }
        .t-flow-icon { font-size: 28px; margin-bottom: 6px; }
        .t-flow-label { font-size: 12px; font-weight: 700; color: #334155; }
        .t-flow-arrow { color: #ff4500; font-size: 20px; font-weight: 900; }

        /* Mockup */
        .t-mockup-row { display: grid; grid-template-columns: 320px 1fr; gap: 32px; align-items: start; }
        @media (max-width: 768px) { .t-mockup-row { grid-template-columns: 1fr; } }
        .t-mockup { position: relative; background: #fff; border: 2px solid #e2e8f0; border-radius: 20px; padding: 24px; box-shadow: 0 12px 32px rgba(0,0,0,0.06); }
        .t-mockup-top { text-align: center; margin-bottom: 20px; }
        .t-mockup-circle { font-size: 40px; margin-bottom: 8px; }
        .t-mockup-h1 { font-size: 18px; font-weight: 900; color: #0f172a; }
        .t-mockup-h2 { font-size: 16px; font-weight: 900; color: #0f172a; text-align: center; margin-bottom: 12px; }
        .t-mockup-h3 { font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 14px; }
        .t-mockup-sub { font-size: 11px; color: #64748b; margin-top: 4px; }
        .t-mockup-shop-icon { width: 64px; height: 64px; background: linear-gradient(135deg, #ff6b6b, #ff4500); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 12px; }
        .t-mockup-tabs { display: flex; gap: 4px; border-bottom: 2px solid #e2e8f0; margin-bottom: 16px; padding-bottom: 4px; }
        .t-mockup-tabs span { font-size: 11px; font-weight: 700; color: #64748b; padding: 6px 10px; }
        .t-mockup-tabs span.is-active { color: #ff4500; border-bottom: 3px solid #ff4500; margin-bottom: -6px; }
        .t-mockup-label { font-size: 11px; font-weight: 700; color: #334155; margin-bottom: 4px; }
        .t-mockup-input { padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; color: #94a3b8; background: #f8fafc; margin-bottom: 12px; }
        .t-mockup-textarea { padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; color: #94a3b8; background: #f8fafc; margin-bottom: 12px; min-height: 60px; }
        .t-mockup-btn { padding: 12px; background: #ff4500; color: #fff; border-radius: 8px; text-align: center; font-weight: 800; font-size: 14px; }
        .t-mockup-btn.is-green { background: #16a34a; }
        .t-mockup-card { background: #fff; padding: 14px; border-radius: 10px; border: 1px solid #e0e0e0; }
        .t-mockup-scan { background: #1e293b; border-radius: 12px; padding: 32px; margin-bottom: 16px; display: flex; justify-content: center; align-items: center; min-height: 160px; }
        .t-scan-frame { position: relative; width: 100px; height: 100px; }
        .t-scan-corner { position: absolute; width: 20px; height: 20px; border: 3px solid #22c55e; }
        .t-scan-corner.tl { top: 0; left: 0; border-right: none; border-bottom: none; border-radius: 8px 0 0 0; }
        .t-scan-corner.tr { top: 0; right: 0; border-left: none; border-bottom: none; border-radius: 0 8px 0 0; }
        .t-scan-corner.bl { bottom: 0; left: 0; border-right: none; border-top: none; border-radius: 0 0 0 8px; }
        .t-scan-corner.br { bottom: 0; right: 0; border-left: none; border-top: none; border-radius: 0 0 8px 0; }
        .t-mockup-success { padding: 14px; background: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; color: #15803d; font-weight: 800; font-size: 13px; text-align: center; }
        .t-mockup-link-btn { display: block; text-align: center; padding: 10px; background: #2563eb; color: #fff; border-radius: 6px; font-weight: 700; font-size: 12px; margin-bottom: 16px; }

        .t-mockup-anno { position: absolute; display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; background: #ff4500; color: #fff; border-radius: 50%; font-size: 12px; font-weight: 900; box-shadow: 0 4px 10px rgba(255,69,0,0.4); border: 2px solid #fff; }

        .t-annos { display: flex; flex-direction: column; gap: 12px; padding-top: 8px; }
        .t-anno { display: flex; align-items: flex-start; gap: 12px; font-size: 14px; color: #334155; line-height: 1.7; }
        .t-anno-num { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; background: #ff4500; color: #fff; border-radius: 50%; font-size: 12px; font-weight: 900; flex-shrink: 0; }
        .t-anno-note { font-size: 13px; color: #475569; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 10px; padding: 12px 16px; margin-top: 8px; line-height: 1.7; }

        /* Coupons */
        .t-coupon-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-bottom: 24px; }
        .t-coupon-card { background: #fff; border: 2px solid #e2e8f0; border-radius: 16px; padding: 22px; }
        .t-coupon-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
        .t-coupon-head h4 { margin: 0; font-size: 15px; font-weight: 800; color: #0f172a; }
        .t-coupon-badge { font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 10px; letter-spacing: 0.3px; }
        .t-coupon-badge.is-all { background: #fef3c7; color: #92400e; }
        .t-coupon-badge.is-std { background: #dbeafe; color: #1e40af; }
        .t-coupon-card p { font-size: 13px; color: #64748b; line-height: 1.75; margin: 0 0 14px; }
        .t-coupon-setting { background: #f8fafc; border-radius: 8px; padding: 12px; border: 1px solid #e2e8f0; }
        .t-setting-row { display: flex; justify-content: space-between; gap: 8px; padding: 4px 0; font-size: 12px; }
        .t-setting-row span { color: #64748b; }
        .t-setting-row strong { color: #0f172a; font-weight: 800; }

        .t-callout { background: #ebf8ff; border: 1px solid #90cdf4; border-radius: 14px; padding: 20px 24px; display: flex; gap: 16px; align-items: flex-start; }
        .t-callout-icon { font-size: 22px; flex-shrink: 0; }
        .t-callout strong { display: block; font-size: 15px; color: #2c5282; margin-bottom: 8px; }
        .t-callout ol { margin: 0; padding-left: 20px; font-size: 14px; color: #2c5282; line-height: 1.9; }

        /* Coupon Preview */
        .t-coupon-preview { border-radius: 10px; padding: 14px; text-align: center; margin-bottom: 8px; }
        .t-coupon-preview.is-orange { background: #fff3e0; border: 1px dashed #ffb74d; }
        .t-cp-badge { display: inline-block; font-size: 10px; background: #e65100; color: #fff; padding: 2px 8px; border-radius: 10px; font-weight: 800; margin-bottom: 6px; }
        .t-cp-title { font-size: 13px; font-weight: 800; color: #e65100; margin-bottom: 10px; }
        .t-cp-qr { width: 100px; height: 100px; background: repeating-linear-gradient(45deg, #0f172a, #0f172a 8px, #fff 8px, #fff 16px); border-radius: 6px; margin: 0 auto 8px; }
        .t-cp-note { font-size: 10px; color: #888; }

        /* Upgrade */
        .t-upgrade-box { display: flex; gap: 20px; padding: 28px; background: linear-gradient(135deg, #fff7ed, #fffbeb); border: 2px solid #ff4500; border-radius: 16px; align-items: flex-start; }
        .t-upgrade-icon { font-size: 48px; flex-shrink: 0; }
        .t-upgrade-text strong { display: block; font-size: 16px; color: #c2410c; margin-bottom: 12px; }
        .t-upgrade-text ul { margin: 0; padding-left: 20px; font-size: 14px; color: #7c2d12; line-height: 1.9; }

        /* Related */
        .t-related { margin-top: 64px; padding-top: 32px; border-top: 2px solid #e2e8f0; }
        .t-related h3 { font-size: 13px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #64748b; margin: 0 0 20px; }
        .t-related-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
        .t-related-card { display: flex; align-items: center; gap: 12px; padding: 16px 18px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; text-decoration: none; color: inherit; transition: all 0.2s; }
        .t-related-card:hover { border-color: #ff4500; transform: translateX(4px); }
        .t-related-card .ico { font-size: 24px; flex-shrink: 0; }
        .t-related-card .title { font-size: 14px; font-weight: 800; color: #0f172a; line-height: 1.3; }
        .t-related-card .sub { font-size: 11.5px; color: #64748b; margin-top: 2px; }
        .t-related-card .arrow { color: #ff4500; font-size: 16px; font-weight: 900; margin-left: auto; }

        /* CTA */
        .t-cta { margin-top: 48px; padding: 40px 32px; background: linear-gradient(160deg, #0f172a, #1e293b); color: #fff; border-radius: 20px; text-align: center; }
        .t-cta h3 { font-size: 20px; font-weight: 900; margin: 0 0 10px; }
        .t-cta p { font-size: 14px; color: #94a3b8; margin: 0 0 20px; }
        .t-cta-btn { display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; border-radius: 10px; font-weight: 800; font-size: 14px; text-decoration: none; box-shadow: 0 6px 20px rgba(255,69,0,0.3); }

        @media (max-width: 640px) {
          .t-main { padding: 24px 16px 60px; }
          .t-sec-head h2 { font-size: 20px; }
          .t-flow { gap: 8px; }
          .t-flow-arrow { display: none; }
          .t-upgrade-box { flex-direction: column; }
          .t-cta { padding: 32px 24px; }
        }
      `}</style>
    </>
  );
}
