'use client';

import Link from 'next/link';

export default function GuideTopPage() {
  return (
    <>
      <nav className="g-nav">
        <div className="g-nav-inner">
          <Link href="/" className="logo">
            <svg className="logo-mark" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="guideTopLogoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ff6b6b" />
                  <stop offset="100%" stopColor="#ff4500" />
                </linearGradient>
              </defs>
              <circle cx="24" cy="24" r="23" fill="url(#guideTopLogoGrad)" />
              <path d="M24 8 L33 22 L28 22 L28 30 L20 30 L20 22 L15 22 Z" fill="#ffffff" />
              <circle cx="24" cy="20" r="3" fill="#ff4500" opacity="0.5" />
              <path d="M18 30 L14 38 L20 34 Z" fill="#ffffff" />
              <path d="M30 30 L34 38 L28 34 Z" fill="#ffffff" />
              <path d="M22 30 L24 40 L26 30 Z" fill="#fbbf24" />
            </svg>
            Push-taro<span>.</span>
            <small>実店舗のためのPush通知CRM</small>
          </Link>
          <Link href="/signup" className="g-nav-cta">今すぐ申し込む →</Link>
        </div>
      </nav>

      <main className="g-main">
        <div className="g-hero">
          <span className="g-badge">Guide</span>
          <h1>活用ガイド</h1>
          <p>
            Push-taroの機能を「どう使うか」から、業種ごとの「具体的な運用」まで、
            実店舗のリピート施策に必要なノウハウを徹底解説します。
          </p>
        </div>

        {/* ① 機能別ガイド */}
        <section className="g-sec">
          <div className="g-sec-head">
            <span className="g-sec-num">1</span>
            <div>
              <h2>🔧 機能別ガイド</h2>
              <p>「この機能は何ができるの？」から始める</p>
            </div>
          </div>

          <div className="g-feature-grid">
            <Link href="/guide/features/push-notification" className="g-feature-card">
              <span className="g-feature-icon">📢</span>
              <div className="g-feature-info"><h4>プッシュ通知</h4><p>一斉配信・画像付き通知・リンク遷移</p></div>
              <span className="g-feature-tag is-all">全プラン</span>
            </Link>
            <Link href="/guide/features/coupon-first" className="g-feature-card">
              <span className="g-feature-icon">🎫</span>
              <div className="g-feature-info"><h4>初回クーポン</h4><p>新規顧客の獲得と来店動機</p></div>
              <span className="g-feature-tag is-all">全プラン</span>
            </Link>
            <Link href="/guide/features/coupon-normal" className="g-feature-card">
              <span className="g-feature-icon">🎟️</span>
              <div className="g-feature-info"><h4>通常クーポン</h4><p>何度でも使える常設クーポン</p></div>
              <span className="g-feature-tag is-std">STANDARD+</span>
            </Link>
            <Link href="/guide/features/coupon-loyalty" className="g-feature-card">
              <span className="g-feature-icon">🏆</span>
              <div className="g-feature-info"><h4>特別達成クーポン</h4><p>N回来店で解放、常連化を促進</p></div>
              <span className="g-feature-tag is-std">STANDARD+</span>
            </Link>
            <Link href="/guide/features/coupon-stepup" className="g-feature-card">
              <span className="g-feature-icon">🐾</span>
              <div className="g-feature-info"><h4>ステップアップクーポン</h4><p>段階的に特典アップ</p></div>
              <span className="g-feature-tag is-pro">PRO</span>
            </Link>
            <Link href="/guide/features/coupon-repeat" className="g-feature-card">
              <span className="g-feature-icon">🔄</span>
              <div className="g-feature-info"><h4>連続クーポン</h4><p>消込と同時に次回分を即時発行</p></div>
              <span className="g-feature-tag is-pro">PRO</span>
            </Link>
            <Link href="/guide/features/coupon-birthday" className="g-feature-card">
              <span className="g-feature-icon">🎂</span>
              <div className="g-feature-info"><h4>記念日・誕生日クーポン</h4><p>年1回の特別クーポンを自動配信</p></div>
              <span className="g-feature-tag is-pro">PRO</span>
            </Link>
            <Link href="/guide/features/coupon-dormant" className="g-feature-card">
              <span className="g-feature-icon">💤</span>
              <div className="g-feature-info"><h4>休眠復活クーポン</h4><p>離反顧客を自動で呼び戻す</p></div>
              <span className="g-feature-tag is-pro">PRO</span>
            </Link>
            <Link href="/guide/features/qr-acquisition" className="g-feature-card">
              <span className="g-feature-icon">📱</span>
              <div className="g-feature-info"><h4>QRコード顧客獲得</h4><p>店頭POPから顧客リストを自動構築</p></div>
              <span className="g-feature-tag is-all">全プラン</span>
            </Link>
            <Link href="/guide/features/scheduled-push" className="g-feature-card">
              <span className="g-feature-icon">📅</span>
              <div className="g-feature-info"><h4>予約配信・定期配信</h4><p>日時指定で自動配信</p></div>
              <span className="g-feature-tag is-pro">PRO</span>
            </Link>
            <Link href="/guide/features/referral" className="g-feature-card">
              <span className="g-feature-icon">🤝</span>
              <div className="g-feature-info"><h4>紹介報酬</h4><p>他店舗を紹介で毎月10%還元</p></div>
              <span className="g-feature-tag is-pro">PRO</span>
            </Link>
          </div>
        </section>

        {/* ② 業種別ガイド */}
        <section className="g-sec">
          <div className="g-sec-head">
            <span className="g-sec-num">2</span>
            <div><h2>🏪 業種別ガイド</h2><p>あなたの業種に合わせた活用方法</p></div>
          </div>
          <div className="g-grid">
            <Link href="/guide/salon" className="g-card"><span className="g-card-icon">💇</span><h4>美容室・サロン</h4><p>3回来店で定着する仕組み</p></Link>
            <Link href="/guide/cafe" className="g-card"><span className="g-card-icon">☕</span><h4>飲食店・カフェ</h4><p>雨の日割引・常連客のファン化</p></Link>
            <Link href="/guide/massage" className="g-card"><span className="g-card-icon">💆</span><h4>マッサージ・エステ</h4><p>来店サイクルの可視化</p></Link>
            <Link href="/guide/apparel" className="g-card"><span className="g-card-icon">👕</span><h4>アパレル・雑貨</h4><p>新商品入荷・セール告知</p></Link>
            <Link href="/guide/izakaya" className="g-card"><span className="g-card-icon">🍺</span><h4>バー・居酒屋</h4><p>グループ利用と常連の習慣化</p></Link>
            <Link href="/guide/ramen" className="g-card"><span className="g-card-icon">🍜</span><h4>ラーメン店</h4><p>限定メニューとリピート施策</p></Link>
            <Link href="/guide/sushi" className="g-card"><span className="g-card-icon">🍣</span><h4>寿司店</h4><p>記念日利用と旬のネタ</p></Link>
            <Link href="/guide/snack" className="g-card"><span className="g-card-icon">🍸</span><h4>スナック・パブ</h4><p>常連客と紹介の仕組み</p></Link>
          </div>
        </section>

        {/* ③ テーマ別ガイド */}
        <section className="g-sec">
          <div className="g-sec-head">
            <span className="g-sec-num">3</span>
            <div><h2>🎯 テーマ別ガイド</h2><p>目的から逆引きで探す</p></div>
          </div>
          <div className="g-grid">
            <Link href="/guide/themes/new-customer" className="g-card"><span className="g-card-icon">🆕</span><h4>新規顧客の獲得</h4><p>QRコードと初回クーポンで顧客リスト構築</p></Link>
            <Link href="/guide/themes/repeat" className="g-card"><span className="g-card-icon">🔄</span><h4>リピート施策</h4><p>3回来店で定着する仕組み</p></Link>
            <Link href="/guide/themes/dormant" className="g-card"><span className="g-card-icon">💤</span><h4>休眠顧客の復活</h4><p>離反客を自動で呼び戻す</p></Link>
            <Link href="/guide/themes/birthday" className="g-card"><span className="g-card-icon">🎂</span><h4>記念日・誕生日</h4><p>年1回の特別クーポン</p></Link>
          </div>
        </section>

        {/* ④ 運用ノウハウ */}
        <section className="g-sec">
          <div className="g-sec-head">
            <span className="g-sec-num">4</span>
            <div><h2>📚 運用ノウハウ</h2><p>安全な運用と成功事例</p></div>
          </div>
          <div className="g-grid">
            <Link href="/guide/ng-actions" className="g-card"><span className="g-card-icon">⚠️</span><h4>NG行為集</h4><p>炎上・離反を招く行為</p></Link>
            <Link href="/guide/case-studies" className="g-card"><span className="g-card-icon">📈</span><h4>導入事例</h4><p>成果を出した店舗の事例</p></Link>
          </div>
        </section>

        <div className="g-cta">
          <h3>あなたの店舗でも、はじめてみませんか？</h3>
          <p>配信無制限・7種のクーポン自動配信。<br />Push-taroなら、リピート施策のすべてが1つに。</p>
          <Link href="/signup" className="g-cta-btn">無料相談・資料請求 →</Link>
        </div>
      </main>

      <style jsx global>{`
        .g-nav { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid #e2e8f0; }
        .g-nav-inner { max-width: 1100px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }

        /* LPと完全一致のロゴ */
        .logo { display: flex; align-items: center; font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; text-decoration: none; }
        .logo-mark { width: 34px; height: 34px; flex-shrink: 0; margin-right: 8px; }
        .logo span { color: #ff4500; margin-left: 1px; }
        .logo small { font-size: 11px; font-weight: 600; color: #64748b; letter-spacing: 0; margin-left: 8px; }

        .g-nav-cta { background: #ff4500; color: #fff; padding: 10px 22px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; box-shadow: 0 4px 12px rgba(255,69,0,0.25); }
        .g-main { max-width: 1100px; margin: 0 auto; padding: 40px 24px 80px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans JP", sans-serif; }
        .g-hero { padding: 32px 0 40px; border-bottom: 1px solid #e2e8f0; margin-bottom: 48px; text-align: center; }
        .g-badge { display: inline-block; font-size: 11px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; color: #ff4500; background: #fff7ed; padding: 5px 14px; border-radius: 20px; margin-bottom: 16px; }
        .g-hero h1 { font-size: clamp(28px, 3.6vw, 42px); font-weight: 900; color: #0f172a; letter-spacing: -1px; line-height: 1.25; margin: 0 0 14px; }
        .g-hero p { font-size: 15.5px; color: #64748b; line-height: 1.9; max-width: 720px; margin: 0 auto; }

        .g-sec { margin-bottom: 56px; }
        .g-sec-head { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 24px; }
        .g-sec-num { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; border-radius: 10px; font-size: 16px; font-weight: 900; box-shadow: 0 4px 12px rgba(255,69,0,0.25); flex-shrink: 0; }
        .g-sec-head h2 { font-size: 22px; font-weight: 900; color: #0f172a; margin: 0 0 4px; letter-spacing: -0.5px; }
        .g-sec-head p { font-size: 13px; color: #64748b; margin: 0; }

        .g-feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 14px; }
        .g-feature-card { display: flex; align-items: center; gap: 14px; padding: 18px 20px; background: #fff; border: 2px solid #e2e8f0; border-radius: 14px; text-decoration: none; color: inherit; transition: all 0.2s; }
        .g-feature-card:hover { border-color: #ff4500; transform: translateY(-3px); box-shadow: 0 12px 32px rgba(255,69,0,0.1); }
        .g-feature-icon { font-size: 32px; flex-shrink: 0; }
        .g-feature-info { flex: 1; min-width: 0; }
        .g-feature-info h4 { font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 4px; }
        .g-feature-info p { font-size: 12px; color: #64748b; margin: 0; line-height: 1.5; }
        .g-feature-tag { font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 12px; letter-spacing: 0.3px; flex-shrink: 0; }
        .g-feature-tag.is-all { background: #f1f5f9; color: #64748b; }
        .g-feature-tag.is-std { background: #dbeafe; color: #1e40af; }
        .g-feature-tag.is-pro { background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; }

        .g-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; }
        .g-card { display: block; padding: 20px 18px; background: #fff; border: 2px solid #e2e8f0; border-radius: 14px; text-decoration: none; color: inherit; transition: all 0.2s; }
        .g-card:hover { border-color: #ff4500; transform: translateY(-3px); box-shadow: 0 12px 32px rgba(255,69,0,0.08); }
        .g-card-icon { font-size: 28px; display: block; margin-bottom: 8px; }
        .g-card h4 { font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 6px; }
        .g-card p { font-size: 12.5px; color: #64748b; margin: 0; line-height: 1.6; }

        .g-cta { margin-top: 56px; padding: 40px 32px; background: linear-gradient(160deg, #0f172a, #1e293b); color: #fff; border-radius: 20px; text-align: center; }
        .g-cta h3 { font-size: 22px; font-weight: 900; margin: 0 0 12px; color: #fff; }
        .g-cta p { font-size: 14.5px; color: #94a3b8; margin: 0 0 24px; line-height: 1.8; }
        .g-cta-btn { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; padding: 14px 32px; border-radius: 10px; font-weight: 800; font-size: 15px; text-decoration: none; box-shadow: 0 8px 24px rgba(255,69,0,0.35); }

        @media (max-width: 640px) {
          .g-main { padding: 24px 16px 60px; }
          .logo { font-size: 18px; }
          .logo-mark { width: 28px; height: 28px; margin-right: 6px; }
          .logo small { display: none; }
          .g-nav-cta { padding: 8px 14px; font-size: 12px; }
          .g-feature-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
