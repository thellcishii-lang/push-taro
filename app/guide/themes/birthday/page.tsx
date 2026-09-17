'use client';

import Link from 'next/link';

export default function BirthdayPage() {
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
          <span className="current">誕生日クーポン</span>
        </div>

        <div className="g-hero">
          <span className="g-badge">🎂 テーマ別ガイド</span>
          <h1>誕生日を、<br />最高のファン化の機会に。</h1>
          <p>
            誕生日は、お客様にとって<strong>1年に一度の特別な日</strong>。
            その日に「お店からお祝いの通知が届く」体験は、強い印象と愛着を生みます。
          </p>
        </div>

        <div className="g-content">

          <h2><span className="num">1</span>なぜ誕生日クーポンが効くのか</h2>

          <div className="g-grid">
            <div className="g-card-simple">
              <div className="g-icon-big">🎁</div>
              <h4>特別感が強い</h4>
              <p>他のクーポンと違い、<strong>自分だけ</strong>に向けた特典。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">💝</div>
              <h4>感情を動かす</h4>
              <p>「祝ってもらえた」という感情が、店舗への愛着に。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">📈</div>
              <h4>休眠防止になる</h4>
              <p>誕生日を機に、しばらく来ていなかった顧客も再来店。</p>
            </div>
          </div>

          <div className="g-callout info">
            <span className="ico">💡</span>
            <div>
              <p><strong>誕生日クーポンの反応率は、通常クーポンの3〜5倍</strong></p>
              <p>「自分だけに向けた特別な特典」は、それだけ強い動機になるのです。</p>
            </div>
          </div>

          <h2><span className="num">2</span>Push-taroの誕生日クーポン</h2>

          <div className="g-steps">
            <div className="g-step">
              <div className="g-step-body">
                <h4>顧客の生年月日を登録</h4>
                <p>初回登録時に、生年月日を任意で入力してもらう。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>誕生日当日に自動配信</h4>
                <p>Cronが毎日チェックし、誕生日の顧客に自動で通知を送信。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>お祝いメッセージ＋クーポン</h4>
                <p>「お誕生日おめでとうございます」のメッセージと、特別クーポンを配信。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>来店で消込</h4>
                <p>QRコードを提示してもらい、クーポンを使用。特別な体験を提供。</p>
              </div>
            </div>
          </div>

          <h2><span className="num">3</span>誕生日クーポンの設計</h2>

          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr>
                  <th>項目</th>
                  <th>推奨設定</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>配信タイミング</td><td className="yes">誕生日当日 9:00</td></tr>
                <tr><td>有効期限</td><td className="yes">誕生日から30日間</td></tr>
                <tr><td>割引率</td><td className="yes">15〜25%OFF</td></tr>
                <tr><td>特典内容</td><td className="yes">通常と異なる特別なもの</td></tr>
                <tr><td>メッセージ</td><td className="yes">お客様の名前を入れる</td></tr>
              </tbody>
            </table>
          </div>

          <h2><span className="num">4</span>誕生日クーポンのコツ</h2>

          <div className="g-grid">
            <div className="g-card-simple">
              <div className="g-icon-big">🎉</div>
              <h4>お祝いの言葉を添える</h4>
              <p>「おめでとうございます」の一言が、心を動かす。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">⏰</div>
              <h4>有効期限は長めに</h4>
              <p>当日来られない人も多い。30日程度がベスト。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">🎁</div>
              <h4>特典を豪華に</h4>
              <p>通常クーポンより手厚く。「特別な日」を演出。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">📊</div>
              <h4>効果測定</h4>
              <p>誕生日クーポンの来店率をチェック。</p>
            </div>
          </div>

          <div className="g-callout warn">
            <span className="ico">⚠️</span>
            <div>
              <p><strong>生年月日の取得は任意で</strong></p>
              <p>「生年月日を入力してください」を強制すると、登録率が下がります。<strong>任意項目</strong>にして、「入力すると誕生日クーポンがもらえます」とメリットを提示しましょう。</p>
            </div>
          </div>

          <h2><span className="num">5</span>活用アイデア</h2>

          <div className="g-grid">
            <div className="g-card-simple"><div className="g-icon-big">💐</div><h4>誕生日月の特別メニュー</h4><p>「バースデーデザート無料」など。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">👥</div><h4>お連れ様も割引</h4><p>「お連れ様も10%OFF」。グループ需要を狙う。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">📸</div><h4>記念撮影サービス</h4><p>「誕生日限定、記念写真プレゼント」。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">🎁</div><h4>ポイント2倍</h4><p>誕生日月はポイント2倍。来店動機に。</p></div>
          </div>

          <h2><span className="num">6</span>導入事例</h2>

          <div className="g-card">
            <h4>📍 東京都 エステサロン A様</h4>
            <p style={{ marginBottom: 12 }}>
              <strong>誕生日クーポン来店率：</strong><strong style={{ color: '#16a34a' }}>68%</strong>
            </p>
            <p>「誕生日月に特別クーポン」を配信することで、普段来ない顧客も来店。特別感がファン化を加速。</p>
          </div>

          <div className="g-card">
            <h4>📍 大阪府 カフェ B様</h4>
            <p style={{ marginBottom: 12 }}>
              <strong>誕生日月の来店率が通常月の</strong><strong style={{ color: '#16a34a' }}>2.4倍</strong>
            </p>
            <p>「バースデードリンク無料」の特典で、グループ来店も増加。売上が安定。</p>
          </div>

          <div className="g-related">
            <h3>関連ガイド</h3>
            <div className="g-related-grid">
              <Link href="/guide/themes/dormant" className="g-related-card">
                <span className="ico">💤</span>
                <div><div className="title">休眠顧客の復活</div><div className="sub">前のステップ</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/salon" className="g-related-card">
                <span className="ico">💇</span>
                <div><div className="title">美容室・サロン向け</div><div className="sub">業種別ガイド</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/case-studies" className="g-related-card">
                <span className="ico">📈</span>
                <div><div className="title">導入事例</div><div className="sub">成功事例から学ぶ</div></div>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="g-cta">
            <h3>誕生日を、最高のファン化の機会に。</h3>
            <p>Push-taroで、誕生日クーポンを全自動配信。</p>
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
        }
      `}</style>
    </>
  );
}
