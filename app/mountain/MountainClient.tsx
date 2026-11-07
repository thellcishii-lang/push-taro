// app/mountain/MountainClient.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import './mountain.css';
import { faqs } from './data/faq';

export default function MountainClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="mt-page">
      {/* ================= ナビ ================= */}
      <nav className="mt-nav">
        <div className="mt-nav-inner">
          <div className="mt-nav-brand">
            <Link href="/" className="mt-nav-logo" aria-label="Push-taro.MOUNTAIN">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <defs>
                  <linearGradient
                    id="mtBrandLogoGrad"
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
                <circle cx="24" cy="24" r="23" fill="url(#mtBrandLogoGrad)" />
                <path d="M24 8 L33 22 L28 22 L28 30 L20 30 L20 22 L15 22 Z" fill="#ffffff" />
                <circle cx="24" cy="20" r="3" fill="#ff4500" opacity="0.5" />
                <path d="M18 30 L14 38 L20 34 Z" fill="#ffffff" />
                <path d="M30 30 L34 38 L28 34 Z" fill="#ffffff" />
                <path d="M22 30 L24 40 L26 30 Z" fill="#fbbf24" />
              </svg>
              <span>
                Push-taro<span className="mt-nav-logo-dot">.</span>MOUNTAIN
              </span>
            </Link>
          </div>
          <Link href="/signup" className="mt-nav-cta">
            資料請求 →
          </Link>
        </div>
      </nav>

      <main>
        {/* ================= 1. ヒーロー ================= */}
        <section className="mt-hero">
          <div className="mt-inner">
            <div className="mt-soon">
              <span className="mt-soon-badge">近日公開</span>
              <span className="mt-soon-text">資料請求・導入の事前相談を受付中</span>
            </div>
            <span className="mt-tag">Push-taro.MOUNTAIN</span>
            <h1>
              山の「今」を、
              <br />
              登山者のスマホへ<span className="mt-accent">直接</span>届ける。
            </h1>
            <p className="mt-hero-sub">
              push-taro MOUNTAIN は、低山・日帰りハイキング専用のプッシュ通知基盤です。
              <br />
              天候の急変や熊の出没を、そのエリアにいる登山者へ直接通知。
              <br />
              現在地がわかる地図と、下山したかどうかを確認できる仕組みで、山の安全と山裾の賑わいを支えます。
            </p>
            <div className="mt-cta-row">
              <Link href="/signup" className="mt-btn mt-btn-primary">
                資料請求する
              </Link>
              <Link href="/contact" className="mt-btn mt-btn-secondary">
                導入の相談をする
              </Link>
            </div>
            <p className="mt-note">近日公開／導入先は山岳・観光系の組合・協会向け／初期費用0円（予定）</p>
          </div>
        </section>

        {/* ================= 2. 組合の課題 ================= */}
        <section className="mt-section">
          <div className="mt-inner">
            <h2 className="mt-h2">「お知らせ」と「安全確認」が、アナログのままになっていませんか。</h2>
            <div className="mt-cards3">
              <div className="mt-card">
                <span className="mt-num">課題 1</span>
                <h3>急な天候変化や熊の出没を、その場の登山者へ届ける手段がない</h3>
                <p>
                  山の天気は変わりやすく、熊の出没情報も突然です。登山口の掲示やSNSでは、その山に今いる登山者全員には届きません。
                </p>
              </div>
              <div className="mt-card">
                <span className="mt-num">課題 2</span>
                <h3>日没後、「まだ下りてきていない人」が何人いるか分からない</h3>
                <p>
                  日帰りの低山でも、下山できていない登山者がいるかどうかは、現場の大きな不安です。誰が残っているのかを確認する手段がなければ、初動が遅れます。
                </p>
              </div>
              <div className="mt-card">
                <span className="mt-num">課題 3</span>
                <h3>安全対策はコストばかりで、収益に繋がらない</h3>
                <p>
                  安全のための設備や人手は、組合にとって負担になりがちです。山裾のお店の賑わいと結びつける仕組みがなければ、続けること自体が難しくなります。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3. 解決策の提示 ================= */}
        <section className="mt-section mt-solution">
          <div className="mt-inner">
            <h2 className="mt-h2">その日の登山のためだけに設計された、安全と案内の基盤。</h2>
            <div className="mt-intro">
              <p>
                <strong>push-taro MOUNTAIN とは</strong>
              </p>
              <p>
                push-taro MOUNTAIN
                は、低山・日帰りハイキングのためだけに設計されたプッシュ通知基盤です。登山者は登山口のQRコードから登録し、組合は専用画面から安全情報の配信と下山状況の確認を行います。登録はその日限りで、エリアを離れた登山者の情報は残しません。
              </p>
            </div>
            <div className="mt-cards3">
              <div className="mt-card">
                <span className="mt-num">特徴 1</span>
                <h3>気象・熊出没のプッシュ通知</h3>
                <p>
                  天候の急変や熊の出没など、安全に関わる情報を、そのエリアにいる登山者全員へ直接届けます。情報の発信は組合側が行い、登山者は自分の現在地と、およその出没位置を地図上で確認できます。安全通知はクーポンなどとは別の枠で扱い、緊急情報としての格を守ります。
                </p>
              </div>
              <div className="mt-card">
                <span className="mt-num">特徴 2</span>
                <h3>圏外でも使える地図と現在地</h3>
                <p>
                  GPSは電波がなくても現在地を表示できます。全国の地図データを端末に引き込めるため、圏外の山中でも「自分がどこにいるか」が分かります。
                </p>
              </div>
              <div className="mt-card">
                <span className="mt-num">特徴 3</span>
                <h3>下山確認プッシュと「未確認」リスト</h3>
                <p>
                  夕方、登山者全員へ「下山確認」のプッシュ通知を送ります。下山した登山者は、通知から開いた画面で下山ボタンを押すだけ。下山が確認できた人から順に、その日の登録は終了します。夕方6時の時点で確認が取れていない人は「下山未確認」のリストに残り、組合の管理者が照会すると登録時の電話番号が表示され、電話での安否確認や警察への報告につなげられます。Bluetoothによる最終位置の判定も、居場所の手がかりとして活用します。
                </p>
              </div>
            </div>
            <div className="mt-warn">
              <p>
                ※本サービスは安全を補助する仕組みであり、遭難の検知や安全を保証するものではありません。「通知がなかった＝危険がない」わけではないことを、利用案内でも明示します。
              </p>
            </div>
          </div>
        </section>

        {/* ================= 4. 山裾のお店とつながるクーポン ================= */}
        <section className="mt-section mt-ads">
          <div className="mt-inner">
            <h2 className="mt-h2">安全対策が、地域の収益にもなる仕組み。</h2>
            <p className="mt-lead">
              MOUNTAIN
              には、山裾のお店（温泉・飲食・お土産）のクーポンを掲載できます。下山した登山者のスマホに「お疲れさま」の一杯や入浴の案内が届く、地域の賑わいづくりです。
            </p>
            <div className="mt-flow">
              <h3>組合にとっての収益構造</h3>
              <div className="mt-flow-step">組合は push-taro MOUNTAIN を契約</div>
              <div className="mt-flow-arrow">↓</div>
              <div className="mt-flow-step">山裾のお店へ、クーポン掲載の枠を宣伝メニューとして提供</div>
              <div className="mt-flow-arrow">↓</div>
              <div className="mt-flow-step">お店からの宣伝費で、アプリの利用料をまかなえる</div>
              <div className="mt-flow-arrow">↓</div>
              <div className="mt-flow-step">安全対策が「コスト」から「地域の仕組み」に変わる</div>
            </div>
            <p className="mt-ads-fineprint">※クーポンの枠数や宣伝費の設定は、組合が自由に決められます。</p>
          </div>
        </section>

        {/* ================= 5. 主な仕様・機能 ================= */}
        <section className="mt-section mt-spec">
          <div className="mt-inner">
            <h2 className="mt-h2">仕様・機能</h2>
            <table className="mt-table">
              <tbody>
                <tr>
                  <th style={{ width: '26%' }}>項目</th>
                  <th>内容</th>
                </tr>
                <tr>
                  <td>
                    <strong>安全通知</strong>
                  </td>
                  <td>気象の急変・熊の出没などを、そのエリアの登山者全員へプッシュ通知。発信内容は組合側が作成。クーポンとは別枠で配信</td>
                </tr>
                <tr>
                  <td>
                    <strong>地図・現在地</strong>
                  </td>
                  <td>GPSによる現在地表示。全国の地図データを引き込め、圏外でも現在地と地図を確認可能</td>
                </tr>
                <tr>
                  <td>
                    <strong>出没位置の表示</strong>
                  </td>
                  <td>熊の出没位置（およその位置）を、登山者側の地図上に表示</td>
                </tr>
                <tr>
                  <td>
                    <strong>登山者登録</strong>
                  </td>
                  <td>登山口などのQRコードから登録。取得情報は電話番号のみ（SMS認証）。アプリのインストールは不要</td>
                </tr>
                <tr>
                  <td>
                    <strong>下山確認</strong>
                  </td>
                  <td>
                    夕方に下山確認のプッシュ通知を送信。下山ボタンで確認できた登山者から登録を終了し、当日18時の時点で未確認の登山者だけがリストに残る。次にアプリを開いた際にエリア外と確認できた場合も自動で解除
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>登録のリセット</strong>
                  </td>
                  <td>翌日以降、下山未確認の登山者以外は購読者から削除。安否確認が取れた時点で、未確認者も削除</td>
                </tr>
                <tr>
                  <td>
                    <strong>安否照会</strong>
                  </td>
                  <td>未下山者の照会は組合の管理者のみ可能。照会すると登録時の電話番号が表示され、警察への報告に使用（照会にはログが残ります）</td>
                </tr>
                <tr>
                  <td>
                    <strong>最終位置の判定</strong>
                  </td>
                  <td>Bluetoothによる最終位置の手がかりを取得し、安否確認の補助に使用</td>
                </tr>
                <tr>
                  <td>
                    <strong>クーポン</strong>
                  </td>
                  <td>山裾のお店のクーポンを掲載可能（温泉・飲食・お土産など）</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ================= 6. 料金 ================= */}
        <section className="mt-section">
          <div className="mt-inner">
            <h2 className="mt-h2">料金</h2>
            <div className="mt-price-box">
              <p>
                料金プランは、公開に合わせてご案内します。
                <br />
                導入を検討される組合・協会の方は、エリアの規模（登山者数・対象エリア）を添えてお問い合わせください。規模に合ったプランをご案内します。
              </p>
              <ul className="mt-notes">
                <li>初期費用0円・サブスク型を予定</li>
                <li>山裾のお店からの宣伝費で、実質負担を抑える運用も可能です</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ================= 7. 導入の流れ ================= */}
        <section className="mt-section">
          <div className="mt-inner">
            <h2 className="mt-h2">導入の流れ</h2>
            <div className="mt-steps">
              <div className="mt-step-card">
                <div className="mt-step-label">STEP 1</div>
                <h3>相談・申込</h3>
                <p>対象エリアと登山者数の規模をお知らせください。エリアに合った構成をご案内します。</p>
              </div>
              <div className="mt-step-card">
                <div className="mt-step-label">STEP 2</div>
                <h3>事前準備</h3>
                <p>登山口などに掲示するQRコードを発行し、組合側の配信画面を準備します。山裾のお店のクーポン登録もこの期間に行います。</p>
              </div>
              <div className="mt-step-card">
                <div className="mt-step-label">STEP 3</div>
                <h3>運用開始</h3>
                <p>登山者は当日にQRコードから登録。組合は気象・出没などの安全情報を必要に応じて配信し、日没後は未下山者の有無を画面で確認できます。</p>
              </div>
              <div className="mt-step-card">
                <div className="mt-step-label">STEP 4</div>
                <h3>日次リセット</h3>
                <p>下山が確認できた登山者の登録はその日のうちに終了し、翌日に持ち越しません。下山未確認の登山者だけが、安否確認の対象として翌日以降も残ります。</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 8. FAQ ================= */}
        <section className="mt-section mt-faq">
          <div className="mt-inner">
            <h2 className="mt-h2">よくある質問</h2>
            {faqs.map((f, i) => (
              <div key={i} className="mt-faq-item">
                <button
                  type="button"
                  className="mt-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>Q. {f.q}</span>
                  <span className="mt-faq-icon">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && <p className="mt-faq-a">{f.a}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* ================= 9. 最終CTA ================= */}
        <section className="mt-section mt-final-cta">
          <div className="mt-inner">
            <h2 className="mt-h2">山の安全を、「お知らせの届かなさ」で諦めない。</h2>
            <p className="mt-final-text">
              push-taro MOUNTAIN は近日公開予定です。
              <br />
              対象エリアの規模をお知らせいただければ、エリアに合った構成をご案内します。
            </p>
            <div className="mt-cta-row">
              <Link href="/signup" className="mt-btn mt-btn-primary">
                資料請求する
              </Link>
              <Link href="/contact" className="mt-btn mt-btn-secondary">
                導入の相談をする
              </Link>
            </div>
            <p className="mt-note">近日公開／組合・協会向け／初期費用0円（予定）</p>
          </div>
        </section>
      </main>
    </div>
  );
}
