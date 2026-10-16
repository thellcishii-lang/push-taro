'use client';

import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';

export default function SnackGuidePage() {
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
          <span className="current">スナック・パブ</span>
        </div>

        <div className="g-hero">
          <span className="g-badge">🍸 スナック・パブ向け</span>
          <h1>スナック・パブのための<br />Push-taro活用ガイド</h1>
          <p>
            まず、正直に書きます。<br />
            <strong>顧客200人以下・キャスト1〜2人なら、LINEライトプランで十分です</strong>。<br />
            スナックは「人と人」のビジネス。個別チャットが、最も効率的です。<br />
            この記事では、<strong>「それでもPush-taroが向いているのは、どんな店舗か」</strong>を、正直に解説します。
          </p>
        </div>

        <div className="g-content">

          {/* ============================================================
              1. スナックは「人と人」のビジネス
          ============================================================ */}
          <h2><span className="num">1</span>スナックは、「人と人」のビジネス</h2>

          <p>
            スナックの最大の武器は、<strong>ママ・マスターと常連客の関係性</strong>です。<br />
            そして、常連客同士のつながり。<br />
            これは、他の業種にはない、スナックならではの強みです。
          </p>

          <div className="g-callout info">
            <span className="ico">💡</span>
            <div>
              <p><strong>だから、個別チャットが一番効率的</strong></p>
              <p>
                「今日、来る？」「元気？」——1対1の会話。<br />
                これが、スナックの集客の、最も自然な形です。<br />
                一斉配信よりも、<strong>個別チャットの方が、来店率が高い</strong>ケースが多い。
              </p>
            </div>
          </div>

          <p>
            そして、その個別チャットを、<strong>すでにLINEでやっている</strong>。<br />
            だから、スナックに「Push-taroを導入してください」と言うのは、<br />
            <strong>正直、無理がある</strong>のです。
          </p>

          {/* ============================================================
              2. でも、キャストが増えると、限界が来る
          ============================================================ */}
          <h2><span className="num">2</span>でも、キャストが増えると、限界が来る</h2>

          <p>
            個別チャットは、最強です。<br />
            でも、<strong>キャストが5人以上</strong>になってくると、話が変わります。
          </p>

          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr>
                  <th>規模</th>
                  <th>個別チャット</th>
                  <th>一斉配信の必要性</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ママ1人・顧客100人</td>
                  <td className="yes">◎ 十分可能</td>
                  <td className="no">不要</td>
                </tr>
                <tr>
                  <td>ママ1人・顧客200人</td>
                  <td className="yes">○ ギリギリ</td>
                  <td>△ 週1回なら、あった方が良い</td>
                </tr>
                <tr>
                  <td>キャスト5人・顧客500人</td>
                  <td className="no">❌ 不可能</td>
                  <td className="yes">✅ 必須</td>
                </tr>
                <tr>
                  <td>キャスト10人・顧客1,000人</td>
                  <td className="no">❌ 完全に無理</td>
                  <td className="yes">✅ 毎日配信したい</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            キャストが5人以上になると、<br />
            <strong>「今日のキャスト」を配信したくなる</strong>。<br />
            「今夜は、Mika・Yuki・Rina が出勤です」——これが、来店の決め手になる。
          </p>

          <p>
            これを、個別チャットで500人に送るのは、<strong>物理的に無理</strong>です。<br />
            ここで初めて、<strong>一斉配信の必要性</strong>が生まれます。
          </p>

          {/* ============================================================
              3. まずは、LINEライトプランで十分です
          ============================================================ */}
          <h2><span className="num">3</span>まずは、LINEライトプランで十分です</h2>

          <p>
            ここが、この記事の、最も大切な部分です。<br />
            <strong>顧客200人以下・キャスト1〜2人なら、LINEライトプランで足ります</strong>。
          </p>

          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr>
                  <th>項目</th>
                  <th>LINE ライトプラン</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>月額</td>
                  <td className="yes">¥5,000</td>
                </tr>
                <tr>
                  <td>配信上限</td>
                  <td>5,000通</td>
                </tr>
                <tr>
                  <td>クーポン機能</td>
                  <td className="yes">○ 使える</td>
                </tr>
                <tr>
                  <td>友だち追加</td>
                  <td className="yes">すでに繋がっている</td>
                </tr>
                <tr>
                  <td>個別チャット</td>
                  <td className="yes">無制限・無料</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="g-callout success">
            <span className="ico">✅</span>
            <div>
              <p><strong>スナックに、LINEライトプランは、よく合います。</strong></p>
              <p>
                ・すでに友だちと繋がっている<br />
                ・クーポンも配れる<br />
                ・個別チャットは無料<br />
                ・月¥5,000で、週1回の一斉配信ができる<br /><br />
                <strong>無理に、Push-taroに乗り換える必要は、ありません。</strong>
              </p>
            </div>
          </div>

          {/* ============================================================
              4. Push-taroが向いているのは、こんな店舗
          ============================================================ */}
          <h2><span className="num">4</span>Push-taroが向いているのは、こんな店舗</h2>

          <p>
            では、どんなスナックなら、Push-taroが向いているのか。<br />
            それは、<strong>「LINEの配信上限では、足りなくなった店舗」</strong>です。
          </p>

          <h3 className="g-h3">条件①：キャスト5人以上</h3>

          <p>
            「今日のキャスト」を、毎日配信したい。<br />
            キャスト5人以上、顧客500人以上の規模なら、これが来店の決め手になります。
          </p>

          <h3 className="g-h3">条件②：顧客500人以上</h3>

          <p>
            顧客500人に、月20日配信すると、10,000通。<br />
            LINEライトプラン（5,000通）では、足りません。
          </p>

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
                  <span>月20日配信 × 500人</span>
                  <strong>10,000通</strong>
                </div>
                <div className="cost-verdict is-ok">
                  △ 足りるが、月¥15,000
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
                  <span>月20日配信 × 500人</span>
                  <strong className="is-good">無制限（超過なし）</strong>
                </div>
                <div className="cost-verdict is-good">
                  ✅ LINEより安く、毎日配信できる
                </div>
              </div>
            </div>
          </div>

          <div className="g-callout info">
            <span className="ico">💡</span>
            <div>
              <p><strong>スナックの場合、LINEスタンダードが必要になるのは、この規模から</strong></p>
              <p>
                キャスト5人以上・顧客500人以上。<br />
                この規模なら、Push-taro PRO（¥10,000、配信無制限）の方が、安くて自由。
              </p>
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
                  <th>店舗の規模</th>
                  <th>推奨</th>
                  <th>理由</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ママ1人・顧客100人</td>
                  <td className="yes">LINE 無料プラン</td>
                  <td>個別チャットで十分。月200通も要らない</td>
                </tr>
                <tr>
                  <td>ママ1人・顧客200人</td>
                  <td className="yes">LINE ライトプラン</td>
                  <td>週1回の一斉配信 + 個別チャット。月¥5,000</td>
                </tr>
                <tr>
                  <td>キャスト3人・顧客300人</td>
                  <td className="yes">LINE ライトプラン</td>
                  <td>まだLINEで足りる。クーポンも使える</td>
                </tr>
                <tr>
                  <td>キャスト5人・顧客500人</td>
                  <td className="yes">Push-taro PRO</td>
                  <td>毎日配信したい。LINEスタンダード（¥15,000）より安い</td>
                </tr>
                <tr>
                  <td>キャスト10人・顧客1,000人</td>
                  <td className="yes">Push-taro PRO</td>
                  <td>配信無制限。全クーポン機能が使える</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="g-quote is-orange">
            スナックの多くは、<br />
            LINEライトプランで、十分です。<br /><br />
            Push-taroが要るのは、<br />
            「キャスト5人・顧客500人」を超えた、<br />
            大きな店舗だけ。
          </div>

          {/* ============================================================
              6. 「今日のキャスト」配信という、最強の武器
          ============================================================ */}
          <h2><span className="num">6</span>「今日のキャスト」配信という、最強の武器</h2>

          <p>
            もし、Push-taroを使うなら、<br />
            最も効果的なのが、<strong>「今日のキャスト」配信</strong>です。
          </p>

          <div className="g-steps">
            <div className="g-step">
              <div className="g-step-body">
                <h4>① 今日のキャストを配信する</h4>
                <p>「今夜は、Mika・Yuki・Rina が出勤です🍸」——これを、毎日。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>② 指名客が、来店を決める</h4>
                <p>「Mikaちゃん、今日いるなら行こうかな」——これが、来店の決め手になる。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>③ 暇な日も、告知できる</h4>
                <p>「今夜、空いてるよ」——これを、一斉配信で伝えられる。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>④ イベント告知も、一斉配信</h4>
                <p>「金曜は生演奏」「周年祭」——特別な日を、全員に届ける。</p>
              </div>
            </div>
          </div>

          <div className="g-callout success">
            <span className="ico">✅</span>
            <div>
              <p><strong>「今日のキャスト」配信は、キャスト5人以上のスナックにしか成立しない</strong></p>
              <p>
                ニッチだが、深い。<br />
                指名文化のあるスナックなら、これが最強の集客ツールになります。
              </p>
            </div>
          </div>

          {/* ============================================================
              7. まとめ
          ============================================================ */}
          <h2><span className="num">7</span>まとめ</h2>

          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr>
                  <th>店舗の規模</th>
                  <th>推奨ツール</th>
                  <th>理由</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ママ1人・顧客〜200人</td>
                  <td className="yes">LINE（無料 / ライト）</td>
                  <td>個別チャット + 週1回配信で、十分</td>
                </tr>
                <tr>
                  <td>キャスト3人・顧客〜300人</td>
                  <td className="yes">LINE ライトプラン</td>
                  <td>クーポンも使える。乗り換え不要</td>
                </tr>
                <tr>
                  <td>キャスト5人以上・顧客500人以上</td>
                  <td className="yes">Push-taro PRO</td>
                  <td>毎日配信したい。LINEより安い</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            スナックは、「人と人」のビジネスです。<br />
            個別チャットを、大切にしてください。<br /><br />
            そして、もし<strong>「配信上限が足りない」</strong>と感じたら——<br />
            その時、Push-taroを思い出してください。
          </p>

          <div className="g-quote is-orange">
            無理に、乗り換える必要は、ありません。<br /><br />
            でも、もし必要になったら、<br />
            Push-taroは、そこにあります。
          </div>

          {/* 関連ガイド */}
          <div className="g-related">
            <h3>次に読む</h3>
            <div className="g-related-grid">
              <Link href="/guide/line-comparison" className="g-related-card is-next">
                <span className="ico">📊</span>
                <div>
                  <div className="title">LINE公式アカウントとの比較</div>
                  <div className="sub">配信上限という壁を、数字で解説</div>
                </div>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="g-related" style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
            <h3>あわせて読みたい</h3>
            <div className="g-related-grid">
              <Link href="/guide/izakaya" className="g-related-card">
                <span className="ico">🍺</span>
                <div>
                  <div className="title">バー・居酒屋向け</div>
                  <div className="sub">業種別ガイド</div>
                </div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/features/coupon-dormant" className="g-related-card">
                <span className="ico">💤</span>
                <div>
                  <div className="title">休眠復活クーポン</div>
                  <div className="sub">離反客を呼び戻す</div>
                </div>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="g-cta">
            <h3>まずは、LINEライトプランで。</h3>
            <p>
              スナックの多くは、LINEで足ります。<br />
              もし「配信上限が足りない」と感じたら、<br />
              その時、Push-taroを思い出してください。
            </p>
            <Link href="/guide/line-comparison" className="g-cta-btn">LINEとの比較を見る →</Link>
          </div>

        </div>
      </main>

      <style jsx global>{`
        .g-nav { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid #e2e8f0; }
        .g-nav-inner { max-width: 1100px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
        .g-logo { display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 900; color: #0f172a; text-decoration: none; letter-spacing: -0.5px; }
        .g-logo small { font-size: 11px; font-weight: 600; color: #64748b; }
        .g-nav-cta { background: #ff4500; color: #fff; padding: 10px 22px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; box-shadow: 0 4px 12px rgba(255,69,0,0.25); }
        .g-main { max-width: 860px; margin: 0 auto; padding: 40px 24px 80px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans JP", sans-serif; }
        .g-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #64748b; margin-bottom: 20px; flex-wrap: wrap; }
        .g-breadcrumb a { color: #64748b; text-decoration: none; }
        .g-breadcrumb a:hover { color: #ff4500; }
        .g-breadcrumb .sep { color: #cbd5e1; }
        .g-breadcrumb .current { color: #1e293b; font-weight: 700; }
        .g-hero { padding: 32px 0 40px; border-bottom: 1px solid #e2e8f0; margin-bottom: 40px; }
        .g-badge { display: inline-block; font-size: 11px; font-weight: 800; color: #ff4500; background: #fff7ed; padding: 5px 14px; border-radius: 20px; margin-bottom: 16px; }
        .g-hero h1 { font-size: clamp(26px, 3.4vw, 38px); font-weight: 900; color: #0f172a; letter-spacing: -1px; line-height: 1.25; margin: 0 0 14px; }
        .g-hero p { font-size: 15.5px; color: #64748b; line-height: 1.9; margin: 0; }
        .g-hero p strong { color: #0f172a; }
        .g-content { line-height: 1.9; color: #334155; font-size: 15px; }
        .g-content > h2 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 56px 0 20px; letter-spacing: -0.6px; display: flex; align-items: center; gap: 12px; }
        .g-content > h2:first-of-type { margin-top: 0; }
        .g-content > h2 .num { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; border-radius: 10px; font-size: 16px; font-weight: 900; flex-shrink: 0; }
        .g-content p { margin-bottom: 16px; }
        .g-content strong { color: #0f172a; font-weight: 800; }
        .g-h3 { font-size: 18px; font-weight: 900; color: #0f172a; margin: 32px 0 16px; letter-spacing: -0.4px; padding-left: 14px; border-left: 4px solid #ff4500; }
        .g-quote { margin: 32px auto; padding: 28px 36px; max-width: 640px; background: #f8fafc; border-radius: 16px; text-align: center; font-size: 18px; font-weight: 900; color: #0f172a; line-height: 1.7; letter-spacing: -0.5px; }
        .g-quote.is-orange { background: linear-gradient(135deg, #fff7ed, #ffedd5); color: #c2410c; }
        .g-callout { display: flex; gap: 16px; padding: 20px 24px; border-radius: 14px; margin: 24px 0; align-items: flex-start; }
        .g-callout .ico { flex-shrink: 0; font-size: 22px; line-height: 1; }
        .g-callout p { margin: 0; font-size: 14.5px; line-height: 1.85; }
        .g-callout p + p { margin-top: 8px; }
        .g-callout.info { background: #ebf8ff; border: 1px solid #90cdf4; color: #2c5282; }
        .g-callout.success { background: #f0fdf4; border: 1px solid #86efac; color: #14532d; }
        .g-callout strong { display: block; margin-bottom: 6px; font-weight: 900; }
        .g-callout.info strong { color: #2c5282; }
        .g-callout.success strong { color: #14532d; }
        .g-steps { display: flex; flex-direction: column; gap: 20px; margin: 28px 0; counter-reset: gstep; }
        .g-step { display: flex; gap: 20px; align-items: flex-start; }
        .g-step::before { counter-increment: gstep; content: counter(gstep); flex-shrink: 0; width: 44px; height: 44px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; }
        .g-step-body { flex: 1; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; }
        .g-step-body h4 { margin: 0 0 8px; font-size: 15px; font-weight: 800; color: #0f172a; }
        .g-step-body p { margin: 0; font-size: 14px; color: #475569; }
        .g-table-wrap { overflow-x: auto; margin: 24px 0; border-radius: 12px; border: 1px solid #e2e8f0; background: #fff; }
        .g-table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 500px; }
        .g-table th, .g-table td { padding: 14px 18px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        .g-table thead th { background: #f8fafc; font-weight: 800; color: #0f172a; font-size: 13px; border-bottom: 2px solid #e2e8f0; }
        .g-table tbody tr:last-child td { border-bottom: none; }
        .g-table .yes { color: #16a34a; font-weight: 800; }
        .g-table .no { color: #dc2626; font-weight: 800; }
        .cost-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 24px 0; }
        .cost-card { background: #fff; border: 2px solid #e2e8f0; border-radius: 16px; overflow: hidden; }
        .cost-card.is-line { border-color: #06c755; }
        .cost-card.is-push { border-color: #ff4500; }
        .cost-card-head { padding: 18px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .cost-card.is-line .cost-card-head { background: #f0fdf4; }
        .cost-card.is-push .cost-card-head { background: #fff7ed; }
        .cost-badge { font-size: 11px; font-weight: 900; padding: 4px 12px; border-radius: 10px; background: #06c755; color: #fff; }
        .cost-badge.is-push { background: linear-gradient(135deg, #ff4500, #f97316); }
        .cost-amount { font-family: 'Inter', sans-serif; font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
        .cost-card.is-line .cost-amount { color: #047857; }
        .cost-card.is-push .cost-amount { color: #c2410c; }
        .cost-per { font-size: 12px; font-weight: 600; color: #64748b; margin-left: 2px; }
        .cost-detail { padding: 18px 20px; }
        .cost-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; font-size: 13.5px; border-bottom: 1px dashed #e2e8f0; }
        .cost-row:last-of-type { border-bottom: none; }
        .cost-row span { color: #64748b; }
        .cost-row strong { color: #0f172a; font-weight: 800; }
        .cost-row strong.is-good { color: #16a34a; }
        .cost-verdict { margin-top: 12px; padding: 12px 16px; border-radius: 10px; font-size: 13px; font-weight: 800; text-align: center; line-height: 1.6; }
        .cost-verdict.is-ok { background: #fffbeb; color: #78350f; }
        .cost-verdict.is-good { background: #f0fdf4; color: #14532d; }
        .g-related { margin-top: 64px; padding-top: 32px; border-top: 2px solid #e2e8f0; }
        .g-related > h3 { font-size: 14px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #64748b; margin: 0 0 20px; }
        .g-related-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
        .g-related-card { display: flex; align-items: center; gap: 12px; padding: 16px 18px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; text-decoration: none; color: inherit; transition: all 0.2s; }
        .g-related-card:hover { border-color: #ff4500; transform: translateX(4px); }
        .g-related-card .ico { font-size: 24px; flex-shrink: 0; }
        .g-related-card .title { font-size: 14px; font-weight: 800; color: #0f172a; line-height: 1.3; }
        .g-related-card .sub { font-size: 11.5px; color: #64748b; margin-top: 2px; }
        .g-related-card .arrow { color: #ff4500; font-size: 16px; font-weight: 900; margin-left: auto; }
        .g-related-card.is-next { border-color: #ff4500; background: linear-gradient(135deg, #fff7ed, #ffedd5); box-shadow: 0 8px 20px rgba(255,69,0,0.10); }
        .g-related-card.is-next .title { color: #c2410c; font-size: 15px; }
        .g-related-card.is-next .arrow { font-size: 18px; }
        .g-cta { margin-top: 56px; padding: 40px 32px; background: linear-gradient(160deg, #0f172a, #1e293b); color: #fff; border-radius: 20px; text-align: center; }
        .g-cta h3 { font-size: 22px; font-weight: 900; margin: 0 0 12px; color: #fff; }
        .g-cta p { font-size: 14.5px; color: #94a3b8; margin-bottom: 24px; line-height: 1.8; }
        .g-cta-btn { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; padding: 14px 32px; border-radius: 10px; font-weight: 800; font-size: 15px; text-decoration: none; box-shadow: 0 8px 24px rgba(255,69,0,0.35); }
        @media (max-width: 640px) {
          .g-main { padding: 24px 16px 60px; }
          .g-logo { font-size: 17px; }
          .g-nav-cta { padding: 8px 14px; font-size: 12px; }
          .cost-compare { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
