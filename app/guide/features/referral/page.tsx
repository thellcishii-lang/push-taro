'use client';

import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';

export default function ReferralFeature() {
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
          <Link href="/guide/features">機能別</Link>
          <span className="sep">/</span>
          <span className="current">紹介報酬</span>
        </div>

        <div className="g-hero">
          <span className="g-badge is-pro">🔥 PRO 限定</span>
          <h1>🤝 紹介報酬</h1>
          <p>
            PROプラン特典として、他の店舗を紹介すると<strong>毎月10%の報酬</strong>が発生します。
            10店舗紹介すれば、PROプラン（月額¥10,000）が実質無料になります。
          </p>
        </div>

        <div className="g-content">

          <h2 className="g-h2"><span className="num">1</span>この機能でできること</h2>
          <div className="g-feature-list">
            <div className="g-feature-item"><span className="ico">💰</span><div><strong>毎月10%の継続報酬</strong><p>紹介した店舗が契約している限り、毎月10%の報酬が発生し続けます。</p></div></div>
            <div className="g-feature-item"><span className="ico">🎁</span><div><strong>10店舗で実質無料</strong><p>10店舗紹介すれば、PROプランの月額（¥10,000）が完全に相殺されます。</p></div></div>
            <div className="g-feature-item"><span className="ico">🏦</span><div><strong>口座振込で受け取り</strong><p>累計1万円を超えると、指定の銀行口座に振込申請ができます。</p></div></div>
            <div className="g-feature-item"><span className="ico">📊</span><div><strong>専用ダッシュボード</strong><p>紹介店舗数・累計報酬・未払い報酬が一目で確認できます。</p></div></div>
          </div>

          <h2 className="g-h2"><span className="num">2</span>報酬の仕組み</h2>
          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr><th>紹介店舗のプラン</th><th>月額</th><th>報酬率</th><th>あなたの報酬（毎月）</th></tr>
              </thead>
              <tbody>
                <tr><td>LIGHT</td><td>¥1,980</td><td className="yes">10%</td><td className="yes">¥198</td></tr>
                <tr><td>STANDARD</td><td>¥3,800</td><td className="yes">10%</td><td className="yes">¥380</td></tr>
                <tr><td>PRO</td><td>¥10,000</td><td className="yes">10%</td><td className="yes">¥1,000</td></tr>
              </tbody>
            </table>
          </div>

          <div className="g-callout info">
            <span className="ico">💡</span>
            <div>
              <strong>PRO 10店舗で、月額¥10,000が完全に相殺</strong>
              <p>10店舗 × ¥1,000 = ¥10,000 → PROプラン月額と完全に相殺され、<strong>実質無料</strong>になります。
              11店舗目からは、プラス収益になります。</p>
            </div>
          </div>

          <h2 className="g-h2"><span className="num">3</span>紹介の流れ</h2>
          <div className="g-flow">
            <div className="g-flow-item"><div className="g-flow-circle">1</div><p>紹介コード<br />を共有</p></div>
            <div className="g-flow-arrow">→</div>
            <div className="g-flow-item"><div className="g-flow-circle is-highlight">2</div><p>相手が<br />登録</p></div>
            <div className="g-flow-arrow">→</div>
            <div className="g-flow-item"><div className="g-flow-circle is-highlight">3</div><p>決済<br />完了</p></div>
            <div className="g-flow-arrow">→</div>
            <div className="g-flow-item"><div className="g-flow-circle is-success">💰</div><p>毎月<br />報酬発生</p></div>
          </div>

          <h2 className="g-h2"><span className="num">4</span>確認手順</h2>
          <div className="g-steps">
            <div className="g-step">
              <div className="g-step-body">
                <h4>PROコンソールのヘッダー「🤝 紹介・報酬」をタップ</h4>
                <p>紹介・報酬ダッシュボードに移動します。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>紹介コード・専用URLを確認</h4>
                <p>「コードをコピー」「URLをコピー」ボタンで簡単に共有できます。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>累計報酬・未払い報酬・紹介店舗数を確認</h4>
                <p>サマリーカードで一目で状況がわかります。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>振込先口座を登録</h4>
                <p>未登録の場合は、口座情報を入力して保存してください。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>毎月末に自動で振込処理</h4>
                <p>未払い報酬が1万円を超えていれば、翌月末に振込されます。</p>
              </div>
            </div>
          </div>

          <h2 className="g-h2"><span className="num">5</span>画面イメージ</h2>
          <div className="g-mockup">
            <div className="g-mockup-header">
              <div className="g-mockup-hm-left">
                <span className="g-mockup-hm-name">Patisserie Taro</span>
                <span className="g-mockup-hm-badge">PRO</span>
              </div>
              <span className="g-mockup-hm-btn">🤝 紹介・報酬</span>
            </div>
            <div className="g-ref-summary">
              <div className="g-ref-card"><div className="g-ref-label">累計報酬</div><div className="g-ref-value">¥24,500</div></div>
              <div className="g-ref-card is-green"><div className="g-ref-label">未払い報酬</div><div className="g-ref-value is-green">¥8,200</div></div>
              <div className="g-ref-card is-blue"><div className="g-ref-label">紹介店舗数</div><div className="g-ref-value is-blue">12 店舗</div></div>
            </div>
            <div className="g-ref-code">
              <div className="g-ref-code-label">あなたの紹介コード</div>
              <div className="g-ref-code-value">UBGIEKEK</div>
            </div>
          </div>

          <h2 className="g-h2"><span className="num">6</span>紹介のコツ</h2>
          <div className="g-grid">
            <div className="g-card" style={{ cursor: 'default' }}><span className="g-card-icon">👥</span><h4>異業種の知人へ</h4><p>飲食・美容・アパレルなど、業種を問わず紹介可能。</p></div>
            <div className="g-card" style={{ cursor: 'default' }}><span className="g-card-icon">💬</span><h4>実体験を伝える</h4><p>「実際に使ってリピート率が上がった」など、実感を伝える。</p></div>
            <div className="g-card" style={{ cursor: 'default' }}><span className="g-card-icon">🔗</span><h4>専用URLを活用</h4><p>コード入力の手間を省き、ワンクリックで登録できる。</p></div>
            <div className="g-card" style={{ cursor: 'default' }}><span className="g-card-icon">📊</span><h4>定期的に確認</h4><p>ダッシュボードで誰が登録したかを随時チェック。</p></div>
          </div>

          <div className="g-related">
            <h3>関連ページ</h3>
            <div className="g-related-grid">
              <Link href="/torisetsu/pro" className="g-related-card">
                <span className="ico">📘</span>
                <div><div className="title">PROプラン取扱説明書</div><div className="sub">全機能の使い方</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/program" className="g-related-card">
                <span className="ico">👑</span>
                <div><div className="title">収益化プログラム</div><div className="sub">代理店・アフィリエイト</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/case-studies" className="g-related-card">
                <span className="ico">📈</span>
                <div><div className="title">導入事例</div><div className="sub">成果を出した店舗</div></div>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="g-cta">
            <h3>紹介するほど、お得になる</h3>
            <p>10店舗紹介すればPROプランが実質無料。あなたのネットワークが収益源に。</p>
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
        .g-feature-list { display: flex; flex-direction: column; gap: 14px; }
        .g-feature-item { display: flex; gap: 14px; padding: 18px 22px; background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; align-items: flex-start; }
        .g-feature-item .ico { font-size: 28px; flex-shrink: 0; }
        .g-feature-item strong { display: block; font-size: 15px; color: #0f172a; margin-bottom: 4px; font-weight: 800; }
        .g-feature-item p { font-size: 13.5px; color: #64748b; margin: 0; line-height: 1.7; }
        .g-flow { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; padding: 28px 24px; background: #fff; border-radius: 16px; border: 2px solid #fed7aa; margin: 24px 0; }
        .g-flow-item { text-align: center; flex-shrink: 0; }
        .g-flow-circle { width: 72px; height: 72px; border-radius: 50%; background: #fff7ed; border: 2px solid #ea580c; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 900; color: #ea580c; margin: 0 auto 8px; }
        .g-flow-circle.is-highlight { background: #ea580c; color: #fff; }
        .g-flow-circle.is-success { background: #f0fdf4; border-color: #16a34a; color: #16a34a; font-size: 24px; }
        .g-flow-item p { font-size: 12px; color: #64748b; margin: 0; line-height: 1.5; }
        .g-flow-arrow { color: #ea580c; font-size: 20px; font-weight: 900; }
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
        .g-mockup { background: #fff; border: 2px solid #e2e8f0; border-radius: 16px; padding: 20px; box-shadow: 0 12px 32px rgba(0,0,0,0.06); }
        .g-mockup-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #f8fafc; border-radius: 10px; margin-bottom: 16px; }
        .g-mockup-hm-left { display: flex; align-items: center; gap: 8px; }
        .g-mockup-hm-name { font-size: 14px; font-weight: 800; color: #0f172a; }
        .g-mockup-hm-badge { font-size: 9px; font-weight: 800; background: #ff4500; color: #fff; padding: 2px 8px; border-radius: 10px; }
        .g-mockup-hm-btn { font-size: 11px; font-weight: 800; background: #fff7ed; color: #c2410c; border: 1px solid #fdba74; padding: 6px 12px; border-radius: 6px; }
        .g-ref-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px; }
        .g-ref-card { background: #fff; padding: 14px 10px; border-radius: 10px; border: 1px solid #e2e8f0; text-align: center; }
        .g-ref-card.is-green { background: #f0fdf4; border-color: #86efac; }
        .g-ref-card.is-blue { background: #ebf8ff; border-color: #90cdf4; }
        .g-ref-label { font-size: 10px; font-weight: 700; color: #64748b; margin-bottom: 4px; }
        .g-ref-value { font-size: 18px; font-weight: 900; color: #0f172a; }
        .g-ref-value.is-green { color: #15803d; }
        .g-ref-value.is-blue { color: #2b6cb0; }
        .g-ref-code { background: #fff7ed; padding: 14px; border-radius: 10px; border: 1px solid #fed7aa; text-align: center; }
        .g-ref-code-label { font-size: 11px; font-weight: 700; color: #9a3412; margin-bottom: 6px; }
        .g-ref-code-value { font-size: 20px; font-weight: 900; color: #c2410c; font-family: monospace; letter-spacing: 2px; }
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
          .g-flow-arrow { display: none; }
          .g-ref-summary { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
