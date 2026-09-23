// app/page.tsx
// Push-taro ランディングページ
'use client';

import { useEffect } from 'react';
import { faqs } from '../data/faq';


/* ============================================================
   スクロール出現フック
   ============================================================ */
function useScrollReveal() {
  useEffect(() => {
   if (typeof document === 'undefined') return;
    const selectors = [
      '.reveal', '.reveal-left', '.reveal-right',
      '.tilt-in', '.tilt-in-left', '.tilt-in-right',
    ];
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

/* ============================================================
   カウントアップフック
   ============================================================ */
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
      {/* ============================================================
          NAVBAR
      ============================================================ */}
      <nav className="navbar">
        <div className="navbar-inner">
          <a href="/" className="logo">
            <svg className="logo-mark" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ff6b6b" />
                  <stop offset="100%" stopColor="#ff4500" />
                </linearGradient>
              </defs>
              <circle cx="24" cy="24" r="23" fill="url(#logoGrad)" />
              <path d="M24 8 L33 22 L28 22 L28 30 L20 30 L20 22 L15 22 Z" fill="#ffffff" />
              <circle cx="24" cy="20" r="3" fill="#ff4500" opacity="0.5" />
              <path d="M18 30 L14 38 L20 34 Z" fill="#ffffff" />
              <path d="M30 30 L34 38 L28 34 Z" fill="#ffffff" />
              <path d="M22 30 L24 40 L26 30 Z" fill="#fbbf24" />
            </svg>
            Push-taro<span>.</span>
            <small>実店舗のためのPush通知CRM</small>
          </a>
          <div className="nav-links">
            <a href="#philosophy">思想</a>
            <a href="#features">機能</a>
            <a href="#pricing">料金</a>
            <a href="#programs">収益化</a>
            <a href="#faq">FAQ</a>
            <a href="#cta" className="nav-cta">
              今すぐ始める
              <svg className="svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </nav>

           {/* ============================================================
          HERO
      ============================================================ */}
      <section className="hero">
        <svg className="hero-bg-svg" viewBox="0 0 1400 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="heroGlow1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff4500" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ff4500" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="heroGlow2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3182ce" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3182ce" stopOpacity="0" />
            </radialGradient>
            <pattern id="dotPattern" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="white" opacity="0.08" />
            </pattern>
          </defs>
          <rect width="1400" height="800" fill="url(#dotPattern)" />
          <circle cx="1150" cy="120" r="320" fill="url(#heroGlow1)" />
          <circle cx="180" cy="650" r="280" fill="url(#heroGlow2)" />
          <path d="M0 700 Q 350 620 700 700 T 1400 700" stroke="#ff4500" strokeWidth="1" fill="none" opacity="0.15" />
          <path d="M0 720 Q 350 640 700 720 T 1400 720" stroke="#ff4500" strokeWidth="1" fill="none" opacity="0.08" />
        </svg>

        <div className="hero-inner">
          <div className="hero-badge">
            <span className="dot"></span>
            2026年9月 正式リリース予定・先行登録受付中
          </div>
          <h1>
            既存客のリピートを、<br />
            <span className="gradient-text">&quot;プッシュ通知 × CRM&quot;</span> で仕組化。
          </h1>
          <p className="hero-lead">
            良いサービス、良い商品。それだけでは、お客様には伝わりません。<br />
            <strong style={{ color: '#fff', fontWeight: 900 }}>「喜んで頂ける仕組み」</strong>が、お店とお客様を、もっと強く繋ぎます。<br />
            プッシュ通知 × CRM で、実店舗のリピート施策に必要なすべてを1つに。
          </p>
          <div className="hero-cta-group">
            <a href="#pricing" className="btn-primary">
              今すぐ申し込む
              <svg className="svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#features" className="btn-secondary">
              <svg className="svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              機能を詳しく見る
            </a>
          </div>

          <div className="hero-stats">
            <div className="hero-stat float tilt-in">
              <div className="hero-stat-number">
                最大<span className="count-up" data-count="10">10</span><small>倍</small>
              </div>
              <div className="hero-stat-label">メルマガ比 開封率</div>
            </div>
            <div className="hero-stat float tilt-in" style={{ transitionDelay: '0.1s' }}>
              <div className="hero-stat-number">
                <span className="count-up" data-count="7">7</span><small>種類</small>
              </div>
              <div className="hero-stat-label">クーポン自動配信</div>
            </div>
            <div className="hero-stat float tilt-in" style={{ transitionDelay: '0.2s' }}>
              <div className="hero-stat-number">無制限</div>
              <div className="hero-stat-label">PROプラン配信数</div>
            </div>
            <div className="hero-stat float tilt-in" style={{ transitionDelay: '0.3s' }}>
              <div className="hero-stat-number">
                <span className="count-up" data-count="3">3</span><small>種</small>
              </div>
              <div className="hero-stat-label">収益化プログラム</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          PHILOSOPHY「喜んで頂ける」を、仕組みにする
      ============================================================ */}
      <section className="section section-alt" id="philosophy">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">Philosophy</span>
            <h2>「喜んで頂ける」を、<br />仕組みにする。</h2>
            <p>良いサービス、良い商品。それだけでは、伝わりません。</p>
          </div>

          <div className="philosophy-wrap">
            <div className="philosophy-text reveal">
              <p>
                提供するサービス、取り扱う商品——<br />
                それらが基本として軸にあるのは、もちろん大前提です。
              </p>
              <p>
                しかし、<strong>それらをお客様に喜んで頂けるようにする「仕組み」があるかないか</strong>で、結果は大きく変わります。
              </p>
              <p>
                どんなに素晴らしいサービスや商品があっても、仕組みがなければ既存のお客様には伝わりません。逆に、喜んで頂ける仕組みがあれば、お客様は<strong>もっと利用してくれる</strong>ようになります。
              </p>
              <div className="philosophy-quote">
                そして、それこそが<span style={{ color: '#ff4500' }}>口コミ</span>となり、<br />
                新規のお客様へと繋がっていく。
              </div>
            </div>

            <div className="philosophy-flow reveal-right">
              <div className="philosophy-step">
                <div className="philosophy-step-num">1</div>
                <div className="philosophy-step-text">良いサービス・商品がある</div>
              </div>
              <div className="philosophy-arrow">↓</div>
              <div className="philosophy-step">
                <div className="philosophy-step-num">2</div>
                <div className="philosophy-step-text">それを伝える「仕組み」がある</div>
              </div>
              <div className="philosophy-arrow">↓</div>
              <div className="philosophy-step">
                <div className="philosophy-step-num">3</div>
                <div className="philosophy-step-text">既存客がもっと利用してくれる</div>
              </div>
              <div className="philosophy-arrow">↓</div>
              <div className="philosophy-step is-final">
                <div className="philosophy-step-num">🎉</div>
                <div className="philosophy-step-text">口コミが生まれ、新規へ繋がる</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          PROBLEM
      ============================================================ */}
      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">Problem</span>
            <h2>こんな「店舗経営の悩み」を抱えていませんか？</h2>
            <p>多くの店舗オーナー様が、集客の不安定さとリピート施策のコストに直面しています。</p>
          </div>

          <div className="problem-grid">
            <div className="problem-card tilt-in" style={{ transitionDelay: '0s' }}>
              <div className="problem-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M3 17l6-6 4 4 8-8" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 7h7v7" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>リピート率の頭打ち</h3>
              <p>一度来店されたお客様の再来店につながる有効な導線がなく、一見客頼みの集客から抜け出せない。</p>
            </div>
            <div className="problem-card tilt-in" style={{ transitionDelay: '0.1s' }}>
              <div className="problem-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M6 16a4 4 0 010-8 5 5 0 019.9-1.5A4.5 4.5 0 0118 16H6z" stroke="#dc2626" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M8 20l-1 2M12 20l-1 2M16 20l-1 2" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3>集客のコントロール不足</h3>
              <p>雨天や平日の閑散期など、「今すぐお客様を呼びたい」タイミングでピンポイントにアプローチできない。</p>
            </div>
            <div className="problem-card tilt-in" style={{ transitionDelay: '0.2s' }}>
              <div className="problem-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="10" cy="10" r="6" stroke="#dc2626" strokeWidth="2" />
                  <path d="M10 7v3M10 13v.01" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
                  <path d="M16 14l4 4M16 18l4-4" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3>従量課金のコスト肥大化</h3>
              <p>既存のツールは配信数が増えるほど料金が跳ね上がり、積極的なコミュニケーションが打てない。</p>
            </div>
            <div className="problem-card tilt-in" style={{ transitionDelay: '0.3s' }}>
              <div className="problem-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="8" height="10" rx="1.5" stroke="#dc2626" strokeWidth="2" />
                  <rect x="13" y="9" width="8" height="10" rx="1.5" stroke="#dc2626" strokeWidth="2" />
                  <path d="M7 3h10M7 21h10" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3>顧客情報がバラバラ</h3>
              <p>来店履歴・クーポン利用・誕生日情報が一元管理できず、セグメント配信や施策のPDCAが回らない。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CAC 新規客獲得コスト
      ============================================================ */}
      <section className="section section-dark" id="cac">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Customer Acquisition Cost</span>
            <h2>新規客1人を獲得するのに、<br />いくらかかっていますか？</h2>
            <p>
              新規集客は「広告」と「口コミ」と言われますが、実際には<strong style={{ color: '#fff' }}>どれだけ広告を出せるか</strong>に絞られがちです。<br />
              業種ごとの「新規顧客1人あたりの平均獲得単価」をご覧ください。
            </p>
          </div>

          <div className="cac-grid">
            <div className="cac-card">
              <div className="cac-icon">🍽️</div>
              <div className="cac-industry">カフェ・飲食店・外食産業</div>
              <div className="cac-value">¥5,000〜</div>
              <div className="cac-unit">／ 新規客1人</div>
            </div>
            <div className="cac-card">
              <div className="cac-icon">💇</div>
              <div className="cac-industry">美容サロン</div>
              <div className="cac-value">¥15,000〜</div>
              <div className="cac-unit">／ 新規客1人</div>
            </div>
            <div className="cac-card">
              <div className="cac-icon">💆</div>
              <div className="cac-industry">マッサージ・エステ</div>
              <div className="cac-value">¥20,000〜</div>
              <div className="cac-unit">／ 新規客1人</div>
            </div>
            <div className="cac-card">
              <div className="cac-icon">💪</div>
              <div className="cac-industry">フィットネス・ジム</div>
              <div className="cac-value">¥10,000〜</div>
              <div className="cac-unit">／ 新規客1人</div>
            </div>
            <div className="cac-card">
              <div className="cac-icon">📚</div>
              <div className="cac-industry">スクール・塾</div>
              <div className="cac-value">¥10,000〜</div>
              <div className="cac-unit">／ 新規客1人</div>
            </div>
          </div>

          <div className="cac-balance reveal">
            <div className="cac-balance-title">
              この広告費を<span style={{ color: '#fd7e5a' }}>新規</span>に使うか、<br />
              <span style={{ color: '#fd7e5a' }}>既存客</span>に還元するか。
            </div>
            <p className="cac-balance-text">
              この<strong>天秤</strong>が、とても大切です。<br />
              既存のお客様は、既に貴店を<strong>気に入ってくれている</strong>。<br />
              だからこそ、大切にしたい。<br />
              <strong>「お客様に喜んで頂ける」</strong>ということは、<br />
              <strong>既存客に喜んで頂ける</strong>ことと深く繋がっています。
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          RAIN「雨の日」に、プッシュ通知は効きません
      ============================================================ */}
      <section className="section" id="rain">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">Why Push-taro</span>
            <h2>「雨の日」に、<br />プッシュ通知は効きません。</h2>
            <p>よく聞く「雨の日に来店が減る」「今日は暇だから」——。この状況で通知を送っても、ほぼ効きません。</p>
          </div>

          <div className="rain-compare reveal">
            <div className="rain-card is-bad">
              <span className="rain-badge is-bad">NG例</span>
              <h4>「本日は20%オフです！」</h4>
              <p>雨の日は流動数が少ない。早く帰りたい。行く理由にならない。</p>
            </div>
            <div className="rain-arrow">↓</div>
            <div className="rain-card is-good">
              <span className="rain-badge is-good">OK例</span>
              <h4>「クーポンの期日が今日まで」</h4>
              <p>得する理由・楽しみがあると、人は雨でも動く。</p>
            </div>
          </div>

          <p className="rain-lead reveal">
            日頃から<strong>仕組みを作る</strong>ことで、「行く理由」ができるんです。<br />
            雨だから仕事に行くのをやめよう、とはならないように——<br />
            <strong>そこに得する理由や楽しみがあれば、人は雨でも動きます。</strong>
          </p>

          <div className="rain-conclusion reveal">
            <h3>「喜ばれる仕組み」を作る。</h3>
            <p>いつの間にか「雨なのに客足が途絶えない店」が、できあがります。</p>
          </div>

          <div className="solution-arrow reveal">↓</div>

          <div className="solution-block reveal">
            <h3>だから、<span style={{ color: '#ff4500' }}>Push-taro</span> です。</h3>
            <p>
              「クーポンだけでいいじゃん？」そう思われるかもしれません。<br />
              でもクーポンは<strong>受け身</strong>。サイトや来店で知ってもらうしか、伝える手段がない。
            </p>
            <p>
              それを、<strong>メルマガの6倍の開封率</strong>を持つプッシュ通知で、<strong>動的に仕組み化</strong>する。
              お店に必要な機能だけを、自由に組み合わせて使えます。
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURES（11機能）
      ============================================================ */}
      <section className="section section-alt" id="features">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">Features</span>
            <h2>すべてオンオフ可能。<br />必要な機能だけを、選べる。</h2>
            <p>お店に必要な分だけ、組み合わせて使えます。11のコア機能を標準搭載。</p>
          </div>

          <div className="feature-grid-11">
            {[
              { ico: '📢', name: 'プッシュ通知', badges: ['all'], desc: 'お客様全員へ一斉配信。iPhone・Android・PC対応。メルマガの6倍の開封率。' },
              { ico: '📱', name: 'QRコード登録', badges: ['all'], desc: '店頭POPに置くだけ。お客様はQRを読み取るだけ。アプリ不要で通知登録。' },
              { ico: '🎫', name: '初回クーポン', badges: ['all'], desc: '登録と同時に自動配布。新規顧客獲得と1回目の来店を促す。' },
              { ico: '🎟️', name: '通常クーポン', badges: ['std', 'pro'], desc: '登録者が何度でも使える、常設クーポン。会員特典として運用。' },
              { ico: '🏆', name: '特別達成クーポン', badges: ['std', 'pro'], desc: '指定回数クーポンを使うと、特別クーポンが出現する仕組み。' },
              { ico: '📊', name: '開封率の確認', badges: ['std', 'pro'], desc: '配信ごとの開封率を数値で確認。施策のPDCAを回せる。' },
              { ico: '🐾', name: 'ステップアップクーポン', badges: ['pro'], desc: '来店ごとに、段階的に特典アップ。最大10段階まで設計可能。' },
              { ico: '🔄', name: '連続クーポン', badges: ['pro'], desc: '消込と同時に、次回分のクーポンを自動発行。来店サイクルを短縮。' },
              { ico: '🎂', name: '記念日・誕生日クーポン', badges: ['pro'], desc: '年1回の特別な日に、自動でお祝いクーポンを配信。' },
              { ico: '💤', name: '休眠復活クーポン', badges: ['pro'], desc: '最終来店からN日経過した顧客に、自動で復帰クーポン。' },
              { ico: '📅', name: '予約配信・定期配信', badges: ['pro'], desc: '毎週金曜18時、毎月1日など、指定日時に自動送信。' },
            ].map((f, i) => {
              const cls = f.badges.includes('pro') ? 'is-pro' : f.badges.includes('std') ? 'is-std' : 'is-all';
              return (
                <div key={f.name} className={`feature-card-11 tilt-in ${cls}`} style={{ transitionDelay: `${i * 0.05}s` }}>
                  <div className="feature-card-11-top">
                    <span className="feature-card-11-ico">{f.ico}</span>
                    <div className="feature-card-11-badges">
                      {f.badges.includes('all') && <span className="badge is-all">全プラン</span>}
                      {f.badges.includes('std') && <span className="badge is-std">STANDARD</span>}
                      {f.badges.includes('pro') && <span className="badge is-pro">PRO</span>}
                    </div>
                  </div>
                  <h3>{f.name}</h3>
                  <p>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

            {/* ============================================================
          SCREEN MOCKUP
      ============================================================ */}
      <section className="section screen-section" id="interface">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">Interface</span>
            <h2>シンプルで使いやすい、2つの画面</h2>
            <p>お客様が使うのは、QRコードを読み取るだけ。<br />店舗オーナーは、見やすい管理画面で全ての施策をコントロールできます。</p>
          </div>

          <div className="screen-grid">

            {/* ========== お客様側 ========== */}
            <div>
              <div className="phone-mock">
                <div className="phone-screen">
                  <div className="phone-status-bar">
                    <span>9:41</span>
                    <svg width="46" height="12" viewBox="0 0 46 12" fill="none">
                      <rect x="0" y="4" width="3" height="6" fill="#1a202c" />
                      <rect x="5" y="2" width="3" height="8" fill="#1a202c" />
                      <rect x="10" y="0" width="3" height="10" fill="#1a202c" />
                      <rect x="32" y="1" width="12" height="9" rx="2" stroke="#1a202c" strokeWidth="1" fill="none" />
                      <rect x="33.5" y="2.5" width="8" height="6" fill="#1a202c" />
                    </svg>
                  </div>

                  {/* 店舗ヘッダー */}
                  <div className="phone-shop-header">
                    <div className="phone-shop-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M4 21h16v-4H4z" fill="#fff" />
                        <path d="M4 17c1 0 1-1 2-1s1 1 2 1 1-1 2-1 1 1 2 1 1-1 2-1 1 1 2 1 1-1 2-1 1 1 2 1v-4H4z" fill="#ffedd5" />
                        <path d="M12 3v6M12 3c-1 0-2 1-2 2s1 2 2 2M12 3c1 0 2 1 2 2s-1 2-2 2" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="phone-shop-name">Patisserie Taro</div>
                    <div className="phone-link-btn">🌐 サイトはこちらから</div>
                  </div>

                  <div className="phone-coupons-scroll">

                    {/* 初回クーポン */}
                    <div className="phone-coupon phone-coupon-first">
                      <span className="phone-coupon-badge">初回限定</span>
                      <div className="phone-coupon-title">🎁 初回限定クーポン</div>
                      <div className="phone-coupon-desc">次回ご来店時にご利用ください</div>
                      <div className="phone-coupon-qr">
                        <svg width="80" height="80" viewBox="0 0 21 21">
                          <rect width="21" height="21" fill="#fff"/>
                          <path fill="#0f172a" d="M0,0h7v7h-7zM1,1v5h5v-5zM2,2h3v3h-3zM14,0h7v7h-7zM15,1v5h5v-5zM16,2h3v3h-3zM0,14h7v7h-7zM1,15v5h5v-5zM2,16h3v3h-3zM9,0h1v1h-1zM11,0h1v1h-1zM9,2h1v1h-1zM10,3h1v1h-1zM8,4h1v1h-1z"/>
                        </svg>
                      </div>
                      <div className="phone-coupon-note">会計時にこちらのQRコードをスタッフにご提示ください</div>
                    </div>

                    {/* 通常クーポン */}
                    <div className="phone-coupon phone-coupon-normal">
                      <span className="phone-coupon-badge is-green">通常クーポン</span>
                      <div className="phone-coupon-title">🎟️ 会員様 10%OFF</div>
                      <div className="phone-coupon-desc">いつでも何度でもご利用いただけます</div>
                      <div className="phone-coupon-qr">
                        <svg width="80" height="80" viewBox="0 0 21 21">
                          <rect width="21" height="21" fill="#fff"/>
                          <path fill="#0f172a" d="M0,0h7v7h-7zM1,1v5h5v-5zM2,2h3v3h-3zM14,0h7v7h-7zM15,1v5h5v-5zM16,2h3v3h-3zM0,14h7v7h-7zM1,15v5h5v-5zM2,16h3v3h-3zM9,0h1v1h-1zM11,0h1v1h-1zM9,2h1v1h-1zM10,3h1v1h-1zM8,4h1v1h-1z"/>
                        </svg>
                      </div>
                      <div className="phone-coupon-note">会計時にこちらのQRコードをスタッフにご提示ください</div>
                    </div>

                    {/* 特別達成クーポン */}
                    <div className="phone-coupon phone-coupon-loyalty">
                      <span className="phone-coupon-badge is-orange">特別達成クーポン</span>
                      <div className="phone-coupon-title">🏆 3回達成 20%OFF</div>
                      <div className="phone-coupon-desc">通常クーポンを規定回数ご利用いただいた特典です</div>
                      <div className="phone-coupon-qr">
                        <svg width="80" height="80" viewBox="0 0 21 21">
                          <rect width="21" height="21" fill="#fff"/>
                          <path fill="#0f172a" d="M0,0h7v7h-7zM1,1v5h5v-5zM2,2h3v3h-3zM14,0h7v7h-7zM15,1v5h5v-5zM16,2h3v3h-3zM0,14h7v7h-7zM1,15v5h5v-5zM2,16h3v3h-3zM9,0h1v1h-1zM11,0h1v1h-1zM9,2h1v1h-1zM10,3h1v1h-1zM8,4h1v1h-1z"/>
                        </svg>
                      </div>
                      <div className="phone-coupon-note">会計時にこちらのQRコードをスタッフにご提示ください</div>
                    </div>

                  </div>

                  {/* 通知履歴 */}
                  <div className="phone-history">
                    <div className="phone-history-head">
                      <span>📜 通知履歴 (3件)</span>
                      <span>▼ 展開する</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="screen-caption">
                📱 お客様側の画面イメージ<br />
                QRを読み取って、クーポンを提示するだけ
              </p>
            </div>

            {/* ========== 店舗オーナー側 ========== */}
            <div>
              <div className="dash-mock">
                <div className="dash-topbar">
                  <span className="dash-dot red"></span>
                  <span className="dash-dot yellow"></span>
                  <span className="dash-dot green"></span>
                  <span className="dash-url">push-taro.com/pro-shop</span>
                </div>

                <div className="dash-body">

                  {/* ヘッダー */}
                  <div className="dash-header">
                    <div className="dash-header-left">
                      <div className="dash-shop-icon">🍰</div>
                      <div>
                        <div className="dash-title">
                          Patisserie Taro
                          <span className="dash-badge">PRO</span>
                        </div>
                        <div className="dash-email">owner@patisserie-taro.jp</div>
                      </div>
                    </div>
                    <button className="dash-logout">ログアウト</button>
                  </div>

                  {/* タブ */}
                  <div className="dash-tabs">
                    <div className="dash-tab is-active">📢 即時通知・消し込み</div>
                    <div className="dash-tab">🏪 店舗・基本クーポン</div>
                    <div className="dash-tab">🔥 PRO機能</div>
                    <div className="dash-tab">📅 予約配信</div>
                  </div>

                  {/* 消し込みボタン */}
                  <div className="dash-scan-btn">
                    📷 クーポンQRコードを読み取る（消し込み）
                  </div>

                  {/* 通知作成フォーム */}
                  <div className="dash-form">
                    <div className="dash-form-title">📢 プッシュ通知を作成・即時送信</div>
                    <div className="dash-form-field">
                      <div className="dash-form-label">タイトル</div>
                      <div className="dash-form-input">例: 新着セールのお知らせ</div>
                    </div>
                    <div className="dash-form-field">
                      <div className="dash-form-label">本文</div>
                      <div className="dash-form-textarea">例: 本日から全品20%OFFセール開催中！</div>
                    </div>
                    <div className="dash-form-btn">🔥 Push 通知送信</div>
                  </div>

                  {/* 送信ステータス */}
                  <div className="dash-status">
                    <div className="dash-status-left">
                      🔥 月間送信ステータス
                      <span className="dash-status-tag">PRO</span>
                    </div>
                    <div className="dash-status-right">配信無制限</div>
                  </div>

                  {/* 受取許可件数 */}
                  <div className="dash-subscribers">
                    <span>📱 現在の受取許可件数</span>
                    <strong>1,247 件</strong>
                  </div>

                  {/* 送信履歴 */}
                  <div className="dash-history-title">
                    <span>📁 送信履歴</span>
                    <div className="dash-history-actions">
                      <span>🔄 更新</span>
                      <span>📤 エクスポート</span>
                    </div>
                  </div>
                  <div className="dash-history-item">
                    <div className="dash-history-head">
                      <strong>新作スイーツ入荷のお知らせ</strong>
                      <span className="dash-history-time">2026/09/20 18:30</span>
                    </div>
                    <div className="dash-history-body">本日より新作いちごタルト販売開始🍰</div>
                    <div className="dash-history-meta">
                      <span className="dash-history-status">送信成功</span>
                      <span>（送信数: 1,204件）</span>
                      <span className="dash-history-open">開封率: 62.4%</span>
                    </div>
                  </div>
                  <div className="dash-history-item">
                    <div className="dash-history-head">
                      <strong>週末限定セールのお知らせ</strong>
                      <span className="dash-history-time">2026/09/18 12:00</span>
                    </div>
                    <div className="dash-history-body">今週末は全品10%OFF！</div>
                    <div className="dash-history-meta">
                      <span className="dash-history-status">送信成功</span>
                      <span>（送信数: 1,198件）</span>
                      <span className="dash-history-open">開封率: 58.7%</span>
                    </div>
                  </div>

                </div>
              </div>
              <p className="screen-caption">
                💻 店舗オーナー側の管理画面イメージ<br />
                すべての施策を1画面でコントロール
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          COUPON SYSTEM
      ============================================================ */}
      <section className="section" id="coupons">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">Coupon System</span>
            <h2>7種類のクーポンで、来店サイクルを完全に設計</h2>
            <p>「初回来店 → 習慣化 → ファン化 → 休眠復活」まで、すべてのフェーズに最適化されたクーポンを自動配信できます。</p>
          </div>

          <div className="coupon-grid">
            <div className="coupon-card tilt-in-left" data-type="first" style={{ transitionDelay: '0s' }}>
              <span className="coupon-badge">全プラン</span>
              <div className="coupon-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="8" width="18" height="12" rx="1" fill="#f59e0b" />
                  <path d="M3 8l3-5h12l3 5" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
                  <path d="M12 8v12" stroke="#d97706" strokeWidth="1.5" />
                  <path d="M12 8c-2 0-3-1.5-3-3s1-2 2-2 1 2 1 5M12 8c2 0 3-1.5 3-3s-1-2-2-2-1 2-1 5" stroke="#fff" strokeWidth="1.2" fill="none" />
                </svg>
              </div>
              <h3>初回限定クーポン</h3>
              <p>通知登録と同時に配布される初回来店特典。QRコードを会計時に提示するだけで消込完了。二重利用は自動でブロック。</p>
              <span className="coupon-plan-tag">LIGHT / STANDARD / PRO</span>
            </div>

            <div className="coupon-card tilt-in-right" data-type="normal" style={{ transitionDelay: '0.08s' }}>
              <span className="coupon-badge">STANDARD+</span>
              <div className="coupon-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M3 10a2 2 0 010-4V4a1 1 0 011-1h16a1 1 0 011 1v2a2 2 0 010 4v2a2 2 0 010 4v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2a2 2 0 010-4v-2z" fill="#10b981" />
                  <circle cx="12" cy="12" r="2.5" fill="#fff" />
                </svg>
              </div>
              <h3>通常クーポン</h3>
              <p>登録者全員が何度でも使える常設クーポン。LINE公式のような「友だち特典」をWebプッシュ通知で実現します。</p>
              <span className="coupon-plan-tag">STANDARD / PRO</span>
            </div>

            <div className="coupon-card tilt-in-left" data-type="loyalty" style={{ transitionDelay: '0.16s' }}>
              <span className="coupon-badge">STANDARD+</span>
              <div className="coupon-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M6 3h12v6a6 6 0 01-12 0V3z" fill="#3b82f6" />
                  <path d="M6 5H3v2a3 3 0 003 3M18 5h3v2a3 3 0 01-3 3" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
                  <path d="M10 15h4v3h2v3H8v-3h2v-3z" fill="#3b82f6" />
                  <path d="M12 6l1 2 2 .5-1.5 1.5.5 2-2-1-2 1 .5-2L9 8.5 11 8z" fill="#fff" />
                </svg>
              </div>
              <h3>特別達成クーポン</h3>
              <p>累計来店N回で解放される特別報酬。ポイントカードのデジタル版として、常連客のファン化を促進します。</p>
              <span className="coupon-plan-tag">STANDARD / PRO</span>
            </div>

            <div className="coupon-card tilt-in-right" data-type="stepup" style={{ transitionDelay: '0.24s' }}>
              <span className="coupon-badge">PRO限定</span>
              <div className="coupon-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="17" width="5" height="4" fill="#8b5cf6" />
                  <rect x="9" y="12" width="5" height="9" fill="#8b5cf6" />
                  <rect x="15" y="7" width="5" height="14" fill="#8b5cf6" />
                  <path d="M5 14l4-4 4 2 6-6" stroke="#fbbf24" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="19" cy="6" r="1.5" fill="#fbbf24" />
                </svg>
              </div>
              <h3>ステップアップクーポン</h3>
              <p>「1回目→2回目→3回目…」と段階的に特典が豪華になる仕組み。最大10段階まで設計でき、来店習慣を強力に後押し。</p>
              <span className="coupon-plan-tag">PRO ONLY</span>
            </div>

            <div className="coupon-card tilt-in-left" data-type="repeat" style={{ transitionDelay: '0.08s' }}>
              <span className="coupon-badge">PRO限定</span>
              <div className="coupon-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M20 12a8 8 0 11-2.3-5.6" stroke="#ec4899" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M20 3v6h-6" stroke="#ec4899" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>連続クーポン</h3>
              <p>消込と同時に次回使えるクーポンが即時発行。有効期限を「14日間」のように設定し、来店サイクルを短縮します。</p>
              <span className="coupon-plan-tag">PRO ONLY</span>
            </div>

            <div className="coupon-card tilt-in-right" data-type="birthday" style={{ transitionDelay: '0.16s' }}>
              <span className="coupon-badge">PRO限定</span>
              <div className="coupon-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M4 21h16v-4H4z" fill="#f97316" />
                  <path d="M4 17c1 0 1-1 2-1s1 1 2 1 1-1 2-1 1 1 2 1 1-1 2-1 1 1 2 1 1-1 2-1 1 1 2 1v-4H4z" fill="#ffedd5" stroke="#ea580c" strokeWidth="1" />
                  <path d="M12 3v6M12 3c-1 0-2 1-2 2s1 2 2 2M12 3c1 0 2 1 2 2s-1 2-2 2" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="7" cy="19" r="0.8" fill="#fbbf24" />
                  <circle cx="12" cy="19" r="0.8" fill="#ec4899" />
                  <circle cx="17" cy="19" r="0.8" fill="#3b82f6" />
                </svg>
              </div>
              <h3>誕生日クーポン</h3>
              <p>顧客の生年月日を登録しておくだけで、誕生日当日に自動でお祝い通知。特別感でファン化を加速させます。</p>
              <span className="coupon-plan-tag">PRO ONLY</span>
            </div>

            <div className="coupon-card tilt-in-left" data-type="dormant" style={{ transitionDelay: '0.24s' }}>
              <span className="coupon-badge">PRO限定</span>
              <div className="coupon-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" fill="#64748b" />
                  <text x="12" y="11" fontSize="6" fill="#fff" fontWeight="bold">Z</text>
                  <text x="15" y="15" fontSize="4" fill="#fff" fontWeight="bold">z</text>
                  <path d="M3 20l3-2 3 2 3-2 3 2 3-2 3 2" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </div>
              <h3>休眠復活クーポン</h3>
              <p>「最終来店から60日経過した顧客」を自動抽出し、特別な復帰クーポンを配信。離反顧客の呼び戻しを仕組み化。</p>
              <span className="coupon-plan-tag">PRO ONLY</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW IT WORKS
      ============================================================ */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">How it works</span>
            <h2>導入はたったの4ステップ</h2>
            <p>専門知識ゼロ。ITが苦手な店舗オーナー様でも、最短10分で運用を開始できます。</p>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#ff4500" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <circle cx="12" cy="7" r="4" stroke="#ff4500" strokeWidth="2" fill="none" />
                  <path d="M19 3v4M17 5h4" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h4>アカウント作成</h4>
              <p>メールアドレスと店舗情報を入力して申し込み。決済完了で即時利用開始。</p>
            </div>
            <div className="step">
              <div className="step-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M3 10a2 2 0 010-4V4a1 1 0 011-1h16a1 1 0 011 1v2a2 2 0 010 4v2a2 2 0 010 4v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2a2 2 0 010-4v-2z" fill="#ff4500" />
                  <circle cx="12" cy="12" r="2" fill="#fff" />
                </svg>
              </div>
              <h4>クーポン設定</h4>
              <p>管理画面でクーポンのタイトル・説明・有効期限を設定。画像もアップロード可能。</p>
            </div>
            <div className="step">
              <div className="step-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" rx="1" fill="#ff4500" />
                  <rect x="14" y="3" width="7" height="7" rx="1" fill="#ff4500" />
                  <rect x="3" y="14" width="7" height="7" rx="1" fill="#ff4500" />
                  <rect x="5" y="5" width="3" height="3" fill="#fff" />
                  <rect x="16" y="5" width="3" height="3" fill="#fff" />
                  <rect x="5" y="16" width="3" height="3" fill="#fff" />
                  <rect x="14" y="14" width="3" height="3" fill="#ff4500" />
                  <rect x="18" y="14" width="3" height="3" fill="#ff4500" />
                  <rect x="14" y="18" width="3" height="3" fill="#ff4500" />
                  <rect x="18" y="18" width="3" height="3" fill="#ff4500" />
                </svg>
              </div>
              <h4>店頭にQR設置</h4>
              <p>管理画面で生成されたQRコードをPOPに印刷して店頭に設置するだけ。</p>
            </div>
            <div className="step">
              <div className="step-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8z" fill="#ff4500" />
                  <path d="M13.7 20a2 2 0 01-3.4 0" stroke="#e03e00" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                </svg>
              </div>
              <h4>通知を送信</h4>
              <p>「雨の日割引」「新商品入荷」など、タイミングに合わせてプッシュ通知を送信。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          COMPARISON
      ============================================================ */}
      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">Comparison</span>
            <h2>他社サービスとの圧倒的な違い</h2>
            <p>Push-taroは「実店舗のリピート施策」に特化。汎用ツールにはない機能が満載です。</p>
          </div>

          <div className="compare-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>機能</th>
                  <th className="col-pushtaro">Push-taro</th>
                  <th>汎用プッシュ通知</th>
                  <th>LINE公式</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>プッシュ通知の配信</td><td className="col-pushtaro">✓ 全デバイス対応</td><td>✓</td><td>✓</td></tr>
                <tr><td>クーポン機能</td><td className="col-pushtaro">✓ 7種類</td><td className="check-no">✗ なし</td><td>△ 手動配信のみ</td></tr>
<tr><td>クーポンの自動発行</td><td className="col-pushtaro">✓ 登録・来店・誕生日・休眠に連動</td><td className="check-no">✗ なし</td><td className="check-no">✗ なし</td></tr>
                <tr><td>QRコード消込</td><td className="col-pushtaro">✓ 標準搭載</td><td className="check-no">✗</td><td>△ 別途開発必要</td></tr>
                <tr><td>予約配信・定期配信</td><td className="col-pushtaro">✓</td><td>△ 有料オプション</td><td className="check-no">✗</td></tr>
                <tr><td>誕生日・休眠復活の自動化</td><td className="col-pushtaro">✓</td><td className="check-no">✗</td><td className="check-no">✗</td></tr>
                <tr><td>月額費用</td><td className="col-pushtaro">¥1,980〜</td><td>¥5,000〜</td><td>¥5,000〜 + 従量</td></tr>
                <tr><td>配信の従量課金</td><td className="col-pushtaro">✓ なし</td><td className="check-no">✗ あり</td><td className="check-no">✗ あり</td></tr>
                <tr><td>紹介・代理店プログラム</td><td className="col-pushtaro">✓ 3種標準搭載</td><td className="check-no">✗</td><td className="check-no">✗</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

            {/* ============================================================
          BEFORE / AFTER
      ============================================================ */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">Before / After</span>
            <h2>Push-taro導入前後の変化</h2>
            <p>施策の自動化と一元管理で、店舗運営はここまで変わります。</p>
          </div>

          <div className="ba-grid">
            <div className="ba-card before">
              <span className="ba-label before">BEFORE</span>
              <h3>導入前の店舗運営</h3>
              <div className="ba-list">
                <div className="ba-item"><svg className="svg-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginTop: '2px' }}><circle cx="12" cy="12" r="10" fill="#fecaca" /><path d="M8 8l8 8M16 8l-8 8" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" /></svg><span>チラシ・DMで集客するも、反応率が読めない</span></div>
                <div className="ba-item"><svg className="svg-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginTop: '2px' }}><circle cx="12" cy="12" r="10" fill="#fecaca" /><path d="M8 8l8 8M16 8l-8 8" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" /></svg><span>顧客名簿はExcelや紙でバラバラ管理</span></div>
                <div className="ba-item"><svg className="svg-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginTop: '2px' }}><circle cx="12" cy="12" r="10" fill="#fecaca" /><path d="M8 8l8 8M16 8l-8 8" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" /></svg><span>誕生日・休眠客への施策は手作業 or 未実施</span></div>
                <div className="ba-item"><svg className="svg-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginTop: '2px' }}><circle cx="12" cy="12" r="10" fill="#fecaca" /><path d="M8 8l8 8M16 8l-8 8" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" /></svg><span>クーポン配布のたびにスタッフが手間を取られる</span></div>
                <div className="ba-item"><svg className="svg-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginTop: '2px' }}><circle cx="12" cy="12" r="10" fill="#fecaca" /><path d="M8 8l8 8M16 8l-8 8" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" /></svg><span>施策のPDCAが回らず、改善のサイクルが遅い</span></div>
              </div>
              <div className="ba-metric">
                <div className="ba-metric-value" style={{ fontSize: '17px', letterSpacing: 0, color: '#dc2626', fontWeight: 900, lineHeight: 1.4 }}>
                  リピート施策が<br />後手に回る
                </div>
                <div className="ba-metric-label">施策の属人化・属時化</div>
              </div>
            </div>

            <div className="ba-arrow">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M4 12h16M14 6l6 6-6 6" stroke="#ff4500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="ba-card after">
              <span className="ba-label after">AFTER</span>
              <h3>Push-taro導入後</h3>
              <div className="ba-list">
                <div className="ba-item"><svg className="svg-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginTop: '2px' }}><circle cx="12" cy="12" r="10" fill="#bbf7d0" /><path d="M7 12l3.5 3.5L17 9" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg><span>QRコードで顧客獲得が自動化・数値で見える化</span></div>
                <div className="ba-item"><svg className="svg-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginTop: '2px' }}><circle cx="12" cy="12" r="10" fill="#bbf7d0" /><path d="M7 12l3.5 3.5L17 9" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg><span>顧客情報を一元管理、セグメント配信が可能</span></div>
                <div className="ba-item"><svg className="svg-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginTop: '2px' }}><circle cx="12" cy="12" r="10" fill="#bbf7d0" /><path d="M7 12l3.5 3.5L17 9" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg><span>誕生日・休眠復活クーポンが全自動で配信</span></div>
                <div className="ba-item"><svg className="svg-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginTop: '2px' }}><circle cx="12" cy="12" r="10" fill="#bbf7d0" /><path d="M7 12l3.5 3.5L17 9" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg><span>QR読み取りで消込完了、スタッフの負担ゼロ</span></div>
                <div className="ba-item"><svg className="svg-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginTop: '2px' }}><circle cx="12" cy="12" r="10" fill="#bbf7d0" /><path d="M7 12l3.5 3.5L17 9" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg><span>ダッシュボードでPDCAが高速に回る</span></div>
              </div>
              <div className="ba-metric">
                <div className="ba-metric-value" style={{ fontSize: '17px', letterSpacing: 0, color: '#16a34a', fontWeight: 900, lineHeight: 1.4 }}>
                  仕組みで<br />自動的に回る
                </div>
                <div className="ba-metric-label">施策の自動化・見える化</div>
              </div>
            </div>
          </div>

          {/* 出典付き統計 */}
          <div className="ba-stats reveal">
            <div className="ba-stat-item">
              <div className="ba-stat-value">
                <span className="count-up" data-count="10">10</span><span className="ba-stat-unit">倍</span>
              </div>
              <div className="ba-stat-label">メルマガ比<br />プッシュ通知の開封率</div>
              <div className="ba-stat-source">出典：PUSHONE調査</div>
            </div>
            <div className="ba-stat-item">
              <div className="ba-stat-value">
                <span className="count-up" data-count="87">87</span><span className="ba-stat-unit">%</span>
              </div>
              <div className="ba-stat-label">小売業での<br />プッシュ通知による行動変容率</div>
              <div className="ba-stat-source">出典：アイリッジ 2025年調査</div>
            </div>
            <div className="ba-stat-item">
              <div className="ba-stat-value">
                <span className="count-up" data-count="47">47</span><span className="ba-stat-unit">〜80%</span>
              </div>
              <div className="ba-stat-label">プッシュ通知の<br />開封率レンジ</div>
              <div className="ba-stat-source">出典：Thanx</div>
            </div>
          </div>

          <p className="ba-disclaimer">
            ※ 上記の数値は各種業界調査に基づく参考値であり、特定の店舗における成果を保証するものではありません。
          </p>
        </div>
      </section>

      {/* ============================================================
          PRICING
      ============================================================ */}
      <section className="section" id="pricing">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">Pricing</span>
            <h2>明快でリーズナブルな料金プラン</h2>
            <p>店舗規模やマーケティング目的に合わせて選べる3つのプラン。<br />追加の従量課金は一切ありません。</p>
          </div>

          <div className="pricing-grid">
            <div className="price-card light tilt-in" style={{ transitionDelay: '0s' }}>
              <div className="price-name">LIGHT</div>
              <div className="price-amount">¥1,980<small>/月（税別）</small></div>
              <div className="price-limit">月間配信上限: 5,000通</div>
              <ul className="price-features">
                <li><svg className="svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginTop: '4px' }}><path d="M5 12l5 5L20 7" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>全デバイス対応プッシュ通知</li>
                <li><svg className="svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginTop: '4px' }}><path d="M5 12l5 5L20 7" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>QRコード登録</li>
                <li><svg className="svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginTop: '4px' }}><path d="M5 12l5 5L20 7" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg><strong>初回クーポン</strong></li>
                <li><svg className="svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginTop: '4px' }}><path d="M5 12l5 5L20 7" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>即時配信・履歴管理</li>
                <li><svg className="svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginTop: '4px' }}><path d="M5 12l5 5L20 7" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>月間上限ゲージ表示</li>
              </ul>
              <a href="#cta" className="price-cta light-cta">LIGHTで始める</a>
            </div>

            <div className="price-card featured tilt-in" style={{ transitionDelay: '0.12s' }}>
              <span className="price-badge popular">人気</span>
              <div className="price-name">STANDARD</div>
              <div className="price-amount">¥3,800<small>/月（税別）</small></div>
              <div className="price-limit">月間配信上限: 15,000通</div>
              <ul className="price-features">
                <li><svg className="svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginTop: '4px' }}><path d="M5 12l5 5L20 7" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>LIGHTの全機能</li>
                <li><svg className="svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginTop: '4px' }}><path d="M5 12l5 5L20 7" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg><strong>通常クーポン</strong></li>
                <li><svg className="svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginTop: '4px' }}><path d="M5 12l5 5L20 7" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg><strong>特別達成クーポン</strong></li>
                <li><svg className="svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginTop: '4px' }}><path d="M5 12l5 5L20 7" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg><strong>開封率の確認</strong></li>
                <li><svg className="svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginTop: '4px' }}><path d="M5 12l5 5L20 7" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>拡大された配信枠（15,000通）</li>
              </ul>
              <a href="#cta" className="price-cta std-cta">STANDARDで始める</a>
            </div>

            <div className="price-card pro tilt-in" style={{ transitionDelay: '0.24s' }}>
              <span className="price-badge best">最高峰</span>
              <div className="price-name">PRO</div>
              <div className="price-amount">¥10,000<small>/月（税別）</small></div>
              <div className="price-limit">配信無制限</div>
              <ul className="price-features">
                <li><svg className="svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginTop: '4px' }}><path d="M5 12l5 5L20 7" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>STANDARDの全機能</li>
                <li><svg className="svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginTop: '4px' }}><path d="M5 12l5 5L20 7" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg><strong>ステップアップクーポン</strong></li>
                <li><svg className="svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginTop: '4px' }}><path d="M5 12l5 5L20 7" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg><strong>連続クーポン</strong></li>
                <li><svg className="svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginTop: '4px' }}><path d="M5 12l5 5L20 7" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg><strong>誕生日・記念日クーポン</strong></li>
                <li><svg className="svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginTop: '4px' }}><path d="M5 12l5 5L20 7" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg><strong>休眠復活クーポン</strong></li>
                <li><svg className="svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginTop: '4px' }}><path d="M5 12l5 5L20 7" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg><strong>予約配信・定期配信</strong></li>
                <li><svg className="svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginTop: '4px' }}><path d="M5 12l5 5L20 7" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg><strong>紹介報酬制度（最大10%）</strong></li>
              </ul>
              <a href="#cta" className="price-cta pro-cta">PROで始める</a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          REVENUE PROGRAMS
      ============================================================ */}
      <section className="section section-dark" id="programs">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">Revenue Programs</span>
            <h2>3つの収益化プログラムを標準搭載</h2>
            <p>Push-taroは、店舗自身が「稼ぐ側」にもなれるプラットフォーム。<br />あなたのネットワークが、毎月の安定収益に変わります。</p>
          </div>

          <div className="program-grid">
            <div className="program-card tilt-in" style={{ transitionDelay: '0s' }}>
              <div className="program-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M3 8l4 4 5-7 5 7 4-4v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" fill="#ff4500" stroke="#ffedd5" strokeWidth="1.5" strokeLinejoin="round" />
                  <circle cx="8" cy="16" r="1" fill="#ffedd5" />
                  <circle cx="12" cy="16" r="1" fill="#ffedd5" />
                  <circle cx="16" cy="16" r="1" fill="#ffedd5" />
                </svg>
              </div>
              <h3>代理店パートナー</h3>
              <div className="program-sub">法人・事業者向け｜最大級のストック収益</div>
              <div className="program-rate">最大 45%</div>
              <div className="program-desc">
                紹介した店舗のプラン・契約数に応じて報酬率がステップアップする超過累進型。中長期的に安定した収益源になります。
              </div>
              <ul className="program-list">
                <li>PRO 30% / その他 18%（基本）</li>
                <li>100社紹介で 36%、200社以上で 45%</li>
                <li>加盟金 ¥300,000 + 月額 ¥30,000</li>
                <li>専用ダッシュボード・販促素材完備</li>
              </ul>
            </div>

            <div className="program-card tilt-in" style={{ transitionDelay: '0.12s' }}>
              <div className="program-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <circle cx="9" cy="8" r="3.5" fill="#ff4500" stroke="#ffedd5" strokeWidth="1.5" />
                  <circle cx="17" cy="10" r="2.5" fill="#fb923c" stroke="#ffedd5" strokeWidth="1.5" />
                  <path d="M3 20c0-3.5 3-6 6-6s6 2.5 6 6" fill="#ff4500" stroke="#ffedd5" strokeWidth="1.5" />
                  <path d="M14 18c0-2.5 2-4 4-4s4 1.5 4 4" stroke="#ffedd5" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
              <h3>PRO紹介制度</h3>
              <div className="program-sub">PROプラン契約者向け｜実質無料化が可能</div>
              <div className="program-rate">毎月 10%</div>
              <div className="program-desc">
                PROプランをご契約中の店舗が他店舗を紹介するだけで、毎月10%の報酬が還元。10店舗紹介でPROプランが実質無料に。
              </div>
              <ul className="program-list">
                <li>紹介店舗が契約中は毎月発生</li>
                <li>10店舗で実質無料化</li>
                <li>管理画面から即時参加可能</li>
                <li>累計1万円で振込申請</li>
              </ul>
            </div>

            <div className="program-card tilt-in" style={{ transitionDelay: '0.24s' }}>
              <div className="program-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M3 11v2l4 1 1 4 3-2 3 2 1-4 4-1v-2l-4-1-1-4-3 2-3-2-1 4-4 1z" fill="#ff4500" stroke="#ffedd5" strokeWidth="1.5" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="2" fill="#ffedd5" />
                </svg>
              </div>
              <h3>アフィリエイト</h3>
              <div className="program-sub">誰でもOK｜リスクフリーで副収入</div>
              <div className="program-rate">8% または 単発</div>
              <div className="program-desc">
                ブログ・SNS・知人紹介など、自由な方法で店舗を紹介。初期費用・月額費用0円で、リスクなく始められます。
              </div>
              <ul className="program-list">
                <li>継続課金型: 初年度8%・13ヶ月目以降5%を継続還元</li>
                <li>単発型: PRO¥5,000 / STD¥2,000 / LIGHT¥1,000</li>
                <li>インボイス登録で源泉徴収なし</li>
                <li>累計5,000円で振込申請</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          USE CASES
      ============================================================ */}
      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">Use Cases</span>
            <h2>導入シーン別の活用イメージ</h2>
            <p>業種を問わず、あらゆる実店舗でご活用いただけます。</p>
          </div>

          <div className="usecase-grid">
            <div className="usecase-card tilt-in-left" style={{ transitionDelay: '0s' }}>
              <div className="usecase-header">
                <span className="usecase-industry">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 11h14a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2z" fill="#475569" />
                    <path d="M3 11l3-6h12l3 6" stroke="#475569" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
                  </svg>
                  飲食店・カフェ
                </span>
                <span className="usecase-plan">STANDARD</span>
              </div>
              <div className="usecase-body">
                <div className="usecase-title" style={{ fontSize: '17px', marginBottom: '12px' }}>毎日配信で顧客を取り込む</div>
                <p className="usecase-desc">ランチ激戦区では、日替わりランチの今日のメニューを毎日１０時に発信！数量限定なども発信に入れるなど</p>
              </div>
            </div>

            <div className="usecase-card tilt-in-right" style={{ transitionDelay: '0.08s' }}>
              <div className="usecase-header">
                <span className="usecase-industry">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M8 3v6a4 4 0 004 4v8M12 3v10" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="18" cy="7" r="3" stroke="#475569" strokeWidth="2" fill="none" />
                    <path d="M21 10c-2 0-3 1-3 3v8" stroke="#475569" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                  小売店・雑貨屋
                </span>
                <span className="usecase-plan">PRO</span>
              </div>
              <div className="usecase-body">
                <div className="usecase-title" style={{ fontSize: '17px', marginBottom: '12px' }}>クーポン活用で来店率を上げる</div>
                <p className="usecase-desc">連続クーポンとステップアップクーポン、さらに特別達成クーポンで来れば来るほどお得がもらえる仕組みで来店率を上げる。</p>
              </div>
            </div>

            <div className="usecase-card tilt-in-left" style={{ transitionDelay: '0.16s' }}>
              <div className="usecase-header">
                <span className="usecase-industry">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3c-2 0-3 2-3 4 0 3 3 5 3 8 0 3-3 5-3 5s5-1 6-4 0-6 0-6 3 1 3 4c0 2-1 4-1 4s3-2 3-6c0-5-4-9-8-9z" fill="#475569" />
                  </svg>
                  エステ・リラク
                </span>
                <span className="usecase-plan">PRO</span>
              </div>
              <div className="usecase-body">
                <div className="usecase-title" style={{ fontSize: '17px', marginBottom: '12px' }}>クーポン活用で来店を促す</div>
                <p className="usecase-desc">クーポンについてる期間を設定しステップアップと特別達成の組み合わせで通う動機を楽しみに変える</p>
              </div>
            </div>

            <div className="usecase-card tilt-in-right" style={{ transitionDelay: '0.24s' }}>
              <div className="usecase-header">
                <span className="usecase-industry">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 3l-2 7h10l-2-7" stroke="#475569" strokeWidth="2" strokeLinejoin="round" fill="none" />
                    <path d="M4 10h16l-1 10a1 1 0 01-1 1H6a1 1 0 01-1-1L4 10z" fill="#475569" />
                    <circle cx="9" cy="7" r="1" fill="#475569" />
                  </svg>
                  アパレル・雑貨
                </span>
                <span className="usecase-plan">STANDARD</span>
              </div>
              <div className="usecase-body">
                <div className="usecase-title" style={{ fontSize: '17px', marginBottom: '12px' }}>クーポン活用で来店を増やす</div>
                <p className="usecase-desc">来るだけで、買わなくともステップアップする仕組みを使い、特別クーポンでお得に買える仕組みにする。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECURITY
      ============================================================ */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">Security & Reliability</span>
            <h2>安心して運用いただくための仕組み</h2>
            <p>大切な顧客情報と店舗の売上を守るため、堅牢なセキュリティと運用体制を整えています。</p>
          </div>

          <div className="security-grid">
            <div className="security-item tilt-in" style={{ transitionDelay: '0s' }}>
              <div className="security-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="10" width="16" height="11" rx="2" fill="#16a34a" />
                  <path d="M8 10V7a4 4 0 018 0v3" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <circle cx="12" cy="15.5" r="1.5" fill="#fff" />
                  <path d="M12 16v2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h4>Firebase Auth 認証</h4>
              <p>業界標準のIDトークン認証で、店舗・代理店・アフィリエイトすべてのアカウントを安全に保護。</p>
            </div>
            <div className="security-item tilt-in" style={{ transitionDelay: '0.06s' }}>
              <div className="security-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M3 18l4-8 6 4 8-9" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M17 3h4v4" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h4>Webhook 署名検証</h4>
              <p>Squareからの決済通知は、HMAC-SHA256署名を検証。なりすまし・改ざんを完全に防止します。</p>
            </div>
            <div className="security-item tilt-in" style={{ transitionDelay: '0.12s' }}>
              <div className="security-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8z" fill="#16a34a" />
                  <circle cx="12" cy="3" r="2" fill="#ef4444" />
                </svg>
              </div>
              <h4>エラー即時通知</h4>
              <p>システムエラー発生時は管理者へ即時メール通知。5分間のスロットル機能で通知爆発も防止。</p>
            </div>
            <div className="security-item tilt-in" style={{ transitionDelay: '0.06s' }}>
              <div className="security-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="#16a34a" stroke="#16a34a" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
              <h4>サーキットブレーカー</h4>
              <p>異常検知時は管理画面から全配信をワンクリックで緊急停止。被害拡大を未然に防ぎます。</p>
            </div>
            <div className="security-item tilt-in" style={{ transitionDelay: '0.12s' }}>
              <div className="security-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M4 5h12l4 4v10a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z" stroke="#16a34a" strokeWidth="2" fill="none" strokeLinejoin="round" />
                  <path d="M16 5v4h4" stroke="#16a34a" strokeWidth="2" fill="none" strokeLinejoin="round" />
                  <path d="M7 12h8M7 15h5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h4>自動クリーンアップ</h4>
              <p>30日以上応答のない端末トークンは自動削除。ストレージ肥大化と誤配信リスクを防止。</p>
            </div>
            <div className="security-item tilt-in" style={{ transitionDelay: '0.18s' }}>
              <div className="security-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="3" width="14" height="18" rx="2" stroke="#16a34a" strokeWidth="2" fill="none" />
                  <path d="M9 8h6M9 12h6M9 16h4" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h4>監査ログ記録</h4>
              <p>決済履歴・報酬計算・手動アクションをすべてFirestoreに記録。いつ誰が何をしたか追跡可能。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FAQ
      ============================================================ */}
      <section className="section section-alt" id="faq">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">FAQ</span>
            <h2>よくあるご質問</h2>
            <p>その他ご不明な点は、お気軽にお問い合わせください。</p>
          </div>

          <div className="faq-list">
  {faqs.map((f, i) => (
    <details
      key={f.q}
      className="faq-item reveal"
      style={{ transitionDelay: `${i * 0.05}s` }}
    >
      <summary>
        {f.q}
        <svg
          className="faq-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 5v14M5 12h14"
            stroke="#ff4500"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </summary>
      <div className="faq-answer">{f.a}</div>
    </details>
  ))}
</div>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA
      ============================================================ */}
      <section className="cta-final" id="cta">
        <svg className="cta-bg-svg" viewBox="0 0 1400 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="ctaGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff4500" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ff4500" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="700" cy="300" r="400" fill="url(#ctaGlow)" />
          <path d="M0 400 Q 350 350 700 400 T 1400 400" stroke="#ff4500" strokeWidth="1" fill="none" opacity="0.15" />
          <path d="M0 430 Q 350 380 700 430 T 1400 430" stroke="#ff4500" strokeWidth="1" fill="none" opacity="0.08" />
        </svg>

        <div className="cta-final-inner reveal">
          <h2>
            お客様に喜んで頂ける、<br />
            お店づくりを、一緒に。
          </h2>
          <p>
            Push-taroは、実店舗の「喜んで頂ける仕組み」を<br />
            プッシュ通知 × CRM で自動化するプラットフォームです。<br />
            まずはお気軽に、無料相談・資料請求から。
          </p>
          <a href="/signup" className="btn-primary">
            今すぐ申し込む（無料相談・簡単登録）
            <svg className="svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <div className="cta-note">
            ※ 2026年9月 正式リリース予定。現在、先行登録受付中です。
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
      ============================================================ */}
      <footer className="footer">
        <div className="container">
          <div className="footer-logo">
            <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="footerLogoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ff6b6b" />
                  <stop offset="100%" stopColor="#ff4500" />
                </linearGradient>
              </defs>
              <circle cx="24" cy="24" r="23" fill="url(#footerLogoGrad)" />
              <path d="M24 8 L33 22 L28 22 L28 30 L20 30 L20 22 L15 22 Z" fill="#ffffff" />
              <circle cx="24" cy="20" r="3" fill="#ff4500" opacity="0.5" />
              <path d="M18 30 L14 38 L20 34 Z" fill="#ffffff" />
              <path d="M30 30 L34 38 L28 34 Z" fill="#ffffff" />
              <path d="M22 30 L24 40 L26 30 Z" fill="#fbbf24" />
            </svg>
            Push-taro
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
            実店舗のための次世代プッシュ通知CRMプラットフォーム
          </p>

          <div className="footer-links">
            <a href="/terms">利用規約</a>
            <a href="/privacy">プライバシーポリシー</a>
            <a href="/tokusho">特定商取引法に基づく表記</a>
            <a href="/programs">収益化プログラム</a>
            <a href="mailto:info@push-taro.com">お問い合わせ</a>
          </div>

          <p className="footer-copy">
            運営：the合同会社 〒357-0123 埼玉県飯能市中下藤下郷23-21<br />
            &copy; 2026 Push-taro All Rights Reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
