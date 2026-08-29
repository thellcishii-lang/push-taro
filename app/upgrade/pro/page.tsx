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

  // 会社・契約情報
  const [companyName, setCompanyName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  // 振込口座情報
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [accountType, setAccountType] = useState('savings');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  // 利用規約
  const [termsAgreed, setTermsAgreed] = useState(false);

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

    if (!termsAgreed) {
      alert('利用規約への同意が必要です。');
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
          companyName,
          invoiceNumber,
          address,
          phone,
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
            既存の店舗データ（店舗ID: <code>{shopId || '未引き継ぎ'}</code>）および顧客登録数はすべて引き継がれます。
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* 1. 会社・契約情報 */}
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#2d3748' }}>
            1. ご契約者（請求書・インボイス発行）情報
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
          </div>

          {/* 2. 口座情報 */}
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#2d3748' }}>
            2. 10%紹介報酬 受取用 口座情報
          </h3>

          <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
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

          {/* 3. 利用規約 (正式文言) */}
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#2d3748' }}>
            3. 利用規約への同意
          </h3>

          <div style={{
            height: '160px',
            overflowY: 'scroll',
            background: '#f8fafc',
            border: '1px solid #cbd5e0',
            padding: '14px 16px',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#475569',
            lineHeight: '1.7',
            marginBottom: '15px'
          }}>
            <p style={{ fontWeight: 'bold', margin: '0 0 8px 0', fontSize: '13px', color: '#1a202c' }}>利用規約</p>
            <p style={{ margin: '0 0 10px 0' }}>
              この利用規約（以下、「本規約」といいます。）は、Push-taro（以下、「当サービス」といいます。）が提供する店舗向けプッシュ通知・CRMプラットフォームの利用条件を定めるものです。ご利用者様（以下、「ユーザー」といいます。）には、本規約に従って当サービスをご利用いただきます。
            </p>
            <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#2d3748' }}>第1条（適用）</p>
            <p style={{ margin: '0 0 10px 0' }}>
              本規約は、ユーザーと当サービス運営者との間の当サービスの利用に関わる一切の関係に適用されるものとします。
            </p>
            <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#2d3748' }}>第2条（利用料金と支払い方法）</p>
            <p style={{ margin: '0 0 10px 0' }}>
              ユーザーは、当サービスの有料プラン（ライト、スタンダード、プロ）の対価として、別途定め、本サイトに表示する利用料金を、所定の決済方法（Square等）により支払うものとします。
            </p>
            <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#2d3748' }}>第3条（禁止事項）</p>
            <p style={{ margin: '0 0 10px 0' }}>
              ユーザーは、当サービスの利用にあたり、法令や公序良俗に違反する行為、または運営を妨害するおそれのある行為を行ってはならないものとします。
            </p>
            <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#2d3748' }}>第4条（規約の変更）</p>
            <p style={{ margin: '0 0 6px 0' }}>
              運営者は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
            </p>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '25px', fontSize: '14px', fontWeight: 'bold', color: '#1a202c' }}>
            <input
              type="checkbox"
              required
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
            />
            利用規約に同意してPROプランへ申し込む
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
