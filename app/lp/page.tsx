'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div style={{ fontFamily: 'sans-serif', color: '#333', background: '#fffcf7', minHeight: '100vh', margin: 0, padding: 0 }}>
      {/* ヒーローセクション */}
      <header style={{ background: '#1a1a1a', color: '#fff', textAlign: 'center', overflow: 'hidden' }}>
        {/* 横幅いっぱいのヒーロー画像エリア */}
        <div style={{ width: '100%', maxHeight: '500px', overflow: 'hidden', borderBottom: '4px solid #ff4500' }}>
          <img 
            src="/taro.png" 
            alt="プッシュ太郎" 
            style={{ width: '100%', height: 'auto', maxHeight: '500px', display: 'block', objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '50px 20px' }}>
          <span style={{ background: '#ff4500', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
            プッシュ通知特化型システム
          </span>

          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', margin: '20px 0 10px 0', fontWeight: '900', letterSpacing: '2px', lineHeight: '1.2' }}>
            プッシュ太郎
          </h1>

          <p style={{ fontSize: '22px', color: '#ffcc00', fontWeight: 'bold', margin: '0 0 30px 0' }}>
            数こそ正義。量こそ力。とにかく送る！
          </p>

          <p style={{ fontSize: '16px', color: '#ccc', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto 30px auto' }}>
            LINEの配信制限や高いコストに悩んでいませんか？<br />
            お店専用のプッシュ通知で、もっと安く、もっと大量に、お客様のスマホへダイレクトに届ける。
          </p>

          <a
            href="#pricing"
            style={{ display: 'inline-block', background: '#ff4500', color: '#fff', padding: '18px 40px', fontSize: '18px', fontWeight: 'bold', textDecoration: 'none', borderRadius: '8px', boxShadow: '0 4px 20px rgba(255, 69, 0, 0.5)' }}
          >
            🔥 今すぐプランを選ぶ
          </a>
        </div>
      </header>

      {/* 特徴セクション */}
      <section style={{ maxWidth: '900px', margin: '60px auto', padding: '0 20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '40px', fontWeight: 'bold' }}>
          💡 「プッシュ太郎」が選ばれる3つの理由
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px' }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e0e0e0', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '32px', marginBottom: '15px' }}>🎫</div>
            <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#111' }}>強力な初回クーポン機能</h3>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
              ただQRを置くだけじゃない！「その場で使える初回特典」でお客様の心を掴み、面倒な手続なしで自然に購読者（リスト）を爆増させます。
            </p>
          </div>

          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e0e0e0', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '32px', marginBottom: '15px' }}>🚀</div>
            <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#111' }}>圧倒的なコストパフォーマンス</h3>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
              他社ツールやLINE公式アカウントの従量課金にサヨナラ。月額1,980円から圧倒的な配信数を、追加費用なしで存分に使えます。
            </p>
          </div>

          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e0e0e0', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '32px', marginBottom: '15px' }}>⚙️</div>
            <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#111' }}>決済後、即時アカウント発行</h3>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
              Square決済完了と同時にシステムが専用IDとパスワードを自動発行。すぐにログインして今日からプッシュ通知をスタートできます。
            </p>
          </div>
        </div>
      </section>

      {/* 料金プランセクション */}
      <section id="pricing" style={{ background: '#f5f5f5', padding: '60px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '10px', fontWeight: 'bold' }}>
            📦 選べる料金プラン
          </h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
            店舗の規模や配信量に合わせて、最適なプランをお選びいただけます。
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
            {/* ライトプラン */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '30px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: '#333', marginBottom: '10px' }}>ライトプラン</h3>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff4500', marginBottom: '15px' }}>
                  1,980円<span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>/月</span>
                </div>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                  上限: <strong>5,000件/月</strong>
                </p>
                <ul style={{ fontSize: '14px', color: '#444', paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>店舗専用管理画面</li>
                  <li>QRコード・購読者管理</li>
                  <li>初回クーポン機能</li>
                </ul>
              </div>
              <a
                href="https://square.link/u/YOUR_LIGHT_LINK" 
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', textAlign: 'center', background: '#333', color: '#fff', padding: '12px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', marginTop: '30px' }}
              >
                ライトプランで始める
              </a>
            </div>

            {/* スタンダードプラン（おすすめ） */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '30px', border: '2px solid #ff4500', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 8px 20px rgba(255, 69, 0, 0.1)' }}>
              <div style={{ position: 'absolute', top: '-14px', right: '20px', background: '#ff4500', color: '#fff', padding: '4px 12px', fontSize: '12px', fontWeight: 'bold', borderRadius: '12px' }}>
                人気No.1
              </div>
              <div>
                <h3 style={{ fontSize: '20px', color: '#333', marginBottom: '10px' }}>スタンダードプラン</h3>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff4500', marginBottom: '15px' }}>
                  3,800円<span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>/月</span>
                </div>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                  上限: <strong>10,000件/月</strong>
                </p>
                <ul style={{ fontSize: '14px', color: '#444', paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>ライトプランの全機能</li>
                  <li>たっぷり1万通配信</li>
                  <li>優先サポート</li>
                </ul>
              </div>
              <a
                href="https://square.link/u/YOUR_STANDARD_LINK" 
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', textAlign: 'center', background: '#ff4500', color: '#fff', padding: '12px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', marginTop: '30px' }}
              >
                スタンダードで始める
              </a>
            </div>

            {/* プロプラン */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '30px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: '#333', marginBottom: '10px' }}>プロプラン</h3>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff4500', marginBottom: '15px' }}>
                  5,800円<span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>/月</span>
                </div>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                  上限: <strong>30,000件/月</strong>
                </p>
                <ul style={{ fontSize: '14px', color: '#444', paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>スタンダードの全機能</li>
                  <li>画像付きリッチ通知対応</li>
                  <li>最大3万通の大規模配信</li>
                </ul>
              </div>
              <a
                href="https://square.link/u/YOUR_PRO_LINK" 
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', textAlign: 'center', background: '#333', color: '#fff', padding: '12px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', marginTop: '30px' }}
              >
                プロプランで始める
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer style={{ background: '#1a1a1a', color: '#aaa', padding: '40px 20px', textAlign: 'center', fontSize: '14px' }}>
        <p style={{ margin: '0 0 10px 0', color: '#fff', fontWeight: 'bold', fontSize: '18px' }}>プッシュ太郎</p>
        <p style={{ margin: 0 }}>© 2026 プッシュ通知特化型システム All Rights Reserved.</p>
        <div style={{ marginTop: '20px' }}>
          <Link href="/admin" style={{ color: '#888', textDecoration: 'none', fontSize: '13px' }}>
            管理者ログイン
          </Link>
        </div>
      </footer>
    </div>
  );
}
