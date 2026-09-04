'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// ============================================================
// Firebase 直接初期化
// ============================================================
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // プラン選択
  const [selectedPlan, setSelectedPlan] = useState<'light' | 'standard' | 'pro'>('light');

  // 基本会員情報（パスワードなし）
  const [companyName, setCompanyName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Proプラン用 口座情報詳細
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [accountType, setAccountType] = useState('savings');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  // 利用規約同意
  const [termsAgreed, setTermsAgreed] = useState(false);

  // ============================================================
  // 戻ったときに入力値を復元する（確認画面から戻ってきた場合のみ）
  // ============================================================
  useEffect(() => {
    if (sessionStorage.getItem('went_to_confirm') === 'true') {
      const stored = sessionStorage.getItem('signup_data');
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setEmail(data.email || '');
          setCompanyName(data.companyName || '');
          setPhone(data.phone || '');
          setAddress(data.address || '');
          setInvoiceNumber(data.invoiceNumber || '');
          setSelectedPlan(data.plan || 'light');
          if (data.bankAccount) {
            setBankName(data.bankAccount.bankName || '');
            setBranchName(data.bankAccount.branchName || '');
            setAccountType(data.bankAccount.accountType || 'savings');
            setAccountNumber(data.bankAccount.accountNumber || '');
            setAccountHolder(data.bankAccount.accountHolder || '');
          }
        } catch (e) {}
      }
      sessionStorage.removeItem('went_to_confirm');
    }
  }, []);

  // ============================================================
  // 本登録処理（送信）→ 確認画面へ遷移（APIは呼ばない）
  // ============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAgreed) {
      alert('利用規約への同意が必要です。');
      return;
    }

    // ============================================================
    // 送信前バリデーション
    // ============================================================
    
    // ① メールアドレス確認（2回入力チェック）
    const emailConfirm = (document.getElementById('emailConfirm') as HTMLInputElement)?.value;
    if (email !== emailConfirm) {
      alert('メールアドレスが一致しません。もう一度入力してください。');
      return;
    }

    // ② 電話番号の簡易チェック（ハイフン除去後10〜11桁）
    const phoneClean = phone.replace(/-/g, '');
    if (phoneClean.length < 10 || phoneClean.length > 11) {
      alert('電話番号が正しくありません（10〜11桁の数字で入力してください）。');
      return;
    }

        // ③ PROプラン時は銀行口座が必須
    if (selectedPlan === 'pro') {
      if (!bankName || !branchName || !accountNumber || !accountHolder) {
        alert('PROプランでは銀行口座情報が必須です。すべて入力してください。');
        return;
      }
      const kanaRegex = /^[ァ-ヶー]+$/;
      if (!kanaRegex.test(accountHolder)) {
        alert('口座名義は全角カナで入力してください。');
        return;
      }
    }

    // ============================================================
    // 🔥 メールアドレス重複チェック（確認画面に進む前に）
    // ============================================================
    try {
      const checkRes = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, checkOnly: true }),
      });
      const checkData = await checkRes.json();

      if (checkRes.status === 409) {
        if (checkData.alreadyPaid) {
          alert('このメールアドレスはすでに登録済みです。\n管理画面からログインしてください。');
          router.push('/admin');
        } else {
          alert('このメールアドレスはすでに申し込み中です。\n決済を完了させるか、別のメールアドレスをご使用ください。');
        }
        return;
      }
    } catch (err: any) {
      alert('メールアドレスの確認中にエラーが発生しました: ' + err.message);
      return;
    }

    const formData = {
      email,
      plan: selectedPlan,
      // ...
    };

    // ============================================================
    // 確認画面へ遷移（APIは呼ばない）
    // ============================================================
    const formData = {
      email,
      plan: selectedPlan,
      companyName,
      invoiceNumber,
      address,
      phone: phone.replace(/-/g, ''),
      bankAccount: selectedPlan === 'pro' ? {
        bankName,
        branchName,
        accountType,
        accountNumber,
        accountHolder,
      } : null,
    };

    sessionStorage.setItem('went_to_confirm', 'true');
    sessionStorage.setItem('signup_data', JSON.stringify(formData));
    router.push('/signup/confirm');
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <main style={{ maxWidth: '650px', margin: '0 auto', background: '#fff', padding: '36px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1a202c', margin: '0 0 8px 0' }}>
            Push-taro 新規アカウント登録
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
              <div style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0' }}>¥1,980<span style={{ fontSize: '10px', fontWeight: 'normal' }}>/月（税別）</span></div>
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
              <div style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0' }}>¥3,800<span style={{ fontSize: '10px', fontWeight: 'normal' }}>/月（税別）</span></div>
              <div style={{ fontSize: '11px', color: '#0369a1' }}>月間１万5千配信。LIGHTプランの３倍の配信量</div>
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
              <div style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0' }}>¥10,000<span style={{ fontSize: '10px', fontWeight: 'normal' }}>/月（税別）</span></div>
              <div style={{ fontSize: '11px', color: '#c2410c' }}>配信無制限　全機能 ＋ 10%紹介報酬還元</div>
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
              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '13px' }}>所在地 / 住所</label>
              <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#e11d48', fontWeight: 'bold' }}>
                ※住所などは正式な登録住所で書いてください。
              </p>
              <input
                type="text"
                required
                placeholder="〇〇県〇〇市〇〇１２３−４５"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
              />
            </div>

            {/* 電話番号（SMS認証は任意になったのでラベル変更） */}
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>
                電話番号
              </label>
              <input
                type="tel"
                required
                placeholder="09012345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>ご登録メールアドレス</label>
              <input
                type="email"
                required
                placeholder="owner@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
              />
            </div>

            {/* メール確認用 */}
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>メールアドレス（確認）</label>
              <input
                type="email"
                required
                placeholder="もう一度入力してください"
                id="emailConfirm"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
              />
            </div>

            {/* ❌ パスワード入力欄は削除（システム自動発行） */}
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
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}>
          適格請求書発行事業者登録番号（インボイス番号）
        </label>
        <input
          type="text"
          placeholder="T1234567890123（任意）"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box', background: '#fff' }}
        />
        <p style={{ fontSize: '11px', color: '#78350f', marginTop: '4px' }}>
          ※ インボイス番号がない場合、紹介報酬の還元率が <strong>10% → 9%</strong> となります。
        </p>
      </div>
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

          {/* 4. 利用規約（全文掲載） */}
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#2d3748' }}>
            4. 利用規約への同意
          </h3>

          <div style={{
            height: '180px',
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
              この利用規約（以下、「本規約」といいます。）は、the合同会社（以下、「当社」といいます。）が提供するPush-taro（以下、「当サービス」といいます。）の利用条件を定めるものです。ご利用者様（以下、「ユーザー」といいます。）には、本規約に従って当サービスをご利用いただきます。
            </p>
            
            <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', color: '#2d3748' }}>第1条（適用）</p>
            <p style={{ margin: '0 0 8px 0' }}>本規約は、ユーザーと当社との間の当サービスの利用に関わる一切の関係に適用されるものとします。ユーザーが本サービスのお申し込みまたはご利用を開始した時点で、本規約の全条項に同意したものとみなします。</p>

            <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', color: '#2d3748' }}>第2条（アカウント登録と管理）</p>
            <p style={{ margin: '0 0 8px 0' }}>1. ユーザーは、真実かつ正確な情報をもってアカウント登録を行うものとします。<br />2. ユーザーは、自己の責任においてアカウントIDおよびパスワードを厳重に管理するものとし、第三者への譲渡・貸与等はできません。<br />3. アカウント情報の管理不十分による損害の責任はユーザーが負うものとします。</p>

            <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', color: '#2d3748' }}>第3条（利用料金および支払い方法）</p>
            <p style={{ margin: '0 0 8px 0' }}>1. ユーザーは、当サービスが定める各プラン（ライトプラン: 1,980円/月（税別）、スタンダードプラン: 3,800円/月（税別）、プロプラン: 10,000円/月（税別）、いずれも税別）の利用料金を、当社指定の決済手段（Square等）により支払うものとします。<br />2. 月の途中でアカウントの開通または解約が行われた場合であっても、日割り計算による返金・精算は行いません。</p>

            <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', color: '#2d3748' }}>第4条（送信メッセージおよびコンテンツの責任）</p>
            <p style={{ margin: '0 0 8px 0' }}>1. 当サービスを通じてエンドユーザー（通知購読者）へ配信されるメッセージの内容に関する責任は、一切ユーザー自身に帰属します。<br />2. ユーザーは、特定電子メール法等の関連法令を遵守し、承諾を得ていない不特定多数への迷惑通知（スパム配信）を行ってはなりません。</p>

            <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', color: '#2d3748' }}>第5条（禁止事項）</p>
            <p style={{ margin: '0 0 8px 0' }}>ユーザーは、法令違反行為、知的財産権の侵害、サーバーへの過度な負荷行為、虚偽情報の配信、反社会的勢力への利益供与行為等を行ってはならないものとします。</p>

            <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', color: '#2d3748' }}>第6条（サービスの提供停止・変更・終了）</p>
            <p style={{ margin: '0 0 8px 0' }}>当社は、保守点検・障害復旧・天災地変等により事前に通知することなくサービス提供を中断・停止することがあります。</p>

            <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', color: '#2d3748' }}>第7条（紹介成果報酬制度・PRO特典）</p>
            <p style={{ margin: '0 0 8px 0' }}>1. プロプランユーザーが他店舗を紹介した場合、所定のロジックに基づき10%相当の成果報酬権利が発生します。<br />2. 発生した成果報酬は毎月の請求精算時に自動控除・相殺にて精算されます。</p>

            <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', color: '#2d3748' }}>第8条（契約解除および利用制限）</p>
            <p style={{ margin: '0 0 8px 0' }}>ユーザーが本規約に違反した場合、または利用料金の支払いを怠った場合、当社は即座にサービス利用の停止、あるいは契約を解除することができます。</p>

            <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', color: '#2d3748' }}>第9条（免責事項）</p>
            <p style={{ margin: '0 0 8px 0' }}>1. 当社は、当サービスが特定の目的に適合することや期待する売上向上成果が得られることを保証するものではありません。<br />2. 当社が損害賠償責任を負う場合であっても、過去1ヶ月間にユーザーが支払った利用料相当額を上限とします。</p>

            <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', color: '#2d3748' }}>第10条（秘密保持および個人情報の取扱い）</p>
            <p style={{ margin: '0 0 8px 0' }}>個人情報の取扱いについては、別途定める「プライバシーポリシー」に従うものとします。</p>

            <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', color: '#2d3748' }}>第11条（規約の変更）</p>
            <p style={{ margin: '0 0 8px 0' }}>当社は、必要と判断した場合には、事前に適切な方法で通知することにより、いつでも本規約を変更することができるものとします。</p>

            <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', color: '#2d3748' }}>第12条（準拠法および裁判管轄）</p>
            <p style={{ margin: '0 0 8px 0' }}>本規約の解釈にあたっては日本法を準拠法とし、当社の本社所在地を管轄する裁判所を専属的合意管轄とします。</p>

            <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #cbd5e0', fontSize: '11px', color: '#64748b' }}>
              【事業者名】the合同会社<br />
              【所在地】〒357-0123 埼玉県飯能市中藤下郷２３−２１<br />
              【連絡先】pushtaro.info@gmail.com
            </div>
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
            style={{width: '100%', padding: '16px', backgroundColor: loading ? '#94a3b8' : '#ff4500', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 12px rgba(255, 69, 0, 0.3)' }}
          >
            {loading ? '処理中...' : '申し込む（決済画面へ進む）'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px' }}>
          <Link href="/admin" style={{ color: '#0284c7', textDecoration: 'none' }}>すでにアカウントをお持ちの方（ログイン）</Link>
        </div>

      </main>
    </div>
  );
}
