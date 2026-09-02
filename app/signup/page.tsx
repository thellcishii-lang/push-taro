'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { app } from '../../lib/firebase-client';

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
  // SMS認証用ステート
  // ============================================================
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [sendingSms, setSendingSms] = useState(false);
  const [smsError, setSmsError] = useState('');
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  // ============================================================
  // SMS送信処理
  // ============================================================
  const handleSendSms = async () => {
    // 電話番号チェック（ハイフン除去後10〜11桁）
    const phoneClean = phone.replace(/-/g, '');
    if (phoneClean.length < 10 || phoneClean.length > 11) {
      alert('電話番号が正しくありません（10〜11桁の数字で入力してください）。');
      return;
    }

    // 国際形式に変換（日本の場合は +81 を付与）
    let phoneNumber = phoneClean;
    if (phoneNumber.startsWith('0')) {
      phoneNumber = '+81' + phoneNumber.slice(1);
    } else if (!phoneNumber.startsWith('+')) {
      phoneNumber = '+81' + phoneNumber;
    }

    setSendingSms(true);
    setSmsError('');

    try {
      // reCAPTCHA の初期化（まだなければ）
      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier(
          auth,
          'recaptcha-container',
          {
            size: 'invisible',
            callback: () => {
              console.log('[SMS] reCAPTCHA 成功');
            },
          }
        );
      }

      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaRef.current
      );
      setVerificationId(confirmation.verificationId);
      alert('📱 SMSを送信しました。届いた6桁のコードを入力してください。');
    } catch (err: any) {
      console.error('[SMS] 送信エラー:', err);
      setSmsError('SMS送信に失敗しました: ' + (err.message || '不明なエラー'));
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }
    } finally {
      setSendingSms(false);
    }
  };

  // ============================================================
  // SMSコード検証処理
  // ============================================================
  const handleVerifyCode = async () => {
    if (!verificationId || !verificationCode) {
      alert('認証コードを入力してください。');
      return;
    }

    try {
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      await signInWithCredential(auth, credential);
      setPhoneVerified(true);
      alert('✅ 電話番号が認証されました！');
      setSmsError('');
    } catch (err: any) {
      console.error('[SMS] 検証エラー:', err);
      setSmsError('認証コードが間違っています。もう一度お試しください。');
    }
  };

  // ============================================================
  // 本登録処理（送信）
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
    
    // ① メールアドレス確認
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

    // ③ SMS認証が完了しているかチェック
    if (!phoneVerified) {
      alert('📱 先に電話番号のSMS認証を完了してください。');
      return;
    }

    // ④ PROプラン時は銀行口座が必須
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

    // ⑤ 法人の場合はインボイス番号が必須
    if (companyName && !invoiceNumber) {
      alert('法人の方はインボイス登録番号の入力をお願いします。');
      return;
    }
    // ============================================================

    setLoading(true);

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          plan: selectedPlan,
          companyName,
          invoiceNumber,
          address,
          phone: phoneClean,
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

      // ✅ 決済リンクがあればリダイレクト（Squareへ）
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert('申し込みを受け付けました。メールに記載された決済リンクからお手続きください。');
        router.push('/');
      }

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
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>
                インボイス登録番号 <span style={{ color: '#e11d48' }}>（法人の方は必須）</span>
              </label>
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

            {/* 電話番号 + SMS認証 */}
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>
                電話番号 <span style={{ color: '#e11d48' }}>（SMS認証必須）</span>
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="tel"
                  required
                  placeholder="03-1234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ flex: 1, minWidth: '180px', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={handleSendSms}
                  disabled={sendingSms || phoneVerified}
                  style={{
                    padding: '10px 18px',
                    background: phoneVerified ? '#22c55e' : sendingSms ? '#94a3b8' : '#3b82f6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: phoneVerified || sendingSms ? 'default' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {sendingSms ? '送信中...' : phoneVerified ? '✅ 認証済み' : 'SMS送信'}
                </button>
              </div>
              {phoneVerified && (
                <p style={{ fontSize: '12px', color: '#22c55e', marginTop: '4px' }}>
                  ✅ 電話番号認証が完了しています
                </p>
              )}
            </div>

            {/* SMS認証コード入力（未認証の場合のみ表示） */}
            {!phoneVerified && verificationId && (
              <div style={{ background: '#f0f9ff', padding: '12px 16px', borderRadius: '6px', border: '1px solid #bae6fd' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>
                  認証コード（SMSに届いた6桁）
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    style={{
                      padding: '10px 18px',
                      background: '#22c55e',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    認証
                  </button>
                </div>
                {smsError && (
                  <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>{smsError}</p>
                )}
                <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  ※ SMSが届かない場合は、もう一度「SMS送信」ボタンを押してください。
                </p>
              </div>
            )}

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
            {/* 利用規約の全文（省略） */}
            <p style={{ fontWeight: 'bold', margin: '0 0 8px 0', fontSize: '13px', color: '#1a202c' }}>利用規約</p>
            <p style={{ margin: '0 0 10px 0' }}>
              この利用規約（以下、「本規約」といいます。）は、the合同会社（以下、「当社」といいます。）が提供するPush-taro（以下、「当サービス」といいます。）の利用条件を定めるものです。ご利用者様（以下、「ユーザー」といいます。）には、本規約に従って当サービスをご利用いただきます。
            </p>
            {/* ... 残りの規約全文は既存のものをそのまま使用してください ... */}
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
            disabled={loading || !phoneVerified}
            style={{
              width: '100%',
              padding: '16px',
              background: (!phoneVerified || loading) ? '#94a3b8' : '#ff4500',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '18px',
              cursor: (!phoneVerified || loading) ? 'not-allowed' : 'pointer',
              boxShadow: (!phoneVerified || loading) ? 'none' : '0 4px 12px rgba(255, 69, 0, 0.3)',
            }}
          >
            {!phoneVerified
              ? '📱 電話番号認証を完了してください'
              : loading
              ? '処理中...'
              : '申し込む（決済画面へ進む）'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px' }}>
          <Link href="/admin" style={{ color: '#0284c7', textDecoration: 'none' }}>すでにアカウントをお持ちの方（ログイン）</Link>
        </div>

        {/* reCAPTCHA コンテナ（SMS認証用） */}
        <div id="recaptcha-container" style={{ marginTop: '10px' }}></div>

      </main>
    </div>
  );
}
