'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [selectedPlan, setSelectedPlan] = useState<'light' | 'standard' | 'pro'>('light');
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // プロプラン専用の追加フィールド
  const [companyName, setCompanyName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [bankInfo, setBankInfo] = useState('');

  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('利用規約に同意してください。');
      return;
    }

    setLoading(true);
    try {
      // 申込データを送信するAPIを叩く処理（後ほど実装）
      // const res = await fetch('/api/signup', { ... });
      
      setSubmitted(true);
    } catch (err: any) {
      alert('エラーが発生しました: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
        <div style={{ background: '#f0f8ff', padding: '30px', borderRadius: '8px', textAlign: 'center', border: '1px solid #b0e0e6' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>導入ありがとうございます！</h2>
          <p style={{ lineHeight: '1.6', color: '#333', marginBottom: '20px' }}>
            お申し込みを受け付けました。ご登録いただいたメールアドレス宛に、申込書と利用規約、およびSquare決済リンクをお送りしましたのでご確認ください。
          </p>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '20px' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>💳 Square決済へお進みください</p>
            <a
              href="https://square.link/u/YOUR_PAYMENT_LINK"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: selectedPlan === 'pro' ? '#dd6b20' : '#006aff',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              Square決済ページを開く
            </a>
          </div>
          <p style={{ fontSize: '12px', color: '#666' }}>
            決済完了後、数分以内にログイン用のIDとパスワードがメールで自動送信されます。
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: '650px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <p style={{ marginBottom: '15px' }}><Link href="/lp" style={{ color: '#3182ce', textDecoration: 'none', fontSize: '14px' }}>← LPに戻る</Link></p>
      
      <h1 style={{ fontSize: '24px', marginBottom: '10px', textAlign: 'center' }}>Push-taro お申し込みフォーム</h1>
      <p style={{ color: '#666', textAlign: 'center', marginBottom: '25px', fontSize: '14px' }}>
        ご希望のプランを選択し、必要事項をご入力の上お申し込みください。
      </p>

      <form onSubmit={handleSubmit} style={{ background: '#fafafa', padding: '25px', borderRadius: '8px', border: '1px solid #e1e1e1' }}>
        
        {/* プラン選択タブ */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>ご希望プラン <span style={{ color: 'red' }}>*</span></label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setSelectedPlan('light')}
              style={{
                padding: '12px 8px',
                borderRadius: '6px',
                border: selectedPlan === 'light' ? '2px solid #3182ce' : '1px solid #ccc',
                background: selectedPlan === 'light' ? '#ebf8ff' : '#fff',
                color: selectedPlan === 'light' ? '#2b6cb0' : '#333',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              ライト<br /><span style={{ fontSize: '11px', fontWeight: 'normal' }}>1,980円/月</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedPlan('standard')}
              style={{
                padding: '12px 8px',
                borderRadius: '6px',
                border: selectedPlan === 'standard' ? '2px solid #3182ce' : '1px solid #ccc',
                background: selectedPlan === 'standard' ? '#ebf8ff' : '#fff',
                color: selectedPlan === 'standard' ? '#2b6cb0' : '#333',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              スタンダード<br /><span style={{ fontSize: '11px', fontWeight: 'normal' }}>3,800円/月</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedPlan('pro')}
              style={{
                padding: '12px 8px',
                borderRadius: '6px',
                border: selectedPlan === 'pro' ? '2px solid #dd6b20' : '1px solid #ccc',
                background: selectedPlan === 'pro' ? '#fffaf0' : '#fff',
                color: selectedPlan === 'pro' ? '#c05621' : '#333',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              プロ (最高峰)<br /><span style={{ fontSize: '11px', fontWeight: 'normal' }}>9,800円/月</span>
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>店舗名（屋号）</label>
          <input
            type="text"
            required
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="例: カフェ・プッシュ太郎"
            style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>ご担当者様のお名前</label>
          <input
            type="text"
            required
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="例: 山田 太郎"
            style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>ご住所</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="例: 東京都渋谷区..."
            style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>メールアドレス</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="例: info@example.com"
            style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>お電話番号</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="例: 090-1234-5678"
            style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        {/* プロプラン選択時のみ表示する追加項目（インボイス・法人・口座） */}
        {selectedPlan === 'pro' && (
          <div style={{ background: '#fffaf0', border: '1px solid #fbd38d', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#c05621', marginBottom: '15px', borderBottom: '1px solid #feebc8', paddingBottom: '8px' }}>
              ⭐ プロプラン専用項目（インボイス・紹介制度対応）
            </h3>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px', color: '#2d3748' }}>法人名 / 正式な事業者名（請求書記載用）</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="例: 株式会社プッシュタロウ"
                style={{ width: '100%', padding: '10px', fontSize: '15px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: '#fff' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px', color: '#2d3748' }}>適格請求書発行事業者登録番号（インボイス番号）</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="T1234567890123"
                style={{ width: '100%', padding: '10px', fontSize: '15px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: '#fff' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px', color: '#2d3748' }}>紹介コード（お持ちの方のみ）</label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="紹介者のコード"
                style={{ width: '100%', padding: '10px', fontSize: '15px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: '#fff' }}
              />
            </div>

            <div style={{ marginBottom: '5px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px', color: '#2d3748' }}>紹介報酬（ポイント還元）の振込先口座情報</label>
              <p style={{ fontSize: '11px', color: '#666', marginBottom: '5px' }}>※1万円以上の出金申請時に使用します（PayPay銀行等対応）</p>
              <input
                type="text"
                value={bankInfo}
                onChange={(e) => setBankInfo(e.target.value)}
                placeholder="金融機関名・支店名・口座番号・名義人"
                style={{ width: '100%', padding: '10px', fontSize: '15px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: '#fff' }}
              />
            </div>
          </div>
        )}

        {/* 利用規約エリア */}
        <div style={{ marginBottom: '20px', background: '#fff', padding: '15px', borderRadius: '4px', border: '1px solid #ddd', maxHeight: '120px', overflowY: 'scroll', fontSize: '13px', color: '#555' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>利用規約</p>
          <p>ここにPush-taroの利用規約が入ります。本規約に同意の上、お申し込みを行ってください。不正利用の禁止やサービス内容についての記載がここに含まれます。</p>
        </div>

        <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            id="agreed"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ width: '18px', height: '18px' }}
          />
          <label htmlFor="agreed" style={{ fontSize: '14px', cursor: 'pointer', fontWeight: 'bold' }}>
            <Link href="/terms" target="_blank" style={{ color: '#3182ce' }}>利用規約</Link> および <Link href="/privacy" target="_blank" style={{ color: '#3182ce' }}>プライバシーポリシー</Link> に同意する
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? '#ccc' : selectedPlan === 'pro' ? '#dd6b20' : '#28a745',
            color: '#fff',
            border: 'none',
            padding: '14px',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '送信中...' : selectedPlan === 'pro' ? 'プロプランで申し込む' : '申し込む'}
        </button>
      </form>
    </main>
  );
}
