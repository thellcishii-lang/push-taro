import Link from 'next/link';

export const metadata = {
  title: '業種別 活用ガイド | Push-taro',
  description: '美容室・飲食店・マッサージ・アパレルなど、業種別のPush-taro活用方法を徹底解説。新規獲得から休眠復活まで、実店舗のリピート施策を仕組み化するノウハウを公開。',
};

export default function GuideTopPage() {
  return (
    <>
      {/* ページヘッダー */}
      <div className="guide-hero">
        <span className="badge">Guide</span>
        <h1>業種別 活用ガイド</h1>
        <p>
          美容室・飲食店・マッサージ・アパレルなど、業種ごとに最適化されたPush-taroの活用方法を解説します。
          新規顧客の獲得から、リピート施策、休眠顧客の復活まで、実店舗の売上を伸ばすノウハウが満載です。
        </p>
      </div>

      {/* 業種一覧 */}
      <h2 style={{
        fontSize: 18, fontWeight: 800, color: '#1e293b',
        marginBottom: 16, letterSpacing: '-0.3px',
      }}>
        📋 業種から探す
      </h2>

      <div className="guide-grid">
        <Link href="/guide/salon" className="guide-grid-card">
          <span className="icon">💇</span>
          <h4>美容室・サロン</h4>
          <p>3回来店で定着する仕組み。連続クーポン・誕生日クーポン・休眠復活で、リピート率を劇的に改善。</p>
          <span className="arrow">詳しく見る →</span>
        </Link>

        <Link href="/guide/cafe" className="guide-grid-card">
          <span className="icon">☕</span>
          <h4>飲食店・カフェ</h4>
          <p>雨の日割引・新メニュー告知・常連客のファン化。LINE公式の3倍の開封率で、確実にリピートを獲得。</p>
          <span className="arrow">詳しく見る →</span>
        </Link>

        <Link href="/guide/massage" className="guide-grid-card">
          <span className="icon">💆</span>
          <h4>マッサージ・エステ</h4>
          <p>来店サイクルを可視化し、メンテナンス時期を逃さずアプローチ。休眠顧客の復活で、月商を安定化。</p>
          <span className="arrow">詳しく見る →</span>
        </Link>

        <Link href="/guide/apparel" className="guide-grid-card">
          <span className="icon">👕</span>
          <h4>アパレル・雑貨</h4>
          <p>新商品入荷・セール告知を画像付きで配信。固定ファンの買い逃しを防ぎ、季節ごとの売上を最大化。</p>
          <span className="arrow">詳しく見る →</span>
        </Link>
      </div>

      {/* テーマ別 */}
      <h2 style={{
        fontSize: 18, fontWeight: 800, color: '#1e293b',
        margin: '48px 0 16px', letterSpacing: '-0.3px',
      }}>
        🎯 テーマから探す
      </h2>

      <div className="guide-grid">
        <Link href="/guide/themes/new-customer" className="guide-grid-card">
          <span className="icon">🆕</span>
          <h4>新規顧客の獲得</h4>
          <p>QRコードと初回クーポンで、手間なく顧客リストを構築する方法。</p>
          <span className="arrow">詳しく見る →</span>
        </Link>

        <Link href="/guide/themes/repeat" className="guide-grid-card">
          <span className="icon">🔄</span>
          <h4>リピート施策</h4>
          <p>3回来店で定着する仕組みを自動化。連続・ステップアップクーポンの活用法。</p>
          <span className="arrow">詳しく見る →</span>
        </Link>

        <Link href="/guide/themes/dormant" className="guide-grid-card">
          <span className="icon">💤</span>
          <h4>休眠顧客の復活</h4>
          <p>離反しかけた顧客を自動で呼び戻す、休眠復活クーポンの設定術。</p>
          <span className="arrow">詳しく見る →</span>
        </Link>

        <Link href="/guide/themes/birthday" className="guide-grid-card">
          <span className="icon">🎂</span>
          <h4>誕生日クーポン</h4>
          <p>特別感でファン化を加速。誕生日クーポン自動配信のベストプラクティス。</p>
          <span className="arrow">詳しく見る →</span>
        </Link>
      </div>

      {/* 運用ノウハウ */}
      <h2 style={{
        fontSize: 18, fontWeight: 800, color: '#1e293b',
        margin: '48px 0 16px', letterSpacing: '-0.3px',
      }}>
        📚 運用ノウハウ
      </h2>

      <div className="guide-grid">
        <Link href="/guide/ng-actions" className="guide-grid-card">
          <span className="icon">⚠️</span>
          <h4>NG行為集</h4>
          <p>炎上・ブロック・離反を招くNG行為を徹底解説。安全な運用のために必読。</p>
          <span className="arrow">詳しく見る →</span>
        </Link>

        <Link href="/guide/case-studies" className="guide-grid-card">
          <span className="icon">📈</span>
          <h4>導入事例</h4>
          <p>実際に成果を出した店舗の事例を、具体的な数値とともに紹介。</p>
          <span className="arrow">詳しく見る →</span>
        </Link>
      </div>

      {/* CTA */}
      <div className="guide-cta">
        <h3>あなたの店舗でも、はじめてみませんか？</h3>
        <p>
          配信無制限・7種のクーポン自動配信。<br />
          Push-taroなら、リピート施策のすべてが1つに。
        </p>
        <Link href="/signup" className="btn">
          無料相談・資料請求 →
        </Link>
      </div>
    </>
  );
}
