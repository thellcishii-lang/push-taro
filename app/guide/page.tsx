'use client';

import Link from 'next/link';

export default function GuideTopPage() {
  return (
    <>
      {/* ヘッダー */}
      <nav className="g-nav">
        <div className="g-nav-inner">
          <Link href="/" className="g-logo">🚀 Push-taro <small>/ 使い方ガイド</small></Link>
          <Link href="/signup" className="g-nav-cta">今すぐ申し込む →</Link>
        </div>
      </nav>

      <main className="g-main">
        {/* ページヘッダー */}
        <div className="g-hero">
          <span className="g-badge">Guide</span>
          <h1>業種別 活用ガイド</h1>
          <p>
            美容室・飲食店・マッサージ・アパレルなど、業種ごとに最適化されたPush-taroの活用方法を解説します。
            新規顧客の獲得から、リピート施策、休眠顧客の復活まで、実店舗の売上を伸ばすノウハウが満載です。
          </p>
        </div>

        {/* 業種一覧 */}
        <h2 className="g-h2">📋 業種から探す</h2>
        <div className="g-grid">
          <Link href="/guide/salon" className="g-card">
            <span className="g-card-icon">💇</span>
            <h4>美容室・サロン</h4>
            <p>3回来店で定着する仕組み。連続・誕生日・休眠復活クーポンで、リピート率を劇的に改善。</p>
            <span className="g-card-arrow">詳しく見る →</span>
          </Link>
          <Link href="/guide/cafe" className="g-card">
            <span className="g-card-icon">☕</span>
            <h4>飲食店・カフェ</h4>
            <p>雨の日割引・新メニュー告知・常連客のファン化。LINE公式の3倍の開封率で、確実にリピートを獲得。</p>
            <span className="g-card-arrow">詳しく見る →</span>
          </Link>
          <Link href="/guide/massage" className="g-card">
            <span className="g-card-icon">💆</span>
            <h4>マッサージ・エステ</h4>
            <p>来店サイクルを可視化し、メンテナンス時期を逃さずアプローチ。休眠顧客の復活で、月商を安定化。</p>
            <span className="g-card-arrow">詳しく見る →</span>
          </Link>
          <Link href="/guide/apparel" className="g-card">
            <span className="g-card-icon">👕</span>
            <h4>アパレル・雑貨</h4>
            <p>新商品入荷・セール告知を画像付きで配信。固定ファンの買い逃しを防ぎ、季節ごとの売上を最大化。</p>
            <span className="g-card-arrow">詳しく見る →</span>
          </Link>
          <Link href="/guide/snack" className="g-card">
            <span className="g-card-icon">🍸</span>
            <h4>スナック・パブ</h4>
            <p>常連客と紹介で成り立つ業態。休眠常連の呼び戻しと、紹介キャンペーンの仕組み化。</p>
            <span className="g-card-arrow">詳しく見る →</span>
　　　　　　　　　　　　　　　　　　　　</Link>
        </div>

        {/* テーマ別 */}
        <h2 className="g-h2">🎯 テーマから探す</h2>
        <div className="g-grid">
          <Link href="/guide/themes/new-customer" className="g-card">
            <span className="g-card-icon">🆕</span>
            <h4>新規顧客の獲得</h4>
            <p>QRコードと初回クーポンで、手間なく顧客リストを構築する方法。</p>
            <span className="g-card-arrow">詳しく見る →</span>
          </Link>
          <Link href="/guide/themes/repeat" className="g-card">
            <span className="g-card-icon">🔄</span>
            <h4>リピート施策</h4>
            <p>3回来店で定着する仕組みを自動化。連続・ステップアップクーポンの活用法。</p>
            <span className="g-card-arrow">詳しく見る →</span>
          </Link>
          <Link href="/guide/themes/dormant" className="g-card">
            <span className="g-card-icon">💤</span>
            <h4>休眠顧客の復活</h4>
            <p>離反しかけた顧客を自動で呼び戻す、休眠復活クーポンの設定術。</p>
            <span className="g-card-arrow">詳しく見る →</span>
          </Link>
          <Link href="/guide/themes/birthday" className="g-card">
            <span className="g-card-icon">🎂</span>
            <h4>誕生日クーポン</h4>
            <p>特別感でファン化を加速。誕生日クーポン自動配信のベストプラクティス。</p>
            <span className="g-card-arrow">詳しく見る →</span>
          </Link>
        </div>

        {/* 運用ノウハウ */}
        <h2 className="g-h2">📚 運用ノウハウ</h2>
        <div className="g-grid">
          <Link href="/guide/ng-actions" className="g-card">
            <span className="g-card-icon">⚠️</span>
            <h4>NG行為集</h4>
            <p>炎上・ブロック・離反を招くNG行為を徹底解説。安全な運用のために必読。</p>
            <span className="g-card-arrow">詳しく見る →</span>
          </Link>
          <Link href="/guide/case-studies" className="g-card">
            <span className="g-card-icon">📈</span>
            <h4>導入事例</h4>
            <p>実際に成果を出した店舗の事例を、具体的な数値とともに紹介。</p>
            <span className="g-card-arrow">詳しく見る →</span>
          </Link>
        </div>

        {/* CTA */}
        <div className="g-cta">
          <h3>あなたの店舗でも、はじめてみませんか？</h3>
          <p>配信無制限・7種のクーポン自動配信。<br />Push-taroなら、リピート施策のすべてが1つに。</p>
          <Link href="/signup" className="g-cta-btn">無料相談・資料請求 →</Link>
        </div>
      </main>

      {/* スタイル */}
      <style jsx global>{`
        .g-nav { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid #e2e8f0; }
        .g-nav-inner { max-width: 1100px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
        .g-logo { display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 900; color: #0f172a; text-decoration: none; letter-spacing: -0.5px; }
        .g-logo small { font-size: 11px; font-weight: 600; color: #64748b; }
        .g-nav-cta { background: #ff4500; color: #fff; padding: 10px 22px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; box-shadow: 0 4px 12px rgba(255,69,0,0.25); }
        .g-main { max-width: 1100px; margin: 0 auto; padding: 40px 24px 80px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans JP", sans-serif; }
        .g-hero { padding: 32px 0 40px; border-bottom: 1px solid #e2e8f0; margin-bottom: 40px; }
        .g-badge { display: inline-block; font-size: 11px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; color: #ff4500; background: #fff7ed; padding: 5px 14px; border-radius: 20px; margin-bottom: 16px; }
        .g-hero h1 { font-size: clamp(26px, 3.4vw, 38px); font-weight: 900; color: #0f172a; letter-spacing: -1px; line-height: 1.25; margin: 0 0 14px; }
        .g-hero p { font-size: 15.5px; color: #64748b; line-height: 1.9; max-width: 720px; margin: 0; }
        .g-h2 { font-size: 18px; font-weight: 800; color: #1e293b; margin: 48px 0 16px; letter-spacing: -0.3px; }
        .g-h2:first-of-type { margin-top: 0; }
        .g-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
        .g-card { display: block; background: #fff; border: 2px solid #e2e8f0; border-radius: 16px; padding: 24px 22px; text-decoration: none; color: inherit; transition: all 0.25s; }
        .g-card:hover { border-color: #ff4500; transform: translateY(-4px); box-shadow: 0 16px 40px rgba(255,69,0,0.1); }
        .g-card-icon { font-size: 32px; margin-bottom: 12px; display: block; }
        .g-card h4 { font-size: 17px; font-weight: 800; color: #0f172a; margin: 0 0 8px; }
        .g-card p { font-size: 13px; color: #64748b; margin: 0 0 12px; line-height: 1.7; }
        .g-card-arrow { font-size: 12px; font-weight: 800; color: #ff4500; }
        .g-cta { margin-top: 56px; padding: 40px 32px; background: linear-gradient(160deg, #0f172a 0%, #1e293b 100%); color: #fff; border-radius: 20px; text-align: center; }
        .g-cta h3 { font-size: 22px; font-weight: 900; margin: 0 0 12px; color: #fff; }
        .g-cta p { font-size: 14.5px; color: #94a3b8; margin-bottom: 24px; line-height: 1.8; }
        .g-cta-btn { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; padding: 14px 32px; border-radius: 10px; font-weight: 800; font-size: 15px; text-decoration: none; box-shadow: 0 8px 24px rgba(255,69,0,0.35); }
        @media (max-width: 640px) {
          .g-nav-inner { padding: 12px 16px; }
          .g-main { padding: 24px 16px 60px; }
          .g-logo { font-size: 17px; }
          .g-nav-cta { padding: 8px 14px; font-size: 12px; }
        }
      `}</style>
    </>
  );
}
