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
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <a href="#referral" style={{ fontSize: '14px', fontWeight: '600', color: '#dd6b20', textDecoration: 'none' }}>
            紹介制度について
          </a>
          <a href="#pricing" style={{ fontSize: '14px', fontWeight: '600', color: '#4a5568', textDecoration: 'none' }}>
            料金プラン
          </a>
          {/* 将来チャットボットに差し替え可能な問い合わせボタン */}
          <a href="#contact" style={{ fontSize: '14px', fontWeight: '600', color: '#3182ce', textDecoration: 'none' }}>
            お問い合わせ
          </a>
          <Link href="/signup" style={{ background: '#3182ce', color: '#fff', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', textDecoration: 'none', transition: 'background 0.2s' }}>
            お申し込み
          </Link>
        </div>
      </nav>

      {/* ヒーローセクション */}
      <header style={{ background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)', color: '#fff', textAlign: 'center', padding: '100px 20px 80px 20px' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <span style={{ background: 'rgba(49, 130, 206, 0.2)', color: '#63b3ed', border: '1px solid #3182ce', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            店舗の売上とリピート率を最大化するCRMプラットフォーム
          </span>

          <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', margin: '24px 0 20px 0', fontWeight: '800', letterSpacing: '-1px', lineHeight: '1.2' }}>
            既存客の囲い込みを、もっと身近に。<br />もっと自由に、コストを気にせず。
          </h1>

          <p style={{ fontSize: '18px', color: '#a0aec0', lineHeight: '1.8', maxWidth: '720px', margin: '0 auto 40px auto' }}>
            雨の日や平日のアイドルタイム、常連客へのタイムリーなアプローチ。<br />
            店舗専用のプッシュ通知と高度なCRM機能が、安定した集客とリピートを実現します。
          </p>

          <Link
            href="/signup"
            style={{ display: 'inline-block', background: '#3182ce', color: '#fff', padding: '16px 36px', fontSize: '16px', fontWeight: '700', textDecoration: 'none', borderRadius: '8px', boxShadow: '0 4px 14px rgba(49, 130, 206, 0.4)' }}
          >
            今すぐ申し込む（無料相談・簡単登録）
          </Link>
        </div>
      </header>

      {/* 課題提示セクション */}
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
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>📉</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: '#2d3748' }}>リピート率の頭打ち</h3>
            <p style={{ fontSize: '14px', color: '#718096', lineHeight: '1.6' }}>
              一度来店されたお客様の再来店につながる有効な導線がなく、一見客頼みの集客から抜け出せない。
            </p>
          </div>

          <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>🌧️</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: '#2d3748' }}>集客のコントロール不足</h3>
            <p style={{ fontSize: '14px', color: '#718096', lineHeight: '1.6' }}>
              雨天や平日の閑散期など、「今すぐお客様を呼びたい」というタイミングでピンポイントにアプローチできない。
            </p>
          </div>

          <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>💸</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: '#2d3748' }}>コストの肥大化</h3>
            <p style={{ fontSize: '14px', color: '#718096', lineHeight: '1.6' }}>
              既存のツールでは配信数が増えるほど料金が跳ね上がり、積極的なコミュニケーションが打てない。
            </p>
          </div>
        </div>
      </section>

      {/* 従量課金の罠 */}
      <section style={{ background: '#edf2f7', padding: '80px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: '#e53e3e', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            業界の大きなジレンマ
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1a202c', margin: '16px 0 24px 0' }}>
            「たくさん送りたいのに、送れない」<br />他社ツールの従量課金の罠
          </h2>
          <p style={{ fontSize: '16px', color: '#4a5568', lineHeight: '1.8', textAlign: 'left', background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #cbd5e0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            既存客の囲い込みには、定期的な情報発信やセグメント配信が不可欠です。しかし、一般的な通知ツールやメッセージ配信プラットフォームの多くは<strong>「配信数に応じた従量課金制」</strong>を採用しています。<br /><br />
            例えば、顧客数が1,000人を超えた状態で月に何度も配信を行おうとすると、コストが天井知らずに膨れ上がり、店舗経営を圧迫してしまいます。この制約が、本当は行いたいマーケティング施策の足かせになっているのです。
          </p>
        </div>
      </section>

      {/* 6つの業種別・プラン別実績セクション */}
      <section style={{ maxWidth: '1000px', margin: '80px auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ color: '#3182ce', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Proven Results & Use Cases
          </span>
          <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#1a202c', margin: '16px 0 10px 0' }}>
            業種・プラン別の導入実績事例
          </h2>
          <p style={{ color: '#718096', fontSize: '16px' }}>
            各プランの特性を活かして、どのように店舗の成果に直結しているのかをご紹介します。
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          {/* 事例1: ライト */}
          <div style={{ background: '#fff', padding: '28px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ background: '#4a5568', color: '#fff', padding: '2px 10px', fontSize: '11px', fontWeight: '700', borderRadius: '4px' }}>ライトプラン</span>
                <span style={{ fontSize: '13px', color: '#718096', fontWeight: '600' }}>飲食店・カフェ</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#3182ce', marginBottom: '8px' }}>月間200人の新規獲得</div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>新規顧客の自動リスト化</h3>
              <p style={{ fontSize: '13px', color: '#718096', lineHeight: '1.6' }}>
                QRコードと初回クーポンだけで手間をかけず、まずは小規模に低コストで顧客リスト（購読者）を増やす。
              </p>
            </div>
          </div>

          {/* 事例2: ライト */}
          <div style={{ background: '#fff', padding: '28px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ background: '#4a5568', color: '#fff', padding: '2px 10px', fontSize: '11px', fontWeight: '700', borderRadius: '4px' }}>ライトプラン</span>
                <span style={{ fontSize: '13px', color: '#718096', fontWeight: '600' }}>アパレル・雑貨店</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#3182ce', marginBottom: '8px' }}>売上 前年比140%</div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>セール告知のフル活用</h3>
              <p style={{ fontSize: '13px', color: '#718096', lineHeight: '1.6' }}>
                5,000通の配信枠内でこまめに情報を届け、固定ファンの買い逃しを防いでしっかり売上に繋げる。
              </p>
            </div>
          </div>

          {/* 事例3: スタンダード */}
          <div style={{ background: '#fff', padding: '28px', borderRadius: '12px', border: '2px solid #3182ce', boxShadow: '0 4px 6px rgba(49, 130, 206, 0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ background: '#3182ce', color: '#fff', padding: '2px 10px', fontSize: '11px', fontWeight: '700', borderRadius: '4px' }}>スタンダード</span>
                <span style={{ fontSize: '13px', color: '#718096', fontWeight: '600' }}>飲食店・カフェ</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#3182ce', marginBottom: '8px' }}>稼働率 約2.4倍</div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>アイドルタイム集客</h3>
              <p style={{ fontSize: '13px', color: '#718096', lineHeight: '1.6' }}>
                ジオフェンス機能を使い、平日の14〜16時に近くを歩く人に「今だけデザート無料」を自動送信。
              </p>
            </div>
          </div>

          {/* 事例4: スタンダード */}
          <div style={{ background: '#fff', padding: '28px', borderRadius: '12px', border: '2px solid #3182ce', boxShadow: '0 4px 6px rgba(49, 130, 206, 0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ background: '#3182ce', color: '#fff', padding: '2px 10px', fontSize: '11px', fontWeight: '700', borderRadius: '4px' }}>スタンダード</span>
                <span style={{ fontSize: '13px', color: '#718096', fontWeight: '600' }}>テイクアウト専門店</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#3182ce', marginBottom: '8px' }}>夕方の売上が安定</div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>「近くを通ったら」作戦</h3>
              <p style={{ fontSize: '13px', color: '#718096', lineHeight: '1.6' }}>
                駅帰りのサラリーマン層の立ち寄り率が向上。商圏内への侵入をGPS検知し夕食のおかず訴求を自動化。
              </p>
            </div>
          </div>

          {/* 事例5: プロ */}
          <div style={{ background: '#fff', padding: '28px', borderRadius: '12px', border: '1px solid #dd6b20', boxShadow: '0 4px 6px rgba(221, 107, 32, 0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ background: '#dd6b20', color: '#fff', padding: '2px 10px', fontSize: '11px', fontWeight: '700', borderRadius: '4px' }}>プロプラン</span>
                <span style={{ fontSize: '13px', color: '#718096', fontWeight: '600' }}>美容室・サロン</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#dd6b20', marginBottom: '8px' }}>再来 60日 ⇒ 42日</div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>再来サイクル短縮</h3>
              <p style={{ fontSize: '13px', color: '#718096', lineHeight: '1.6' }}>
                誕生日配信や休眠顧客への自動アプローチで、お客様ごとのメンテナンス時期を逃さずリピート安定。
              </p>
            </div>
          </div>

          {/* 事例6: プロ */}
          <div style={{ background: '#fff', padding: '28px', borderRadius: '12px', border: '1px solid #dd6b20', boxShadow: '0 4px 6px rgba(221, 107, 32, 0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ background: '#dd6b20', color: '#fff', padding: '2px 10px', fontSize: '11px', fontWeight: '700', borderRadius: '4px' }}>プロプラン</span>
                <span style={{ fontSize: '13px', color: '#718096', fontWeight: '600' }}>エステ・リラク</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#dd6b20', marginBottom: '8px' }}>リピート率 18% ⇒ 42%</div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>ファン育成 ＆ 紹介で実質無料</h3>
              <p style={{ fontSize: '13px', color: '#718096', lineHeight: '1.6' }}>
                連続アクセス特典やA/Bテストでロイヤル化。紹介制度も活用してランニングコストを完全に相殺。
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* スタンダード機能・ジオフェンス解説セクション */}
      <section style={{ background: '#edf2f7', padding: '80px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ color: '#3182ce', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Feature Spotlight
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1a202c', margin: '16px 0 12px 0' }}>
              スタンダードプランの目玉：『ジオフェンス機能』の仕組み
            </h2>
            <p style={{ fontSize: '16px', color: '#4a5568', lineHeight: '1.8' }}>
              お店の半径数十〜数百メートル以内（商圏内）に顧客が足を踏み入れた瞬間、スマホのGPSと連動して自動的にプッシュ通知を送信。自動で来店動機をつくり出します。
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #cbd5e0', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📍</div>
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>STEP 1：エリアに入る</h4>
              <p style={{ fontSize: '13px', color: '#718096', lineHeight: '1.6' }}>周辺を歩いている見込み客や既存顧客をGPSが自動で検知。</p>
            </div>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #cbd5e0', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎟️</div>
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>STEP 2：クーポンを自動配信</h4>
              <p style={{ fontSize: '13px', color: '#718096', lineHeight: '1.6' }}>「お近くの方へ！今から使える限定特典」などをスマホへ自動でお届け。</p>
            </div>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #cbd5e0', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>🏃</div>
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>STEP 3：そのまま来店へ</h4>
              <p style={{ fontSize: '13px', color: '#718096', lineHeight: '1.6' }}>どこに行こうか迷っているお客様をダイレクトに店舗の席へ誘導。</p>
            </div>
          </div>
        </div>
      </section>

      {/* プロプラン紹介制度セクション */}
      <section id="referral" style={{ background: '#1a202c', color: '#fff', padding: '80px 20px' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ background: 'rgba(236, 201, 75, 0.2)', color: '#ecc94b', border: '1px solid #ecc94b', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Pro Plan Exclusive
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: '800', margin: '20px 0 16px 0', letterSpacing: '-0.5px' }}>
            プロプラン限定：紹介制度で「実質無料」運用
          </h2>
          <p style={{ fontSize: '16px', color: '#a0aec0', lineHeight: '1.8', marginBottom: '40px' }}>
            プロプランを他の店舗様に紹介すると、月額料金の<strong>10%（約980円分）が毎月ポイント還元</strong>されます。<br />
            10件ご紹介いただければ、プロプランがなんと<strong>実質ゼロ円（無料）</strong>に！貯まったポイントは1P＝1円として1万円から自動口座振込で引き出し可能です。
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', textAlign: 'left' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ color: '#ecc94b', fontWeight: '700', fontSize: '16px', marginBottom: '8px' }}>🎁 10% 毎月還元</div>
              <p style={{ fontSize: '13px', color: '#cbd5e0', lineHeight: '1.6' }}>紹介した店舗が契約中である限り、毎月継続してポイントがチャージされ続けます。</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ color: '#ecc94b', fontWeight: '700', fontSize: '16px', marginBottom: '8px' }}>🚀 10件で実質無料</div>
              <p style={{ fontSize: '13px', color: '#cbd5e0', lineHeight: '1.6' }}>10店舗の仲間を増やすだけで、9,800円の最高峰プランがタダに。</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ color: '#ecc94b', fontWeight: '700', fontSize: '16px', marginBottom: '8px' }}>💰 1万円から現金化</div>
              <p style={{ fontSize: '13px', color: '#cbd5e0', lineHeight: '1.6' }}>1P=1円で換算。1万円を超えたら申請ボタン一つで銀行口座へ振り込み。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 料金プランセクション */}
      <section id="pricing" style={{ background: '#f8fafc', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1a202c', marginBottom: '12px' }}>
              明快でリーズナブルな料金プラン
            </h2>
            <p style={{ color: '#4a5568', fontSize: '16px' }}>
              店舗の規模やマーケティングの目的に合わせて、最適なプランをお選びいただけます。追加の従量課金はありません。
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
                <p style={{ fontSize: '14px', color: '#e53e3e', fontWeight: '700', marginBottom: '16px' }}>
                  月間配信上限: 5,000通
                </p>
                <p style={{ fontSize: '14px', color: '#718096', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                  まずは手軽にプッシュ通知を導入したい小規模店舗向け
                </p>
                <ul style={{ fontSize: '14px', color: '#2d3748', paddingLeft: '20px', lineHeight: '2' }}>
                  <li>全デバイス対応（ホーム画面導線）</li>
                  <li>QRコード・初回クーポン機能</li>
                  <li>店舗専用管理画面</li>
                </ul>
              </div>
              <Link
                href="/signup" 
                style={{ display: 'block', textAlign: 'center', background: '#4a5568', color: '#fff', padding: '14px', borderRadius: '6px', textDecoration: 'none', fontWeight: '700', marginTop: '30px' }}
              >
                ライトプランで始める
              </Link>
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
                <p style={{ fontSize: '14px', color: '#e53e3e', fontWeight: '700', marginBottom: '16px' }}>
                  月間配信上限: 10,000通 (1万通)
                </p>
                <p style={{ fontSize: '14px', color: '#718096', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                  ジオフェンス機能でリアルタイムな来店を強力に促進
                </p>
                <ul style={{ fontSize: '14px', color: '#2d3748', paddingLeft: '20px', lineHeight: '2' }}>
                  <li>ライトプランの全機能</li>
                  <li><strong>ジオフェンス機能（位置情報連動）</strong></li>
                  <li>優先サポート対応</li>
                </ul>
              </div>
              <Link
                href="/signup" 
                style={{ display: 'block', textAlign: 'center', background: '#3182ce', color: '#fff', padding: '14px', borderRadius: '6px', textDecoration: 'none', fontWeight: '700', marginTop: '30px' }}
              >
                スタンダードで始める
              </Link>
            </div>

            {/* プロプラン */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '36px 30px', border: '2px solid #dd6b20', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 15px -3px rgba(221, 107, 32, 0.15)' }}>
              <div style={{ position: 'absolute', top: '-14px', right: '24px', background: '#dd6b20', color: '#fff', padding: '4px 14px', fontSize: '12px', fontWeight: '700', borderRadius: '12px' }}>
                最高峰・実質無料化
              </div>
              <div>
                <h3 style={{ fontSize: '18px', color: '#dd6b20', fontWeight: '700', marginBottom: '8px' }}>プロプラン</h3>
                <div style={{ fontSize: '36px', fontWeight: '800', color: '#1a202c', marginBottom: '16px' }}>
                  9,800円<span style={{ fontSize: '14px', color: '#718096', fontWeight: 'normal' }}>/月 (税込)</span>
                </div>
                <p style={{ fontSize: '14px', color: '#e53e3e', fontWeight: '700', marginBottom: '16px' }}>
                  月間配信上限: 50,000通 (5万通)
                </p>
                <p style={{ fontSize: '14px', color: '#718096', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                  本格的な自動CRM・ファン育成を極める最高峰プラン
                </p>
                <ul style={{ fontSize: '14px', color: '#2d3748', paddingLeft: '20px', lineHeight: '2' }}>
                  <li>スタンダードの全機能</li>
                  <li><strong>連続アクセス特典・誕生日配信</strong></li>
                  <li><strong>アプリ内メッセージ ＆ A/Bテスト</strong></li>
                  <li><strong>休眠顧客自動アプローチ機能</strong></li>
                  <li><strong>紹介制度（10%還元で実質無料化）</strong></li>
                </ul>
              </div>
              <Link
                href="/signup" 
                style={{ display: 'block', textAlign: 'center', background: '#dd6b20', color: '#fff', padding: '14px', borderRadius: '6px', textDecoration: 'none', fontWeight: '700', marginTop: '30px', boxShadow: '0 4px 10px rgba(221, 107, 32, 0.3)' }}
              >
                プロプランで始める
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* お問い合わせセクション（将来チャットボットに差し替え可能） */}
      <section id="contact" style={{ background: '#edf2f7', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1a202c', marginBottom: '12px' }}>
            ご不明な点やご相談はお気軽に
          </h3>
          <p style={{ fontSize: '14px', color: '#4a5568', marginBottom: '24px' }}>
            導入前のプラン選定や機能に関するご質問など、いつでもお問い合わせください。
          </p>
          <a
            href="mailto:support@pushtaro.com"
            style={{ display: 'inline-block', background: '#3182ce', color: '#fff', padding: '12px 28px', borderRadius: '6px', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}
          >
            お問い合わせする
          </a>
        </div>
      </section>

      {/* フッター（法的ページとリンクを統合） */}
      <footer style={{ background: '#1a202c', color: '#a0aec0', padding: '50px 20px', textAlign: 'center', fontSize: '14px' }}>
        <p style={{ margin: '0 0 10px 0', color: '#fff', fontWeight: '700', fontSize: '18px' }}>Push-taro</p>
        <p style={{ margin: '0 0 20px 0' }}>店舗専用プッシュ通知・CRMプラットフォーム</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
          <Link href="/terms" style={{ color: '#cbd5e0', textDecoration: 'none', fontSize: '13px' }}>利用規約</Link>
          <Link href="/privacy" style={{ color: '#cbd5e0', textDecoration: 'none', fontSize: '13px' }}>プライバシーポリシー</Link>
          <Link href="/tokusho" style={{ color: '#cbd5e0', textDecoration: 'none', fontSize: '13px' }}>特定商取引法に基づく表記</Link>
        </div>

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
