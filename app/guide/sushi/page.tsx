'use client';

import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';

export default function SushiGuidePage() {
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
          <span className="current">寿司店</span>
        </div>

        <div className="g-hero">
          <span className="g-badge">🍣 寿司店向け</span>
          <h1>寿司店のための<br />Push-taro活用ガイド</h1>
          <p>
            寿司店は<strong>「特別な日」と「旬のネタ」</strong>が来店動機。
            記念日利用を狙いつつ、常連客を育てる仕組みを解説します。
          </p>
        </div>

        <div className="g-content">

          <h2><span className="num">1</span>寿司店が抱える3つの課題</h2>
          <div className="g-grid">
            <div className="g-card-simple">
              <div className="g-icon-big">💴</div>
              <h4>単価は高いが頻度が低い</h4>
              <p>1回の単価は高いが、来店頻度が低い。年数回来店に留まる。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">📅</div>
              <h4>予約が読めない</h4>
              <p>平日と週末の差が激しく、予約状況にムラがある。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">🎌</div>
              <h4>特別感を出しにくい</h4>
              <p>他の飲食店との差別化に、仕組みが必要。</p>
            </div>
          </div>

          <div className="g-callout info">
            <span className="ico">💡</span>
            <div>
              <p><strong>寿司店は「記念日需要」が最大の武器</strong></p>
              <p>誕生日・結婚記念日・合格祝い——<strong>特別な日に選ばれる店</strong>になることで、単価も頻度も上がります。</p>
            </div>
          </div>

          <h2><span className="num">2</span>記念日利用と常連化を両立</h2>
          <div className="g-diagram">
            <div className="g-flow">
              <div className="g-flow-item">
                <div className="g-flow-circle">初来店</div>
                <p>QR登録</p>
              </div>
              <div className="g-flow-arrow">→</div>
              <div className="g-flow-item">
                <div className="g-flow-circle">記念日</div>
                <p>誕生日<br />クーポン</p>
              </div>
              <div className="g-flow-arrow">→</div>
              <div className="g-flow-item">
                <div className="g-flow-circle highlight">常連化</div>
                <p>旬のネタ<br />で来店</p>
              </div>
              <div className="g-flow-arrow">→</div>
              <div className="g-flow-item">
                <div className="g-flow-circle success">🎉 紹介</div>
                <p>接待・祝い<br />で利用</p>
              </div>
            </div>
          </div>

          <h2><span className="num">3</span>寿司店向け 運用フロー</h2>
          <div className="g-steps">
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 1：レジ横・座席にQRコードを設置</h4>
                <p>会計時・着席時に、自然に目に入る場所に。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 2：旬のネタを定期配信</h4>
                <p>「本日、天然本マグロ入荷」など、旬の情報を配信。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 3：記念日クーポンで特別感</h4>
                <p>誕生日・記念日を登録してもらい、その日に特別な演出を。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 4：平日限定コースで稼働UP</h4>
                <p>「平日限定 おまかせコース」で平日の稼働率を底上げ。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 5：休眠顧客の呼び戻し</h4>
                <p>「旬のネタが入りました」と共に、復活クーポンを配信。</p>
              </div>
            </div>
          </div>

          <h2><span className="num">4</span>寿司店で推奨するクーポン設計</h2>
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
                <tr><td>🎫 初回限定</td><td>新規獲得</td><td>握り1貫サービス</td></tr>
                <tr><td>🔄 連続</td><td>常連化</td><td>次回5%OFF</td></tr>
                <tr><td>🎂 誕生日</td><td>記念日利用</td><td>バースデーケーキ or 記念撮影</td></tr>
                <tr><td>💍 記念日</td><td>特別な日</td><td>乾杯ドリンクサービス</td></tr>
                <tr><td>📅 平日限定</td><td>稼働率UP</td><td>平日ランチ10%OFF</td></tr>
                <tr><td>💤 休眠復活</td><td>呼び戻し</td><td>1品サービス</td></tr>
              </tbody>
            </table>
          </div>

          <h2><span className="num">5</span>寿司店ならではの活用アイデア</h2>
          <div className="g-grid">
            <div className="g-card-simple"><div className="g-icon-big">🐟</div><h4>旬のネタ入荷</h4><p>「本日、天然本マグロ入荷しました」を配信。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">🎂</div><h4>誕生日演出</h4><p>「お誕生日おめでとうございます」と特別な一皿を。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">🍶</div><h4>日本酒入荷</h4><p>「十四代入荷」など、限定酒の情報。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">🌸</div><h4>季節のネタ</h4><p>「春の桜鯛」「秋の秋刀魚」など旬の情報。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">📅</div><h4>平日限定コース</h4><p>平日ディナー限定のお得なコースを告知。</p></div>
            <div className="g-card-simple"><div className="g-icon-big">🎉</div><h4>周年祭</h4><p>「開店記念・特別コース」など。</p></div>
          </div>

          <div className="g-callout warn">
            <span className="ico">⚠️</span>
            <div>
              <p><strong>割引よりも「特別感」で勝負</strong></p>
              <p>寿司店は<strong>過度な割引が逆効果</strong>になりやすい業種。値引きよりも「特別な一皿」「記念日演出」など、<strong>体験価値</strong>で差別化しましょう。</p>
            </div>
          </div>

          <h2><span className="num">6</span>導入事例</h2>
          <div className="g-card">
            <h4>📍 東京都 寿司店 A様</h4>
            <p style={{ marginBottom: 12 }}>
              <strong>導入前：</strong>記念日利用 月3組<br />
              <strong>導入後：</strong>記念日利用 月<strong style={{ color: '#16a34a' }}>12組</strong>
            </p>
            <p>誕生日クーポンと記念日登録の仕組みで、特別な日の利用が4倍に。</p>
          </div>

          <div className="g-card">
            <h4>📍 北海道 寿司店 B様</h4>
            <p style={{ marginBottom: 12 }}>
              <strong>導入前：</strong>常連客 50名<br />
              <strong>導入後：</strong>常連客 <strong style={{ color: '#16a34a' }}>130名</strong>
            </p>
            <p>旬のネタ配信で、常連客の来店頻度が大幅アップ。平日の稼働も改善。</p>
          </div>

          <div className="g-related">
            <h3>関連ガイド</h3>
            <div className="g-related-grid">
              <Link href="/guide/themes/birthday" className="g-related-card">
                <span className="ico">🎂</span>
                <div><div className="title">誕生日クーポン</div><div className="sub">テーマ別ガイド</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/izakaya" className="g-related-card">
                <span className="ico">🍺</span>
                <div><div className="title">バー・居酒屋向け</div><div className="sub">業種別ガイド</div></div>
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
            <h3>寿司店の「特別な日」を、仕組みに。</h3>
            <p>記念日利用と常連化を、Push-taroで両立。</p>
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
