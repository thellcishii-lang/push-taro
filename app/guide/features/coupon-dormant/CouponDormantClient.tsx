'use client';

import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import '../../industry.css'; // ★ 共通CSSを読み込み

export default function CouponDormantClient() {
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
          <span className="current">休眠復活クーポン</span>
        </div>

        <div className="g-hero">
          <span className="g-badge is-pro">🔥 PRO 限定</span>
          <h1>💤 休眠復活クーポン</h1>
          <p>
            最終来店から<strong>N日以上経過したお客様を自動抽出</strong>し、
            特別な復帰クーポンを自動配信。離反しかけた顧客を、確実に呼び戻します。
          </p>
        </div>

        <div className="g-content">

          <h2 className="g-h2"><span className="num">1</span>この機能でできること</h2>
          <div className="g-feature-list">
            <div className="g-feature-item"><span className="ico">🔍</span><div><strong>休眠顧客を自動抽出</strong><p>最終来店から指定日数が経過した顧客を、システムが自動で検出。</p></div></div>
            <div className="g-feature-item"><span className="ico">📢</span><div><strong>自動で復帰クーポン配信</strong><p>特別なクーポンと共に、お久しぶりの通知をお届け。</p></div></div>
            <div className="g-feature-item"><span className="ico">📅</span><div><strong>再送信間隔を自動制御</strong><p>同じ人にしつこく送らないよう、システムが30日間隔で制御。</p></div></div>
            <div className="g-feature-item"><span className="ico">🎯</span><div><strong>休眠判定日数を自由に設定</strong><p>業種に合わせて「30日」「60日」「90日」などを選択可能。</p></div></div>
          </div>

          <h2 className="g-h2"><span className="num">2</span>仕組み</h2>
          <div className="g-flow">
            <div className="g-flow-item"><div className="g-flow-circle">来店</div><p>クーポン利用</p></div>
            <div className="g-flow-arrow">→</div>
            <div className="g-flow-item"><div className="g-flow-circle">60日経過</div><p>自動検知</p></div>
            <div className="g-flow-arrow">→</div>
            <div className="g-flow-item"><div className="g-flow-circle is-highlight">自動配信</div><p>復帰クーポン</p></div>
            <div className="g-flow-arrow">→</div>
            <div className="g-flow-item"><div className="g-flow-circle is-success">🎉</div><p>再来店で<br />復活</p></div>
          </div>

          <div className="g-callout info">
            <span className="ico">💡</span>
            <div>
              <strong>既存客の復活は、新規獲得の5倍効率的</strong>
              <p>新規獲得に5,000〜30,000円かかるのに対し、休眠客の復活は<strong>ほぼゼロコスト</strong>。
              しかも元々店舗を知っているので、成約率が高いのです。</p>
            </div>
          </div>

          <h2 className="g-h2"><span className="num">3</span>休眠判定の推奨日数</h2>
          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr><th>業種</th><th>通常の来店サイクル</th><th>休眠判定</th></tr>
              </thead>
              <tbody>
                <tr><td>美容室・サロン</td><td>30〜45日</td><td className="yes">60日</td></tr>
                <tr><td>飲食店・カフェ</td><td>7〜14日</td><td className="yes">30日</td></tr>
                <tr><td>マッサージ・エステ</td><td>30〜60日</td><td className="yes">90日</td></tr>
                <tr><td>アパレル・雑貨</td><td>30〜90日</td><td className="yes">90日</td></tr>
                <tr><td>スナック・パブ</td><td>14〜30日</td><td className="yes">60日</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="g-h2"><span className="num">4</span>設定手順</h2>
          <div className="g-steps">
            <div className="g-step">
              <div className="g-step-body">
                <h4>「🔥 PRO機能」タブを開く</h4>
                <p>「💤 休眠復活クーポン設定」セクションまでスクロール。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>「有効にする」にチェック</h4>
                <p>設定項目が表示されます。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>休眠判定日数を設定</h4>
                <p>業種に合わせて、30日 / 60日 / 90日 から選択。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>復帰クーポンのタイトル・メッセージを入力</h4>
                <p>「お久しぶりです。特別な復帰クーポンをご用意しました🎁」など。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>「✅ 設定完了」をタップ</h4>
                <p>以降、毎日Cronが自動で休眠顧客をチェックし、配信します。</p>
              </div>
            </div>
          </div>

          <h2 className="g-h2"><span className="num">5</span>画面イメージ</h2>
          <div className="g-mockup">
            <div className="g-mockup-tabs">
              <span>📢 即時通知</span>
              <span>🏪 店舗設定</span>
              <span className="is-active-green">🔥 PRO機能</span>
              <span>📅 予約</span>
            </div>
            <div className="g-mockup-card">
              <div className="g-mockup-h3">💤 休眠復活クーポン</div>
              <div className="g-checkbox-row"><span className="g-checkbox is-on">✓</span><span>有効にする</span></div>
              <div className="g-mockup-label">対象条件</div>
              <div className="g-mockup-input">最終利用から 60 日経過した顧客</div>
              <div className="g-mockup-label">復帰クーポンタイトル</div>
              <div className="g-mockup-input">お久しぶりクーポン 20%OFF</div>
              <div className="g-mockup-label">お久しぶりメッセージ</div>
              <div className="g-mockup-textarea">お久しぶりです。またお会いできるのを楽しみにしています🎁</div>
              <div className="g-checkbox-row"><span className="g-checkbox">□</span><span>特別達成クーポンに追加する</span></div>
            </div>
          </div>

          <h2 className="g-h2"><span className="num">6</span>おすすめ設定</h2>
          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr><th>項目</th><th>推奨</th><th>理由</th></tr>
              </thead>
              <tbody>
                <tr><td>休眠判定日数</td><td className="yes">60〜90日</td><td>来店サイクルの2〜3倍が効果的</td></tr>
                <tr><td>割引率</td><td className="yes">20〜30%OFF</td><td>通常より手厚く、戻ってくる動機に</td></tr>
                <tr><td>有効期限</td><td className="yes">30〜60日</td><td>お久しぶりの方にも使いやすい期間</td></tr>
                <tr><td>メッセージ</td><td className="yes">親しみやすく</td><td>「お久しぶりです」など、押し付けない文体</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="g-h2"><span className="num">7</span>業種別の活用例</h2>
          <div className="g-grid">
            <Link href="/guide/salon" className="g-card"><span className="g-card-icon">💇</span><h4>美容室・サロン</h4><p>「3ヶ月来店なし → 20%OFF」</p></Link>
            <Link href="/guide/cafe" className="g-card"><span className="g-card-icon">☕</span><h4>飲食店・カフェ</h4><p>「1ヶ月来店なし → ドリンク無料」</p></Link>
            <Link href="/guide/massage" className="g-card"><span className="g-card-icon">💆</span><h4>マッサージ</h4><p>「3ヶ月来店なし → 30%OFF」</p></Link>
            <Link href="/guide/snack" className="g-card"><span className="g-card-icon">🍸</span><h4>スナック・パブ</h4><p>「2ヶ月来店なし → 1杯無料」</p></Link>
          </div>

          <div className="g-related">
            <h3>関連機能</h3>
            <div className="g-related-grid">
              <Link href="/guide/features/coupon-birthday" className="g-related-card">
                <span className="ico">🎂</span>
                <div><div className="title">記念日・誕生日クーポン</div><div className="sub">年1回の特別配信</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/features/coupon-loyalty" className="g-related-card">
                <span className="ico">🏆</span>
                <div><div className="title">特別達成クーポン</div><div className="sub">N回来店で解放</div></div>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="g-cta">
            <h3>休眠顧客を、自動で呼び戻す</h3>
            <p>離反しかけた顧客を、Push-taroの休眠復活クーポンで。</p>
            <Link href="/signup" className="g-cta-btn">無料相談・資料請求 →</Link>
          </div>
        </div>
      </main>
    </>
  );
}
