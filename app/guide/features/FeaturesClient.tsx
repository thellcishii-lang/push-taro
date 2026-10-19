'use client';

import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import './features.css'; // ★ 専用CSSを読み込む

export default function FeaturesClient() {
  return (
    <>
      <nav className="g-nav">
        <div className="g-nav-inner">
          <BrandLogo />
          <Link href="/signup" className="g-nav-cta">今すぐ申し込む →</Link>
        </div>
      </nav>

      <main className="g-main">

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
    </>
  );
}
