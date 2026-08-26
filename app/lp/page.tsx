'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', color: '#2d3748', background: '#f8fafc', minHeight: '100vh', margin: 0, padding: 0, lineHeight: 1.7 }}>
      
      {/* ヘッダー / ナビゲーション */}
      <nav style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: '20px', fontWeight: '800', color: '#1a202c', letterSpacing: '-0.5px' }}>
          Push-taro<span style={{ color: '#3182ce', fontSize: '14px', marginLeft: '8px', fontWeight: 'normal' }}>本格派CRMツール</span>
        </div>
        <div>
          <a href="#pricing" style={{ background: '#3182ce', color: '#fff', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', textDecoration: 'none', transition: 'background 0.2s' }}>
            料金プランを見る
          </a>
        </div>
      </nav>

      {/* ヒーローセクション（起） */}
      <header style={{ background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)', color: '#fff', textAlign: 'center', padding: '80px 20px 60px 20px', overflow: 'hidden' }}>
        {/* 文字なしベース画像エリア */}
        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto 40px auto', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
          <img 
            src="/taro.png" 
            alt="Push-taro イメージ" 
            style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
          />
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ background: 'rgba(49, 130, 206, 0.2)', color: '#63b3ed', border: '1px solid #3182ce', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            店舗の売上とリピート率を最大化するCRM
          </span>

          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', margin: '24px 0 16px 0', fontWeight: '800', letterSpacing: '-1px', lineHeight: '1.2' }}>
            既存客の囲い込みを、もっと身近に。<br />もっと自由に。
          </h1>

          <p style={{ fontSize: '18px', color: '#a0aec0', lineHeight: '1.8', maxWidth: '700px', margin: '0 auto 40px auto' }}>
            雨の日や平日のアイドルタイム、常連客へのタイムリーなアプローチ。<br />
            店舗専用のプッシュ通知プラットフォームが、安定した集客とリピートを実現します。
          </p>

          <a
            href="#pricing"
            style={{ display: 'inline-block', background: '#3182ce', color: '#fff', padding: '16px 36px', fontSize: '16px', fontWeight: '700', textDecoration: 'none', borderRadius: '8px', boxShadow: '0 4px 14px rgba(49, 130, 206, 0.4)' }}
          >
            料金プランと機能を確認する
          </a>
        </div>
      </header>

      {/* 課題提示セクション（承・その1） */}
      <section style={{ maxWidth: '900px', margin: '80px auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#1a202c', marginBottom: '16px' }}>
            こんな「店舗経営の悩み」を抱えていませんか？
          </h2>
          <p style={{ color: '#718096', fontSize: '16px' }}>
            多くの店舗オーナー様が、集客の不安定さとリピート施策のコストに直面しています。
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>📉</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: '#2d3748' }}>リピート率の頭打ち</h3>
            <p style={{ fontSize: '14px', color: '#718096', lineHeight: '1.6' }}>
              一度来店されたお客様の再来店につながる有効な導線がなく、一見客頼みの集客から抜け出せない。
            </p>
          </div>

          <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>🌧️</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: '#2d3748' }}>集客のコントロール不足</h3>
            <p style={{ fontSize: '14px', color: '#718096', lineHeight: '1.6' }}>
              雨天や平日の閑散期など、「今すぐお客様を呼びたい」というタイミングでピンポイントにアプローチできない。
            </p>
          </div>

          <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>💸</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: '#2d3748' }}>コストの肥大化</h3>
            <p style={{ fontSize: '14px', color: '#718096', lineHeight: '1.6' }}>
              既存のツールでは配信数が増えるほど料金が跳ね上がり、積極的なコミュニケーションが打てない。
            </p>
          </div>
        </div>
      </section>

      {/* 従量課金の罠（承・その2） */}
      <section style={{ background: '#edf2f7', padding: '80px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: '#e53e3e', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            業界の大きなジレンマ
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1a202c', margin: '16px 0 24px 0' }}>
            「たくさん送りたいのに、送れない」<br />他社ツールの従量課金の罠
          </h2>
          <p style={{ fontSize: '16px', color: '#4a5568', lineHeight: '1.8', textAlign: 'left', background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #cbd5e0' }}>
            既存客の囲い込みには、定期的な情報発信やセグメント配信が不可欠です。しかし、一般的な通知ツールやメッセージ配信プラットフォームの多くは<strong>「配信数に応じた従量課金制」</strong>を採用しています。<br /><br />
            例えば、顧客数が1,000人を超えた状態で月に何度も配信を行おうとすると、コストが天井知らずに膨れ上がり、店舗経営を圧迫してしまいます。この制約が、本当は行いたいマーケティング施策の足かせになっているのです。
          </p>
        </div>
      </section>

      {/* 解決策・実績イメージ（転） */}
      <section style={{ maxWidth: '900px', margin: '80px auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ color: '#3182ce', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Solution & Results
          </span>
          <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#1a202c', margin: '16px 0 10px 0' }}>
            Push-taroがもたらす、確かなリピート改善効果
          </h2>
          <p style={{ color: '#718096', fontSize: '16px' }}>
            飲食店、サロン、アパレルなど、多様な業種でリピート率向上を実現しています。
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748', marginBottom: '10px' }}>🍽️ 飲食店・カフェ</h3>
            <p style={{ fontSize: '14px', color: '#718096', lineHeight: '1.6' }}>
              雨の日のランチタイムに限定クーポンを配信し、稼働率を平均35%向上。常連化の自動化に成功。
            </p>
          </div>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748', marginBottom: '10px' }}>✂️ 美容室・サロン</h3>
            <p style={{ fontSize: '14px', color: '#718096', lineHeight: '1.6' }}>
              前回来店から一定期間が経過した休眠顧客への自動アプローチで、再来店のサイクルが大幅に短縮。
            </p>
          </div>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748', marginBottom: '10px' }}>🛍️ 小売・アパレル</h3>
            <p style={{ fontSize: '14px', color: '#718096', lineHeight: '1.6' }}>
              新作入荷やセール情報をタイムリーに一斉配信。コストを気にせずダイレクトに購買意欲を刺激。
            </p>
          </div>
        </div>
      </section>

      {/* 料金プランセクション（結） */}
      <section id="pricing" style={{ background: '#edf2f7', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1a202c', marginBottom: '12px' }}>
              明快でリーズナブルな料金プラン
            </h2>
            <p style={{ color: '#4a5568', fontSize: '16px' }}>
              店舗の規模やマーケティングの目的に合わせて、最適なプランをお選びいただけます。
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            
            {/* ライトプラン */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '36px 30px', border: '1px solid #cbd5e0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '18px', color: '#4a5568', fontWeight: '700', marginBottom: '8px' }}>ライトプラン</h3>
                <div style={{ fontSize: '36px', fontWeight: '800', color: '#1a202c', marginBottom: '16px' }}>
                  1,980円<span style={{ fontSize: '14px', color: '#718096', fontWeight: 'normal' }}>/月 (税込)</span>
                </div>
                <p style={{ fontSize: '14px', color: '#718096', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                  まずは手軽にプッシュ通知を導入したい小規模店舗向け
                </p>
                <ul style={{ fontSize: '14px', color: '#2d3748', paddingLeft: '20px', lineHeight: '2' }}>
                  <li>全デバイス対応（ホーム画面導線）</li>
                  <li>QRコード・初回クーポン機能</li>
                  <li>店舗専用管理画面</li>
                </ul>
              </div>
              <a
                href="https://square.link/u/YOUR_LIGHT_LINK" 
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', textAlign: 'center', background: '#4a5568', color: '#fff', padding: '14px', borderRadius: '6px', textDecoration: 'none', fontWeight: '700', marginTop: '30px' }}
              >
                ライトプランで始める
              </a>
            </div>

            {/* スタンダードプラン */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '36px 30px', border: '2px solid #3182ce', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 15px -3px rgba(49, 130, 206, 0.1)' }}>
              <div style={{ position: 'absolute', top: '-14px', right: '24px', background: '#3182ce', color: '#fff', padding: '4px 14px', fontSize: '12px', fontWeight: '700', borderRadius: '12px' }}>
                人気プラン
              </div>
              <div>
                <h3 style={{ fontSize: '18px', color: '#3182ce', fontWeight: '700', marginBottom: '8px' }}>スタンダードプラン</h3>
                <div style={{ fontSize: '36px', fontWeight: '800', color: '#1a202c', marginBottom: '16px' }}>
                  3,800円<span style={{ fontSize: '14px', color: '#718096', fontWeight: 'normal' }}>/月 (税込)</span>
                </div>
                <p style={{ fontSize: '14px', color: '#718096', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                  ジオフェンス機能でリアルタイムな来店を強力に促進
                </p>
                <ul style={{ fontSize: '14px', color: '#2d3748', paddingLeft: '20px', lineHeight: '2' }}>
                  <li>ライトプランの全機能</li>
                  <li><strong>ジオフェンス機能（位置情報連動）</strong></li>
                  <li>優先サポート対応</li>
                </ul>
              </div>
              <a
                href="https://square.link/u/YOUR_STANDARD_LINK" 
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', textAlign: 'center', background: '#3182ce', color: '#fff', padding: '14px', borderRadius: '6px', textDecoration: 'none', fontWeight: '700', marginTop: '30px' }}
              >
                スタンダードで始める
              </a>
            </div>

            {/* プロプラン */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '36px 30px', border: '1px solid #cbd5e0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '18px', color: '#2d3748', fontWeight: '700', marginBottom: '8px' }}>プロプラン</h3>
                <div style={{ fontSize: '36px', fontWeight: '800', color: '#1a202c', marginBottom: '16px' }}>
                  9,800円<span style={{ fontSize: '14px', color: '#718096', fontWeight: 'normal' }}>/月 (税込)</span>
                </div>
                <p style={{ fontSize: '14px', color: '#718096', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                  本格的な自動CRM・ファン育成を極める最高峰プラン
                </p>
                <ul style={{ fontSize: '14px', color: '#2d3748', paddingLeft: '20px', lineHeight: '2' }}>
                  <li>スタンダードの全機能</li>
                  <li><strong>連続アクセス特典・誕生日配信</strong></li>
                  <li><strong>アプリ内メッセージ ＆ A/Bテスト</strong></li>
                  <li><strong>休眠顧客自動アプローチ機能</strong></li>
                  <li>詳細な顧客情報登録フロー対応</li>
                </ul>
              </div>
              <a
                href="https://square.link/u/YOUR_PRO_LINK" 
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', textAlign: 'center', background: '#1a202c', color: '#fff', padding: '14px', borderRadius: '6px', textDecoration: 'none', fontWeight: '700', marginTop: '30px' }}
              >
                プロプランで始める
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* フッター */}
      <footer style={{ background: '#1a202c', color: '#a0aec0', padding: '50px 20px', textAlign: 'center', fontSize: '14px' }}>
        <p style={{ margin: '0 0 10px 0', color: '#fff', fontWeight: '700', fontSize: '18px' }}>Push-taro</p>
        <p style={{ margin: '0 0 20px 0' }}>店舗専用プッシュ通知・CRMプラットフォーム</p>
        <p style={{ margin: 0, fontSize: '12px', color: '#718096' }}>© 2026 Push-taro All Rights Reserved.</p>
        <div style={{ marginTop: '20px' }}>
          <Link href="/admin" style={{ color: '#cbd5e0', textDecoration: 'none', fontSize: '13px' }}>
            管理者ログイン
          </Link>
        </div>
      </footer>

    </div>
  );
}
