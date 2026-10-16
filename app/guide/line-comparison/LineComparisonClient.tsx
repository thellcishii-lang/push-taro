'use client';

import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import './line-comparison.css';

export default function LineComparisonClient() {
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
          <span className="current">LINE公式アカウントとの比較</span>
        </div>

        <div className="g-hero">
          <span className="g-badge">📊 数字で比較</span>
          <h1>LINE公式アカウントの<br />配信上限と、Push-taroとの比較。</h1>
          <p>
            LINE Businessは、<strong>本当に素晴らしいツール</strong>です。<br />
            9,800万人が使う国民的インフラ。友だち登録という低いハードル。<br />
            でも、<strong>「配信上限」という、見えない壁</strong>がある。<br />
            この記事では、その壁を数字で整理します。
          </p>
        </div>

        <div className="g-content">

          {/* ============================================================
              1. LINEの配信通数、正しく理解していますか
          ============================================================ */}
          <h2><span className="num">1</span>LINEの配信通数、正しく理解していますか</h2>

          <p>
            LINE公式アカウントの配信通数は、<strong>「友だち数 × 配信回数」</strong>で消費されます。<br />
            無料プランは月200通、ライトプランは月5,000通、スタンダードプランは月30,000通。
          </p>

          <div className="g-callout info">
            <span className="ico">💡</span>
            <div>
              <p><strong>ここで、多くの人が誤解しているポイントがあります。</strong></p>
              <p>「クーポンは別カウント？」「メッセージと一緒なら1通？」——実は、<strong>送り方によって通数が変わる</strong>のです。</p>
            </div>
          </div>

          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr>
                  <th>送信方法</th>
                  <th>通数カウント</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>メッセージのみ</td>
                  <td>1通</td>
                </tr>
                <tr>
                  <td>メッセージ + クーポン（同時送信）</td>
                  <td className="yes">1通（クーポンは添付扱い）</td>
                </tr>
                <tr>
                  <td>メッセージ + クーポン（別送信）</td>
                  <td className="no">2通（別々にカウント）</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            「同時送信なら1通」と聞くと、得した気分になります。<br />
            でも、ここに<strong>LINEの隠れた弱点</strong>があります。
          </p>

          {/* ============================================================
              2. 「クーポンを別送」が招く、知られざる罠
          ============================================================ */}
          <h2><span className="num">2</span>「クーポンを別送」が招く、知られざる罠</h2>

          <p>
            「メッセージ + クーポン同時送信」で通数を節約すると、何が起きるか。
          </p>

          <div className="g-steps">
            <div className="g-step">
              <div className="g-step-body">
                <h4>① クーポンが、メッセージに埋もれる</h4>
                <p>トーク画面では、メッセージ本文が優先表示されます。クーポンは、下に小さく添付されるだけ。「クーポンが来た」という実感が、薄れる。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>② お客様が、クーポンだけを見返せない</h4>
                <p>LINEのトーク画面は、時系列で流れていきます。「あのクーポン、どこだっけ？」と探すのが、手間になる。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>③ 「今すぐ使える」感が、弱い</h4>
                <p>クーポンは、<strong>独立して目立つから使われる</strong>。メッセージの添付では、その臨場感が出ない。</p>
              </div>
            </div>
          </div>

          <div className="g-callout warn">
            <span className="ico">⚠️</span>
            <div>
              <p><strong>「通数を節約する」か、「クーポンを目立たせる」か。</strong></p>
              <p>LINEでは、この<strong>トレードオフ</strong>から逃れられません。</p>
            </div>
          </div>

          {/* ============================================================
              3. Push-taroは、クーポン配信がカウント対象外
          ============================================================ */}
          <h2><span className="num">3</span>Push-taroは、クーポン配信がカウント対象外</h2>

          <p>
            Push-taroでは、<strong>クーポンの配信は、通数カウントに含まれません</strong>。<br />
            あくまで、プッシュ通知による配信のみが、カウント対象です。
          </p>

          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr>
                  <th>送信内容</th>
                  <th>LINE</th>
                  <th className="col-pushtaro">Push-taro</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>通常メッセージ / プッシュ通知</td>
                  <td>1通</td>
                  <td className="col-pushtaro">1通</td>
                </tr>
                <tr>
                  <td>クーポン配信</td>
                  <td className="no">1通</td>
                  <td className="col-pushtaro yes">0通（カウント外）</td>
                </tr>
                <tr>
                  <td>メッセージ + クーポン同時</td>
                  <td>1通</td>
                  <td className="col-pushtaro yes">1通</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            つまり、Push-taroなら——
          </p>

          <div className="g-quote is-orange">
            プッシュ通知でクーポンの存在を伝え、<br />
            クーポン画面を開いてもらう。<br /><br />
            これが、<strong>通数を増やさずに</strong>できる。
          </div>

          {/* ============================================================
              4. 登録者数別・コスト比較
          ============================================================ */}
          <h2><span className="num">4</span>登録者数別・コスト比較</h2>

          <p>
            では、具体的な数字で見ていきましょう。<br />
            ベースは、<strong>週2回配信（月8回）・うち4回がクーポン</strong>という運用です。
          </p>

          <h3 className="g-h3">ケース①：登録者500人の場合</h3>

          <div className="cost-compare">
            <div className="cost-card is-line">
              <div className="cost-card-head">
                <span className="cost-badge">LINE ライトプラン</span>
                <span className="cost-amount">¥5,000<span className="cost-per">/月</span></span>
              </div>
              <div className="cost-detail">
                <div className="cost-row">
                  <span>配信上限</span>
                  <strong>5,000通</strong>
                </div>
                <div className="cost-row">
                  <span>月8回配信 × 500人</span>
                  <strong>4,000通</strong>
                </div>
                <div className="cost-row">
                  <span>クーポン4回を別送</span>
                  <strong className="is-warn">+2,000通 = 6,000通</strong>
                </div>
                <div className="cost-verdict is-bad">
                  ❌ 上限を超える。追加課金 or スタンダードへ
                </div>
              </div>
            </div>

            <div className="cost-card is-push">
              <div className="cost-card-head">
                <span className="cost-badge is-push">Push-taro LIGHT</span>
                <span className="cost-amount">¥1,980<span className="cost-per">/月</span></span>
              </div>
              <div className="cost-detail">
                <div className="cost-row">
                  <span>配信上限</span>
                  <strong>5,000通</strong>
                </div>
                <div className="cost-row">
                  <span>月8回配信 × 500人</span>
                  <strong>4,000通</strong>
                </div>
                <div className="cost-row">
                  <span>クーポン4回</span>
                  <strong className="is-good">0通（カウント外）</strong>
                </div>
                <div className="cost-verdict is-good">
                  ✅ 余裕あり。クーポンも自由に配信
                </div>
              </div>
            </div>
          </div>

          <h3 className="g-h3">ケース②：登録者1,500人の場合</h3>

          <div className="cost-compare">
            <div className="cost-card is-line">
              <div className="cost-card-head">
                <span className="cost-badge">LINE スタンダード</span>
                <span className="cost-amount">¥15,000<span className="cost-per">/月</span></span>
              </div>
              <div className="cost-detail">
                <div className="cost-row">
                  <span>配信上限</span>
                  <strong>30,000通</strong>
                </div>
                <div className="cost-row">
                  <span>月8回配信 × 1,500人</span>
                  <strong>12,000通</strong>
                </div>
                <div className="cost-row">
                  <span>クーポン4回を別送</span>
                  <strong>+6,000通 = 18,000通</strong>
                </div>
                <div className="cost-verdict is-ok">
                  △ ギリギリ。だが、月¥15,000
                </div>
              </div>
            </div>

            <div className="cost-card is-push">
              <div className="cost-card-head">
                <span className="cost-badge is-push">Push-taro STANDARD</span>
                <span className="cost-amount">¥3,800<span className="cost-per">/月</span></span>
              </div>
              <div className="cost-detail">
                <div className="cost-row">
                  <span>配信上限</span>
                  <strong>15,000通</strong>
                </div>
                <div className="cost-row">
                  <span>月8回配信 × 1,500人</span>
                  <strong>12,000通</strong>
                </div>
                <div className="cost-row">
                  <span>クーポン4回</span>
                  <strong className="is-good">0通（カウント外）</strong>
                </div>
                <div className="cost-verdict is-good">
                  ✅ 余裕あり。LINEの1/4の価格
                </div>
              </div>
            </div>
          </div>

          <h3 className="g-h3">ケース③：登録者3,000人の場合</h3>

          <div className="cost-compare">
            <div className="cost-card is-line">
              <div className="cost-card-head">
                <span className="cost-badge">LINE プロ</span>
                <span className="cost-amount">¥50,000<span className="cost-per">/月</span></span>
              </div>
              <div className="cost-detail">
                <div className="cost-row">
                  <span>配信上限</span>
                  <strong>無制限</strong>
                </div>
                <div className="cost-row">
                  <span>月8回配信 × 3,000人</span>
                  <strong>24,000通</strong>
                </div>
                <div className="cost-row">
                  <span>クーポン4回を別送</span>
                  <strong>+12,000通</strong>
                </div>
                <div className="cost-verdict is-bad">
                  ❌ スタンダード（30,000通）では足りない。プロが必須
                </div>
              </div>
            </div>

            <div className="cost-card is-push">
              <div className="cost-card-head">
                <span className="cost-badge is-push">Push-taro PRO</span>
                <span className="cost-amount">¥10,000<span className="cost-per">/月</span></span>
              </div>
              <div className="cost-detail">
                <div className="cost-row">
                  <span>配信上限</span>
                  <strong className="is-good">無制限</strong>
                </div>
                <div className="cost-row">
                  <span>月8回配信 × 3,000人</span>
                  <strong>無制限（超過なし）</strong>
                </div>
                <div className="cost-row">
                  <span>クーポン4回</span>
                  <strong className="is-good">0通（カウント外）</strong>
                </div>
                <div className="cost-verdict is-good">
                  ✅ LINEの1/5の価格。全クーポン機能が使える
                </div>
              </div>
            </div>
          </div>

          <div className="g-callout success">
            <span className="ico">✅</span>
            <div>
              <p><strong>登録者数が増えるほど、Push-taroの優位性が際立つ</strong></p>
              <p>500人以下の小規模なら、LINE無料プランで足ります。<br />しかし、500人を超えたあたりから、Push-taroの方が安く、自由に配信できます。</p>
            </div>
          </div>

          {/* ============================================================
              5. あなたの店舗は、どっち？
          ============================================================ */}
          <h2><span className="num">5</span>あなたの店舗は、どっち？</h2>

          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr>
                  <th>登録者数</th>
                  <th>推奨</th>
                  <th>理由</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>〜200人</td>
                  <td className="yes">LINE 無料プラン</td>
                  <td>月200通で足りる。まずは無料で始める</td>
                </tr>
                <tr>
                  <td>200〜600人</td>
                  <td className="yes">LINE ライト or Push-taro LIGHT</td>
                  <td>月¥1,980〜で、どちらも運用可能</td>
                </tr>
                <tr>
                  <td>600〜1,500人</td>
                  <td className="yes">Push-taro STANDARD</td>
                  <td>LINEライトでは足りず、スタンダード¥15,000が必要になる</td>
                </tr>
                <tr>
                  <td>1,500〜3,000人</td>
                  <td className="yes">Push-taro STANDARD or PRO</td>
                  <td>LINEスタンダードの1/4〜1/2の価格</td>
                </tr>
                <tr>
                  <td>3,000人以上</td>
                  <td className="yes">Push-taro PRO</td>
                  <td>LINEプロ¥50,000に対し、¥10,000で無制限</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            ただし、これは<strong>「配信コスト」だけの比較</strong>です。<br />
            実際の判断には、通知の届き方・クーポンの使いやすさ・運用のシンプルさも含めて、総合的に考える必要があります。
          </p>

          {/* ============================================================
              6. まずSTANDARDから始める理由
          ============================================================ */}
          <h2><span className="num">6</span>まずSTANDARDから始める理由</h2>

          <p>
            Push-taroには、LIGHT・STANDARD・PROの3プランがあります。<br />
            最初から<strong>PROを使いこなす必要はありません</strong>。
          </p>

          <div className="g-steps">
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 1：LIGHT で、配信の習慣を作る</h4>
                <p>まず「毎週配信する」という習慣を身につける。月5,000通で、500人規模までなら十分。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 2：STANDARD で、来店回数の施策を始める</h4>
                <p>通常クーポン・特別達成クーポンで、「来てくれる人を大切にする」仕組みを追加。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>STEP 3：PRO で、本格的なリピート施策へ</h4>
                <p>ステップアップ・連続・誕生日・休眠復活。ここからが、本番。顧客が1,000人を超えたあたりが、切り替えの目安。</p>
              </div>
            </div>
          </div>

          <div className="g-quote is-orange">
            まずは、STANDARDで<br />
            「全員に同じ施策」を届ける習慣を作る。<br /><br />
            それが、リピート施策の、<br />
            一番の土台になる。
          </div>

          {/* ============================================================
              7. 広告費の「循環」を作る
          ============================================================ */}
          <h2><span className="num">7</span>広告費の「循環」を作る</h2>

          <p>
            最後に、もっと大きな話を。<br />
            Push-taroが目指すのは、<strong>「広告費に依存しない経営体質」</strong>です。
          </p>

          <div className="cycle-diagram">
            <div className="cycle-step">
              <div className="cycle-num">1</div>
              <div className="cycle-content">
                <h4>広告で、集客する</h4>
                <p>オープン時、売上の落ち込み時に、一時的に広告の露出を増やす</p>
              </div>
            </div>
            <div className="cycle-arrow">↓</div>
            <div className="cycle-step">
              <div className="cycle-num">2</div>
              <div className="cycle-content">
                <h4>来店した顧客に、QRで登録してもらう</h4>
                <p>初回クーポンで、登録のハードルを下げる</p>
              </div>
            </div>
            <div className="cycle-arrow">↓</div>
            <div className="cycle-step is-highlight">
              <div className="cycle-num">3</div>
              <div className="cycle-content">
                <h4>プッシュ通知で、毎週リピート施策</h4>
                <p>記憶に残る。習慣になる。リピートする。</p>
              </div>
            </div>
            <div className="cycle-arrow">↓</div>
            <div className="cycle-step">
              <div className="cycle-num">4</div>
              <div className="cycle-content">
                <h4>常連化 → 口コミ → 新規も自然に増える</h4>
                <p>広告費を、通常レベルに戻せる</p>
              </div>
            </div>
          </div>

          <div className="g-callout success">
            <span className="ico">✅</span>
            <div>
              <p><strong>この循環が、実店舗の理想形です。</strong></p>
              <p>広告を打ち続ける経営から、広告を「点」で打つ経営へ。<br />Push-taroは、その循環を作るための、リピート施策の土台です。</p>
            </div>
          </div>

          {/* ============================================================
              8. まとめ
          ============================================================ */}
          <h2><span className="num">8</span>まとめ</h2>

          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr>
                  <th>論点</th>
                  <th>LINE公式</th>
                  <th>Push-taro</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>配信通数の消費</td>
                  <td>クーポンも1通</td>
                  <td className="yes">クーポンはカウント外</td>
                </tr>
                <tr>
                  <td>500人・月8回配信</td>
                  <td>¥5,000〜（別送で上限超え）</td>
                  <td className="yes">¥1,980（余裕あり）</td>
                </tr>
                <tr>
                  <td>1,500人・月8回配信</td>
                  <td>¥15,000（スタンダード）</td>
                  <td className="yes">¥3,800（STANDARD）</td>
                </tr>
                <tr>
                  <td>3,000人・月8回配信</td>
                  <td>¥50,000（プロ）</td>
                  <td className="yes">¥10,000（PRO・無制限）</td>
                </tr>
                <tr>
                  <td>通知の届き方</td>
                  <td>トーク画面（埋もれやすい）</td>
                  <td className="yes">ホーム画面に直接表示</td>
                </tr>
                <tr>
                  <td>クーポンの使いやすさ</td>
                  <td>メッセージに添付</td>
                  <td className="yes">独立したクーポン画面</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            LINEは、素晴らしいツールです。<br />
            否定する気は、まったくありません。<br /><br />
            ただ、<strong>「毎週配信する」という運用を前提にすると、配信上限が壁になる</strong>。<br />
            その壁を外したのが、Push-taroです。
          </p>

          {/* 関連ガイド */}
          <div className="g-related">
            <h3>この記事の前提</h3>
            <div className="g-related-grid">
              <Link href="/guide/store-marketing" className="g-related-card">
                <span className="ico">📖</span>
                <div>
                  <div className="title">実店舗の集客、オススメの施策</div>
                  <div className="sub">LINEの配信上限という壁を、最初に指摘した記事</div>
                </div>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="g-related" style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
            <h3>次に読む</h3>
            <div className="g-related-grid">
              <Link href="/guide/push-notification-metrics" className="g-related-card is-next">
                <span className="ico">📊</span>
                <div>
                  <div className="title">プッシュ通知のCVRは、何%あればいいのか</div>
                  <div className="sub">CTRとCVRのベンチマークを、データで解説</div>
                </div>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="g-related" style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
            <h3>あわせて読みたい</h3>
            <div className="g-related-grid">
              <Link href="/guide/segmentation" className="g-related-card">
                <span className="ico">📊</span>
                <div>
                  <div className="title">セグメント配信とは</div>
                  <div className="sub">実店舗では「使えない」理由</div>
                </div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/ctr-to-cvr" className="g-related-card">
                <span className="ico">🎯</span>
                <div>
                  <div className="title">CTRを、CVRに繋げる方法</div>
                  <div className="sub">衝動タップを、来店に変える3つの設計</div>
                </div>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="g-cta">
            <h3>配信上限を、気にせず。</h3>
            <p>
              Push-taroは、クーポン配信がカウント対象外。<br />
              毎週のリピート施策を、自由に設計できます。
            </p>
            <Link href="/signup" className="g-cta-btn">無料相談・資料請求 →</Link>
          </div>

        </div>
      </main>
    </>
  );
}
