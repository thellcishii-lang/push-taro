'use client';

import Link from 'next/link';

export default function NgActionsPage() {
  return (
    <>
      <nav className="g-nav">
        <div className="g-nav-inner">
          <Link href="/" className="g-logo">🚀 Push-taro <small>/ 使い方ガイド</small></Link>
          <Link href="/signup" className="g-nav-cta">今すぐ申し込む →</Link>
        </div>
      </nav>

      <main className="g-main">
        <div className="g-breadcrumb">
          <Link href="/guide">ガイド</Link>
          <span className="sep">/</span>
          <span className="current">NG行為集</span>
        </div>

        <div className="g-hero">
          <span className="g-badge">⚠️ 運用ノウハウ</span>
          <h1>Push通知で<span className="text-red">やってはいけない</span>NG行為集</h1>
          <p>
            便利なプッシュ通知も、使い方を誤ると<strong>ブロック・離反・炎上</strong>を招きます。
            このページでは、実際にトラブルになりやすいNG行為と、その回避策をまとめました。
          </p>
        </div>

        <div className="g-content">

          <h2><span className="num">1</span>配信頻度・タイミングのNG</h2>

          <div className="g-ng-card">
            <div className="g-ng-head">
              <span className="g-ng-label">NG</span>
              <h4>1日に何通も連続配信する</h4>
            </div>
            <p className="g-ng-desc">
              「セール開始」「本日限定」「残りわずか」を1日に3通も送ると、<strong>80%以上の確率で通知OFF</strong>にされます。
            </p>
            <p className="g-ng-fix"><strong>✅ 対策：</strong>1日の配信は最大1通まで。緊急時のみ2通。</p>
          </div>

          <div className="g-ng-card">
            <div className="g-ng-head">
              <span className="g-ng-label">NG</span>
              <h4>深夜・早朝（22時〜8時）に配信</h4>
            </div>
            <p className="g-ng-desc">
              就寝中の通知は<strong>強い不快感</strong>を与え、即ブロックに繋がります。特にBtoCの店舗では致命的です。
            </p>
            <p className="g-ng-fix"><strong>✅ 対策：</strong>配信は<strong>10時〜20時</strong>の間に。予約配信機能で時間指定しましょう。</p>
          </div>

          <div className="g-ng-card">
            <div className="g-ng-head">
              <span className="g-ng-label">NG</span>
              <h4>連日同じ内容を配信</h4>
            </div>
            <p className="g-ng-desc">
              同じセール情報を5日連続で送ると、「またか」と思われ、通知の価値が下がります。
            </p>
            <p className="g-ng-fix"><strong>✅ 対策：</strong>配信は<strong>週2〜3回</strong>を目安に。内容に変化を持たせましょう。</p>
          </div>

          <h2><span className="num">2</span>内容・表現のNG</h2>

          <div className="g-ng-card">
            <div className="g-ng-head">
              <span className="g-ng-label">NG</span>
              <h4>過剰な割引（50%OFF以上）</h4>
            </div>
            <p className="g-ng-desc">
              極端な割引は<strong>常連客の離反</strong>を招きます。「先週定価で買ったのに」という不信感に。
            </p>
            <p className="g-ng-fix"><strong>✅ 対策：</strong>初回10〜15%、休眠復活20〜30%が適正。常連向けは<strong>特典型</strong>（ノベルティ・優先予約）で。</p>
          </div>

          <div className="g-ng-card">
            <div className="g-ng-head">
              <span className="g-ng-label">NG</span>
              <h4>無関係な情報・他社広告の配信</h4>
            </div>
            <p className="g-ng-desc">
              業種と無関係な広告（例：飲食店から保険の案内）は、<strong>「スパム」認定</strong>され配信停止されます。
            </p>
            <p className="g-ng-fix"><strong>✅ 対策：</strong>自店舗の商品・サービスに関連する情報のみ配信。</p>
          </div>

          <div className="g-ng-card">
            <div className="g-ng-head">
              <span className="g-ng-label">NG</span>
              <h4>煽り・恐怖を煽る表現</h4>
            </div>
            <p className="g-ng-desc">
              「今すぐ買わないと損」「残り1名」を連発すると、不信感・炎上リスクに。
            </p>
            <p className="g-ng-fix"><strong>✅ 対策：</strong>本当に希少な時だけ使用。日常的には使わない。</p>
          </div>

          <h2><span className="num">3</span>顧客対応のNG</h2>

          <div className="g-ng-card">
            <div className="g-ng-head">
              <span className="g-ng-label">NG</span>
              <h4>強引な登録誘導</h4>
            </div>
            <p className="g-ng-desc">
              「登録しないと割引しません」「会計前に必ず登録を」など、強制すると<strong>顧客体験を損ねます</strong>。
            </p>
            <p className="g-ng-fix"><strong>✅ 対策：</strong>登録は<strong>完全任意</strong>。「登録で初回10%OFF」など、メリットを提示して選んでもらう。</p>
          </div>

          <div className="g-ng-card">
            <div className="g-ng-head">
              <span className="g-ng-label">NG</span>
              <h4>クーポンの二重使用を許す</h4>
            </div>
            <p className="g-ng-desc">
              初回クーポンを2回使えてしまうと、<strong>ルールの信頼性が崩壊</strong>。以降の施策が効かなくなります。
            </p>
            <p className="g-ng-fix"><strong>✅ 対策：</strong>QRコード消込を<strong>必ず運用</strong>。Push-taroは自動で二重使用をブロックします。</p>
          </div>

          <div className="g-ng-card">
            <div className="g-ng-head">
              <span className="g-ng-label">NG</span>
              <h4>休眠顧客への無配慮な配信</h4>
            </div>
            <p className="g-ng-desc">
              3ヶ月以上来ていない顧客に、通常のセール通知を送るのは逆効果。「もう関係ない」とブロックされます。
            </p>
            <p className="g-ng-fix"><strong>✅ 対策：</strong>休眠顧客には<strong>専用の復活クーポン</strong>を。通常配信と分けましょう。</p>
          </div>

          <h2><span className="num">4</span>運用体制のNG</h2>

          <div className="g-ng-card">
            <div className="g-ng-head">
              <span className="g-ng-label">NG</span>
              <h4>効果測定をしない</h4>
            </div>
            <p className="g-ng-desc">
              「送りっぱなし」では、何が効いているか分からず、改善できません。
            </p>
            <p className="g-ng-fix"><strong>✅ 対策：</strong>開封率・来店率を<strong>月1回チェック</strong>。Push-taroの管理画面で数値が確認できます。</p>
          </div>

          <div className="g-ng-card">
            <div className="g-ng-head">
              <span className="g-ng-label">NG</span>
              <h4>スタッフ間で運用ルールが共有されていない</h4>
            </div>
            <p className="g-ng-desc">
              「誰が送っていいか」が不明確だと、配信内容の重複・矛盾が発生します。
            </p>
            <p className="g-ng-fix"><strong>✅ 対策：</strong>配信担当者を1名決め、<strong>月次で内容を振り返る</strong>運用に。</p>
          </div>

          <div className="g-callout danger">
            <span className="ico">🚨</span>
            <div>
              <p><strong>最重要：ブロックされた顧客は、二度と戻ってきません</strong></p>
              <p>プッシュ通知は「信頼関係」の上に成り立つコミュニケーション手段です。NG行為を避けることが、長期的な成果に直結します。</p>
            </div>
          </div>

          <div className="g-related">
            <h3>関連ガイド</h3>
            <div className="g-related-grid">
              <Link href="/guide/themes/repeat" className="g-related-card">
                <span className="ico">🔄</span>
                <div>
                  <div className="title">リピート施策</div>
                  <div className="sub">正しい配信の設計</div>
                </div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/guide/case-studies" className="g-related-card">
                <span className="ico">📈</span>
                <div>
                  <div className="title">導入事例</div>
                  <div className="sub">成功事例から学ぶ</div>
                </div>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="g-cta">
            <h3>安全で効果的な運用を、Push-taroで。</h3>
            <p>NG行為を避ける仕組みが、標準搭載されています。</p>
            <Link href="/signup" className="g-cta-btn">無料相談・資料請求 →</Link>
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
        .g-hero h1 .text-red { color: #dc2626; }
        .g-hero p { font-size: 15.5px; color: #64748b; line-height: 1.9; margin: 0; }
        .g-content { line-height: 1.9; color: #334155; font-size: 15px; }
        .g-content > h2 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 56px 0 20px; letter-spacing: -0.6px; display: flex; align-items: center; gap: 12px; }
        .g-content > h2:first-of-type { margin-top: 0; }
        .g-content > h2 .num { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; border-radius: 10px; font-size: 16px; font-weight: 900; flex-shrink: 0; }
        .g-content strong { color: #0f172a; font-weight: 800; }
        .g-ng-card { background: #fff; border: 1px solid #fecaca; border-left: 4px solid #dc2626; border-radius: 12px; padding: 20px 22px; margin-bottom: 16px; }
        .g-ng-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .g-ng-label { display: inline-block; font-size: 10px; font-weight: 900; letter-spacing: 1px; color: #fff; background: #dc2626; padding: 3px 10px; border-radius: 4px; flex-shrink: 0; }
        .g-ng-head h4 { margin: 0; font-size: 15px; font-weight: 800; color: #0f172a; }
        .g-ng-desc { font-size: 14px; color: #475569; margin: 0 0 10px; line-height: 1.8; }
        .g-ng-fix { font-size: 13.5px; color: #15803d; background: #f0fdf4; padding: 10px 14px; border-radius: 8px; margin: 0; border-left: 3px solid #16a34a; }
        .g-callout { display: flex; gap: 16px; padding: 20px 24px; border-radius: 14px; margin: 24px 0; align-items: flex-start; }
        .g-callout .ico { flex-shrink: 0; font-size: 22px; line-height: 1; }
        .g-callout p { margin: 0; font-size: 14.5px; line-height: 1.85; }
        .g-callout p + p { margin-top: 8px; }
        .g-callout.danger { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
        .g-related { margin-top: 64px; padding-top: 32px; border-top: 2px solid #e2e8f0; }
        .g-related > h3 { font-size: 14px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #64748b; margin: 0 0 20px; }
        .g-related-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
        .g-related-card { display: flex; align-items: center; gap: 12px; padding: 16px 18px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; text-decoration: none; color: inherit; transition: all 0.2s; }
        .g-related-card:hover { border-color: #ff4500; transform: translateX(4px); }
        .g-related-card .ico { font-size: 24px; flex-shrink: 0; }
        .g-related-card .title { font-size: 14px; font-weight: 800; color: #0f172a; line-height: 1.3; }
        .g-related-card .sub { font-size: 11.5px; color: #64748b; margin-top: 2px; }
        .g-related-card .arrow { color: #ff4500; font-size: 16px; font-weight: 900; margin-left: auto; }
        .g-cta { margin-top: 56px; padding: 40px 32px; background: linear-gradient(160deg, #0f172a, #1e293b); color: #fff; border-radius: 20px; text-align: center; }
        .g-cta h3 { font-size: 22px; font-weight: 900; margin: 0 0 12px; color: #fff; }
        .g-cta p { font-size: 14.5px; color: #94a3b8; margin-bottom: 24px; line-height: 1.8; }
        .g-cta-btn { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #ff4500, #f97316); color: #fff; padding: 14px 32px; border-radius: 10px; font-weight: 800; font-size: 15px; text-decoration: none; box-shadow: 0 8px 24px rgba(255,69,0,0.35); }
        @media (max-width: 640px) {
          .g-main { padding: 24px 16px 60px; }
          .g-logo { font-size: 17px; }
          .g-nav-cta { padding: 8px 14px; font-size: 12px; }
        }
      `}</style>
    </>
  );
}
