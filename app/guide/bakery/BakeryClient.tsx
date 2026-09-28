'use client';

import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import '../industry.css';

export default function BakeryClient() {
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
          <span className="current">パン屋・ベーカリー</span>
        </div>

        <div className="g-hero">
          <span className="g-badge">🥐 パン屋・ベーカリー向け</span>
          <h1>パン屋・ベーカリーのための<br />Push-taro活用ガイド</h1>
          <p>
            パン屋の最大の武器は<strong>「焼き立て」</strong>。<br />
            「本日30個限定 生チョコ食パン15時から」——たった1通のプッシュ通知が、
            午後のアイドルタイムを一番の売上時間に変えます。
          </p>
        </div>

        <div className="g-content">

          {/* ========== 1. なぜパン屋に効くのか ========== */}
          <h2><span className="num">1</span>なぜパン屋に、プッシュ通知が効くのか</h2>
          <p>
            パン屋の最大の魅力は<strong>「焼き立て」</strong>。しかし、お客様は
            「いつ、何が焼き上がるか」を知りません。
          </p>
          <p>
            プッシュ通知なら、<strong>「15時に生チョコ食パンが焼き上がります」</strong>
            と、リアルタイムで届けられます。これは、チラシやSNSでは真似できない即時性です。
          </p>

          <div className="g-callout info">
            <span className="ico">💡</span>
            <div>
              <p><strong>「お店に行かなくとも、今日のパンがわかる」</strong></p>
              <p>これが最大の来店動機。常連客の「今日は何があるかな」を、1通の通知で解決します。</p>
            </div>
          </div>

          {/* ========== 2. 基本編 ========== */}
          <h2><span className="num">2</span>【基本編】毎日使える施策</h2>
          <p>LIGHT / STANDARD プランでも十分効果が出る、基本の3つ。</p>

          <div className="g-grid">
            <div className="g-card-simple">
              <div className="g-icon-big">📢</div>
              <h4>毎日10時の「本日のパン」</h4>
              <p>朝の準備が終わる10時に、今日のラインナップを配信。お昼の来店動機を作ります。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">🥐</div>
              <h4>「本日30個限定」の数量限定</h4>
              <p>数量限定は最も強い来店動機。「今日しか買えない」が行動を後押しします。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">🔥</div>
              <h4>焼き上がり時間の配信</h4>
              <p>「今、焼き上がりました」を配信すると、近隣のお客様がすぐ動きます。</p>
            </div>
          </div>

          {/* ========== 3. 週次編 ========== */}
          <h2><span className="num">3</span>【週次編】曜日で仕組化する</h2>
          <p>曜日ごとにテーマを決めると、常連客の習慣になります。</p>

          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr>
                  <th>曜日</th>
                  <th>テーマ</th>
                  <th>配信例</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>月曜</td><td>週の始まりは食パン</td><td>「今週も始まりました。焼きたて食パン、いかがですか？」</td></tr>
                <tr><td>水曜</td><td>週替わり惣菜パン</td><td>「今週の惣菜パンは、明太ポテト。」</td></tr>
                <tr><td>金曜</td><td>週末限定の特別パン</td><td>「明日はお休み。週末限定の贅沢パン、いかがですか？」</td></tr>
                <tr><td>土日</td><td>家族で楽しむパン</td><td>「お子様に人気の動物パン、本日限定でご用意。」</td></tr>
              </tbody>
            </table>
          </div>

          {/* ========== 4. 季節編 ========== */}
          <h2><span className="num">4</span>【季節編】年間9回のキャンペーン設計</h2>
          <p>
            マクドナルド式の「定番 + 季節メニュー」。1年を4半期に分け、行事を被らないように配置。
          </p>

          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr>
                  <th>時期</th>
                  <th>テーマ</th>
                  <th>具体例</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1月〜2月</td><td>バレンタイン</td><td>チョコ系パン、ハート型限定パン</td></tr>
                <tr><td>3月〜4月</td><td>桜・春</td><td>桜あんぱん、いちごパン</td></tr>
                <tr><td>5月</td><td>ゴールデンウィーク</td><td>家族向けの特別セット</td></tr>
                <tr><td>6月〜8月</td><td>夏・冷たいパン</td><td>冷やしクリームパン、塩パン</td></tr>
                <tr><td>9月〜10月</td><td>秋・ハロウィン</td><td>かぼちゃパン、紫いもパン</td></tr>
                <tr><td>11月〜12月</td><td>クリスマス</td><td>シュトーレン、クリスマス限定パン</td></tr>
              </tbody>
            </table>
          </div>

          <div className="g-callout info">
            <span className="ico">💡</span>
            <div>
              <p><strong>ポイント：</strong>ハロウィン〜バレンタインは行事が満載なので、被らないように4半期で配置。年間9回のキャンペーン時期が自然と生まれます。</p>
            </div>
          </div>

          {/* ========== 5. 応用編 ========== */}
          <h2><span className="num">5</span>【応用編】テスト販売にも使える</h2>
          <p>
            新しいパンを開発した時、いきなり本メニュー化するのはリスク。
            まず<strong>数量限定でテスト販売</strong>し、反応を見ます。
          </p>

          <div className="g-steps">
            <div className="g-step">
              <div className="g-step-body">
                <h4>試作パンを開発</h4>
                <p>季節の素材を使った新商品を試作。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>数量限定で配信</h4>
                <p>「本日20個限定」で反応をチェック。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>開封率と完売を確認</h4>
                <p>50%以上の開封率 + 完売なら成功。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>本メニュー化</h4>
                <p>定番商品としてラインナップに追加。</p>
              </div>
            </div>
          </div>

          {/* ========== 6. 1日の運用手順 ========== */}
          <h2><span className="num">6</span>パン屋の1日、運用手順</h2>
          <p>毎日のルーティンに組み込めば、5分で運用完了。</p>

          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr>
                  <th>時刻</th>
                  <th>アクション</th>
                  <th>内容</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>08:00</td><td>朝の準備</td><td>今日のラインナップと焼き上がり時間を確認</td></tr>
                <tr><td>10:00</td><td>「本日のパン」配信</td><td>今日のラインナップをプッシュ通知</td></tr>
                <tr><td>12:00</td><td>焼き上がり告知</td><td>「クロワッサン焼き上がりました」を即時配信</td></tr>
                <tr><td>15:00</td><td>数量限定告知</td><td>「生チョコ食パン30個限定」を配信</td></tr>
                <tr><td>17:00</td><td>翌日予告</td><td>「明日は〇〇を焼きます」で翌日の来店動機を作る</td></tr>
              </tbody>
            </table>
          </div>

          {/* ========== 7. 黄金律 ========== */}
          <h2><span className="num">7</span>パン屋のための3つの黄金律</h2>

          <div className="g-grid">
            <div className="g-card-simple">
              <div className="g-icon-big">1️⃣</div>
              <h4>クーポン配信は週2回まで</h4>
              <p>毎日送ると通知OFFにされます。焼き上がり告知は毎日OK、クーポンは週2回まで。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">2️⃣</div>
              <h4>「焼き立て」に勝る情報なし</h4>
              <p>「今、焼き上がりました」は、パン屋にしか出せない最強の情報。即時性が命です。</p>
            </div>
            <div className="g-card-simple">
              <div className="g-icon-big">3️⃣</div>
              <h4>クーポンなしでも動く</h4>
              <p>焼き上がり告知、季節メニュー、数量限定。クーポンがなくとも来店動機は作れます。</p>
            </div>
          </div>

          {/* ========== 9. FAQ ========== */}
          <h2><span className="num">8</span>よくあるご質問</h2>
          <div className="g-faq">
            <details className="g-faq-item">
              <summary>パン屋のプッシュ通知は毎日送ってもいいですか？</summary>
              <p>焼き上がり時間や本日のパンの告知であれば毎日配信しても効果があります。ただしクーポン配信は週2回までが適正です。</p>
            </details>
            <details className="g-faq-item">
              <summary>パン屋でプッシュ通知は何を送ればいいですか？</summary>
              <p>「本日30個限定 生チョコ食パン15時から」のような数量限定告知、焼き上がり時間、季節メニューが効果的です。</p>
            </details>
            <details className="g-faq-item">
              <summary>テスト販売にプッシュ通知は使えますか？</summary>
              <p>はい。新商品を数量限定で告知し、反応を見てから本メニュー化する判断材料として活用できます。</p>
            </details>
            <details className="g-faq-item">
              <summary>LIGHT プランでも十分ですか？</summary>
              <p>はい。焼き上がり告知や本日のパン配信は、LIGHT / STANDARD プランで十分効果が出ます。</p>
            </details>
            <details className="g-faq-item">
              <summary>お客様はアプリをインストール必要ですか？</summary>
              <p>不要です。QRコードを読み取って通知を許可するだけ。名前や住所の登録もありません。</p>
            </details>
          </div>

          {/* ========== 関連ガイド ========== */}
          <div className="g-related">
            <h3>関連ガイド</h3>
            <div className="g-related-grid">
              <Link href="/guide/cafe" className="g-related-card">
                <span className="ico">☕</span>
                <div>
                  <div className="title">飲食店・カフェ向け</div>
                  <div className="sub">業種別ガイド</div>
                </div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/features/coupon-stepup" className="g-related-card">
                <span className="ico">🐾</span>
                <div>
                  <div className="title">ステップアップクーポン</div>
                  <div className="sub">機能別ガイド</div>
                </div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/ng-actions" className="g-related-card">
                <span className="ico">⚠️</span>
                <div>
                  <div className="title">NG行為集</div>
                  <div className="sub">炎上を避ける</div>
                </div>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          {/* ========== CTA ========== */}
          <div className="g-cta">
            <h3>パン屋のリピート施策を、仕組みに。</h3>
            <p>「本日30個限定」「焼き立て」の即時配信で、常連客を育てましょう。</p>
            <Link href="/signup" className="g-cta-btn">無料相談・資料請求 →</Link>
          </div>

        </div>
      </main>
    </>
  );
}
