'use client';

import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';

export default function DormantPage() {
  return (
    <>
      <nav className="g-nav">
        <div className="g-nav-inner">
          <BrandLogo tagline="使い方ガイド" />
          <Link href="/signup" className="g-nav-cta">今すぐ申し込む →</Link>
        </div>
      </nav>

      <main className="g-main">
        <div className="g-breadcrumb">
          <Link href="/guide">ガイド</Link>
          <span className="sep">/</span>
          <span className="current">休眠顧客の復活</span>
        </div>

        <div className="g-hero">
          <span className="g-badge">💤 テーマ別ガイド</span>
          <h1>休眠顧客を、<br />自動で呼び戻す。</h1>
          <p>
            「また来たいけど、きっかけがない」——休眠顧客の多くは、<strong>本当は戻りたい</strong>と思っています。
            Push-taroなら、離反しかけた顧客に<strong>自動で復帰クーポンを配信</strong>し、呼び戻せます。
          </p>
        </div>

        <div className="g-content">

          <h2><span className="num">1</span>休眠顧客を放置すると、どうなるか</h2>

          <div className="g-grid">
            <div className="g-card-simple">
              <div className="g-icon-big">📉</div>
              <h4>LTVが下がる</h4>
              <p>既存客の来店が減るほど、1人あたりの売上（LTV）が下がる。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">💸</div>
              <h4>新規獲得コストが増える</h4>
              <p>休眠客を失うと、その分を新規獲得で補う必要。コスト増。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">👻</div>
              <h4>忘れられる</h4>
              <p>半年放置すると、店舗の存在自体を忘れられてしまう。</p>
            </div>
          </div>

          <div className="g-callout info">
            <span className="ico">💡</span>
            <div>
              <p><strong>既存客の復活は、新規獲得の5倍効率的</strong></p>
              <p>新規獲得に5,000〜30,000円かかるのに対し、休眠客の復活は<strong>ほぼゼロコスト</strong>。しかも元々店舗を知っているので、成約率が高い。</p>
            </div>
          </div>

          <h2><span className="num">2</span>休眠顧客の定義とタイミング</h2>

          <p>
            「休眠」と一口に言っても、業種によって最適なタイミングが異なります。
          </p>

          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr>
                  <th>業種</th>
                  <th>通常の来店サイクル</th>
                  <th>休眠と判定する日数</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>美容室・サロン</td><td>30〜45日</td><td className="yes">60日</td></tr>
                <tr><td>飲食店・カフェ</td><td>7〜14日</td><td className="yes">30日</td></tr>
                <tr><td>マッサージ・エステ</td><td>30〜60日</td><td className="yes">90日</td></tr>
                <tr><td>アパレル・雑貨</td><td>30〜90日</td><td className="yes">90日</td></tr>
              </tbody>
            </table>
          </div>

          <p>
            Push-taroでは、この「休眠判定日数」を<strong>店舗ごとに自由に設定</strong>できます。
          </p>

          <h2><span className="num">3</span>休眠復活の3ステップ</h2>

          <div className="g-steps">
            <div className="g-step">
              <div className="g-step-body">
                <h4>自動で休眠顧客を抽出</h4>
                <p>最終来店から設定日数が経過した顧客を、システムが自動で抽出。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>特別な復帰クーポンを配信</h4>
                <p>通常クーポンより<strong>手厚い特典</strong>を、プッシュ通知で自動配信。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>再来店で復活</h4>
                <p>クーポンを使って再来店。これをきっかけに、また常連化していく。</p>
              </div>
            </div>
          </div>

          <h2><span className="num">4</span>復帰クーポンの設計</h2>

          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr>
                  <th>項目</th>
                  <th>推奨設定</th>
                  <th>理由</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>割引率</td>
                  <td className="yes">20〜30%OFF</td>
                  <td>通常より手厚く。特別感を演出。</td>
                </tr>
                <tr>
                  <td>有効期限</td>
                  <td className="yes">14〜30日</td>
                  <td>短すぎず、長すぎず。行動を促す。</td>
                </tr>
                <tr>
                  <td>タイトル</td>
                  <td className="yes">「お久しぶりです」</td>
                  <td>親しみやすさが大事。</td>
                </tr>
                <tr>
                  <td>メッセージ</td>
                  <td className="yes">お客様の名前を入れる</td>
                  <td>パーソナル感で心を動かす。</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2><span className="num">5</span>休眠復活のコツ</h2>

          <div className="g-grid">
            <div className="g-card-simple">
              <div className="g-icon-big">💌</div>
              <h4>親しみのある文体</h4>
              <p>「お久しぶりです」「またお会いしたいです」など、温かい言葉で。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">🎁</div>
              <h4>特別な特典</h4>
              <p>通常クーポンより豪華に。「あなただけ」感を演出。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">⏰</div>
              <h4>再送信の制限</h4>
              <p>同じ人に月1回まで。しつこいと逆効果。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">📊</div>
              <h4>効果測定</h4>
              <p>復活率をチェック。改善のPDCAを回す。</p>
            </div>
          </div>

          <div className="g-callout warn">
            <span className="ico">⚠️</span>
            <div>
              <p><strong>NG：しつこい配信</strong></p>
              <p>「何度も送る」と、逆にブロックされます。Push-taroは<strong>自動で再送信間隔を調整</strong>するので安心です。</p>
            </div>
          </div>

          <h2><span className="num">6</span>導入事例</h2>

          <div className="g-card">
            <h4>📍 埼玉県 美容室 B様</h4>
            <p style={{ marginBottom: 12 }}>
              <strong>導入前：</strong>休眠顧客率 60%<br />
              <strong>導入後：</strong>休眠顧客率 <strong style={{ color: '#16a34a' }}>32%</strong>
            </p>
            <p>「3ヶ月来ていない顧客」への復活クーポン配信で、多くの顧客が戻ってきた。</p>
          </div>

          <div className="g-related">
            <h3>関連ガイド</h3>
            <div className="g-related-grid">
              <Link href="/guide/themes/birthday" className="g-related-card">
                <span className="ico">🎂</span>
                <div><div className="title">誕生日クーポン</div><div className="sub">次のステップ</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/massage" className="g-related-card">
                <span className="ico">💆</span>
                <div><div className="title">マッサージ・エステ向け</div><div className="sub">業種別ガイド</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/salon" className="g-related-card">
                <span className="ico">💇</span>
                <div><div className="title">美容室・サロン向け</div><div className="sub">業種別ガイド</div></div>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="g-cta">
            <h3>休眠顧客を、自動で呼び戻す。</h3>
            <p>離反しかけた顧客を、Push-taroの休眠復活クーポンで。</p>
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
