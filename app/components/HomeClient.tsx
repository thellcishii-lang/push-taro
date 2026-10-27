'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { faqs } from '../data/faq';

function useScrollReveal() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const selectors = ['.reveal', '.reveal-left', '.reveal-right', '.tilt-in', '.tilt-in-left', '.tilt-in-right'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => observer.observe(el));
    });
    return () => observer.disconnect();
  }, []);
}

function useCountUp() {
  useEffect(() => {
    const animate = (el: HTMLElement) => {
      const target = Number(el.dataset.count || 0);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const startTime = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.floor(target * eased);
        el.textContent = current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString() + suffix;
      };
      requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll('[data-count]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function HomeClient() {
  useScrollReveal();
  useCountUp();

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-inner">
          <a href="/" className="logo">
            <Image className="logo-mark" src="/icon-192x192.png" alt="Push-taro ロゴ" width={34} height={34} priority />
            Push-taro<span className="dot">.</span>
            <small>実店舗のためのプッシュ通知 × クーポンアプリ</small>
          </a>
          <div className="nav-links">
            <a href="#why-now">なぜ今</a>
            <a href="#philosophy">思想</a>
            <a href="#features">機能</a>
            <a href="#interface">画面</a>
            <a href="#comparison">他社比較</a>
            <a href="#pricing">料金</a>
            <Link href="/signup" className="nav-cta">今すぐ始める</Link>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-badge reveal">
              <span className="dot-live"></span>
              2026年9月 正式リリース・先行登録受付中
            </div>
            <h1 className="reveal" style={{ transitionDelay: '0.1s' }}>
              実店舗のリピートを、<br />
              <span className="gradient">&quot;プッシュ通知 × クーポンアプリ&quot;</span> で。
            </h1>
            <p className="hero-lead reveal" style={{ transitionDelay: '0.2s' }}>
              高機能なマーケティングツールは、<br />
              使いこなすために専門チームが必要です。<br />
              <strong>Push-taroは、違います。</strong><br />
              顧客データを集めず、QRコード一つ。<br />
              全員に同じ施策から始めて、<br />
              来てくれる人に、感謝をカタチに。
            </p>
            <div className="hero-cta reveal" style={{ transitionDelay: '0.3s' }}>
              <Link href="/signup" className="btn-primary">
                今すぐ申し込む
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a href="#pricing" className="btn-secondary">料金プランを見る</a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat tilt-in float">
                <div className="hero-stat-num">最大<span className="count-up" data-count="10">10</span><small>倍</small></div>
                <div className="hero-stat-label">メルマガ比 クリック率</div>
                <p className="hero-stat-note">開封率はメールの約3倍、クリック率は約10倍。</p>
              </div>
              <div className="hero-stat tilt-in float" style={{ transitionDelay: '0.1s' }}>
                <div className="hero-stat-num"><span className="count-up" data-count="7">7</span><small>種類</small></div>
                <div className="hero-stat-label">クーポン自動配信</div>
              </div>
              <div className="hero-stat tilt-in float" style={{ transitionDelay: '0.2s' }}>
                <div className="hero-stat-num">無制限</div>
                <div className="hero-stat-label">PROプラン配信数</div>
              </div>
              <div className="hero-stat tilt-in float" style={{ transitionDelay: '0.3s' }}>
                <div className="hero-stat-num"><span className="count-up" data-count="3">3</span><small>種</small></div>
                <div className="hero-stat-label">収益化プログラム</div>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT IS */}
        <section className="section what-is-section" id="what-is">
          <div className="container">
            <div className="what-is-card reveal">
              <span className="section-tag">What is Push-taro</span>
              <h2>Push-taroとは</h2>
              <p className="what-is-lead">
                Push-taroは、実店舗のための<strong>「プッシュ通知 × クーポンアプリ」</strong>です。<br />
                顧客データを集めず、QRコード一つで始められる、<br />
                新しいカタチのリピート施策ツール。
              </p>
              <div className="what-is-qa">
                <h3 className="what-is-qa-q">
                  <span className="q-mark">Q.</span>
                  Push-taro（プッシュタロー）の利用料金はいくらですか？
                </h3>
                <p className="what-is-qa-a">
                  Push-taroは、実店舗の規模に合わせて選べる明快な料金プランをご用意しています。<br />
                  小規模店舗向けの<strong>「LIGHTプラン」なら月額1,980円（月間5,000通まで）</strong>、<br />
                  大型店舗や複数店舗向けの<strong>「PROプラン」なら月額10,000円で配信無制限</strong>でご利用いただけます。<br />
                  追加の従量課金は一切ありません。
                </p>
                <a href="#pricing" className="what-is-qa-link">詳しい機能と料金プランを見る →</a>
              </div>
              <div className="what-is-points">
                <div className="what-is-point">
                  <span className="what-is-point-icon">📢</span>
                  <div><strong>プッシュ通知</strong><p>ホーム画面に、直接届く</p></div>
                </div>
                <div className="what-is-point">
                  <span className="what-is-point-icon">🎫</span>
                  <div><strong>クーポンアプリ</strong><p>クーポンは、自動で反映</p></div>
                </div>
                <div className="what-is-point">
                  <span className="what-is-point-icon">🔒</span>
                  <div><strong>顧客情報を、取らない</strong><p>電話番号だけ。漏れるリスクを最小化</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY NOW */}
        <section className="section" id="why-now">
          <div className="container">
            <div className="section-header reveal">
              <span className="section-tag">Why Now</span>
              <h2>なぜ、今、プッシュ通知なのか。</h2>
              <p>2023年、iPhoneがWebアプリのプッシュ通知に対応。<br />これで国内のスマホ全般で使えるようになりました。<br />
                <a href="https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/" target="_blank" rel="noopener noreferrer">WebKitによる対応の発表</a>
              </p>
            </div>
            <div className="timeline">
              <div className="timeline-item tilt-in">
                <div className="timeline-year">2015</div>
                <div className="timeline-content">
                  <h4>Android、プッシュ通知に対応</h4>
                  <p>Androidは早くからWebアプリのプッシュ通知をサポートしていました。ただ、iPhoneユーザーには届きませんでした。</p>
                </div>
              </div>
              <div className="timeline-item is-highlight tilt-in" style={{ transitionDelay: '0.1s' }}>
                <div className="timeline-year">2023</div>
                <div className="timeline-content">
                  <h4>iPhone、Webアプリのプッシュ通知に対応</h4>
                  <p>iOS 16.4以降で、ホーム画面に追加したWebアプリがプッシュ通知を受け取れるように。これでiPhoneユーザーにも届けられるようになりました。</p>
                </div>
              </div>
              <div className="timeline-item is-final tilt-in" style={{ transitionDelay: '0.2s' }}>
                <div className="timeline-year">NOW</div>
                <div className="timeline-content">
                  <h4>国内のスマホ全般で、プッシュ通知が可能に</h4>
                  <p>iPhone・Android、どちらのユーザーにも、Webアプリから直接お得を届けられる時代になりました。</p>
                </div>
              </div>
            </div>
            <div className="why-now-compare">
              <div className="why-now-card is-corporate tilt-in-left">
                <h4>🏢 大手企業は、すでに活用中</h4>
                <p>プッシュ通知の開封率の高さをいち早く理解し、Webサイトからの通知をどんどん増やしています。</p>
              </div>
              <div className="why-now-card is-shop tilt-in-right">
                <h4>🏪 実店舗では、まだ普及率が低い</h4>
                <p>この恩恵を、実店舗はまだ上手に使えていません。<br />だからこそ、今がチャンスです。</p>
              </div>
            </div>
          </div>
        </section>

        {/* WHY COUPON */}
        <section className="section section-alt" id="why-coupon">
          <div className="container">
            <div className="section-header reveal">
              <span className="section-tag">Why Coupon</span>
              <h2>プッシュ通知 × クーポンで、<br />来店の理由を作る。</h2>
              <p>「お知らせ」だけでは、見てもらえない。<br />「お得」とセットで届けるから、来店に繋がる。</p>
            </div>
            <div className="coupon-example-grid reveal">
              <div className="coupon-example is-bad">
                <h4 className="coupon-example-title"><span className="icon">❌</span> お知らせだけ（ダメな例）</h4>
                <div className="coupon-example-text">「本日も元気に営業中！<br />イチゴタルトが焼き上がりました🍓」</div>
                <p className="coupon-example-result">→ 「ふーん」で終わってしまう。</p>
              </div>
              <div className="coupon-example is-good">
                <h4 className="coupon-example-title"><span className="icon">✅</span> お得とセット（Push-taroの例）</h4>
                <div className="coupon-example-text">「【15時まで限定】<br />焼き立てイチゴタルト<strong>50円引きクーポン</strong>が届きました！<br />お会計時に提示してください🍰」</div>
                <p className="coupon-example-result">→ 「じゃあ、15時までに行こうかな」と繋がる。</p>
              </div>
            </div>
            <div className="why-coupon-flow">
              <div className="wc-step tilt-in">
                <div className="wc-num">1</div>
                <div className="wc-icon">📢</div>
                <h4>プッシュ通知が届く</h4>
                <p>ホーム画面に、直接メッセージが届きます。メールやLINEより、圧倒的に見られます。</p>
              </div>
              <div className="wc-arrow">→</div>
              <div className="wc-step is-highlight tilt-in" style={{ transitionDelay: '0.1s' }}>
                <div className="wc-num">2</div>
                <div className="wc-icon">🎁</div>
                <h4>「お得」がないと、削除される</h4>
                <p>ただのお知らせでは、お客様はホーム画面から削除してしまいます。だからクーポンとセットが必要です。</p>
              </div>
              <div className="wc-arrow">→</div>
              <div className="wc-step is-final tilt-in" style={{ transitionDelay: '0.2s' }}>
                <div className="wc-num">3</div>
                <div className="wc-icon">🎯</div>
                <h4>来店・リピートに繋がる</h4>
                <p>「今すぐ使えるクーポン」なら、来店の理由になります。リピートにも自然と繋がります。</p>
              </div>
            </div>
            <div className="before-after">
              <div className="ba-col is-before tilt-in-left">
                <h4>❌ Before</h4>
                <ul>
                  <li>チラシ・DMを打っても、効果が見えない</li>
                  <li>一度来たお客様が、再来店しない</li>
                  <li>クーポンアプリは重くて、登録されない</li>
                </ul>
              </div>
              <div className="ba-col is-after tilt-in-right">
                <h4>✅ After</h4>
                <ul>
                  <li>QRを読み取るだけで、お客様が登録</li>
                  <li>来店ごとに、次のクーポンが自動配信</li>
                  <li>「喜んで頂ける仕組み」が、自然に回り出す</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section className="section" id="philosophy">
          <div className="container">
            <div className="section-header reveal">
              <span className="section-tag">Philosophy</span>
              <h2>実店舗に、<br />本当に必要なものだけ。</h2>
              <p>大手マーケティングツールの真似ではなく、<br />実店舗のリアルに合わせた設計です。</p>
            </div>
            <div className="philosophy-statement reveal">
              <span className="quote-mark">&quot;</span>
              <h3>セグメント配信（顧客を属性ごとに分けて配信すること）・<br />高度な分析・A/Bテスト——<br />それらを実店舗で使いこなすには、<br />専門のマーケティングチームが不可欠です。</h3>
              <p>適当に使っても、効果は限定的。<br />数十万〜数百万の顧客を抱えるECサイトならともかく、<br />数百〜数千人の顧客を相手にする実店舗では、<br /><strong>費用対効果が合いません。</strong></p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Link href="/guide/segmentation" className="philosophy-statement-link">📊 セグメント配信が、実店舗では「使えない」理由を詳しく読む</Link>
            </div>
            <div className="philosophy-compare">
              <div className="pc-card is-wrong tilt-in-left">
                <span className="pc-badge">業界の「間違い」</span>
                <h4>大手ツールがやってること</h4>
                <ul className="pc-list">
                  <li><span className="ico">✕</span><span>専門マーケターが何時間もかけて設計</span></li>
                  <li><span className="ico">✕</span><span>年齢・性別・来店頻度で顧客を細かく分類</span></li>
                  <li><span className="ico">✕</span><span>PDCA（計画・実行・確認・改善のサイクル）を毎月回す前提</span></li>
                  <li><span className="ico">✕</span><span>実店舗では「なんであの人だけ？」と差別になりかねない</span></li>
                  <li><span className="ico">✕</span><span>効果のない通知を打ち続けて、ホーム画面から削除される</span></li>
                </ul>
              </div>
              <div className="pc-card is-right tilt-in-right">
                <span className="pc-badge">Push-taroの「正解」</span>
                <h4>実店舗に本当に必要なこと</h4>
                <ul className="pc-list">
                  <li><span className="ico">◎</span><span>まず、<strong>全員に同じ施策</strong>ができること</span></li>
                  <li><span className="ico">◎</span><span>その上で、<strong>来てくれる人への感謝</strong>をカタチに</span></li>
                  <li><span className="ico">◎</span><span>特別な知識も、マーケティング専任チームも、必要ありません</span></li>
                  <li><span className="ico">◎</span><span>シンプルだからこそ、<strong>続けられる</strong></span></li>
                  <li><span className="ico">◎</span><span>「差別」ではなく「お返し」としての仕組み</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECURITY */}
        <section className="section security-section" id="security">
          <div className="container">
            <div className="section-header reveal">
              <span className="section-tag">Security</span>
              <h2>顧客情報を、取らない。<br />という安心。</h2>
              <p>大手企業の情報流出が、日常になっています。<br />顧客情報を取れば取るほど、リスクは増える。<br />Push-taroが保存するのは、<strong>電話番号だけ</strong>です。</p>
            </div>
            <div className="security-compare">
              <div className="security-card is-others tilt-in-left">
                <span className="security-badge">他のツール</span>
                <h4>保存する情報</h4>
                <ul className="security-list">
                  <li>氏名・住所</li>
                  <li>生年月日・性別</li>
                  <li>購買履歴</li>
                  <li>クレジットカード情報</li>
                  <li>電話番号</li>
                </ul>
                <p className="security-note">漏洩時のリスク：<strong>最大</strong></p>
              </div>
              <div className="security-card is-push tilt-in-right">
                <span className="security-badge is-push">Push-taro</span>
                <h4>保存する情報</h4>
                <ul className="security-list">
                  <li className="is-good">電話番号（SMS認証済み）</li>
                  <li className="is-no">氏名・住所</li>
                  <li className="is-no">生年月日・性別</li>
                  <li className="is-no">購買履歴</li>
                  <li className="is-no">クレジットカード情報</li>
                </ul>
                <p className="security-note">漏洩時のリスク：<strong className="is-good">最小</strong></p>
              </div>
            </div>
            <div className="security-cta reveal">
              <Link href="/guide/security" className="security-link">🔒 なぜ、Push-taroは顧客情報を取らないのか</Link>
            </div>
          </div>
        </section>

        {/* GUIDE PROMO */}
        <section className="guide-promo guide-promo-2">
          <div className="container">
            <div className="guide-promo-card is-reverse reveal">
              <div className="guide-promo-left">
                <span className="guide-promo-tag">📖 深く読みたい方へ</span>
                <h2 className="guide-promo-title">実店舗の集客、<br />オススメの施策。<br /><span className="guide-promo-title-accent">これが土台となる。</span></h2>
                <p className="guide-promo-text">広告、ポータル、LP、SNS、LINE。<br />どれも必要で、全部やる時代。<br />でも、1回来店してくれたお客様への施策が、弱いのでは。</p>
                <ul className="guide-promo-list">
                  <li>LINE Businessの配信上限という、見えない壁</li>
                  <li>CVRを上げるには、繰り返しの検証が必要</li>
                  <li>Push-taroは、その壁をどう外したか</li>
                </ul>
                <Link href="/guide/store-marketing" className="guide-promo-btn">
                  詳しく読む
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
              <div className="guide-promo-right">
                <div className="guide-promo-mock is-alt">
                  <div className="guide-promo-mock-head"></div>
                  <div className="guide-promo-mock-bar" style={{ width: '95%' }}></div>
                  <div className="guide-promo-mock-bar" style={{ width: '70%' }}></div>
                  <div className="guide-promo-mock-bar is-highlight" style={{ width: '88%' }}></div>
                  <div className="guide-promo-mock-bar" style={{ width: '60%' }}></div>
                  <div className="guide-promo-mock-bar" style={{ width: '80%' }}></div>
                  <div className="guide-promo-mock-bar" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SETUP */}
        <section className="section section-alt" id="setup">
          <div className="container">
            <div className="section-header reveal">
              <span className="section-tag">Easy Setup</span>
              <h2>導入は、想像よりずっと簡単。</h2>
              <p>専門知識は一切不要。<br />QRコードを印刷して貼るだけで、今日から始められます。</p>
            </div>
            <div className="setup-barrier reveal">
              <div className="setup-barrier-icon">🚪</div>
              <div className="setup-barrier-body">
                <h3>プッシュ通知の最大の難関は、<br />「受け取ってもらう」こと。</h3>
                <p>アプリのダウンロード、LINE登録、ホーム画面への追加——<br />お客様に何らかのアクションをしてもらわないと、通知は届きません。<br /><strong>この最初のハードルを、いかに低くするかが勝負です。</strong></p>
              </div>
            </div>
            <div className="setup-flow-wrap">
              <div className="setup-col is-customer reveal-left">
                <div className="setup-head">
                  <span className="setup-badge">お客様側</span>
                  <h3>QRを読み取って、30秒。</h3>
                  <p>全プランに「QRコード + 初回クーポン」標準搭載</p>
                </div>
                <div className="setup-steps">
                  <div className="setup-step"><div className="setup-num">1</div><div className="setup-text"><strong>QRコードを読み取る</strong><span>店頭POPのQRをカメラで読み取るだけ</span></div></div>
                  <div className="setup-step"><div className="setup-num">2</div><div className="setup-text"><strong>ホーム画面に追加（iPhoneのみ）</strong><span>Androidは自動で完了</span></div></div>
                  <div className="setup-step"><div className="setup-num">3</div><div className="setup-text"><strong>SMS認証</strong><span>電話番号に届くコードを入力</span></div></div>
                  <div className="setup-step is-final"><div className="setup-num">✓</div><div className="setup-text"><strong>登録完了 + 初回クーポンGET</strong><span>その場で「10〜20%OFF」が受け取れる</span></div></div>
                </div>
                <div className="setup-note"><strong>「ホーム画面に追加で10%OFF」</strong><br />これだけで、お客様の登録ハードルは一気に下がります。</div>
              </div>
              <div className="setup-col is-owner reveal-right">
                <div className="setup-head">
                  <span className="setup-badge">店舗オーナー側</span>
                  <h3>登録から運用まで、10分。</h3>
                  <p>専門知識ゼロ。ITが苦手でも大丈夫。</p>
                </div>
                <div className="setup-steps">
                  <div className="setup-step"><div className="setup-num">1</div><div className="setup-text"><strong>アカウント作成</strong><span>メールアドレスと店舗情報を入力</span></div></div>
                  <div className="setup-step"><div className="setup-num">2</div><div className="setup-text"><strong>クーポン設定</strong><span>タイトル・説明・有効期限を管理画面で</span></div></div>
                  <div className="setup-step"><div className="setup-num">3</div><div className="setup-text"><strong>店頭ポップを印刷</strong><span>管理画面から、A4/A5ポップを印刷するだけ</span></div></div>
                  <div className="setup-step is-final"><div className="setup-num">✓</div><div className="setup-text"><strong>通知を送信</strong><span>「本日の日替わりランチ！」を即配信</span></div></div>
                </div>
                <div className="setup-note"><strong>アカウント作成から最短10分。</strong><br />決済完了で、即時利用開始できます。</div>
              </div>
            </div>

            {/* 店頭ポップ */}
            <div className="qr-pop-section reveal">
              <div className="qr-pop-head">
                <span className="tag">NEW FEATURE</span>
                <div className="qr-pop-plan-badges">
                  <span className="qr-pop-plan-badge is-std">STANDARD</span>
                  <span className="qr-pop-plan-badge is-pro">PRO</span>
                </div>
                <h3>店頭ポップを、管理画面から印刷するだけ。</h3>
                <p>レジ横・カウンター・テーブルに置くだけで、お客様が自分から登録してくれます。</p>
              </div>
              <div className="qr-pop-body">
                <div className="qr-pop-visual">
                  <div className="pop-a4">
                    <div className="pop-shop">Patisserie Taro</div>
                    <div className="pop-lead">＼ スマホで読み取るだけ ／</div>
                    <div className="pop-catch">お得な情報を<br /><span className="accent">プッシュ通知</span>で<br />お届けします</div>
                    <div className="pop-qr"></div>
                    <div className="pop-perk"><span className="pop-perk-badge">初回限定</span><div className="pop-perk-title">🎁 初回限定 10%OFF</div></div>
                  </div>
                  <div className="pop-a5">
                    <div className="pop-shop">Patisserie Taro</div>
                    <div className="pop-lead">＼ スマホで読み取るだけ ／</div>
                    <div className="pop-catch">お得な情報を<br /><span className="accent">プッシュ通知</span>で<br />お届けします</div>
                    <div className="pop-qr"></div>
                    <div className="pop-perk"><span className="pop-perk-badge">初回限定</span><div className="pop-perk-title">🎁 初回限定 10%OFF</div></div>
                  </div>
                </div>
                <div className="qr-pop-content">
                  <div className="qr-pop-feature"><div className="qr-pop-feature-icon">🖨️</div><div className="qr-pop-feature-body"><h4>A4 / A5、2サイズから選べる</h4><p>レジ横に立てるA4、カウンターに置くA5。店舗の状況に合わせて、ぴったりのサイズを印刷できます。</p></div></div>
                  <div className="qr-pop-feature"><div className="qr-pop-feature-icon">✨</div><div className="qr-pop-feature-body"><h4>店舗名とQRコード入り</h4><p>お客様はQRを読み取るだけ。アプリ不要、30秒で通知登録が完了します。</p></div></div>
                  <div className="qr-pop-feature"><div className="qr-pop-feature-icon">🎁</div><div className="qr-pop-feature-body"><h4>初回クーポンが設定されていれば、自動で表示</h4><p>「登録するとお得」ではなく、<strong>「登録すると、今すぐお得」</strong>。その場で特典が得られるから、登録率が爆発的に上がります。</p></div></div>
                  <div className="qr-pop-highlight"><strong>「今日、これ使えます」が最強の登録動機。</strong><p>お会計時に「これ、今日使えるから登録するとお得ですよ」と一言添えるだけ。<br />未来のお得ではなく、<strong>目の前のお得</strong>が、お客様の背中を押します。</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="section" id="features">
          <div className="container">
            <div className="section-header reveal">
              <span className="section-tag">Features</span>
              <h2>必要な機能から、<br />選べる3つのステップ。</h2>
              <p>「全員に配る」「常連を大切にする」「もっと極める」。<br />お店の状況に合わせて、必要なものから導入できます。</p>
            </div>

            <div className="feature-group">
              <div className="feature-group-head reveal">
                <span className="feature-group-num">1</span>
                <div>
                  <h3>まず、全員に配る機能</h3>
                  <p>最初に使うのはこれだけ。難しく考えず、今日から始められます。</p>
                </div>
                <span className="feature-group-tag is-all">全プラン</span>
              </div>
              <div className="feature-cards">
                <div className="feature-card tilt-in">
                  <div className="feature-card-icon">📢</div>
                  <h4>プッシュ通知</h4>
                  <p>登録したお客様全員に、一斉に通知を配信。クリック率（送った通知が、どれくらいタップされたかの割合）はメルマガの約10倍。</p>
                </div>
                <div className="feature-card tilt-in" style={{ transitionDelay: '0.05s' }}>
                  <div className="feature-card-icon">📱</div>
                  <h4>QRコード登録</h4>
                  <p>店頭ポップのQRを読み取るだけ。アプリ不要、30秒で登録完了。</p>
                </div>
                <div className="feature-card tilt-in" style={{ transitionDelay: '0.1s' }}>
                  <div className="feature-card-icon">🎫</div>
                  <h4>初回クーポン</h4>
                  <p>登録と同時に自動配布。「今すぐ使える」特典で、登録率が上がります。</p>
                </div>
              </div>
            </div>

            <div className="feature-group">
              <div className="feature-group-head reveal">
                <span className="feature-group-num">2</span>
                <div>
                  <h3>来
