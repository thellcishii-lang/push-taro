'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// 紹介店舗のデータ型
interface ReferredShop {
  id: string;
  name: string;
  referredByCode: string;
  createdAt?: any;
}

// 通知データ型
interface AgencyNotification {
  id: string;
  shopName: string;
  referralCode: string;
  isRead: boolean;
  createdAt?: any;
}

export default function AgencyPage() {
  // --- ログイン状態・ダッシュボード用ステート ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');
  const [referredShops, setReferredShops] = useState<ReferredShop[]>([]);
  const [notifications, setNotifications] = useState<AgencyNotification[]>([]);
  const [fetchingDashboard, setFetchingDashboard] = useState<boolean>(true);

  // --- 申込フォーム用ステート ---
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

  // 初回ロード時にログイン状態とデータの取得
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        // 例: Firebase Auth または トークン確認処理
        // ログイン中の代理店IDがある場合はダッシュボード表示へ切替
        const storedUserId = localStorage.getItem('agencyUserId'); // 実際の認証情報に併せて調整
        if (storedUserId) {
          setIsLoggedIn(true);
          setUserId(storedUserId);

          // 1. 紹介顧客リスト（店舗）の取得
          const shopsRes = await fetch(`/api/agency/shops?userId=${storedUserId}`);
          if (shopsRes.ok) {
            const data = await shopsRes.json();
            setReferredShops(data.shops || []);
          }

          // 2. 新着通知の取得
          const notifRes = await fetch(`/api/agency/notifications?userId=${storedUserId}`);
          if (notifRes.ok) {
            const data = await notifRes.json();
            setNotifications(data.notifications || []);
          }
        }
      } catch (err) {
        console.error('ダッシュボードデータの取得失敗:', err);
      } finally {
        setFetchingDashboard(false);
      }
    };

    checkAuthAndFetchData();
  }, []);

  // 通知を既読にする処理
  const handleMarkAsRead = async (notifId: string) => {
    try {
      await fetch('/api/agency/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: notifId }),
      });
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('既読処理失敗:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('代理店利用規約に同意してください。');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/agency/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          ownerName,
          email,
          phone,
          address,
          invoiceNumber,
          bankInfo,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '申込処理に失敗しました。');
      }

      setSubmitted(true);
    } catch (err: any) {
      alert('エラーが発生しました: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 送信完了画面 ---
  if (submitted) {
    return (
      <main style={{ maxWidth: '650px', margin: '60px auto', padding: '20px', fontFamily: 'sans-serif' }}>
        <div style={{ background: '#f0fdf4', padding: '40px 30px', borderRadius: '12px', textAlign: 'center', border: '1px solid #bbf7d0' }}>
          <h2 style={{ color: '#166534', marginBottom: '16px', fontSize: '24px' }}>代理店お申し込みを受け付けました</h2>
          <p style={{ lineHeight: '1.8', color: '#374151', marginBottom: '24px', fontSize: '15px' }}>
            ご登録ありがとうございます。ご入力いただいた内容をもとに審査を行わせていただきます。<br />
            審査完了後、ご登録のメールアドレス宛（<strong>{email}</strong>）に<strong>決済手続き用のご案内メール</strong>をお送りいたします。
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              background: '#3182ce',
              color: '#fff',
              padding: '12px 28px',
              borderRadius: '6px',
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

  // 未読通知数の取得
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#2d3748', background: '#f8fafc', minHeight: '100vh', margin: 0, padding: 0, lineHeight: 1.7 }}>
      
      {/* ナビゲーションバー */}
      <nav style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: '20px', fontWeight: '800', color: '#1a202c' }}>
          <Link href="/" style={{ color: '#1a202c', textDecoration: 'none' }}>
            Push-taro<span style={{ color: '#3182ce', fontSize: '14px', marginLeft: '8px', fontWeight: 'normal' }}>本格派CRMツール</span>
          </Link>
        </div>

        {/* 代理店用ヘッダー通知アイコン */}
        {isLoggedIn && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ fontSize: '20px', cursor: 'pointer' }}>🔔</span>
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-8px',
                  background: '#e53e3e',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  padding: '2px 6px',
                }}>
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        )}
      </nav>

      <main style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>

        {/* ログイン済み：代理店ダッシュボード画面 */}
        {isLoggedIn ? (
          <div>
            <div style={{ background: '#ffffff', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1a202c', marginBottom: '8px' }}>
                代理店ダッシュボード
              </h1>
              <p style={{ color: '#718096', fontSize: '14px' }}>
                あなたの紹介コード経由で登録された店舗（顧客）一覧と通知を確認できます。
              </p>
            </div>

            {/* 未読通知アラートボックス */}
            {unreadCount > 0 && (
              <div style={{ background: '#fffaf0', border: '1px solid #feebc8', borderRadius: '12px', padding: '20px', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#c05621', margin: '0 0 12px 0' }}>
                  🔔 新規お申し込み通知 ({unreadCount}件)
                </h3>
                {notifications.filter(n => !n.isRead).map(n => (
                  <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #feebc8' }}>
                    <div style={{ fontSize: '14px', color: '#2d3748' }}>
                      <strong>{n.shopName}</strong> が紹介コード [ <strong>{n.referralCode}</strong> ] で登録されました。
                    </div>
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      style={{ background: '#edf2f7', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      既読にする
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 顧客リスト（紹介店舗一覧） */}
            <div style={{ background: '#ffffff', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>
                紹介顧客リスト（店舗一覧）
              </h2>

              {referredShops.length === 0 ? (
                <p style={{ color: '#a0aec0', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
                  現在、紹介コード経由で登録された店舗はありません。
                </p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ background: '#f7fafc', borderBottom: '2px solid #edf2f7' }}>
                        <th style={{ padding: '12px', color: '#4a5568' }}>店舗名（顧客名）</th>
                        <th style={{ padding: '12px', color: '#4a5568' }}>使用紹介コード</th>
                        <th style={{ padding: '12px', color: '#4a5568' }}>登録日時</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referredShops.map(shop => (
                        <tr key={shop.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                          <td style={{ padding: '16px 12px', fontWeight: 'bold', color: '#2d3748' }}>{shop.name}</td>
                          <td style={{ padding: '16px 12px', color: '#3182ce', fontWeight: 'bold' }}>{shop.referredByCode}</td>
                          <td style={{ padding: '16px 12px', color: '#718096' }}>
                            {shop.createdAt ? new Date(shop.createdAt.seconds * 1000).toLocaleDateString('ja-JP') : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (

          /* 未ログイン時：代理店申込フォーム（既存画面） */
          <div style={{ maxWidth: '800px', margin: '0 auto', background: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            
            {/* ヘッダー */}
            <div style={{ textAlign: 'center', marginBottom: '35px' }}>
              <span style={{ background: '#ebf8ff', color: '#3182ce', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>
                Official Partner Program
              </span>
              <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '16px 0 10px 0', color: '#1a202c' }}>
                代理店パートナーお申し込み
              </h1>
              <p style={{ color: '#718096', fontSize: '15px' }}>
                必要事項をご入力の上、パートナー登録の審査へお進みください。
              </p>
            </div>

            {/* 条件サマリーボックス */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={{ background: 'linear-gradient(135deg, #ebf8ff 0%, #eef2ff 100%)', border: '2px solid #bee3f8', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 6px 0', color: '#1a202c' }}>加盟金（初期費用）</h3>
                <div style={{ fontSize: '26px', fontWeight: '900', color: '#3182ce' }}>
                  300,000円 <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#4a5568' }}>(税別)</span>
                </div>
              </div>
              <div style={{ background: '#f7fafc', border: '2px solid #cbd5e0', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 6px 0', color: '#1a202c' }}>代理店月額費用</h3>
                <div style={{ fontSize: '26px', fontWeight: '900', color: '#1a202c' }}>
                  30,000円 <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#4a5568' }}>/月 (税別)</span>
                </div>
              </div>
            </div>

            {/* 申込フォーム */}
            <form onSubmit={handleSubmit}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '15px', paddingBottom: '8px', borderBottom: '2px solid #edf2f7' }}>
                申請者情報入力
              </h2>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>会社名 / 屋号 <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="例: 株式会社サンプルエージェンシー"
                  style={{ width: '100%', padding: '10px', fontSize: '15px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
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
                  style={{ width: '100%', padding: '10px', fontSize: '15px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
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
                  style={{ width: '100%', padding: '10px', fontSize: '15px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
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
                  style={{ width: '100%', padding: '10px', fontSize: '15px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
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
                  style={{ width: '100%', padding: '10px', fontSize: '15px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>適格請求書発行事業者登録番号（インボイス番号）</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="例: T1234567890123"
                  style={{ width: '100%', padding: '10px', fontSize: '15px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>成果報酬の振込先口座情報</label>
                <input
                  type="text"
                  value={bankInfo}
                  onChange={(e) => setBankInfo(e.target.value)}
                  placeholder="例: 〇〇銀行 支店名 普通 1234567 口座名義"
                  style={{ width: '100%', padding: '10px', fontSize: '15px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
                />
              </div>

              {/* 規約エリア */}
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e0', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c', marginBottom: '8px' }}>代理店利用規約（概要）</h3>
                <div style={{ height: '140px', overflowY: 'auto', fontSize: '12px', color: '#4a5568', background: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', lineHeight: '1.7', marginBottom: '12px' }}>
                  <p style={{ margin: '0 0 8px 0' }}><strong>第1条（目的）</strong> 本規約は代理店パートナーの販売促進活動および権利義務関係を定めるものです。</p>
                  <p style={{ margin: '0 0 8px 0' }}><strong>第2条（契約成立と費用）</strong> 審査通過後、加盟金（30万円・税別）および初月月額費用（3万円・税別）の決済完了をもって契約成立とします。</p>
                  <p style={{ margin: '0 0 8px 0' }}><strong>第3条（解約・返金）</strong> 理由の如何を問わず、支払済みの加盟金の返金は行われません。</p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="agreement"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="agreement" style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748', cursor: 'pointer' }}>
                    「代理店利用規約」の内容を確認し、同意します。
                  </label>
                </div>
              </div>

              {/* 送信ボタン */}
              <button
                type="submit"
                disabled={!agreed || loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '16px',
                  color: '#ffffff',
                  border: 'none',
                  background: agreed && !loading ? '#3182ce' : '#cbd5e0',
                  cursor: agreed && !loading ? 'pointer' : 'not-allowed',
                  boxShadow: agreed && !loading ? '0 4px 12px rgba(49, 130, 206, 0.3)' : 'none',
                }}
              >
                {loading ? '送信中...' : '代理店パートナーに申し込む'}
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
