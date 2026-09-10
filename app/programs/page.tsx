'use client';

import { useState } from 'react';
import Link from 'next/link';
import './programs.css';

export default function ProgramsPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Q. 代理店の審査は厳しいですか？',
      a: '事業内容や実績に基づいて審査を行いますが、まずはお気軽にご相談ください。Web制作会社やマーケティング会社様からのご参加を特に歓迎しております。',
    },
    {
      q: 'Q. 紹介制度とアフィリエイトの違いは？',
      a: '紹介制度はPROプラン契約者限定で、月額10%の継続還元が受けられます。アフィリエイトは誰でも参加可能で、5%継続還元または一括報酬（PRO:5,000円 / Standard:2,000円 / Light:1,000円）を選択できます。',
    },
    {
      q: 'Q. 報酬はいつ・どうやって受け取れますか？',
      a: '代理店・紹介制度は毎月の請求精算時に相殺または振込にて精算されます。アフィリエイトは累計報酬が5,000円に達した時点で、手動振込（銀行振込）にてお支払いいたします。',
    },
    {
      q: 'Q. Push7と何が違うのですか？',
      a: 'Push-taroは実店舗専用のCRM機能（QRコードによる顧客獲得・クーポン管理・リピート促進）を備えており、また3つの収益化プログラム（代理店・紹介・アフィリエイト）を全て備えている唯一のサービスです。',
    },
    {
      q: 'Q. サービスはいつから始まりますか？',
      a: '2026年9月に正式リリース予定です。現在は事前登録および先行パートナーを募集中です。早期にご参加いただいた方には、特別なサポート体制をご用意しております。',
    },
  ];

  return (
    <div className="programs-page">
      {/* ナビゲーション */}
      <nav className="navbar">
        <div className="container">
          <div className="logo">
            Push-taro<span>.</span> <small>みんなのプッシュ通知</small>
          </div>
          <a href="#cta-final" className="nav-cta">
            <i className="fas fa-rocket"></i> 今すぐ参加
          </a>
        </div>
      </nav>

      {/* ヒーロー */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">
            <i className="fas fa-bolt"></i> 2026年9月サービス開始予定
          </div>
          <h1>
            みんなで広げる、<br />
            <span className="highlight">ストック収益</span>の新時代
          </h1>
          <p>
            Push-taroの<strong>代理店・紹介・アフィリエイト</strong> – 3つの収益化プログラムで、
            あなたのネットワークを毎月の安定収益に変えませんか？
          </p>
          <div className="hero-cta-group">
            <a href="#programs" className="btn-primary">
              <i className="fas fa-arrow-right"></i> プログラムを比較する
            </a>
            <a href="#cta-final" className="btn-secondary">
              <i className="fas fa-file-alt"></i> 無料で資料請求
            </a>
          </div>

          <div className="pillars">
            <div className="pillar-item">
              <span className="icon">👑</span>
              <h3>代理店パートナー</h3>
              <p>最大級のストック収益</p>
            </div>
            <div className="pillar-item">
              <span className="icon">🤝</span>
              <h3>紹介制度</h3>
              <p>PRO限定・実質無料化</p>
            </div>
            <div className="pillar-item">
              <span className="icon">📢</span>
              <h3>アフィリエイト</h3>
              <p>誰でもOK・0円スタート</p>
            </div>
          </div>
        </div>
      </section>

      {/* 市場の成長性 */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-title">
            <span className="tag">WHY NOW</span>
            <h2>なぜ今、Webプッシュ通知なのか？</h2>
            <p>実店舗のDXニーズが高まる中、Webプッシュ通知はメルマガを超える新たな顧客接点として急成長しています。</p>
          </div>
          <div className="market-grid">
            <div className="market-card">
              <div className="number">~6<span>倍</span></div>
              <p>メルマガ比の開封率</p>
            </div>
            <div className="market-card">
              <div className="number">94<span>%</span></div>
              <p>日本のスマートフォン普及率</p>
            </div>
            <div className="market-card">
              <div className="number">2026.9</div>
              <p>Push-taro サービス開始</p>
            </div>
            <div className="market-card">
              <div className="number">今</div>
              <p>先行者利益を掴む絶好のチャンス</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3つの収益化プログラム */}
      <section className="section" id="programs">
        <div className="container">
          <div className="section-title">
            <span className="tag">3 PROGRAMS</span>
            <h2>あなたに合った収益化プログラム</h2>
            <p>事業規模やスタイルに合わせて、最適なプログラムをお選びいただけます。</p>
          </div>

          <div className="program-grid">
            {/* 代理店 */}
            <div className="program-card">
              <span className="badge">BEST</span>
              <div className="emoji-big">👑</div>
              <h3>代理店パートナー</h3>
              <div className="sub">法人・事業者向け｜最大級のストック収益</div>

              <div className="price-table">
                <div className="row"><span className="label">加盟金（キャンペーン）</span><span className="value highlight">¥300,000</span></div>
                <div className="row"><span className="label">月額費用</span><span className="value">¥30,000</span></div>
                <div className="row"><span className="label">PRO紹介報酬</span><span className="value highlight">30%</span></div>
                <div className="row"><span className="label">Standard/Light紹介報酬</span><span className="value highlight">18%</span></div>
              </div>

              <ul className="features">
                <li><i className="fas fa-check-circle"></i> 専用ダッシュボード & 優先サポート</li>
                <li><i className="fas fa-check-circle"></i> 販促素材・テンプレート提供</li>
                <li><i className="fas fa-check-circle"></i> 紹介店舗が継続する限り報酬発生</li>
                <li><i className="fas fa-check-circle"></i> 100社紹介で月収 <strong>30万円</strong> 超</li>
              </ul>

              <Link href="/agency" className="cta-link">
                資料請求する <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            {/* 紹介制度 */}
            <div className="program-card">
              <span className="badge blue">PRO限定</span>
              <div className="emoji-big">🤝</div>
              <h3>紹介制度</h3>
              <div className="sub">PROプラン契約者向け｜実質無料化が可能</div>

              <div className="price-table">
                <div className="row"><span className="label">参加条件</span><span className="value">PROプラン契約</span></div>
                <div className="row"><span className="label">紹介報酬（全プラン一律）</span><span className="value highlight">10%</span></div>
                <div className="row"><span className="label">換金条件</span><span className="value">累計 ¥10,000</span></div>
              </div>

              <ul className="features">
                <li><i className="fas fa-check-circle"></i> 紹介した店舗が続く限り <strong>毎月継続</strong></li>
                <li><i className="fas fa-check-circle"></i> PRO 10件紹介で <strong>実質無料</strong></li>
                <li><i className="fas fa-check-circle"></i> 20件紹介で月収 <strong>20,000円</strong></li>
                <li><i className="fas fa-check-circle"></i> 管理画面から即時参加可能</li>
              </ul>

              <Link href="/admin" className="cta-link outline">
                管理画面から参加 <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            {/* アフィリエイト */}
            <div className="program-card">
              <span className="badge green">NEW</span>
              <div className="emoji-big">📢</div>
              <h3>アフィリエイト</h3>
              <div className="sub">誰でもOK｜リスクフリーで副収入</div>

              <div className="price-table">
                <div className="row"><span className="label">参加条件</span><span className="value">なし（誰でもOK）</span></div>
                <div className="row"><span className="label">継続課金型（全プラン一律）</span><span className="value highlight">5%</span></div>
                <div className="row"><span className="label">一時金（PRO/Standard/Light）</span><span className="value">¥5,000 / ¥2,000 / ¥1,000</span></div>
              </div>

              <ul className="features">
                <li><i className="fas fa-check-circle"></i> <strong>初期費用・月額費用 0円</strong></li>
                <li><i className="fas fa-check-circle"></i> 継続課金 or 一時金を選択可能</li>
                <li><i className="fas fa-check-circle"></i> 自分のブログ・SNSで自由に発信</li>
                <li><i className="fas fa-check-circle"></i> PRO 10件で月収 <strong>5,000円</strong> のストック収益</li>
              </ul>

              <Link href="/affiliate/signup" className="cta-link green">
                今すぐ登録 <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 比較表 */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-title">
            <span className="tag">COMPARE</span>
            <h2>3つのプログラム 比較表</h2>
            <p>自分に最適なプログラムを一目で比較できます。</p>
          </div>

          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>比較項目</th>
                  <th>👑 代理店</th>
                  <th>🤝 紹介制度</th>
                  <th>📢 アフィリエイト</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>参加条件</strong></td>
                  <td>審査あり（法人・事業者）</td>
                  <td>PROプラン契約者</td>
                  <td><strong>誰でもOK</strong></td>
                </tr>
                <tr>
                  <td><strong>初期費用</strong></td>
                  <td>¥300,000（加盟金）</td>
                  <td>¥0（PRO月額¥10,000必要）</td>
                  <td><strong>¥0</strong></td>
                </tr>
                <tr>
                  <td><strong>PRO紹介報酬</strong></td>
                  <td className="highlight-cell">30%（継続）</td>
                  <td>10%（継続）</td>
                  <td>5%（継続） or ¥5,000（一括）</td>
                </tr>
                <tr>
                  <td><strong>Standard/Light紹介報酬</strong></td>
                  <td className="highlight-cell">18%（継続）</td>
                  <td>10%（継続）</td>
                  <td>5%（継続） or ¥2,000/¥1,000（一括）</td>
                </tr>
                <tr>
                  <td><strong>収益の特徴</strong></td>
                  <td>最大級のストック収益</td>
                  <td>実質無料化が可能</td>
                  <td>リスクフリーで始められる</td>
                </tr>
                <tr>
                  <td><strong>推奨ユーザー</strong></td>
                  <td>法人・事業者</td>
                  <td>既存PROユーザー</td>
                  <td>個人・ブロガー・インフルエンサー</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 競合比較 */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <span className="tag">VS COMPETITORS</span>
            <h2>Push-taro が選ばれる理由</h2>
            <p>主要競合と比較しても、圧倒的な優位性があります。</p>
          </div>

          <div className="competitor-grid">
            <div className="competitor-card">
              <div className="name push-taro">🔥 Push-taro</div>
              <div className="tagline">実店舗特化型CRM + 収益化プログラム</div>
              <ul className="feature-list">
                <li><span>代理店制度</span><span className="val yes">✅ 充実 (30%/18%)</span></li>
                <li><span>紹介制度</span><span className="val yes">✅ 10%継続</span></li>
                <li><span>アフィリエイト</span><span className="val yes">✅ 5%継続 or 一括</span></li>
                <li><span>収益化プログラム数</span><span className="val best">3つ</span></li>
                <li><span>ターゲット</span><span className="val">実店舗CRM</span></li>
              </ul>
            </div>

            <div className="competitor-card">
              <div className="name">📱 Push7</div>
              <div className="tagline">Webサイト・ブログ向け</div>
              <ul className="feature-list">
                <li><span>代理店制度</span><span className="val no">❌ なし</span></li>
                <li><span>紹介制度</span><span className="val no">❌ なし</span></li>
                <li><span>アフィリエイト</span><span className="val no">❌ なし</span></li>
                <li><span>収益化プログラム数</span><span className="val no">0つ</span></li>
                <li><span>ターゲット</span><span className="val">Webサイト・ブログ</span></li>
              </ul>
            </div>

            <div className="competitor-card">
              <div className="name">📡 OneSignal</div>
              <div className="tagline">Webアプリ・サイト全般</div>
              <ul className="feature-list">
                <li><span>代理店制度</span><span className="val no">❌ なし</span></li>
                <li><span>紹介制度</span><span className="val no">❌ なし</span></li>
                <li><span>アフィリエイト</span><span className="val no">❌ なし</span></li>
                <li><span>収益化プログラム数</span><span className="val no">0つ</span></li>
                <li><span>ターゲット</span><span className="val">Webアプリ全般</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 収益シミュレーション */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-title">
            <span className="tag">SIMULATION</span>
            <h2>具体的な収益シミュレーション</h2>
            <p>あなたのネットワークがどれだけの収益を生み出すか、具体的にイメージできます。</p>
          </div>

          <div className="sim-wrap">
            <div className="sim-card">
              <h4>👑 ケース①：代理店（50社PRO紹介）</h4>
              <div className="desc">50社 × PRO月額 ¥10,000 × 30%</div>
              <div className="amount">¥150,000 <span>/ 月</span></div>
              <div className="note"><i className="fas fa-rocket"></i> 加盟金 ¥300,000 は約2ヶ月で回収可能！</div>
            </div>

            <div className="sim-card">
              <h4>🤝 ケース②：紹介制度（10社PRO紹介）</h4>
              <div className="desc">10社 × PRO月額 ¥10,000 × 10%</div>
              <div className="amount">¥10,000 <span>/ 月</span></div>
              <div className="note"><i className="fas fa-gift"></i> PROプラン（¥10,000/月）が <strong>実質無料</strong> に！</div>
            </div>

            <div className="sim-card">
              <h4>📢 ケース③：アフィリエイト（10社PRO紹介）</h4>
              <div className="desc">継続課金型：10社 × ¥10,000 × 5%</div>
              <div className="amount">¥5,000 <span>/ 月</span></div>
              <div className="note"><i className="fas fa-coins"></i> 一時金型なら <strong>¥50,000</strong> の一括収入も選択可！</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <span className="tag">FAQ</span>
            <h2>よくある質問</h2>
          </div>

          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div key={idx} className={`faq-item ${activeFaq === idx ? 'active' : ''}`}>
                <button
                  className="faq-question"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                >
                  <span>{faq.q}</span>
                  <i className="fas fa-chevron-down"></i>
                </button>
                <div className="faq-answer">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 最終CTA */}
      <section className="cta-final" id="cta-final">
        <div className="container">
          <h2>今すぐ始めて、<br />ストック収益を手に入れよう</h2>
          <p>あなたのネットワークが、毎月の安定収益に変わります。まずは無料で情報を入手してください。</p>

          <div className="grid">
            <div className="item">
              <div className="icon">👑</div>
              <h4>代理店パートナー</h4>
              <div className="sub">審査あり｜最大収益</div>
              <Link href="/agency" className="btn-small">資料請求する</Link>
            </div>
            <div className="item">
              <div className="icon">🤝</div>
              <h4>紹介制度</h4>
              <div className="sub">PRO限定｜実質無料</div>
              <Link href="/admin" className="btn-small outline">管理画面から参加</Link>
            </div>
            <div className="item">
              <div className="icon">📢</div>
              <h4>アフィリエイト</h4>
              <div className="sub">誰でもOK｜0円スタート</div>
              <Link href="/affiliate/signup" className="btn-small">今すぐ登録</Link>
            </div>
          </div>

          <div className="footnote">
            <i className="fas fa-clock"></i> Push-taroは <strong>2026年9月</strong> サービス開始予定です。<br />
            現在は事前登録を受け付けております。{' '}
            <a href="mailto:pushtaro-info@gmail.com" style={{ color: '#fb923c', textDecoration: 'underline' }}>
              お問い合わせ
            </a>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="footer">
        <div className="container">
          <p style={{ fontWeight: 700, color: '#fff', marginBottom: 8 }}>
            Push-taro <span style={{ color: '#ff4500' }}>.</span>
          </p>
          <p style={{ fontSize: 12 }}>
            &copy; 2026 Push-taro All Rights Reserved. &nbsp;|&nbsp;
            <Link href="/terms">利用規約</Link> &nbsp;|&nbsp;
            <Link href="/privacy">プライバシーポリシー</Link> &nbsp;|&nbsp;
            <Link href="/tokusho">特定商取引法</Link>
          </p>
          <p style={{ fontSize: 11, color: '#64748b', marginTop: 8 }}>
            運営：the合同会社 〒357-0123 埼玉県飯能市中藤下郷23-21
          </p>
        </div>
      </footer>
    </div>
  );
}
