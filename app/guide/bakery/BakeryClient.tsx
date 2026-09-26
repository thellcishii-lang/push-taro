'use client';

import Link from 'next/link';
import './bakery.css';

export default function BakeryClient() {
  return (
    <div className="bakery-page">
      {/* ========== ナビ ========== */}
      <nav className="bakery-nav">
        <div className="bakery-nav-inner">
          <Link href="/" className="bakery-logo">
            Push-taro<span>.</span>
          </Link>
          <Link href="/guide" className="bakery-nav-back">
            ← 活用ガイドに戻る
          </Link>
        </div>
      </nav>

      {/* ========== ヒーロー ========== */}
      <section className="bakery-hero">
        <div className="bakery-container">
          <span className="bakery-badge">🥐 業種別ガイド｜ベーカリー編</span>
          <h1>
            パン屋のための<br />
            プッシュ通知活用術。
          </h1>
          <p className="bakery-lead">
            「本日30個限定 生チョコ食パン15時から」——<br />
            たった1通のプッシュ通知が、パン屋の売上を変えます。<br />
            25年の現場経験から導き出した、実践マニュアル。
          </p>
        </div>
      </section>

      {/* ========== なぜパン屋に効くのか ========== */}
      <section className="bakery-section">
        <div className="bakery-container">
          <h2>なぜパン屋に、<br />プッシュ通知が効くのか</h2>
          <div className="bakery-two-col">
            <div className="bakery-text">
              <h3>「焼き上がり時間」が勝負を決める</h3>
              <p>
                パン屋の最大の魅力は<strong>「焼き立て」</strong>。しかし、お客様は
                「いつ、何が焼き上がるか」を知りません。
              </p>
              <p>
                プッシュ通知なら、<strong>「15時に生チョコ食パンが焼き上がります」</strong>
                と、リアルタイムで届けられます。これは、チラシやSNSでは真似できない即時性です。
              </p>
              <h3>常連客の「今日は何があるかな」を解決</h3>
              <p>
                「今日は行こうかな」と迷っているお客様の背中を、<br />
                <strong>1通の通知で押せる</strong>のが、プッシュ通知です。
              </p>
            </div>
            <div className="bakery-highlight">
              <div className="bakery-highlight-icon">🍞</div>
              <p className="bakery-highlight-text">
                「お店に行かなくとも、<br />
                今日のパンがわかる」<br />
                <strong>これが最大の来店動機。</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 基本編：毎日使える施策 ========== */}
      <section className="bakery-section bakery-section-alt">
        <div className="bakery-container">
          <span className="bakery-tag">BASIC</span>
          <h2>【基本編】毎日使える施策</h2>
          <p className="bakery-subtitle">LIGHT / STANDARD プランでも十分効果が出る、基本の3つ。</p>

          <div className="bakery-case-grid">
            <div className="bakery-case-card">
              <span className="bakery-case-num">01</span>
              <h3>毎日10時の<br />「本日のパン」配信</h3>
              <p>
                朝の準備が終わる10時に、今日のラインナップを配信。
                「今日はあのパンがある」と、お昼の来店動機を作ります。
              </p>
              <div className="bakery-example">
                <div className="bakery-example-label">配信例</div>
                <div className="bakery-example-title">本日のラインナップ</div>
                <div className="bakery-example-body">
                  ・メロンパン（11時焼き上がり）<br />
                  ・カレーパン（12時焼き上がり）<br />
                  ・あんバター（13時焼き上がり）
                </div>
              </div>
            </div>

            <div className="bakery-case-card">
              <span className="bakery-case-num">02</span>
              <h3>「本日30個限定」の<br />数量限定告知</h3>
              <p>
                数量限定は、<strong>最も強い来店動機</strong>。
                「今日しか買えない」という心理が、行動を後押しします。
              </p>
              <div className="bakery-example">
                <div className="bakery-example-label">配信例</div>
                <div className="bakery-example-title">本日30個限定</div>
                <div className="bakery-example-body">
                  15時から、生チョコ食パン<br />
                  30個限定で販売します🥐<br />
                  <strong>お早めに！</strong>
                </div>
              </div>
            </div>

            <div className="bakery-case-card">
              <span className="bakery-case-num">03</span>
              <h3>焼き上がり時間の<br />リアルタイム配信</h3>
              <p>
                「今、焼き上がりました」を配信すると、近隣のお客様が
                すぐに動きます。<strong>「今すぐ行けば買える」</strong>という確信が大事。
              </p>
              <div className="bakery-example">
                <div className="bakery-example-label">配信例</div>
                <div className="bakery-example-title">🔥 焼き立て入荷</div>
                <div className="bakery-example-body">
                  クロワッサン、焼き上がりました！<br />
                  温かいうちに、ぜひ。
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 週次編 ========== */}
      <section className="bakery-section">
        <div className="bakery-container">
          <span className="bakery-tag">WEEKLY</span>
          <h2>【週次編】曜日で仕組化する</h2>
          <p className="bakery-subtitle">曜日ごとにテーマを決めると、常連客の習慣になります。</p>

          <div className="bakery-week-grid">
            <div className="bakery-week-card">
              <div className="bakery-week-day">月曜</div>
              <div className="bakery-week-theme">週の始まりは食パン</div>
              <p>「今週も始まりました。焼きたて食パン、いかがですか？」</p>
            </div>
            <div className="bakery-week-card">
              <div className="bakery-week-day">水曜</div>
              <div className="bakery-week-theme">週替わり惣菜パン</div>
              <p>「今週の惣菜パンは、明太ポテト。」週替わりで飽きさせない。</p>
            </div>
            <div className="bakery-week-card">
              <div className="bakery-week-day">金曜</div>
              <div className="bakery-week-theme">週末限定の特別パン</div>
              <p>「明日はお休み。週末限定の贅沢パン、いかがですか？」</p>
            </div>
            <div className="bakery-week-card">
              <div className="bakery-week-day">土日</div>
              <div className="bakery-week-theme">家族で楽しむパン</div>
              <p>「お子様に人気の動物パン、本日限定でご用意。」</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 季節編 ========== */}
      <section className="bakery-section bakery-section-alt">
        <div className="bakery-container">
          <span className="bakery-tag">SEASONAL</span>
          <h2>【季節編】年間9回のキャンペーン設計</h2>
          <p className="bakery-subtitle">
            マクドナルド式の「定番 + 季節メニュー」。1年を4半期に分け、行事を被らないように配置。
          </p>

          <div className="bakery-season-list">
            <div className="bakery-season-item">
              <span className="bakery-season-when">1月〜2月</span>
              <h4>バレンタイン</h4>
              <p>チョコレート系パン、ハート型の限定パン。3回のステップクーポンで達成型キャンペーン。</p>
            </div>
            <div className="bakery-season-item">
              <span className="bakery-season-when">3月〜4月</span>
              <h4>桜・春</h4>
              <p>桜あんぱん、いちごパン。春の訪れを演出する季節パン。</p>
            </div>
            <div className="bakery-season-item">
              <span className="bakery-season-when">5月</span>
              <h4>ゴールデンウィーク</h4>
              <p>家族向けの特別セット。連休中の朝食需要を取り込む。</p>
            </div>
            <div className="bakery-season-item">
              <span className="bakery-season-when">6月〜8月</span>
              <h4>夏・冷たいパン</h4>
              <p>冷やしクリームパン、塩パン。夏限定の新商品を数量限定で告知。</p>
            </div>
            <div className="bakery-season-item">
              <span className="bakery-season-when">9月〜10月</span>
              <h4>秋・ハロウィン</h4>
              <p>かぼちゃパン、紫いもパン。ハロウィン限定の可愛いパン。</p>
            </div>
            <div className="bakery-season-item">
              <span className="bakery-season-when">11月〜12月</span>
              <h4>クリスマス</h4>
              <p>
                シュトーレン、クリスマス限定パン。11月20日過ぎから
                <strong>3回のステップアップクーポン</strong>を配信。
              </p>
            </div>
          </div>

          <div className="bakery-note">
            <strong>💡 ポイント：</strong>
            ハロウィン〜バレンタインは行事が満載なので、被らないように4半期で配置。
            年間9回のキャンペーン時期が自然と生まれます。
          </div>
        </div>
      </section>

      {/* ========== 応用編：テスト販売 ========== */}
      <section className="bakery-section">
        <div className="bakery-container">
          <span className="bakery-tag">ADVANCED</span>
          <h2>【応用編】テスト販売にも使える</h2>

          <div className="bakery-two-col">
            <div className="bakery-text">
              <h3>新商品のテスト販売</h3>
              <p>
                新しいパンを開発した時、いきなり本メニュー化するのはリスク。
                まず<strong>数量限定でテスト販売</strong>し、反応を見ます。
              </p>
              <h3>メニュー開発の人気度チェック</h3>
              <p>
                「本日20個限定、試作の抹茶あんぱん」と配信し、<br />
                <strong>売れ行きと開封率で人気度を判定</strong>。
              </p>
              <h3>本メニュー化の判断基準</h3>
              <p>
                初回配信で<strong>開封率50%以上、完売</strong>なら本メニュー化。
                反応が薄ければ、レシピを改良して再テスト。
              </p>
            </div>
            <div className="bakery-workflow">
              <div className="bakery-workflow-step">
                <span className="bakery-workflow-num">1</span>
                <div>
                  <strong>試作パンを開発</strong>
                  <p>季節の素材を使った新商品を試作</p>
                </div>
              </div>
              <div className="bakery-workflow-arrow">↓</div>
              <div className="bakery-workflow-step">
                <span className="bakery-workflow-num">2</span>
                <div>
                  <strong>数量限定で配信</strong>
                  <p>「本日20個限定」で反応をチェック</p>
                </div>
              </div>
              <div className="bakery-workflow-arrow">↓</div>
              <div className="bakery-workflow-step">
                <span className="bakery-workflow-num">3</span>
                <div>
                  <strong>開封率と完売を確認</strong>
                  <p>50%以上の開封率 + 完売なら成功</p>
                </div>
              </div>
              <div className="bakery-workflow-arrow">↓</div>
              <div className="bakery-workflow-step is-final">
                <span className="bakery-workflow-num">✓</span>
                <div>
                  <strong>本メニュー化</strong>
                  <p>定番商品としてラインナップに追加</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 1日の運用手順 ========== */}
      <section className="bakery-section bakery-section-dark">
        <div className="bakery-container">
          <span className="bakery-tag">DAILY ROUTINE</span>
          <h2>パン屋の1日、運用手順</h2>
          <p className="bakery-subtitle bakery-subtitle-light">
            毎日のルーティンに組み込めば、5分で運用完了。
          </p>

          <div className="bakery-timeline">
            <div className="bakery-timeline-item">
              <div className="bakery-timeline-time">08:00</div>
              <div className="bakery-timeline-content">
                <h4>朝の準備</h4>
                <p>今日のラインナップと焼き上がり時間を確認</p>
              </div>
            </div>
            <div className="bakery-timeline-item">
              <div className="bakery-timeline-time">10:00</div>
              <div className="bakery-timeline-content">
                <h4>「本日のパン」配信</h4>
                <p>今日のラインナップをプッシュ通知で配信</p>
              </div>
            </div>
            <div className="bakery-timeline-item">
              <div className="bakery-timeline-time">12:00</div>
              <div className="bakery-timeline-content">
                <h4>焼き上がり告知</h4>
                <p>「クロワッサン焼き上がりました」を即時配信</p>
              </div>
            </div>
            <div className="bakery-timeline-item">
              <div className="bakery-timeline-time">15:00</div>
              <div className="bakery-timeline-content">
                <h4>数量限定告知</h4>
                <p>「生チョコ食パン30個限定」を配信</p>
              </div>
            </div>
            <div className="bakery-timeline-item is-final">
              <div className="bakery-timeline-time">17:00</div>
              <div className="bakery-timeline-content">
                <h4>翌日予告</h4>
                <p>「明日は〇〇を焼きます」で翌日の来店動機を作る</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 3つの黄金律 ========== */}
      <section className="bakery-section">
        <div className="bakery-container">
          <h2>パン屋のための3つの黄金律</h2>

          <div className="bakery-rule-grid">
            <div className="bakery-rule-card">
              <div className="bakery-rule-num">01</div>
              <h3>クーポン配信は<br />週2回まで</h3>
              <p>
                毎日送ると通知OFFにされます。
                焼き上がり告知は毎日OK、クーポンは週2回まで。
              </p>
            </div>
            <div className="bakery-rule-card">
              <div className="bakery-rule-num">02</div>
              <h3>「焼き立て」に<br />勝る情報なし</h3>
              <p>
                「今、焼き上がりました」は、パン屋にしか出せない最强的な情報。
                即時性が命です。
              </p>
            </div>
            <div className="bakery-rule-card">
              <div className="bakery-rule-num">03</div>
              <h3>クーポンなしでも<br />お客様は動く</h3>
              <p>
                焼き上がり告知、季節メニュー、数量限定。
                クーポンがなくとも来店動機は作れます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="bakery-section bakery-section-alt">
        <div className="bakery-container">
          <h2>よくあるご質問</h2>
          <div className="bakery-faq">
            <details className="bakery-faq-item">
              <summary>パン屋のプッシュ通知は毎日送ってもいいですか？</summary>
              <p>焼き上がり時間や本日のパンの告知であれば毎日配信しても効果があります。ただしクーポン配信は週2回までが適正です。</p>
            </details>
            <details className="bakery-faq-item">
              <summary>パン屋でプッシュ通知は何を送ればいいですか？</summary>
              <p>「本日30個限定 生チョコ食パン15時から」のような数量限定告知、焼き上がり時間、季節メニューが効果的です。</p>
            </details>
            <details className="bakery-faq-item">
              <summary>テスト販売にプッシュ通知は使えますか？</summary>
              <p>はい。新商品を数量限定で告知し、反応を見てから本メニュー化する判断材料として活用できます。</p>
            </details>
            <details className="bakery-faq-item">
              <summary>LIGHT プランでも十分ですか？</summary>
              <p>はい。焼き上がり告知や本日のパン配信は、LIGHT / STANDARD プランで十分効果が出ます。</p>
            </details>
            <details className="bakery-faq-item">
              <summary>お客様はアプリをインストール必要ですか？</summary>
              <p>不要です。QRコードを読み取って通知を許可するだけ。名前や住所の登録もありません。</p>
            </details>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="bakery-cta">
        <div className="bakery-container">
          <h2>パン屋のリピート施策を、<br />今日から始めよう。</h2>
          <p>25年の現場経験から導き出したノウハウを、そのまま使えます。</p>
          <div className="bakery-cta-buttons">
            <Link href="/signup" className="bakery-cta-btn primary">
              今すぐ申し込む
            </Link>
            <Link href="/guide" className="bakery-cta-btn outline">
              他の業種ガイドを見る
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
