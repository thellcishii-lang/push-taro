'use client';

import { useState } from 'react';

export default function SignupPage() {
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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
      
      // 仮で成功したとして完了画面へ切り替え
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
              href="https://square.link/u/YOUR_PAYMENT_LINK" // 実際のSquare決済リンクに置き換え
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: '#006aff',
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
    <main style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '10px', textAlign: 'center' }}>プッシュ太郎 お申し込みフォーム</h1>
      <p style={{ color: '#666', textAlign: 'center', marginBottom: '30px', fontSize: '14px' }}>
        必要事項をご入力の上、利用規約をご確認いただきお申し込みください。
      </p>

      <form onSubmit={handleSubmit} style={{ background: '#fafafa', padding: '25px', borderRadius: '8px', border: '1px solid #e1e1e1' }}>
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

        {/* 利用規約エリア */}
        <div style={{ marginBottom: '20px', background: '#fff', padding: '15px', borderRadius: '4px', border: '1px solid #ddd', maxHeight: '120px', overflowY: 'scroll', fontSize: '13px', color: '#555' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>利用規約</p>
          <p>ここにプッシュ太郎の利用規約が入ります。本規約に同意の上、お申し込みを行ってください。不正利用の禁止やサービス内容についての記載がここに含まれます。</p>
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
            利用規約に同意する
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? '#ccc' : '#28a745',
            color: '#fff',
            border: 'none',
            padding: '14px',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '送信中...' : '申し込む'}
        </button>
      </form>
    </main>
  );
}
