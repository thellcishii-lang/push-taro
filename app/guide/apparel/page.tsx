'use client';

import Link from 'next/link';

export default function ApparelGuidePage() {
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
          <span className="current">アパレル・雑貨</span>
        </div>

        <div className="g-hero">
          <span className="g-badge">👕 アパレル・雑貨向け</span>
          <h1>アパレル・雑貨店のための<br />Push-taro活用ガイド</h1>
          <p>
            アパレル・雑貨店は<strong>「新商品」と「セール」のタイミング</strong>が売上を左右します。
            固定ファンに確実に情報を届け、買い逃しを防ぐ仕組みを解説します。
          </p>
        </div>

        <div className="g-content">

          <h2><span className="num">1</span>アパレル・雑貨が抱える3つの課題</h2>
          <div className="g-grid">
            <div className="g-card-simple">
              <div className="g-icon-big">📱</div>
              <h4>SNSでは届かない</h4>
              <p>Instagram投稿は<strong>フォロワーの5%</strong>にしか届かない。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">🛒</div>
              <h4>買い逃しが多い</h4>
              <p>「あの商品、欲しかったのに売り切れ」という<strong>機会損失</strong>。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">🍂</div>
              <h4>季節変動が大きい</h4>
              <p>季節の変わり目に<strong>売上が乱高下</strong>する。</p>
            </div>
          </div>

          <div className="g-callout info">
            <span className="ico">💡</span>
            <div>
              <p><strong>アパレルは「タイミング」が命</strong></p>
              <p>「新作が入荷した瞬間」「セールが始まる瞬間」に、固定ファンに届けられるかどうかが売上を左右します。</p>
            </div>
          </div>

          <h2><span className="num">2</span>固定ファンを育てる仕組み</h2>
          <p>
            アパレル・雑貨店は、<strong>「リピーター」と「新規」の両方</strong>を大切にする業種。
            それぞれに最適なアプローチを自動化しましょう。
          </p>

          <div className="g-diagram">
            <div className="g-flow">
              <div className="g-flow-item">
                <div className="g-flow-circle">来店</div>
                <p>初回購入</p>
              </div>
              <div className="g-flow-arrow">→</div>
              <div className="g-flow-item">
                <div className="g-flow-circle">連続</div>
                <p>次回クーポン<br />配信</p>
              </div>
              <div className="g-flow-arrow">→</div>
              <div className="g-flow-item">
                <div className="g-flow-circle highlight">新作告知</div>
                <p>買い逃し<br />防止</p>
              </div>
              <div class="g-flow-arrow">→</div>
              <div className="g-flow-item">
                <div className="g-flow-circle success">🎉 ファン化</div>
                <p>リピート</p>
              </div>
            </div>
          </div>

          <h2><span className="num">3</span>アパレル・雑貨向け 運用フロー</h2>
          <div className="g-steps">
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 1：QRコードで顧客を獲得</h4>
                <p>お会計時にQRコードを案内。次回使えるクーポンと引き換えに登録。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 2：新商品入荷を画像付きで配信</h4>
                <p>新作入荷のタイミングで、画像付き通知を配信。「見たい」を刺激。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 3：セール開始を即時配信</h4>
                <p>セール開始と同時に配信。固定ファンの買い逃しを防止。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 4：季節キャンペーンで来店動機</h4>
                <p>春の新生活、秋の衣替えなど、季節ごとのキャンペーンで来店動機を。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 5：休眠顧客の呼び戻し</h4>
                <p>60日以上来店が無い顧客には、特別な復帰クーポンを配信。</p>
              </div>
            </div>
          </div>

          <h2><span className="num">4</span>アパレル・雑貨で推奨するクーポン設計</h2>
          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr><th>クーポン種別</th><th>目的</th><th>推奨設定</th></tr>
              </thead>
              <tbody>
                <tr><td>🎫 初回限定</td><td>新規顧客獲得</td><td>初回10%OFF</td></tr>
                <tr><td>🔄 連続</td><td>2回目来店</td><td>30日後の10%OFF</td></tr>
                <tr><td>👕 新作限定</td><td>新商品購入促進</td><td>新作のみ10%OFF</td></tr>
                <tr><td>🎂 誕生日</td><td>特別感</td><td>誕生日月15%OFF</td></tr>
                <tr><td>💤 休眠復活</td><td>離反防止</td><td>90日未来店で20%OFF</td></tr>
                <tr><td>🍂 季節セール</td><td>季節変動の緩和</td><td>シーズン切り替え時に</td></tr>
              </tbody>
            </table>
          </div>

          <h2><span className="num">5</span>アパレル・雑貨向け 活用アイデア</h2>
          <div className="g-grid">
            <div className="g-card-simple"><div className="g-icon-big">🆕</div><h4>新作入荷</h4><p>入荷と同時に画像付き配信。買い逃しを防止。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">🔥</div><h4>セール開始</h4><p>セール開始と同時に配信。売り上げを最大化。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">🎁</div><h4>限定アイテム</h4><p>Push-taro登録者限定の商品を配信。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">📸</div><h4>着こなし提案</h4><p>コーディネート写真を配信。購買意欲を刺激。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">🍂</div><h4>季節キャンペーン</h4><p>衣替えシーズンの特典で来店動機を。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">💝</div><h4>ギフト特集</h4><p>母の日・父の日など、ギフト需要を狙う。</p></div>
          </div>

          <h2><span className="num">6</span>導入事例</h2>
          <div className="g-card">
            <h4>📍 東京都 セレクトショップ A様</h4>
            <p style={{ marginBottom: 12 }}>
              <strong>導入前：</strong>新作売上 月50万円<br />
              <strong>導入後：</strong>新作売上 月<strong style={{ color: '#16a34a' }}>120万円</strong>
            </p>
            <p>新作入荷を画像付き通知で配信することで、発売初週の売上が大幅アップ。買い逃しが減少。</p>
          </div>

          <div className="g-card">
            <h4>📍 大阪府 雑貨店 B様</h4>
            <p style={{ marginBottom: 12 }}>
              <strong>導入前：</strong>リピート率 20%<br />
              <strong>導入後：</strong>リピート率 <strong style={{ color: '#16a34a' }}>48%</strong>
            </p>
            <p>連続クーポンと季節キャンペーンで、定期的に来店する顧客が増加。売上が安定。</p>
          </div>

          <div className="g-related">
            <h3>関連ガイド</h3>
            <div className="g-related-grid">
              <Link href="/guide/themes/new-customer" className="g-related-card">
                <span className="ico">🆕</span>
                <div><div className="title">新規顧客の獲得</div><div className="sub">テーマ別ガイド</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/cafe" className="g-related-card">
                <span className="ico">☕</span>
                <div><div className="title">飲食店・カフェ向け</div><div className="sub">業種別ガイド</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/ng-actions" className="g-related-card">
                <span className="ico">⚠️</span>
                <div><div className="title">NG行為集</div><div className="sub">炎上を避ける</div></div>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="g-cta">
            <h3>アパレル・雑貨の売上を、仕組みに。</h3>
            <p>新作告知・セール配信・リピート施策のすべてを、Push-taroで。</p>
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
