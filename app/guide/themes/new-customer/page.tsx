'use client';

import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';

export default function NewCustomerPage() {
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
          <span className="current">新規顧客の獲得</span>
        </div>

        <div className="g-hero">
          <span className="g-badge">🆕 テーマ別ガイド</span>
          <h1>新規顧客の獲得を、<br />もっとシンプルに。</h1>
          <p>
            チラシ・DM・ポスティングに頼る集客は、コストがかかる割に効果が読めません。
            Push-taroなら、QRコードと初回クーポンで<strong>手間なく顧客リストを構築</strong>できます。
          </p>
        </div>

        <div className="g-content">

          <h2><span className="num">1</span>新規獲得の3つの落とし穴</h2>

          <div className="g-grid">
            <div className="g-card-simple">
              <div className="g-icon-big">💸</div>
              <h4>コストが高い</h4>
              <p>チラシ・ポスティングは1人獲得に<strong>5,000〜30,000円</strong>かかる。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">📊</div>
              <h4>効果が見えない</h4>
              <p>「何人来たか」も分からない。改善のしようがない。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">🔁</div>
              <h4>リピートしない</h4>
              <p>獲得しても<strong>7割が1回で離反</strong>。焼け石に水。</p>
            </div>
          </div>

          <div className="g-callout info">
            <span className="ico">💡</span>
            <div>
              <p><strong>「獲得」と「リピート」はセットで考える</strong></p>
              <p>新規獲得は、その後の<strong>リピート施策と組み合わせて初めて成果</strong>になります。Push-taroは両方を1つで実現します。</p>
            </div>
          </div>

          <h2><span className="num">2</span>Push-taroの新規獲得フロー</h2>

          <div className="g-steps">
            <div className="g-step">
              <div className="g-step-body">
                <h4>店頭にQRコードを設置</h4>
                <p>管理画面から生成した店舗専用QRコードを、POPに印刷して設置。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>お客様がスマホでスキャン</h4>
                <p>アプリ不要。ブラウザから読み取って、通知を「許可」するだけ。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>自動で初回クーポンを配布</h4>
                <p>登録と同時に、初回限定クーポンが自動配信される。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>顧客リストに自動追加</h4>
                <p>登録した顧客の情報が、自動で顧客リストに蓄積されていく。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>初回来店でクーポン消込</h4>
                <p>会計時にQRを提示してもらい、消込完了。これで1人獲得。</p>
              </div>
            </div>
          </div>

          <h2><span className="num">3</span>獲得コストを劇的に下げる仕組み</h2>

          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr>
                  <th>項目</th>
                  <th>従来の集客</th>
                  <th>Push-taro</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>月額コスト</td>
                  <td>¥50,000〜</td>
                  <td className="yes">¥1,980〜</td>
                </tr>
                <tr>
                  <td>1人あたり獲得コスト</td>
                  <td>¥5,000〜30,000</td>
                  <td className="yes">¥0〜数百円</td>
                </tr>
                <tr>
                  <td>効果測定</td>
                  <td className="no">困難</td>
                  <td className="yes">リアルタイムで可視化</td>
                </tr>
                <tr>
                  <td>リピート施策</td>
                  <td className="no">別途必要</td>
                  <td className="yes">標準搭載</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2><span className="num">4</span>新規獲得のコツ</h2>

          <div className="g-grid">
            <div className="g-card-simple">
              <div className="g-icon-big">📍</div>
              <h4>複数箇所に設置</h4>
              <p>レジ横・テーブル・鏡前など、目につく場所に複数設置。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">🎁</div>
              <h4>初回特典は魅力的に</h4>
              <p>「登録で〇%OFF」より「ドリンク1杯無料」など具体化。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">📢</div>
              <h4>スタッフの声かけ</h4>
              <p>会計時に「よろしければこちらから」と自然に案内。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">⏰</div>
              <h4>登録のタイミング</h4>
              <p>満足度が高い会計直後がベスト。</p>
            </div>
          </div>

          <div className="g-callout warn">
            <span className="ico">⚠️</span>
            <div>
              <p><strong>NG：強引な登録誘導</strong></p>
              <p>「登録しないと割引できません」は、顧客体験を損ねます。あくまで<strong>任意</strong>で、メリットを提示して選んでもらいましょう。</p>
            </div>
          </div>

          <div className="g-related">
            <h3>関連ガイド</h3>
            <div className="g-related-grid">
              <Link href="/guide/themes/repeat" className="g-related-card">
                <span className="ico">🔄</span>
                <div><div className="title">リピート施策</div><div className="sub">次に読む</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/salon" className="g-related-card">
                <span className="ico">💇</span>
                <div><div className="title">美容室・サロン向け</div><div className="sub">業種別ガイド</div></div>
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
            <h3>新規獲得を、もっとシンプルに。</h3>
            <p>QRコードと初回クーポンで、手間なく顧客リストを構築。</p>
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
        .g-table .no { color: #94a3b8; font-weight: 700; }
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
