import Link from 'next/link';

export const metadata = {
  title: '飲食店・カフェ向け Push-taro活用ガイド',
  description: '雨の日割引・新メニュー告知・常連客のファン化。飲食店のリピート施策を仕組み化する方法。',
};

export default function CafeGuidePage() {
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
          <span className="current">飲食店・カフェ</span>
        </div>

        <div className="g-hero">
          <span className="g-badge">☕ 飲食店・カフェ向け</span>
          <h1>飲食店・カフェのための<br />Push-taro活用ガイド</h1>
          <p>
            飲食店の新規客獲得コストは1人あたり<strong>平均5,000円</strong>。
            チラシ・広告に頼る集客から脱却し、常連客を育てて安定経営を実現する方法を解説します。
          </p>
        </div>

        <div className="g-content">

          <h2><span className="num">1</span>飲食店が抱える3つの課題</h2>
          <div className="g-grid">
            <div className="g-card-simple">
              <div className="g-icon-big">📉</div>
              <h4>リピート率が低い</h4>
              <p>一度来たお客様の<strong>6割が再来店しない</strong>。一見客頼みの経営。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">☔</div>
              <h4>天候に左右される</h4>
              <p>雨の日・平日のアイドルタイムに、<strong>お客様を呼べない</strong>。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">💰</div>
              <h4>広告費が高い</h4>
              <p>チラシ・ポスティングに<strong>月5〜10万円</strong>。効果も読めない。</p>
            </div>
          </div>

          <div className="g-callout info">
            <span className="ico">💡</span>
            <div>
              <p><strong>飲食店のカギは「タイミング」と「天候」</strong></p>
              <p>「今、雨が降ってきた」「新メニューができた」そんな瞬間に、お客様に直接届けられるのがPush通知の強みです。</p>
            </div>
          </div>

          <h2><span className="num">2</span>3回来店で常連化する仕組み</h2>
          <p>
            飲食店でも、<strong>3回来店した顧客は常連化する</strong>というデータがあります。
            初回・2回目・3回目それぞれに、最適なアプローチを自動化しましょう。
          </p>

          <div className="g-diagram">
            <div className="g-flow">
              <div className="g-flow-item">
                <div className="g-flow-circle">1回目</div>
                <p>初回クーポン<br />で来店</p>
              </div>
              <div className="g-flow-arrow">→</div>
              <div className="g-flow-item">
                <div className="g-flow-circle">2回目</div>
                <p>連続クーポン<br />で再来</p>
              </div>
              <div className="g-flow-arrow">→</div>
              <div className="g-flow-item">
                <div className="g-flow-circle highlight">3回目</div>
                <p>特別達成<br />クーポン</p>
              </div>
              <div className="g-flow-arrow">→</div>
              <div className="g-flow-item">
                <div className="g-flow-circle success">🎉 常連</div>
                <p>ファン化</p>
              </div>
            </div>
          </div>

          <h2><span className="num">3</span>飲食店向け 運用フロー</h2>
          <div className="g-steps">
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 1：テーブル・レジ横にQRコードを設置</h4>
                <p>会計時やお食事中に、お客様が自然に読み取れる場所にPOPを設置。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 2：初回クーポンで次回予約を獲得</h4>
                <p>登録と同時に「次回使える10%OFF」を配布。有効期限を14〜30日に設定。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 3：連続クーポンで2回目来店</h4>
                <p>消込と同時に次回クーポンを自動発行。来店サイクルを短縮。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 4：3回目で特別達成クーポン</h4>
                <p>累計3回来店で、特別な達成クーポンを解放。常連化を促進。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 5：天候連動でアイドルタイム対策</h4>
                <p>雨の日限定クーポンや、平日ランチタイム限定クーポンで稼働率を上げる。</p>
              </div>
            </div>
          </div>

          <h2><span className="num">4</span>飲食店で推奨するクーポン設計</h2>
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
                <tr><td>🎫 初回限定</td><td>新規顧客の獲得</td><td>ドリンク1杯無料 など</td></tr>
                <tr><td>🔄 連続</td><td>2回目来店</td><td>14日間有効の10%OFF</td></tr>
                <tr><td>🏆 特別達成</td><td>3回来店で常連化</td><td>3回でデザート無料</td></tr>
                <tr><td>☔ 雨の日限定</td><td>アイドルタイム対策</td><td>雨の日15%OFF</td></tr>
                <tr><td>🍽️ ランチ限定</td><td>平日昼の稼働率UP</td><td>平日ランチドリンク付き</td></tr>
                <tr><td>🎂 誕生日</td><td>特別感の演出</td><td>誕生日月に20%OFF</td></tr>
                <tr><td>💤 休眠復活</td><td>離反顧客の呼び戻し</td><td>60日未来店で30%OFF</td></tr>
              </tbody>
            </table>
          </div>

          <h2><span className="num">5</span>飲食店向け 活用アイデア</h2>
          <div className="g-grid">
            <div className="g-card-simple"><div className="g-icon-big">☔</div><h4>雨の日限定クーポン</h4><p>天気連動で「雨の日15%OFF」を自動配信。天候による集客変動を緩和。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">🍜</div><h4>新メニュー告知</h4><p>季節限定メニュー・新作スイーツの写真を配信して、来店動機を作る。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">⏰</div><h4>アイドルタイム対策</h4><p>14時〜17時の「カフェタイム限定」クーポンで稼働率UP。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">🎉</div><h4>記念日クーポン</h4><p>誕生日・記念日に特別クーポン。特別感でファン化。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">🍰</div><h4>スイーツ新作</h4><p>季節のスイーツを画像付きで配信。「食べたい」を刺激。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">👥</div><h4>グループ利用</h4><p>「4名様以上で1名無料」など、宴会需要を狙ったクーポン。</p></div>
          </div>

          <h2><span className="num">6</span>導入事例</h2>
          <div className="g-card">
            <h4>📍 東京都 カフェ A様</h4>
            <p style={{ marginBottom: 12 }}>
              <strong>導入前：</strong>平日14時〜17時の稼働率 30%<br />
              <strong>導入後：</strong>平日14時〜17時の稼働率 <strong style={{ color: '#16a34a' }}>65%</strong>
            </p>
            <p>「カフェタイム限定クーポン」を14時に自動配信。近隣のオフィスワーカーが来店するように。</p>
          </div>

          <div className="g-card">
            <h4>📍 大阪府 居酒屋 B様</h4>
            <p style={{ marginBottom: 12 }}>
              <strong>導入前：</strong>リピート率 25%<br />
              <strong>導入後：</strong>リピート率 <strong style={{ color: '#16a34a' }}>58%</strong>
            </p>
            <p>連続クーポンと誕生日クーポンで、常連客が自然と増加。日雇いスタッフの接客負担も軽減。</p>
          </div>

          <div className="g-related">
            <h3>関連ガイド</h3>
            <div className="g-related-grid">
              <Link href="/guide/salon" className="g-related-card">
                <span className="ico">💇</span>
                <div><div className="title">美容室・サロン向け</div><div className="sub">業種別ガイド</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/themes/repeat" className="g-related-card">
                <span className="ico">🔄</span>
                <div><div className="title">リピート施策</div><div className="sub">テーマ別ガイド</div></div>
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
            <h3>飲食店の集客を、仕組みに。</h3>
            <p>天候・時間帯に左右されない集客体制を、Push-taroで。</p>
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
