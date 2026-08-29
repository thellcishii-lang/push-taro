'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase-client';
import { onAuthStateChanged } from 'firebase/auth';

function ProUpgradeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const shopId = searchParams.get('shopId');

  const [user, setUser] = useState<any>(null);
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [accountType, setAccountType] = useState('savings');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      }
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopId) {
      alert('店舗IDが確認できません。管理画面から再度やり直してください。');
      return;
    }

    setLoading(true);
    try {
      const idToken = user ? await user.getIdToken() : '';
      const res = await fetch('/api/upgrade-request/pro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          shopId,
          bankAccount: {
            bankName,
            branchName,
            accountType,
            accountNumber,
            accountHolder,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'お申し込みに失敗しました。');
      }

      setSubmitted(true);
    } catch (err: any) {
      alert('エラー: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: '650px', margin: '60px auto', padding: '20px', fontFamily: 'sans-serif' }}>
        <div style={{ background: '#fff7ed', padding: '40px 30px', borderRadius: '12px', textAlign: 'center', border: '1px solid #fed7aa' }}>
          <h2 style={{ color: '#c2410c', marginBottom: '16px', fontSize: '24px' }}>🔥 PROプランお申し込みを受け付けました</h2>
          <p style={{ lineHeight: '1.8', color: '#374151', marginBottom: '24px', fontSize: '15px' }}>
            ご登録ありがとうございます。手続き完了のご案内をメールにてお送りいたしました。<br />
            既存の顧客データ（Push登録）はすべてそのままPROプランへ引き継がれます。
          </p>
          <Link
            href="/admin"
            style={{
              display: 'inline-block',
              background: '#ea580c',
              color: '#fff',
              padding: '12px 28px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            店舗管理画面へ戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '0 20px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div style={{ background: '#ffffff', padding: '36px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span style={{ background: '#fff7ed', color: '#ea580c', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
            PRO PLAN UPGRADE
          </span>
          <h1 style={{ fontSize: '26px', fontWeight: '800', margin: '16px 0 8px 0', color: '#1a202c' }}>
            PROプランへのアップグレードお申し込み
          </h1>
          <p style={{ fontSize: '14px', color: '#718096', margin: 0 }}>
            既存の店舗データ（店舗ID: <code>{shopId || '未引き継ぎ'}</code>）を維持したままアップグレードします。
          </p>
        </div>

        {/* PROプランメリットカード */}
        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#c2410c' }}>🎁 PROプラン限定特典</h3>
          <ul style={{ fontSize: '13px', color: '#78350f', margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
            <li><strong>他店舗紹介による 10% 成果報酬還元</strong>（利用料から自動相殺）</li>
            <li>Web Push完全無制限送信 ＆ 自動配信（Cron）無制限活用</li>
            <li>優先サポート ＆ Square自動連携機能</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#2d3748' }}>
            🏦 紹介報酬 受取用 口座情報の登録（後から変更可能）
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>金融機関名</label>
              <input
                type="text"
                required
                placeholder="例: 〇〇銀行"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>支店名</label>
              <input
                type="text"
                required
                placeholder="例: △△支店"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>預金種目</label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
              >
                <option value="savings">普通</option>
                <option value="checking">当座</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>口座番号</label>
              <input
                type="text"
                required
                placeholder="1234567"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>口座名義（カナ）</label>
              <input
                type="text"
                required
                placeholder="ヤマダ タロウ"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: '#ff4500',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(255, 69, 0, 0.3)'
            }}
          >
            {loading ? '処理中...' : 'PROプランにアップグレードを申し込む'}
          </button>
        </form>

      </div>
    </div>
  );
}

export default function ProUpgradePage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>読み込み中...</div>}>
      <ProUpgradeContent />
    </Suspense>
  );
}
