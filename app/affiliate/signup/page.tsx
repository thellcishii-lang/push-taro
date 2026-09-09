'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AffiliateSignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rewardType, setRewardType] = useState<'recurring' | 'one-time'>('recurring');

  // 銀行口座（任意）
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [accountType, setAccountType] = useState('savings');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const bankAccount = bankName || branchName || accountNumber || accountHolder
        ? { bankName, branchName, accountType, accountNumber, accountHolder }
        : null;

      const res = await fetch('/api/affiliate/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, rewardType, bankAccount }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '登録に失敗しました');
      }

      setSuccess(true);
      setSentEmail(email);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '60px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <main style={{ maxWidth: '500px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1a202c', marginBottom: '8px' }}>登録完了しました</h2>
          <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.8' }}>
            <strong>{sentEmail}</strong> に<br />
            ログイン情報（パスワード）を送信しました。
          </p>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '12px' }}>
            メールをご確認の上、ダッシュボードにログインしてください。
          </p>
          <Link
            href="/affiliate/dashboard"
            style={{ display: 'inline-block', marginTop: '24px', padding: '12px 32px', background: '#ff4500', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}
          >
            ダッシュボードへログイン
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <main style={{ maxWidth: '560px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1a202c', margin: '0 0 8px 0' }}>
            📢 アフィリエイト登録
          </h1>
          <p style={{ color: '#718096', fontSize: '14px', margin: 0 }}>
            誰でも無料で始められる！収益化プログラム
          </p>
        </div>

        {error && (
          <div style={{ background: '#fecaca', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 氏名 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>氏名 <span style={{ color: '#e53e3e' }}>*</span></label>
            <input
              type="text"
              required
              placeholder="山田 太郎"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
            />
          </div>

          {/* メールアドレス */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>メールアドレス <span style={{ color: '#e53e3e' }}>*</span></label>
            <input
              type="email"
              required
              placeholder="taro@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
            />
          </div>

          {/* 報酬タイプ選択 */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px' }}>
              報酬タイプを選択 <span style={{ color: '#e53e3e' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="rewardType"
                  value="recurring"
                  checked={rewardType === 'recurring'}
                  onChange={() => setRewardType('recurring')}
                />
                <span>
                  <strong>継続課金型</strong>
                  <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '4px' }}>（毎月5%継続還元）</span>
                </span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="rewardType"
                  value="one-time"
                  checked={rewardType === 'one-time'}
                  onChange={() => setRewardType('one-time')}
                />
                <span>
                  <strong>一括報酬型</strong>
                  <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '4px' }}>
                    （PRO:¥5,000 / Standard:¥2,000 / Light:¥1,000）
                  </span>
                </span>
              </label>
            </div>
          </div>

          {/* 銀行口座（任意） */}
          <details style={{ marginBottom: '24px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', color: '#2563eb' }}>
              💰 振込先口座情報（任意）
            </summary>
            <div style={{ marginTop: '12px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}>金融機関名</label>
                <input type="text" placeholder="〇〇銀行" value={bankName} onChange={(e) => setBankName(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}>支店名</label>
                <input type="text" placeholder="△△支店" value={branchName} onChange={(e) => setBranchName(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}>預金種目</label>
                <select value={accountType} onChange={(e) => setAccountType(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}>
                  <option value="savings">普通</option>
                  <option value="checking">当座</option>
                </select>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}>口座番号</label>
                <input type="text" placeholder="1234567" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}>口座名義（カナ）</label>
                <input type="text" placeholder="ヤマダ タロウ" value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
              </div>
            </div>
          </details>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? '#94a3b8' : '#ff4500',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '登録中...' : '🚀 アフィリエイトに登録する'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#64748b' }}>
          <Link href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>トップページに戻る</Link>
        </div>
      </main>
    </div>
  );
}
