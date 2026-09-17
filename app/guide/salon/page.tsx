import Link from 'next/link';

export const metadata = {
  title: '美容室・サロン向け Push-taro活用ガイド',
  description: '美容室の新規客獲得コストは1人あたり3万円。Push-taroで3回来店で定着する仕組みを自動化し、リピート率を劇的に改善する方法を解説します。',
};

export default function SalonGuidePage() {
  return (
    <>
      {/* パンくず */}
      <div className="guide-breadcrumb">
        <Link href="/guide">ガイド</Link>
        <span className="sep">/</span>
        <span className="current">美容室・サロン</span>
      </div>

      {/* ページヘッダー */}
      <div className="guide-hero">
        <span className="badge">💇 美容室・サロン向け</span>
        <h1>美容室・サロンのための<br />Push-taro活用ガイド</h1>
        <p>
          美容サロンの新規客獲得コストは、1人あたり<strong>平均30,000円</strong>。
          新規獲得に頼り続ける経営から脱却し、既存客のリピートで安定した売上を作る方法を解説します。
        </p>
      </div>

      <div className="guide-content">

        {/* 業界の課題 */}
        <h2><span className="num">1</span>美容サロン業界が抱える3つの課題</h2>

        <div className="guide-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <div className="guide-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💸</div>
            <h4 style={{ marginTop: 0 }}>新規獲得コストが高い</h4>
            <p style={{ fontSize: 13, color: '#64748b' }}>
              ホットペッパー等の掲載費で、1人あたり<strong>3万円</strong>。これが毎月の重い負担に。
            </p>
          </div>
          <div className="guide-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔄</div>
            <h4 style={{ marginTop: 0 }}>リピート率が低い</h4>
            <p style={{ fontSize: 13, color: '#64748b' }}>
              新規客の<strong>7割が1回で離反</strong>。「また来たい」と思わせる仕組みがない。
            </p>
          </div>
          <div className="guide-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💤</div>
            <h4 style={{ marginTop: 0 }}>休眠客の放置</h4>
            <p style={{ fontSize: 13, color: '#64748b' }}>
              3ヶ月来ていない顧客に、<strong>何もアプローチできていない</strong>。
            </p>
          </div>
        </div>

        <div className="guide-callout info">
          <span className="ico">💡</span>
          <div>
            <p><strong>美容サロンの成功は、リピート率で決まる</strong></p>
            <p>新規獲得に頼る経営から、既存客のリピートで安定させる経営へ。これが美容サロンが生き残る唯一の道です。</p>
          </div>
        </div>

        {/* 3回来店で定着する仕組み */}
        <h2><span className="num">2</span>3回来店で、お客様は定着する</h2>

        <p>
          美容サロン業界では、<strong>「3回来店した顧客は、その後も継続して通い続ける」</strong>というデータがあります。
          逆に言えば、<strong>3回まで来店させられれば、その顧客は離反しない</strong>ということです。
        </p>

        {/* 図解 */}
        <div className="guide-diagram">
          <svg viewBox="0 0 720 260" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="arrowGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ff4500" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>

            {/* 1回目 */}
            <circle cx="100" cy="120" r="60" fill="#fff7ed" stroke="#ff4500" strokeWidth="2" />
            <text x="100" y="112" fontSize="14" fontWeight="800" textAnchor="middle" fill="#ff4500">1回目</text>
            <text x="100" y="132" fontSize="11" textAnchor="middle" fill="#64748b">初回クーポン</text>
            <text x="100" y="148" fontSize="11" textAnchor="middle" fill="#64748b">で来店</text>

            {/* 矢印1 */}
            <path d="M170 120 L230 120" stroke="url(#arrowGrad)" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#ff4500" />
              </marker>
            </defs>

            {/* 2回目 */}
            <circle cx="290" cy="120" r="60" fill="#fff7ed" stroke="#ff4500" strokeWidth="2" />
            <text x="290" y="112" fontSize="14" fontWeight="800" textAnchor="middle" fill="#ff4500">2回目</text>
            <text x="290" y="132" fontSize="11" textAnchor="middle" fill="#64748b">連続クーポン</text>
            <text x="290" y="148" fontSize="11" textAnchor="middle" fill="#64748b">で再来</text>

            {/* 矢印2 */}
            <path d="M360 120 L420 120" stroke="url(#arrowGrad)" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />

            {/* 3回目 */}
            <circle cx="480" cy="120" r="60" fill="#ff4500" stroke="#e03e00" strokeWidth="2" />
            <text x="480" y="112" fontSize="14" fontWeight="800" textAnchor="middle" fill="#fff">3回目</text>
            <text x="480" y="132" fontSize="11" textAnchor="middle" fill="#ffe4d6">特別達成</text>
            <text x="480" y="148" fontSize="11" textAnchor="middle" fill="#ffe4d6">クーポン</text>

            {/* 矢印3 */}
            <path d="M550 120 L610 120" stroke="url(#arrowGrad)" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />

            {/* 定着 */}
            <text x="650" y="115" fontSize="22" textAnchor="middle">🎉</text>
            <text x="650" y="140" fontSize="13" fontWeight="800" textAnchor="middle" fill="#16a34a">定着</text>
          </svg>
        </div>

        <div className="guide-callout success">
          <span className="ico">✅</span>
          <div>
            <p><strong>「あと1回行くと特別クーポンがもらえる」</strong>という仕組みが、来店のきっかけを作ります。</p>
            <p>Push-taroなら、これを全自動で運用できます。</p>
          </div>
        </div>

        {/* 具体的な運用フロー */}
        <h2><span className="num">3</span>美容サロン向け 運用フロー</h2>

        <div className="guide-steps">
          <div className="guide-step">
            <div className="guide-step-body">
              <h4>STEP 1：QRコードを店頭に設置</h4>
              <p>管理画面から生成した店舗専用QRコードを、POPに印刷してカウンター・鏡前に設置。お客様は待ち時間に読み取るだけ。</p>
            </div>
          </div>

          <div className="guide-step">
            <div className="guide-step-body">
              <h4>STEP 2：初回クーポンで顧客獲得</h4>
              <p>通知登録と同時に、初回限定クーポンを自動配布。「次回使える〇%OFF」が再来店の動機になります。</p>
            </div>
          </div>

          <div className="guide-step">
            <div className="guide-step-body">
              <h4>STEP 3：連続クーポンで2回目来店</h4>
              <p>初回来店の消込と同時に、次回クーポンを即時発行。有効期限を14日間に設定し、来店サイクルを短縮。</p>
            </div>
          </div>

          <div className="guide-step">
            <div className="guide-step-body">
              <h4>STEP 4：3回目で特別達成クーポン</h4>
              <p>累計3回来店で、特別な達成クーポンを解放。「あと1回で特別クーポン」の心理が、確実な来店を促します。</p>
            </div>
          </div>

          <div className="guide-step">
            <div className="guide-step-body">
              <h4>STEP 5：誕生日・休眠復活で長期化</h4>
              <p>誕生日クーポンで特別感を演出。60日来店が無い顧客には、休眠復活クーポンを自動配信して呼び戻します。</p>
            </div>
          </div>
        </div>

        {/* 推奨クーポン設計 */}
        <h2><span className="num">4</span>美容サロンで推奨するクーポン設計</h2>

        <div className="guide-table-wrap">
          <table className="guide-table">
            <thead>
              <tr>
                <th>クーポン種別</th>
                <th>目的</th>
                <th>推奨設定</th>
                <th>必要プラン</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>🎫 初回限定</td>
                <td>新規顧客の獲得</td>
                <td>カット10%OFF など</td>
                <td className="yes">LIGHT〜</td>
              </tr>
              <tr>
                <td>🔄 連続</td>
                <td>2回目来店の促進</td>
                <td>14日間有効の次回割引</td>
                <td className="yes">PRO</td>
              </tr>
              <tr>
                <td>🏆 特別達成</td>
                <td>3回来店で定着</td>
                <td>3回で15%OFF</td>
                <td className="yes">STANDARD〜</td>
              </tr>
              <tr>
                <td>🐾 ステップアップ</td>
                <td>段階的な特典</td>
                <td>1回目→2回目→3回目で豪華に</td>
                <td className="yes">PRO</td>
              </tr>
              <tr>
                <td>🎂 誕生日</td>
                <td>特別感の演出</td>
                <td>誕生日月に20%OFF</td>
                <td className="yes">PRO</td>
              </tr>
              <tr>
                <td>💤 休眠復活</td>
                <td>離反顧客の呼び戻し</td>
                <td>60日未来店で30%OFF</td>
                <td className="yes">PRO</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="guide-callout warn">
          <span className="ico">⚠️</span>
          <div>
            <p><strong>POINT：割引率は「高すぎず、低すぎず」</strong></p>
            <p>初回クーポンは10〜15%、休眠復活は20〜30%が効果的。<strong>50%OFFなどの過度な割引は、常連客の離反を招く</strong>ので避けましょう。</p>
          </div>
        </div>

        {/* 活用アイデア */}
        <h2><span className="num">5</span>美容サロン向け 活用アイデア</h2>

        <div className="guide-grid">
          <div className="guide-card">
            <h4>☔ 雨の日限定クーポン</h4>
            <p>「雨の日は空いている」という特性を活かし、雨の日限定の割引を配信。平日の稼働率を上げられます。</p>
          </div>
          <div className="guide-card">
            <h4>💇 新メニュー告知</h4>
            <p>新メニューや新商品の入荷を、画像付きで配信。興味を持った顧客が予約に繋がります。</p>
          </div>
          <div className="guide-card">
            <h4>📅 予約リマインド</h4>
            <p>「前回の来店から1ヶ月が経ちました」という通知で、自然な再来店を促します。</p>
          </div>
          <div className="guide-card">
            <h4>🎉 季節キャンペーン</h4>
            <p>春の新生活応援、夏の紫外線対策など、季節に合わせた施策で来店動機を作ります。</p>
          </div>
          <div className="guide-card">
            <h4>👯 友達紹介キャンペーン</h4>
            <p>「お友達と一緒なら2人とも10%OFF」など、紹介を促すキャンペーンも効果的。</p>
          </div>
          <div className="guide-card">
            <h4>📸 スタイル写真の配信</h4>
            <p>新作スタイルの写真を配信し、「これにしたい」という気持ちを刺激します。</p>
          </div>
        </div>

        {/* 導入事例 */}
        <h2><span className="num">6</span>導入事例</h2>

        <div className="guide-card">
          <h4>📍 都内 美容室 A様（3店舗展開）</h4>
          <p style={{ marginBottom: 12 }}>
            <strong>導入前：</strong>リピート率 45% / 月商 250万円<br />
            <strong>導入後：</strong>リピート率 <strong style={{ color: '#16a34a' }}>72%</strong> / 月商 <strong style={{ color: '#16a34a' }}>380万円</strong>
          </p>
          <p>
            連続クーポンと誕生日クーポンの自動配信で、来店サイクルが短縮。
            「次にいつ来ればいいか」が自然に伝わる仕組みができました。
          </p>
        </div>

        <div className="guide-card">
          <h4>📍 埼玉県 美容室 B様（個人経営）</h4>
          <p style={{ marginBottom: 12 }}>
            <strong>導入前：</strong>休眠顧客率 60%<br />
            <strong>導入後：</strong>休眠顧客率 <strong style={{ color: '#16a34a' }}>32%</strong>
          </p>
          <p>
            休眠復活クーポンで、3ヶ月来ていなかった顧客が戻ってくるように。
            「気になっていたけど、きっかけが無かった」という声が多く、効果を実感しています。
          </p>
        </div>

        {/* 関連ページ */}
        <div className="guide-related">
          <h3>関連ガイド</h3>
          <div className="guide-related-grid">
            <Link href="/guide/salon/three-visits" className="guide-related-card">
              <span className="ico">🎯</span>
              <div className="text">
                <div className="title">3回来店で定着する仕組み</div>
                <div className="sub">美容サロン向け詳細ガイド</div>
              </div>
              <span className="arrow">→</span>
            </Link>
            <Link href="/guide/salon/birthday" className="guide-related-card">
              <span className="ico">🎂</span>
              <div className="text">
                <div className="title">誕生日クーポンの活用法</div>
                <div className="sub">特別感でファン化を加速</div>
              </div>
              <span className="arrow">→</span>
            </Link>
            <Link href="/guide/salon/winback" className="guide-related-card">
              <span className="ico">💤</span>
              <div className="text">
                <div className="title">離反防止・休眠復活</div>
                <div className="sub">失いかけた顧客を呼び戻す</div>
              </div>
              <span className="arrow">→</span>
            </Link>
            <Link href="/guide/ng-actions" className="guide-related-card">
              <span className="ico">⚠️</span>
              <div className="text">
                <div className="title">NG行為集</div>
                <div className="sub">炎上・離反を招く行為</div>
              </div>
              <span className="arrow">→</span>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="guide-cta">
          <h3>美容サロンのリピート施策を、仕組みに。</h3>
          <p>
            Push-taroなら、3回来店で定着する仕組みを全自動で運用できます。<br />
            まずは無料相談から、お気軽にどうぞ。
          </p>
          <Link href="/signup" className="btn">
            無料相談・資料請求 →
          </Link>
        </div>

      </div>
    </>
  );
}
