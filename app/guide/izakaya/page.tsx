'use client';

import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';

export default function IzakayaGuidePage() {
  return (
    <>
      <nav className="g-nav">
        <div className="g-nav-inner">
          <BrandLogo />
          <Link href="/signup" className="g-nav-cta">今すぐ申し込む →</Link>
        </div>
      </nav>

      <main className="g-main">
        <div className="g-breadcrumb">
          <Link href="/guide">ガイド</Link>
          <span className="sep">/</span>
          <span className="current">バー・居酒屋</span>
        </div>

        <div className="g-hero">
          <span className="g-badge">🍺 バー・居酒屋向け</span>
          <h1>バー・居酒屋のための<br />Push-taro活用ガイド</h1>
          <p>
            バー・居酒屋は<strong>「グループ利用」と「常連の習慣化」</strong>が売上のカギ。
            会社の飲み会・宴会需要を取り込みつつ、常連客を育てる仕組みを解説します。
          </p>
        </div>

        <div className="g-content">

          <h2><span className="num">1</span>バー・居酒屋が抱える3つの課題</h2>
          <div className="g-grid">
            <div className="g-card-simple">
              <div className="g-icon-big">📅</div>
              <h4>稼働にムラがある</h4>
              <p>金曜・土曜は満席、平日はガラガラ。曜日による差が大きい。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">📉</div>
              <h4>宴会予約が読めない</h4>
              <p>歓迎会・忘年会シーズンの予約が、事前に取れない。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">🔄</div>
              <h4>常連化しない</h4>
              <p>一度来ても、その後のフォローができていない。</p>
            </div>
          </div>

          <div className="g-callout info">
            <span className="ico">💡</span>
            <div>
              <p><strong>バー・居酒屋は「グループ」と「平日」が鍵</strong></p>
              <p>単独客より<strong>グループ来店</strong>、週末より<strong>平日の稼働率</strong>を上げることが、売上安定の近道です。</p>
            </div>
          </div>

          <h2><span className="num">2</span>グループと常連を同時に育てる</h2>
          <div className="g-diagram">
            <div className="g-flow">
              <div className="g-flow-item">
                <div className="g-flow-circle">初来店</div>
                <p>QR登録</p>
              </div>
              <div className="g-flow-arrow">→</div>
              <div className="g-flow-item">
                <div className="g-flow-circle">連続</div>
                <p>次回クーポン<br />配信</p>
              </div>
              <div className="g-flow-arrow">→</div>
              <div className="g-flow-item">
                <div className="g-flow-circle highlight">常連化</div>
                <p>グループで<br />再来店</p>
              </div>
              <div className="g-flow-arrow">→</div>
              <div className="g-flow-item">
                <div className="g-flow-circle success">🎉 宴会</div>
                <p>忘年会・歓迎会<br />で大型利用</p>
              </div>
            </div>
          </div>

          <h2><span className="num">3</span>バー・居酒屋向け 運用フロー</h2>
          <div className="g-steps">
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 1：テーブル・レジ横にQRコードを設置</h4>
                <p>会計時・お食事中に、自然に読み取れる場所に。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 2：初回クーポンで次回を約束</h4>
                <p>「次回1品無料」「ドリンク1杯無料」など、来店動機を配布。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 3：平日限定クーポンで稼働率UP</h4>
                <p>「月〜木限定10%OFF」を配信。平日の稼働を底上げ。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 4：宴会シーズンの事前告知</h4>
                <p>「忘年会のご予約承ります」を11月から配信。早期予約を獲得。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 5：休眠常連の呼び戻し</h4>
                <p>「最近見かけないな」という常連客に、特別な復帰クーポン。</p>
              </div>
            </div>
          </div>

          <h2><span className="num">4</span>バー・居酒屋で推奨するクーポン設計</h2>
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
                <tr><td>🎫 初回限定</td><td>新規獲得</td><td>1品無料 or ドリンク1杯</td></tr>
                <tr><td>🔄 連続</td><td>常連化</td><td>次回10%OFF</td></tr>
                <tr><td>📅 平日限定</td><td>稼働率UP</td><td>月〜木 15%OFF</td></tr>
                <tr><td>👥 グループ特典</td><td>宴会需要</td><td>4名以上で1名無料</td></tr>
                <tr><td>🏆 特別達成</td><td>ファン化</td><td>5回来店で1品プレゼント</td></tr>
                <tr><td>💤 休眠復活</td><td>呼び戻し</td><td>60日未来店で1品無料</td></tr>
              </tbody>
            </table>
          </div>

          <h2><span className="num">5</span>バー・居酒屋ならではの活用アイデア</h2>
          <div className="g-grid">
            <div className="g-card-simple"><div className="g-icon-big">🍶</div><h4>日本酒入荷</h4><p>「本日、新政No.6入荷しました」など。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">🍺</div><h4>クラフトビール</h4><p>新入荷のクラフトビールを画像付きで配信。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">📺</div><h4>スポーツ中継</h4><p>「今夜はサッカー日本戦を放映」など。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">🎉</div><h4>宴会告知</h4><p>「忘年会プランご予約承ります」を早期配信。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">🍽️</div><h4>新メニュー</h4><p>季節の料理・新作を配信。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">⏰</div><h4>アイドルタイム</h4><p>「今なら空いてます」を18時台に配信。</p></div>
          </div>

          <div className="g-callout warn">
            <span className="ico">⚠️</span>
            <div>
              <p><strong>配信時間の注意</strong></p>
              <p>バー・居酒屋は<strong>昼間の配信</strong>がおすすめ。特に<strong>16〜18時</strong>に「今夜、空いてます」を配信すると、その日の来店に繋がります。</p>
            </div>
          </div>

          <div className="g-related">
            <h3>関連ガイド</h3>
            <div className="g-related-grid">
              <Link href="/guide/snack" className="g-related-card">
                <span className="ico">🍸</span>
                <div><div className="title">スナック・パブ向け</div><div className="sub">業種別ガイド</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/themes/dormant" className="g-related-card">
                <span className="ico">💤</span>
                <div><div className="title">休眠顧客の復活</div><div className="sub">テーマ別ガイド</div></div>
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
            <h3>バー・居酒屋の稼働率を、仕組みに。</h3>
            <p>平日の底上げから宴会予約まで、Push-taroで。</p>
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
