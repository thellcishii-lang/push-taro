'use client';

import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import './guide.css';

export default function GuideClient() {
  return (
    <>
      <nav className="g-nav">
        <div className="g-nav-inner">
          <BrandLogo />
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

        {/* ============================================================
            ① 店舗マーケティングの本質
        ============================================================ */}
        <section className="g-sec">
          <div className="g-sec-head">
            <span className="g-sec-num">1</span>
            <div>
              <h2>🎓 店舗マーケティングの本質</h2>
              <p>「なぜ、そうなのか」を理解する</p>
            </div>
          </div>

          <div className="g-grid">
  <Link href="/guide/store-marketing" className="g-card is-new">
    <span className="g-card-new">NEW</span>
    <span className="g-card-icon">📖</span>
    <h4>実店舗の集客、オススメの施策</h4>
    <p>広告・ポータル・LP・SNS・LINE。全部やる時代に、抜けているもの</p>
  </Link>
  <Link href="/guide/line-comparison" className="g-card is-new">
      <span className="g-card-new">NEW</span>
      <span className="g-card-icon">📊</span>
      <h4>LINE公式アカウントとの比較</h4>
      <p>配信上限という壁を、数字で解説</p>
  </Link>
  <Link href="/guide/push-notification-metrics" className="g-card is-new">
    <span className="g-card-new">NEW</span>
    <span className="g-card-icon">📊</span>
    <h4>プッシュ通知のCVRは、何%あればいいのか</h4>
    <p>CTRとCVRのベンチマークを、データで解説</p>
  </Link>
  <Link href="/guide/ctr-to-cvr" className="g-card is-new">
    <span className="g-card-new">NEW</span>
    <span className="g-card-icon">🎯</span>
    <h4>CTRを、CVRに繋げる方法</h4>
    <p>衝動タップを、来店に変える3つの設計</p>
  </Link>
  <Link href="/guide/segmentation" className="g-card is-new">
    <span className="g-card-new">NEW</span>
    <span className="g-card-icon">📊</span>
    <h4>セグメント配信とは</h4>
    <p>実店舗では「使えない」理由を、数字で解説</p>
  </Link>
  <Link href="/guide/existing-customers" className="g-card is-new">
    <span className="g-card-new">NEW</span>
    <span className="g-card-icon">👥</span>
    <h4>既存客の囲い込み</h4>
    <p>売上が頭打ちになる、本当の理由</p>
  </Link>
</div>
        </section>

        {/* ============================================================
            ② 機能別ガイド
        ============================================================ */}
        <section className="g-sec">
          <div className="g-sec-head">
            <span className="g-sec-num">2</span>
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
            <Link href="/guide/features/qr-acquisition" className="g-feature-card">
              <span className="g-feature-icon">📱</span>
              <div className="g-feature-info"><h4>QRコード顧客獲得</h4><p>店頭POPから顧客リストを自動構築</p></div>
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

        {/* ============================================================
            ③ 業種別ガイド
        ============================================================ */}
        <section className="g-sec">
          <div className="g-sec-head">
            <span className="g-sec-num">3</span>
            <div><h2>🏪 業種別ガイド</h2><p>あなたの業種に合わせた活用方法</p></div>
          </div>
          <div className="g-grid">
            <Link href="/guide/super" className="g-card is-new">
  <span className="g-card-new">NEW</span>
  <span className="g-card-icon">🛒</span>
  <h4>スーパー・小売店</h4>
  <p>チラシを、プッシュ通知に置き換える</p>
</Link>
            <Link href="/guide/bakery" className="g-card is-new">
              <span className="g-card-new">NEW</span>
              <span className="g-card-icon">🥐</span>
              <h4>パン屋・ベーカリー</h4>
              <p>数量限定告知・焼き立て配信・テスト販売</p>
            </Link>
            <Link href="/guide/cafe" className="g-card"><span className="g-card-icon">☕</span><h4>飲食店・カフェ</h4><p>雨の日割引・常連客のファン化</p></Link>
            <Link href="/guide/apparel" className="g-card"><span className="g-card-icon">👕</span><h4>アパレル・雑貨</h4><p>新商品入荷・セール告知</p></Link>
            <Link href="/guide/snack" className="g-card"><span className="g-card-icon">🍸</span><h4>スナック・パブ</h4><p>常連客と紹介の仕組み</p></Link>
          </div>
        </section>

        {/* ============================================================
            ⑤ 運用ノウハウ
        ============================================================ */}
        <section className="g-sec">
          <div className="g-sec-head">
            <span className="g-sec-num">4</span>
            <div><h2>📚 運用ノウハウ</h2><p>安全な運用のために</p></div>
          </div>
          <div className="g-grid">
            <Link href="/guide/ng-actions" className="g-card"><span className="g-card-icon">⚠️</span><h4>NG行為集</h4><p>炎上・離反を招く行為</p></Link>
          </div>
        </section>

        <div className="g-cta">
          <h3>あなたの店舗でも、はじめてみませんか？</h3>
          <p>配信無制限・7種のクーポン自動配信。<br />Push-taroなら、リピート施策のすべてが1つに。</p>
          <Link href="/contact" className="g-cta-btn">無料相談 →</Link>
        </div>
      </main>
    </>
  );
}
