'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AgencySignupPage() {
  const [companyName, setCompanyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [bankInfo, setBankInfo] = useState('');
  
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('代理店利用規約に同意してください。');
      return;
    }

    setLoading(true);
    try {
      // TODO: 代理店申込データを保存するAPIを叩く処理
      // const res = await fetch('/api/agency/signup', { ... });
      
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
          <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>代理店お申し込みを受け付けました</h2>
          <p style={{ lineHeight: '1.6', color: '#333', marginBottom: '20px' }}>
            ご登録ありがとうございます。ご入力いただいた内容をもとに審査を行わせていただきます。<br />
            審査通過後、ご登録のメールアドレス宛に決済リンクおよび今後の流れをご案内いたしますので、今しばらくお待ちください。
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              background: '#006aff',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            トップページへ戻る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: '650px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <p style={{ marginBottom: '15px' }}><Link href="/" style={{ color: '#3182ce', textDecoration: 'none', fontSize: '14px' }}>← トップに戻る</Link></p>
      
      <h1 style={{ fontSize: '24px', marginBottom: '10px', textAlign: 'center' }}>Push-taro 代理店パートナーお申し込み</h1>
      <p style={{ color: '#666', textAlign: 'center', marginBottom: '25px', fontSize: '14px' }}>
        代理店制度へのお申し込みフォームです。必要事項をご入力の上、審査へお進みください。
      </p>

      <form onSubmit={handleSubmit} style={{ background: '#fafafa', padding: '25px', borderRadius: '8px', border: '1px solid #e1e1e1' }}>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>会社名 / 屋号 <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="例: 株式会社サンプルエージェンシー"
            style={{ width: '100%', padding: '10px', fontSize: '15px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: '#fff' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>ご担当者様のお名前 <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            required
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="例: 山田 太郎"
            style={{ width: '100%', padding: '10px', fontSize: '15px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: '#fff' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>メールアドレス（連絡用） <span style={{ color: 'red' }}>*</span></label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="例: agency@example.com"
            style={{ width: '100%', padding: '10px', fontSize: '15px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: '#fff' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>お電話番号 <span style={{ color: 'red' }}>*</span></label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="例: 03-1234-5678"
            style={{ width: '100%', padding: '10px', fontSize: '15px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: '#fff' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>ご住所 <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="例: 東京都渋谷区..."
            style={{ width: '100%', padding: '10px', fontSize: '15px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: '#fff' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>適格請求書発行事業者登録番号（インボイス番号）</label>
          <input
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            placeholder="T1234567890123"
            style={{ width: '100%', padding: '10px', fontSize: '15px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: '#fff' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>紹介報酬の振込先口座情報</label>
          <p style={{ fontSize: '11px', color: '#666', marginBottom: '5px' }}>※毎月の成果報酬の振込先を指定してください</p>
          <input
            type="text"
            value={bankInfo}
            onChange={(e) => setBankInfo(e.target.value)}
            placeholder="金融機関名・支店名・口座番号・名義人"
            style={{ width: '100%', padding: '10px', fontSize: '15px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: '#fff' }}
          />
        </div>

        {/* 代理店利用規約エリア */}
        <div style={{ marginBottom: '20px', background: '#fff', padding: '15px', borderRadius: '4px', border: '1px solid #ddd', maxHeight: '120px', overflowY: 'scroll', fontSize: '13px', color: '#555' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>代理店パートナー利用規約</p>
          <p>ここにPush-taro代理店制度の規約が入ります。加盟金や月額費用、成果報酬の支払条件、禁止事項等の内容を確認の上ご同意ください。</p>
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
            <Link href="/agency/terms" target="_blank" style={{ color: '#3182ce' }}>代理店利用規約</Link> に同意する
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? '#ccc' : '#2b6cb0',
            color: '#fff',
            border: 'none',
            padding: '14px',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '送信中...' : '審査を申し込む'}
        </button>
      </form>
    </main>
  );
}
