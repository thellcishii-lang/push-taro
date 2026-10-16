'use client';

import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import './security.css';

export default function SecurityClient() {
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
          <span className="current">セキュリティ</span>
        </div>

        <div className="g-hero">
          <span className="g-badge">🔒 セキュリティ</span>
          <h1>なぜ、Push-taroは<br />顧客情報を取らないのか。</h1>
          <p>
            大手企業の情報流出が、日常になっています。<br />
            顧客情報を取れば取るほど、<strong>リスクは増える</strong>。<br />
            Push-taroが保存するのは、<strong>電話番号だけ</strong>です。
          </p>
        </div>

        <div className="g-content">

          {/* 1 */}
          <h2><span className="num">1</span>情報流出が、日常になった</h2>

          <p>
            ここ数年、大手企業の情報流出が、後を絶ちません。<br />
            ニュースで、毎週のように報じられています。
          </p>

          <div className="g-callout danger">
            <span className="ico">🚨</span>
            <div>
              <p><strong>「あの大手でも、漏れる」</strong></p>
              <p>
                どれだけセキュリティに投資しても、<strong>100%は防げない</strong>。<br />
                これが、今の時代の現実です。
              </p>
            </div>
          </div>

          <p>
            そして、経営者は、考え始めています。
          </p>

          <div className="g-quote is-orange">
            「うちの店の顧客情報、<br />
            本当に必要だったのか？」
          </div>

          {/* 2 */}
          <h2><span className="num">2</span>顧客情報を取れば取るほど、リスクは増える</h2>

          <p>
            情報流出のリスクは、<strong>保存する情報の量に比例</strong>します。
          </p>

          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr>
                  <th>保存する情報</th>
                  <th>漏洩時のリスク</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>氏名・住所</td>
                  <td className="no">なりすまし・詐欺のリスク</td>
                </tr>
                <tr>
                  <td>生年月日・性別</td>
                  <td className="no">個人特定のリスク</td>
                </tr>
                <tr>
                  <td>購買履歴</td>
                  <td className="no">プライバシー侵害</td>
                </tr>
                <tr>
                  <td>クレジットカード情報</td>
                  <td className="no">金銭的被害・最大のリスク</td>
                </tr>
                <tr>
                  <td><strong>電話番号</strong></td>
                  <td className="yes">相対的に、リスクは最小</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            つまり、<strong>「情報を取らなければ、漏れない」</strong>。<br />
            これは、最もシンプルで、最も確実な、セキュリティ対策です。
          </p>

          {/* 3 */}
          <h2><span className="num">3</span>Push-taroが保存するのは、電話番号だけ</h2>

          <p>
            Push-taroは、<strong>この発想を、徹底しました</strong>。
          </p>

          <div className="security-detail">
            <div className="security-detail-col is-yes">
              <h4>✅ 保存する情報</h4>
              <ul>
                <li>電話番号（SMS認証済み）</li>
                <li>クーポン消込履歴</li>
                <li>来店回数・最終来店日</li>
              </ul>
            </div>
            <div className="security-detail-col is-no">
              <h4>❌ 保存しない情報</h4>
              <ul>
                <li>氏名</li>
                <li>住所</li>
                <li>生年月日・性別</li>
                <li>購買履歴（何を買ったか）</li>
                <li>クレジットカード情報</li>
              </ul>
            </div>
          </div>

          <h3 className="g-h3">なぜ、電話番号だけなのか</h3>

          <p>
            理由は、シンプルです。
          </p>

          <div className="g-steps">
            <div className="g-step">
              <div className="g-step-body">
                <h4>① 通知を届けるのに、電話番号で足りる</h4>
                <p>Push-taroの目的は、プッシュ通知を届けること。名前も住所も、必要ありません。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>② 不正利用の防止に、電話番号で足りる</h4>
                <p>SMS認証で、1人1回の登録を保証。クーポンの使い回しを、防げます。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>③ それ以上は、取らない</h4>
                <p>「取れるから取る」ではなく、「必要だから取る」。Push-taroは、後者です。</p>
              </div>
            </div>
          </div>

          {/* 4 */}
          <h2><span className="num">4</span>漏洩時のリスクを、最小化する設計</h2>

          <p>
            仮に、Push-taroが攻撃を受けたとします。<br />
            漏れる可能性があるのは、<strong>電話番号のリストだけ</strong>。
          </p>

          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr>
                  <th>もし、漏れたら</th>
                  <th>被害</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>電話番号</td>
                  <td>迷惑電話・SMSのリスク</td>
                </tr>
                <tr>
                  <td>氏名・住所</td>
                  <td className="yes">漏れない</td>
                </tr>
                <tr>
                  <td>購買履歴</td>
                  <td className="yes">漏れない</td>
                </tr>
                <tr>
                  <td>クレジットカード情報</td>
                  <td className="yes">漏れない</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            つまり、<strong>被害を、最小限に抑えられる</strong>。<br />
            これは、<strong>構造的な強み</strong>です。運用力でカバーするのではなく、<strong>設計で防いでいる</strong>。
          </p>

          {/* 5 */}
          <h2><span className="num">5</span>それでも、完璧ではない。だから、正直に。</h2>

          <p>
            ここで、<strong>正直に書きます</strong>。
          </p>

          <div className="g-callout warn">
            <span className="ico">⚠️</span>
            <div>
              <p><strong>「絶対に、漏れない」とは、言いません。</strong></p>
              <p>
                電話番号も、個人情報保護法上は、<strong>個人情報</strong>です。<br />
                漏洩すれば、報告義務が生じる可能性もあります。<br /><br />
                Push-taroが言えるのは、<strong>「漏れる情報を、最小限にしている」</strong>ということ。
              </p>
            </div>
          </div>

          <p>
            でも、これは、他のツールには、<strong>真似できない</strong>ことです。<br />
            氏名・住所・購買履歴を取るツールは、<strong>リスクを減らせない</strong>。
          </p>

          <div className="g-quote is-orange">
            漏れる情報を、最小化する。<br /><br />
            これが、Push-taroの、<br />
            最も誠実な、セキュリティ対策です。
          </div>

          <div className="g-callout success">
            <span className="ico">✅</span>
            <div>
              <p><strong>顧客情報を、取らない、という選択。</strong></p>
              <p>
                Push-taroは、「取れるから取る」を、やめました。<br />
                実店舗に、本当に必要なものだけを、シンプルに。<br />
                それが、結果として、最も強いセキュリティになります。
              </p>
            </div>
          </div>

          {/* 関連 */}
          <div className="g-related">
            <h3>次に読む</h3>
            <div className="g-related-grid">
              <Link href="/guide/segmentation" className="g-related-card is-next">
                <span className="ico">📊</span>
                <div>
                  <div className="title">セグメント配信とは</div>
                  <div className="sub">実店舗では「使えない」理由</div>
                </div>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="g-related" style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
            <h3>あわせて読みたい</h3>
            <div className="g-related-grid">
              <Link href="/guide/store-marketing" className="g-related-card">
                <span className="ico">📖</span>
                <div>
                  <div className="title">実店舗の集客、オススメの施策</div>
                  <div className="sub">店舗マーケティングの理論</div>
                </div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/line-comparison" className="g-related-card">
                <span className="ico">📊</span>
                <div>
                  <div className="title">LINE公式アカウントとの比較</div>
                  <div className="sub">配信上限という壁を、数字で解説</div>
                </div>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="g-cta">
            <h3>顧客情報を、取らない。</h3>
            <p>
              Push-taroが保存するのは、電話番号だけ。<br />
              漏洩時のリスクを、最小化する設計です。
            </p>
            <Link href="/signup" className="g-cta-btn">無料相談 →</Link>
          </div>

        </div>
      </main>
    </>
  );
}
