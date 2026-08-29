'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // プラン選択
  const [selectedPlan, setSelectedPlan] = useState<'light' | 'standard' | 'pro'>('light');

  // 基本会員情報
  const [companyName, setCompanyName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Proプラン用 口座情報詳細
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [accountType, setAccountType] = useState('savings');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  // 利用規約同意
  const [termsAgreed, setTermsAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAgreed) {
      alert('利用規約への同意が必要です。');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          plan: selectedPlan,
          companyName,
          invoiceNumber,
          address,
          phone,
          bankAccount: selectedPlan === 'pro' ? {
            bankName,
            branchName,
            accountType,
            accountNumber,
            accountHolder,
          } : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '登録に失敗しました。');
      }

      alert('登録が完了しました！管理画面へログインしてください。');
      router.push('/admin');
    } catch (err: any) {
      alert('エラー: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <main style={{ maxWidth: '650px', margin: '0 auto', background: '#fff', padding: '36px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1a202c', margin: '0 0 8px 0' }}>
            プッシュ太郎 新規アカウント登録
          </h1>
          <p style={{ color: '#718096', fontSize: '14px', margin: 0 }}>
            Web Push通知配信サービスを今すぐ始めましょう。
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 1. プラン選択 */}
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#2d3748' }}>
            1. ご契約プランを選択
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px', marginBottom: '30px' }}>
            
            <div
              onClick={() => setSelectedPlan('light')}
              style={{
                padding: '14px',
                borderRadius: '8px',
                border: selectedPlan === 'light' ? '2px solid #64748b' : '1px solid #cbd5e0',
                background: selectedPlan === 'light' ? '#f8fafc' : '#fff',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#475569' }}>LIGHT</div>
              <div style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0' }}>¥2,980<span style={{ fontSize: '10px', fontWeight: 'normal' }}>/月</span></div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>手軽に試せる基本プラン</div>
            </div>

            <div
              onClick={() => setSelectedPlan('standard')}
              style={{
                padding: '14px',
                borderRadius: '8px',
                border: selectedPlan === 'standard' ? '2px solid #0284c7' : '1px solid #cbd5e0',
                background: selectedPlan === 'standard' ? '#f0f9ff' : '#fff',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#0284c7' }}>STANDARD</div>
              <div style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0' }}>¥9,800<span style={{ fontSize: '10px', fontWeight: 'normal' }}>/月</span></div>
              <div style={{ fontSize: '11px', color: '#0369a1' }}>無制限配信・Square連携</div>
            </div>

            <div
              onClick={() => setSelectedPlan('pro')}
              style={{
                padding: '14px',
                borderRadius: '8px',
                border: selectedPlan === 'pro' ? '2px solid #ff4500' : '1px solid #cbd5e0',
                background: selectedPlan === 'pro' ? '#fff7ed' : '#fff',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#ff4500' }}>PRO</div>
              <div style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0' }}>¥29,800<span style={{ fontSize: '10px', fontWeight: 'normal' }}>/月</span></div>
              <div style={{ fontSize: '11px', color: '#c2410c' }}>全機能 ＋ 10%紹介報酬還元</div>
            </div>

          </div>

          {/* 2. 会社・店舗基本情報 */}
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#2d3748' }}>
            2. ご契約者様（会社・店舗）情報
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '30px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>会社名 / 屋号</label>
              <input
                type="text"
                required
                placeholder="株式会社〇〇 または 店舗屋号"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>インボイス登録番号（任意）</label>
              <input
                type="text"
                placeholder="T1234567890123"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '13px' }}>所在地 / 住所</label>
              <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#e11d48', fontWeight: 'bold' }}>
                ※上記住所などは正式な登録住所で書いてください。
              </p>
              <input
                type="text"
                required
                placeholder="東京都渋谷区〇〇 1-2-3 〇〇ビル4F"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>電話番号</label>
              <input
                type="tel"
                required
                placeholder="03-1234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>ログイン用メールアドレス</label>
              <input
                type="email"
                required
                placeholder="owner@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>ログイン用パスワード</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="6文字以上のパスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* 3. PROプラン選択時限定：受取用口座情報入力欄 */}
          {selectedPlan === 'pro' && (
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '6px', color: '#c2410c' }}>
                🏦 10%紹介報酬 受取口座の登録
              </h3>
              <p style={{ fontSize: '12px', color: '#78350f', margin: '0 0 16px 0' }}>
                PROプラン特典として、他店舗をご紹介いただいた際の成果報酬（10%）をお振り込みする口座を指定してください。
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}>金融機関名</label>
                  <input
                    type="text"
                    required
                    placeholder="例: 〇〇銀行"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box', background: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}>支店名</label>
                  <input
                    type="text"
                    required
                    placeholder="例: △△支店"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box', background: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}>預金種目</label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box', background: '#fff' }}
                  >
                    <option value="savings">普通</option>
                    <option value="checking">当座</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}>口座番号</label>
                  <input
                    type="text"
                    required
                    placeholder="1234567"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box', background: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}>口座名義（カナ）</label>
                  <input
                    type="text"
                    required
                    placeholder="ヤマダ タロウ"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box', background: '#fff' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. 利用規約 */}
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#2d3748' }}>
            4. 利用規約への同意
          </h3>

          <div style={{
            height: '140px',
            overflowY: 'scroll',
            background: '#f8fafc',
            border: '1px solid #cbd5e0',
            padding: '12px 16px',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#475569',
            lineHeight: '1.6',
            marginBottom: '15px'
          }}>
            <p style={{ fontWeight: 'bold', margin: '0 0 6px 0' }}>プッシュ太郎 サービス利用規約</p>
            <p style={{ margin: '0 0 8px 0' }}>
              本規約は、プッシュ太郎（以下「本サービス」）の利用条件を定めるものです。利用者は本規約に同意の上、サービスを利用するものとします。
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>1. 料金および支払い:</strong> 利用者は選択したプランに応じた月額料金を期日までに支払うものとします。月途中の解約に伴う日割り返金は行われません。
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>2. 配信内容の責任:</strong> 送信されるプッシュ通知のメッセージ内容に関する全責任は契約ユーザーに帰属します。不法行為・迷惑行為にあたる配信は即時停止対象となります。
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>3. 紹介報酬制度（PRO限定）:</strong> 紹介成果が発生した場合、解約確認完了後の翌々月末までに指定口座へ成果報酬（10%）が振り込まれます。
            </p>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '25px', fontSize: '14px', fontWeight: 'bold', color: '#1a202c' }}>
            <input
              type="checkbox"
              required
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
            />
            利用規約に同意して申込む
          </label>

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
              fontSize: '18px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(255, 69, 0, 0.3)'
            }}
          >
            {loading ? '登録処理中...' : 'アカウントを登録して開始する'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px' }}>
          <Link href="/admin" style={{ color: '#0284c7', textDecoration: 'none' }}>すでにアカウントをお持ちの方（ログイン）</Link>
        </div>

      </main>
    </div>
  );
}
