'use client';

import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';

export default function PushNotificationFeature() {
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
          <Link href="/guide/features">機能別</Link>
          <span className="sep">/</span>
          <span className="current">プッシュ通知</span>
        </div>

        <div className="g-hero">
          <span className="g-badge is-all">全プラン対応</span>
          <h1>📢 プッシュ通知</h1>
          <p>
            登録済みのお客様全員に、一斉に通知を配信する基本機能です。
            タイトル・本文・リンク先URLを自由に設定でき、開封率はなんと！メルマガの約6倍。
          </p>
        </div>

        <div className="g-content">

          {/* 1. できること */}
          <h2 className="g-h2"><span className="num">1</span>この機能でできること</h2>
          <div className="g-feature-list">
            <div className="g-feature-item"><span className="ico">📢</span><div><strong>全登録者へ一斉配信</strong><p>QRコードから登録したお客様全員に、1回の操作で通知を届けます。</p></div></div>
            <div className="g-feature-item"><span className="ico">🔗</span><div><strong>リンク遷移</strong><p>タップで任意のURL（店舗サイト・予約ページ等）に遷移させられます。</p></div></div>
            <div className="g-feature-item"><span className="ico">📊</span><div><strong>送信数・成功数の記録</strong><p>送信履歴が自動で保存され、いつでも確認できます。</p></div></div>
          </div>

          {/* 2. こんな時に使う */}
          <h2 className="g-h2"><span className="num">2</span>こんな時に使う</h2>
          <div className="g-usecase-grid">
            <div className="g-usecase-card"><span className="ico">🔥</span><h4>セール・キャンペーン告知</h4><p>「本日限定20%OFF」を即時配信。来店動機を刺激。</p></div>
            <div className="g-usecase-card"><span className="ico">🍰</span><h4>新商品入荷の告知</h4><p>新メニュー・の特徴などを配信。</p></div>
            <div className="g-usecase-card"><span className="ico">☔</span><h4>天候に応じた配信</h4><p>「雨の日限定」を当日の天気に合わせて送信。</p></div>
            <div className="g-usecase-card"><span className="ico">⏰</span><h4>アイドルタイム対策</h4><p>「今空いてます」をリアルタイムで配信。</p></div>
          </div>

          {/* 3. 設定手順 */}
          <h2 className="g-h2"><span className="num">3</span>送信手順</h2>
          <div className="g-steps">
            <div className="g-step">
              <div className="g-step-body">
                <h4>「📢 即時通知・消し込み」タブを開く</h4>
                <p>ログイン後、初期表示されるタブです。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>タイトルと本文を入力</h4>
                <p>タイトルは30文字以内、本文は100文字以内が読みやすいとされています。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>リンク先URLを設定（任意）</h4>
                <p>タップ時の遷移先を指定します。未設定の場合は店舗ページへ遷移します。</p>
              </div>
            </div>
            <div className="g-step">
              <div className="g-step-body">
                <h4>「🔥 Push 通知送信」をタップ</h4>
                <p>送信が完了すると、送信履歴に記録されます。</p>
              </div>
            </div>
          </div>

          {/* 4. 画面イメージ */}
          <h2 className="g-h2"><span className="num">4</span>画面イメージ</h2>
          <div className="g-mockup">
            <div className="g-mockup-tabs">
              <span className="is-active">📢 即時通知</span>
              <span>🏪 店舗設定</span>
              <span>🔥 PRO機能</span>
              <span>📅 予約</span>
            </div>
            <div className="g-mockup-card">
              <div className="g-mockup-h3">📢 プッシュ通知を作成</div>
              <div className="g-mockup-label">タイトル</div>
              <div className="g-mockup-input">本日限定 20%OFFセール</div>
              <div className="g-mockup-label">本文</div>
              <div className="g-mockup-textarea">18時まで！新作スイーツも入荷しました🍰</div>
              <div className="g-mockup-label">リンク先URL（任意）</div>
              <div className="g-mockup-input">https://example.com/sale</div>
              <div className="g-mockup-btn">🔥 Push 通知送信</div>
            </div>
          </div>

          {/* 5. おすすめ設定 */}
          <h2 className="g-h2"><span className="num">5</span>おすすめ設定</h2>
          <div className="g-table-wrap">
            <table className="g-table">
              <thead>
                <tr><th>項目</th><th>推奨</th><th>理由</th></tr>
              </thead>
              <tbody>
                <tr><td>タイトル</td><td className="yes">30文字以内</td><td>スマホの通知画面で切れずに表示</td></tr>
                <tr><td>本文</td><td className="yes">100文字以内</td><td>通知プレビューで全体が見える</td></tr>
                <tr><td>配信頻度</td><td className="yes">週2〜3回まで</td><td>しつこいと通知OFFにされやすい</td></tr>
                <tr><td>配信時間</td><td className="yes">10〜20時</td><td>深夜・早朝は不快感を与える</td></tr>
                <tr><td>絵文字</td><td className="yes">1〜2個</td><td>視認性アップ。多用しすぎはNG</td></tr>
              </tbody>
            </table>
          </div>

          {/* 6. 業種別活用例 */}
          <h2 className="g-h2"><span className="num">6</span>業種別の活用例</h2>
          <div className="g-grid">
            <Link href="/guide/cafe" className="g-card"><span className="g-card-icon">☕</span><h4>飲食店・カフェ</h4><p>雨の日割引、本日の日替わりメニュー告知</p></Link>
            <Link href="/guide/salon" className="g-card"><span className="g-card-icon">💇</span><h4>美容室・サロン</h4><p>空き枠のお知らせ、季節のスタイル紹介</p></Link>
            <Link href="/guide/apparel" className="g-card"><span className="g-card-icon">👕</span><h4>アパレル</h4><p>新作入荷、セール開始の告知</p></Link>
            <Link href="/guide/izakaya" className="g-card"><span className="g-card-icon">🍺</span><h4>バー・居酒屋</h4><p>本日のオススメ、スポーツ中継の告知</p></Link>
          </div>

          {/* 関連機能 */}
          <div className="g-related">
            <h3>関連機能</h3>
            <div className="g-related-grid">
              <Link href="/guide/features/scheduled-push" className="g-related-card">
                <span className="ico">📅</span>
                <div><div className="title">予約配信</div><div className="sub">日時指定で自動送信（PRO）</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/features/coupon-first" className="g-related-card">
                <span className="ico">🎫</span>
                <div><div className="title">初回クーポン</div><div className="sub">登録時の自動配信</div></div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/ng-actions" className="g-related-card">
                <span className="ico">⚠️</span>
                <div><div className="title">NG行為集</div><div className="sub">炎上を避けるために</div></div>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="g-cta">
            <h3>プッシュ通知で、確実にリピートを促す</h3>
            <p>メルマガの約6倍の開封率。Push-taroなら、登録者全員に一斉配信できます。</p>
            <Link href="/signup" className="g-cta-btn">無料相談・資料請求 →</Link>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .g-nav { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid #e2e8f0; }
        .g-nav-inner { max-width: 960px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
        .logo { display: flex; align-items: center; font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; text-decoration: none; }
        .logo-mark { width: 34px; height: 34px; flex-shrink: 0; margin-right: 8px; }
        .logo span { color: #ff4500; margin-left: 1px; }
        .logo small { font-size: 11px; font-weight: 600; color: #64748b; letter-spacing: 0; margin-left: 8px; }
        .g-nav-cta { background: #ff4500; color: #fff; padding: 10px 22px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; box-shadow: 0 4px 12px rgba(255,69,0,0.25); }
        .g-main { max-width: 860px; margin: 0 auto; padding: 40px 24px 80px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans JP", sans-serif; }
        .g-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #64748b; margin-bottom: 20px; flex-wrap: wrap; }
        .g-breadcrumb a { color: #64748b; text-decoration: none; }
        .g-breadcrumb a:hover { color: #ff4500; }
        .g-breadcrumb .sep { color: #cbd5e1; }
        .g-breadcrumb .current { color: #1e293b; font-weight: 700; }
        .g-hero { padding: 32px 0 40px; border-bottom: 1px solid #e2e8f0; margin-bottom: 40px; }
        .g-badge { display: inline-block; font-size: 11px; font-weight: 800; color: #ff4500; background: #fff7ed; padding: 5px 14px; border-radius: 20px; margin-bottom: 16px; letter-spacing: 0.3px; }
        .g-badge.is-all { background: #f1f5f9; color: #64748b; }
        .g-hero h1 { font-size: clamp(26px, 3.4vw, 38px); font-weight: 900; color: #0f172a; letter-spacing: -1px; line-height: 1.25; margin: 0 0 14px; }
        .g-hero p { font-size: 15.5px; color: #64748b; line-height: 1.9; margin: 0; }
        .g-content { line-height: 1.9; color: #334155; font-size: 15px; }
        .g-h2 { font-size: 22px; font-weight: 900; color: #0f172a; margin: 56px 0 20px; letter-spacing: -0.6px; display: flex; align-items: center; gap: 12px; }
        .g-h2:first-of-type { margin-top: 0; }
        .g-h2 .num { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; border-radius: 10px; font-size: 16px; font-weight: 900; flex-shrink: 0; }

        .g-feature-list { display: flex; flex-direction: column; gap: 14px; }
        .g-feature-item { display: flex; gap: 14px; padding: 18px 22px; background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; align-items: flex-start; }
        .g-feature-item .ico { font-size: 28px; flex-shrink: 0; }
        .g-feature-item strong { display: block; font-size: 15px; color: #0f172a; margin-bottom: 4px; font-weight: 800; }
        .g-feature-item p { font-size: 13.5px; color: #64748b; margin: 0; line-height: 1.7; }

        .g-usecase-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
        .g-usecase-card { padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; }
        .g-usecase-card .ico { font-size: 26px; display: block; margin-bottom: 8px; }
        .g-usecase-card h4 { font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 6px; }
        .g-usecase-card p { font-size: 12.5px; color: #64748b; margin: 0; line-height: 1.7; }

        .g-steps { display: flex; flex-direction: column; gap: 20px; margin: 28px 0; counter-reset: gstep; }
        .g-step { display: flex; gap: 20px; align-items: flex-start; }
        .g-step::before { counter-increment: gstep; content: counter(gstep); flex-shrink: 0; width: 44px; height: 44px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; }
        .g-step-body { flex: 1; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; }
        .g-step-body h4 { margin: 0 0 8px; font-size: 15px; font-weight: 800; color: #0f172a; }
        .g-step-body p { margin: 0; font-size: 14px; color: #475569; }

        .g-mockup { background: #fff; border: 2px solid #e2e8f0; border-radius: 16px; padding: 24px; box-shadow: 0 12px 32px rgba(0,0,0,0.06); }
        .g-mockup-tabs { display: flex; gap: 2px; border-bottom: 2px solid #e2e8f0; margin-bottom: 16px; padding-bottom: 4px; overflow-x: auto; }
        .g-mockup-tabs span { font-size: 11px; font-weight: 700; color: #64748b; padding: 8px 12px; white-space: nowrap; }
        .g-mockup-tabs span.is-active { color: #ff4500; border-bottom: 3px solid #ff4500; margin-bottom: -6px; }
        .g-mockup-h3 { font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 14px; }
        .g-mockup-label { font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 6px; }
        .g-mockup-input { padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; color: #1e293b; background: #fff; margin-bottom: 14px; }
        .g-mockup-textarea { padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; color: #1e293b; background: #fff; margin-bottom: 14px; min-height: 60px; }
        .g-mockup-btn { padding: 14px; background: #ff4500; color: #fff; border-radius: 8px; text-align: center; font-weight: 800; font-size: 15px; }

        .g-table-wrap { overflow-x: auto; margin: 24px 0; border-radius: 12px; border: 1px solid #e2e8f0; background: #fff; }
        .g-table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 500px; }
        .g-table th, .g-table td { padding: 14px 18px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        .g-table thead th { background: #f8fafc; font-weight: 800; color: #0f172a; font-size: 13px; border-bottom: 2px solid #e2e8f0; }
        .g-table tbody tr:last-child td { border-bottom: none; }
        .g-table .yes { color: #16a34a; font-weight: 800; }

        .g-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
        .g-card { display: block; padding: 20px 18px; background: #fff; border: 2px solid #e2e8f0; border-radius: 14px; text-decoration: none; color: inherit; transition: all 0.2s; }
        .g-card:hover { border-color: #ff4500; transform: translateY(-3px); box-shadow: 0 12px 32px rgba(255,69,0,0.08); }
        .g-card-icon { font-size: 28px; display: block; margin-bottom: 8px; }
        .g-card h4 { font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 6px; }
        .g-card p { font-size: 12px; color: #64748b; margin: 0; line-height: 1.6; }

        .g-related { margin-top: 56px; padding-top: 32px; border-top: 2px solid #e2e8f0; }
        .g-related > h3 { font-size: 14px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #64748b; margin: 0 0 20px; }
        .g-related-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
        .g-related-card { display: flex; align-items: center; gap: 12px; padding: 16px 18px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; text-decoration: none; color: inherit; transition: all 0.2s; }
        .g-related-card:hover { border-color: #ff4500; transform: translateX(4px); }
        .g-related-card .ico { font-size: 24px; flex-shrink: 0; }
        .g-related-card .title { font-size: 14px; font-weight: 800; color: #0f172a; line-height: 1.3; }
        .g-related-card .sub { font-size: 11.5px; color: #64748b; margin-top: 2px; }
        .g-related-card .arrow { color: #ff4500; font-size: 16px; font-weight: 900; margin-left: auto; }

        .g-cta { margin-top: 48px; padding: 40px 32px; background: linear-gradient(160deg, #0f172a, #1e293b); color: #fff; border-radius: 20px; text-align: center; }
        .g-cta h3 { font-size: 20px; font-weight: 900; margin: 0 0 12px; }
        .g-cta p { font-size: 14px; color: #94a3b8; margin: 0 0 20px; line-height: 1.8; }
        .g-cta-btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; border-radius: 10px; font-weight: 800; font-size: 15px; text-decoration: none; box-shadow: 0 6px 20px rgba(255,69,0,0.3); }

        @media (max-width: 640px) {
          .g-main { padding: 24px 16px 60px; }
          .logo { font-size: 18px; }
          .logo-mark { width: 28px; height: 28px; margin-right: 6px; }
          .logo small { display: none; }
          .g-nav-cta { padding: 8px 14px; font-size: 12px; }
          .g-h2 { font-size: 18px; }
        }
      `}</style>
    </>
  );
}
