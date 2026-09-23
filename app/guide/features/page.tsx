'use client';

import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';

export default function FeaturesIndexPage() {
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
          <span className="current">機能別ガイド</span>
        </div>

        <div className="g-hero">
          <span className="g-badge">Features</span>
          <h1>機能別ガイド</h1>
          <p>各機能の「何ができるか」「どう使うか」「おすすめの設定」を、実際の画面イメージとともに解説します。</p>
        </div>

        <h2 className="g-h2">📢 配信・通知系</h2>
        <div className="g-feature-grid">
          <Link href="/guide/features/push-notification" className="g-feature-card">
            <span className="g-feature-icon">📢</span>
            <div className="g-feature-info"><h4>プッシュ通知</h4><p>一斉配信・画像付き通知・リンク遷移</p></div>
            <span className="g-feature-tag is-all">全プラン</span>
          </Link>
          <Link href="/guide/features/scheduled-push" className="g-feature-card">
            <span className="g-feature-icon">📅</span>
            <div className="g-feature-info"><h4>予約配信・定期配信</h4><p>日時指定・毎週・毎月の自動配信</p></div>
            <span className="g-feature-tag is-pro">PRO</span>
          </Link>
        </div>

        <h2 className="g-h2">🎫 クーポン系</h2>
        <div className="g-feature-grid">
          <Link href="/guide/features/coupon-first" className="g-feature-card">
            <span className="g-feature-icon">🎫</span>
            <div className="g-feature-info"><h4>初回クーポン</h4><p>登録と同時に配布、新規獲得</p></div>
            <span className="g-feature-tag is-all">全プラン</span>
          </Link>
          <Link href="/guide/features/coupon-normal" className="g-feature-card">
            <span className="g-feature-icon">🎟️</span>
            <div className="g-feature-info"><h4>通常クーポン</h4><p>何度でも使える常設クーポン</p></div>
            <span className="g-feature-tag is-std">STANDARD+</span>
          </Link>
          <Link href="/guide/features/coupon-loyalty" className="g-feature-card">
            <span className="g-feature-icon">🏆</span>
            <div className="g-feature-info"><h4>特別達成クーポン</h4><p>N回来店で解放、常連化</p></div>
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
            <div className="g-feature-info"><h4>記念日・誕生日クーポン</h4><p>年1回の特別クーポン</p></div>
            <span className="g-feature-tag is-pro">PRO</span>
          </Link>
          <Link href="/guide/features/coupon-dormant" className="g-feature-card">
            <span className="g-feature-icon">💤</span>
            <div className="g-feature-info"><h4>休眠復活クーポン</h4><p>離反客を自動で呼び戻す</p></div>
            <span className="g-feature-tag is-pro">PRO</span>
          </Link>
        </div>

        <h2 className="g-h2">📱 顧客獲得系</h2>
        <div className="g-feature-grid">
          <Link href="/guide/features/qr-acquisition" className="g-feature-card">
            <span className="g-feature-icon">📱</span>
            <div className="g-feature-info"><h4>QRコード顧客獲得</h4><p>店頭POPから顧客リストを自動構築</p></div>
            <span className="g-feature-tag is-all">全プラン</span>
          </Link>
        </div>

        <h2 className="g-h2">💰 収益化系</h2>
        <div className="g-feature-grid">
          <Link href="/guide/features/referral" className="g-feature-card">
            <span className="g-feature-icon">🤝</span>
            <div className="g-feature-info"><h4>紹介報酬</h4><p>他店舗を紹介で毎月10%還元</p></div>
            <span className="g-feature-tag is-pro">PRO</span>
          </Link>
        </div>

        <div className="g-related">
          <h3>関連ガイド</h3>
          <div className="g-related-grid">
            <Link href="/guide" className="g-related-card">
              <span className="ico">🏠</span>
              <div><div className="title">ガイドTOP</div><div className="sub">全体を見る</div></div>
              <span className="arrow">→</span>
            </Link>
            <Link href="/guide/salon" className="g-related-card">
              <span className="ico">💇</span>
              <div><div className="title">業種別ガイド</div><div className="sub">美容室・サロン向け</div></div>
              <span className="arrow">→</span>
            </Link>
          </div>
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
        .g-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #64748b; margin-bottom: 20px; }
        .g-breadcrumb a { color: #64748b; text-decoration: none; }
        .g-breadcrumb a:hover { color: #ff4500; }
        .g-breadcrumb .sep { color: #cbd5e1; }
        .g-breadcrumb .current { color: #1e293b; font-weight: 700; }
        .g-hero { padding: 32px 0 40px; border-bottom: 1px solid #e2e8f0; margin-bottom: 40px; }
        .g-badge { display: inline-block; font-size: 11px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; color: #ff4500; background: #fff7ed; padding: 5px 14px; border-radius: 20px; margin-bottom: 16px; }
        .g-hero h1 { font-size: clamp(26px, 3.4vw, 38px); font-weight: 900; color: #0f172a; letter-spacing: -1px; line-height: 1.25; margin: 0 0 14px; }
        .g-hero p { font-size: 15.5px; color: #64748b; line-height: 1.9; max-width: 720px; margin: 0; }
        .g-h2 { font-size: 18px; font-weight: 800; color: #1e293b; margin: 40px 0 16px; letter-spacing: -0.3px; }
        .g-h2:first-of-type { margin-top: 0; }

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

        .g-related { margin-top: 56px; padding-top: 32px; border-top: 2px solid #e2e8f0; }
        .g-related > h3 { font-size: 14px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #64748b; margin: 0 0 20px; }
        .g-related-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
        .g-related-card { display: flex; align-items: center; gap: 12px; padding: 16px 18px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; text-decoration: none; color: inherit; transition: all 0.2s; }
        .g-related-card:hover { border-color: #ff4500; transform: translateX(4px); }
        .g-related-card .ico { font-size: 24px; flex-shrink: 0; }
        .g-related-card .title { font-size: 14px; font-weight: 800; color: #0f172a; line-height: 1.3; }
        .g-related-card .sub { font-size: 11.5px; color: #64748b; margin-top: 2px; }
        .g-related-card .arrow { color: #ff4500; font-size: 16px; font-weight: 900; margin-left: auto; }

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
