// app/event/EventClient.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import './event.css';
import { faqs } from './data/faq';

export default function EventClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="ev-page">
      {/* ================= ナビ ================= */}
      <nav className="ev-nav">
        <div className="ev-nav-inner">
          <div className="ev-nav-brand">
            <Link href="/" className="ev-nav-logo" aria-label="Push-taro.EVENT">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <defs>
                  <linearGradient
                    id="evBrandLogoGrad"
                    x1="0"
                    y1="0"
                    x2="48"
                    y2="48"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#ff6b6b" />
                    <stop offset="100%" stopColor="#ff4500" />
                  </linearGradient>
                </defs>
                <circle cx="24" cy="24" r="23" fill="url(#evBrandLogoGrad)" />
                <path d="M24 8 L33 22 L28 22 L28 30 L20 30 L20 22 L15 22 Z" fill="#ffffff" />
                <circle cx="24" cy="20" r="3" fill="#ff4500" opacity="0.5" />
                <path d="M18 30 L14 38 L20 34 Z" fill="#ffffff" />
                <path d="M30 30 L34 38 L28 34 Z" fill="#ffffff" />
                <path d="M22 30 L24 40 L26 30 Z" fill="#fbbf24" />
              </svg>
              <span>
                Push-taro<span className="ev-nav-logo-dot">.</span>EVENT
              </span>
            </Link>
          </div>
          <Link href="/signup" className="ev-nav-cta">
            資料請求 →
          </Link>
        </div>
      </nav>

      <main>
        {/* ================= 1. ヒーロー ================= */}
        <section className="ev-hero">
          <div className="ev-inner">
            <div className="ev-soon">
              <span className="ev-soon-badge">近日公開</span>
              <span className="ev-soon-text">資料請求・導入の事前相談を受付中</span>
            </div>
            <span className="ev-tag">Push-taro.EVENT</span>
            <h1>
              イベント当日の「今」を、
              <br />
              来場者のスマホへ<span className="ev-accent">直接</span>届ける。
            </h1>
            <p className="ev-hero-sub">
              push-taro EVENT は、イベント・展示会専用のプッシュ通知 × クーポン基盤です。
              <br />
              15分刻みの予約配信と最大500件のクーポンは、出店者に販売できる「広告商品」になります。
              <br />
              イベント向けの同種サービスは、まだほとんど存在しません。
            </p>
            <div className="ev-cta-row">
              <Link href="/signup" className="ev-btn ev-btn-primary">
                資料請求する
              </Link>
              <Link href="/contact" className="ev-btn ev-btn-secondary">
                導入の相談をする
              </Link>
            </div>
            <p className="ev-note">
              1ヶ月単位の契約（申込日から）／初期費用0円／購読者5万人プラン 月額¥39,800（税別）から
            </p>
          </div>
        </section>

        {/* ================= 2. 主催者の課題 ================= */}
        <section className="ev-section">
          <div className="ev-inner">
            <h2 className="ev-h2">イベントの収益は、「出店料」だけに頼っていませんか。</h2>
            <div className="ev-cards3">
              <div className="ev-card">
                <span className="ev-num">課題 1</span>
                <h3>収益の柱が、出店料しかない</h3>
                <p>
                  イベントの収入は出店料が中心です。出店者が予定より集まらなければ、そのまま収支が苦しくなります。開催が近づいてから打てる、プラスアルファの収益策はなかなかありません。
                </p>
              </div>
              <div className="ev-card">
                <span className="ev-num">課題 2</span>
                <h3>当日の告知が、届いていない</h3>
                <p>
                  プログラムの変更、ステージの開始、混雑情報。SNSに投稿しても来場者のタイムラインには埋もれ、場内アナウンスは聞き逃されます。「今、ここで」を来場者全員に届ける手段がありません。プログラムや会場案内を印刷物で配っている場合、変更が出ても刷り直しは効かず、当日の差し替えもできません。
                </p>
              </div>
              <div className="ev-card">
                <span className="ev-num">課題 3</span>
                <h3>出店者に渡せる付加価値が作れない</h3>
                <p>
                  出店者が求めているのは「場所」だけではなく「来場者をブースへ呼ぶ仕組み」です。それを用意できなければ、出店料以外の提案ができず、次回出店の交渉材料も増えません。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3. 解決策の提示 ================= */}
        <section className="ev-section ev-solution">
          <div className="ev-inner">
            <h2 className="ev-h2">イベントのためだけに設計された、配信の基盤。</h2>
            <div className="ev-intro">
              <p>
                <strong>push-taro EVENT とは</strong>
              </p>
              <p>
                push-taro EVENT
                は、イベント開催期間のためだけに設計された、プッシュ通知とクーポンの配信基盤です。来場者は会場のQRコードから登録し、主催者は専用ダッシュボードから配信とクーポンを運用します。購読は毎日リセットされるため、情報は「その日限り」で完結します。
              </p>
            </div>
            <div className="ev-cards3">
              <div className="ev-card">
                <span className="ev-num">特徴 1</span>
                <h3>15分刻みの予約配信＋即時プッシュ</h3>
                <p>
                  当日のプログラムに合わせ、15分刻みで配信をいくつでも仕込めます。ステージ開始や実演のタイミングに、告知を自動で届けられます。急なプログラム変更や混雑情報は、予約なしの即時プッシュでその場で送れます。
                </p>
              </div>
              <div className="ev-card">
                <span className="ev-num">特徴 2</span>
                <h3>クーポン標準100件・最大500件</h3>
                <p>
                  出店者のクーポンを一覧で掲載できます。来場者は会社名とキーワードで検索できるので、「探しに来た来場者」にも届きます。
                </p>
              </div>
              <div className="ev-card">
                <span className="ev-num">特徴 3</span>
                <h3>毎日リセット＋集計レポート</h3>
                <p>
                  購読データは保持期間（1〜3日）を過ぎると毎日リセットされます。リセットの前に、購読者数・プッシュ通知数・開封率・クーポン数・消し込み履歴をまとめた集計レポートをメールでお届けします。来場者の生データを持ち越さない設計です。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 4. 出店者に売れる「広告」2種 ================= */}
        <section className="ev-section ev-ads">
          <div className="ev-inner">
            <h2 className="ev-h2">
              EVENT が作るのは、コストではありません。
              <br />
              出店者に売れる「広告」です。
            </h2>
            <p className="ev-lead">
              出店料は「場所」の対価です。push-taro EVENT
              が主催者に足すのは、「来場者を動かす」広告の対価を受け取る仕組みです。予約配信とクーポンは、どちらも出店者にそのまま販売できる広告商品になります。
            </p>
            <div className="ev-ad-cards">
              <div className="ev-ad-card">
                <span className="ev-ad-label">広告 A</span>
                <h3>タイムテーブル連動プッシュ（予約配信）</h3>
                <p>出店者・出演者の「出番」に合わせて届く、時間指定の広告枠です。</p>
                <ul>
                  <li>ステージ登壇、実演デモ、限定販売の開始時刻に合わせ、15分刻みで配信を予約できます</li>
                  <li>来場者全員のスマホに直接届くため、会場の隅のブースでも「今から始まる」を告知できます</li>
                  <li>SNSのタイムラインに埋もれず、場内アナウンスのように聞き逃されることもありません</li>
                </ul>
                <p className="ev-ad-closing">出店者にとっては、「自分の時間に、来場者を集める」ための広告です。</p>
              </div>
              <div className="ev-ad-card">
                <span className="ev-ad-label">広告 B</span>
                <h3>クーポン掲載</h3>
                <p>来場と購買に直結する広告枠です。</p>
                <ul>
                  <li>ブース来場特典、その場限りの割引、試供品の引き換えなど、出店者ごとにクーポンを掲載できます</li>
                  <li>来場者は会社名・キーワードでクーポンを検索できるため、目的を持った来場者の目にも留まります</li>
                  <li>クーポンの消込件数は集計レポートに残るため、出店者への効果報告にも使えます</li>
                </ul>
                <p className="ev-ad-closing">出店者にとっては、「来てもらう理由」を来場者のスマホに置ける広告です。</p>
              </div>
            </div>
            <div className="ev-flow">
              <h3>主催者の収益になる構造</h3>
              <div className="ev-flow-step">主催者は push-taro EVENT を1ヶ月単位で契約</div>
              <div className="ev-flow-arrow">↓</div>
              <div className="ev-flow-step">予約配信の枠とクーポン掲載の枠を、広告商品として出店者に販売</div>
              <div className="ev-flow-arrow">↓</div>
              <div className="ev-flow-step">出店料とは別に、広告収入が生まれる</div>
              <div className="ev-flow-arrow">↓</div>
              <div className="ev-flow-step">EVENT の月額は、広告収入から回収できる</div>
            </div>
            <p className="ev-ads-fineprint">
              ※出店者向けの販売価格と枠数は、主催者が自由に設定できます。当社が価格を指定することはありません。
            </p>
          </div>
        </section>

        {/* ================= 5. 主催者の収支イメージ（試算例） ================= */}
        <section className="ev-section">
          <div className="ev-inner">
            <h2 className="ev-h2">収支イメージ（試算例）</h2>
            <p>出店者50社規模のイベントで、5万人プランを契約した場合の試算です。</p>
            <table className="ev-table">
              <tbody>
                <tr>
                  <th>項目</th>
                  <th>内容</th>
                  <th>金額</th>
                </tr>
                <tr>
                  <td>EVENT 利用料</td>
                  <td>購読者5万人プラン（1ヶ月・税別）</td>
                  <td className="ev-amount">¥39,800</td>
                </tr>
                <tr>
                  <td>広告収入（仮）</td>
                  <td>出店者50社に「プッシュ配信1枠＋クーポン掲載」のセットを1社 ¥10,000 で販売</td>
                  <td className="ev-amount">¥500,000</td>
                </tr>
                <tr className="ev-total-row">
                  <td>差し引き（試算）</td>
                  <td></td>
                  <td className="ev-amount">+¥460,200</td>
                </tr>
              </tbody>
            </table>
            <p className="ev-fineprint">
              ※上記の出店者向け単価（1社
              ¥10,000）と販売社数は仮置きの試算例です。実際の販売価格・枠数は主催者が設定するものであり、収入を保証するものではありません。
              <br />
              ※広告を販売しなくても、来場者への告知基盤としてのみの利用も可能です。
            </p>
          </div>
        </section>

        {/* ================= 6. 主な仕様・機能 ================= */}
        <section className="ev-section ev-spec">
          <div className="ev-inner">
            <h2 className="ev-h2">仕様・機能</h2>
            <table className="ev-table">
              <tbody>
                <tr>
                  <th style={{ width: '26%' }}>項目</th>
                  <th>内容</th>
                </tr>
                <tr>
                  <td>
                    <strong>配信（予約・即時）</strong>
                  </td>
                  <td>
                    15分刻みで、いくつでも事前に仕込み可能。予約なしの即時プッシュも可能で、当日のプログラム変更や混雑情報など、急な案内にもその場で対応
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>来場者登録</strong>
                  </td>
                  <td>会場に掲示する日替わりQRコードから登録。取得情報は電話番号のみ（SMS認証）。アプリのインストールは不要</td>
                </tr>
                <tr>
                  <td>
                    <strong>購読のリセット</strong>
                  </td>
                  <td>
                    毎日リセット。保持期間は1〜3日をイベントごとに設定可能。リセット前に集計レポート（購読者数・プッシュ通知数・開封率・クーポン数・消し込み履歴）をメール送信
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>クーポン</strong>
                  </td>
                  <td>標準100件込み、オプションで最大500件。来場者の画面で会社名＋キーワード検索が可能</td>
                </tr>
                <tr>
                  <td>
                    <strong>会場案内PDF</strong>
                  </td>
                  <td>
                    会場案内・プログラム・会場マップなどのPDFを来場者の画面に掲載可能。印刷物の配布を実質なくせて、印刷コストも削減できます。内容の変更もその場で差し替え可能
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>専用ダッシュボード</strong>
                  </td>
                  <td>予約配信の一覧、クーポン管理、現在の登録者数を主催者専用画面で運用</td>
                </tr>
                <tr>
                  <td>
                    <strong>購読者上限</strong>
                  </td>
                  <td>プランごとに5万人／10万人／20万人</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ================= 7. 料金 ================= */}
        <section className="ev-section">
          <div className="ev-inner">
            <h2 className="ev-h2">料金</h2>
            <div className="ev-price-cards">
              <div className="ev-price-card ev-featured">
                <div className="ev-plan">5万人プラン</div>
                <div className="ev-cap">
                  購読者上限 <strong>50,000人</strong>
                </div>
                <div className="ev-price">
                  ¥39,800<small> /月（税別）</small>
                </div>
              </div>
              <div className="ev-price-card">
                <div className="ev-plan">10万人プラン</div>
                <div className="ev-cap">
                  購読者上限 <strong>100,000人</strong>
                </div>
                <div className="ev-price">
                  ¥59,800<small> /月（税別）</small>
                </div>
              </div>
              <div className="ev-price-card">
                <div className="ev-plan">20万人プラン</div>
                <div className="ev-cap">
                  購読者上限 <strong>200,000人</strong>
                </div>
                <div className="ev-price">
                  ¥78,000<small> /月（税別）</small>
                </div>
              </div>
            </div>
            <div className="ev-option-box">
              <h3>クーポンオプション</h3>
              <p>標準で100件まで掲載可能。追加は100件ごとに ¥10,000（税別）、最大500件まで拡張できます。</p>
            </div>
            <ul className="ev-notes">
              <li>契約単位は1ヶ月です。起算日は申込日となります。</li>
              <li>1ヶ月には、開催当日に加えて、テスト配信と来場者の事前登録の期間を含みます。</li>
              <li>初期費用は0円です。表示価格はすべて税別です。</li>
            </ul>
          </div>
        </section>

        {/* ================= 8. 導入の流れ ================= */}
        <section className="ev-section">
          <div className="ev-inner">
            <h2 className="ev-h2">導入の流れ</h2>
            <div className="ev-steps">
              <div className="ev-step-card">
                <div className="ev-step-label">STEP 1</div>
                <h3>申込</h3>
                <p>想定来場者数に合ったプランを選んでお申し込みください。契約期間（1ヶ月）は申込日から始まります。</p>
              </div>
              <div className="ev-step-card">
                <div className="ev-step-label">STEP 2</div>
                <h3>事前準備・事前登録</h3>
                <p>
                  日替わりQRコードを発行し、イベント告知とあわせて来場者への登録案内を開始します。この期間に、出店者のクーポン登録と、当日の予約配信の仕込みを行います。
                </p>
              </div>
              <div className="ev-step-card">
                <div className="ev-step-label">STEP 3</div>
                <h3>当日運用</h3>
                <p>
                  仕込んだ予約配信がプログラムに合わせて自動で届きます。プログラム変更や混雑情報は、即時プッシュでその場で届けられます。クーポンの消込も来場者の画面で完結します。
                </p>
              </div>
              <div className="ev-step-card">
                <div className="ev-step-label">STEP 4</div>
                <h3>終了後</h3>
                <p>
                  集計レポート（購読者数・プッシュ通知数・開封率・クーポン数・消し込み履歴）がメールで届きます。購読データは保持期間を過ぎたものから毎日リセットされ、次回開催に持ち越しません。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 9. FAQ ================= */}
        <section className="ev-section ev-faq">
          <div className="ev-inner">
            <h2 className="ev-h2">よくある質問</h2>
            {faqs.map((f, i) => (
              <div key={i} className="ev-faq-item">
                <button
                  type="button"
                  className="ev-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>Q. {f.q}</span>
                  <span className="ev-faq-icon">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && <p className="ev-faq-a">{f.a}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* ================= 10. 最終CTA ================= */}
        <section className="ev-section ev-final-cta">
          <div className="ev-inner">
            <h2 className="ev-h2">次のイベントを、「出店料だけ」で終わらせない。</h2>
            <p className="ev-final-text">
              push-taro EVENT は、主催者にとっての経費ではなく、出店者に販売できる広告の仕入れです。
              <br />
              まずは想定来場者数と開催日をお知らせください。規模に合ったプランと枠の設計をご案内します。
            </p>
            <div className="ev-cta-row">
              <Link href="/signup" className="ev-btn ev-btn-primary">
                資料請求する
              </Link>
              <Link href="/contact" className="ev-btn ev-btn-secondary">
                導入の相談をする
              </Link>
            </div>
            <p className="ev-note">1ヶ月単位・初期費用0円・月額¥39,800（税別）から</p>
          </div>
        </section>
      </main>
    </div>
  );
}
