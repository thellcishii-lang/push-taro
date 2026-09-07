'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import { db as localDb, exportHistoryToJSON, importHistoryFromJSON, PushHistory } from '../../lib/db';
import { QRCodeSVG } from 'qrcode.react';
import ImageUploader from '../../components/ImageUploader';
import { Html5Qrcode } from 'html5-qrcode';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 店舗情報 & プラン・ロールステート
  const [shopId, setShopId] = useState<string | null>(null);
  const [shopName, setShopName] = useState('');
  const [plan, setPlan] = useState<'light' | 'standard' | 'pro' | string | null>(null);
  const [role, setRole] = useState<'normal' | 'pro' | 'agency'>('normal');
  const [couponEnabled, setCouponEnabled] = useState(false);
  const [couponTitle, setCouponTitle] = useState('');
  const [couponDesc, setCouponDesc] = useState('');
  const [couponRate, setCouponRate] = useState(0);
  const [clientLinkUrl, setClientLinkUrl] = useState('');
  const [shopIconUrl, setShopIconUrl] = useState('');

  // 🗂️ タブ管理（push / shop のみ）
  const [activeTab, setActiveTab] = useState<'push' | 'shop'>('push');

  // 通常クーポン（Standard以上）
  const [normalCouponEnabled, setNormalCouponEnabled] = useState(false);
  const [normalCouponTitle, setNormalCouponTitle] = useState('');
  const [normalCouponDesc, setNormalCouponDesc] = useState('');

  // 特別達成クーポン（Standard以上）
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(false);
  const [loyaltyTargetCount, setLoyaltyTargetCount] = useState(3);
  const [loyaltyTitle, setLoyaltyTitle] = useState('');
  const [loyaltyExpireType, setLoyaltyExpireType] = useState('none');
  const [loyaltyCombinable, setLoyaltyCombinable] = useState(false);

  // 送信フォーム（即時通知）
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 履歴＆受取許可件数
  const [history, setHistory] = useState<PushHistory[]>([]);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);

  // 退会ステート
  const [shopStatus, setShopStatus] = useState<string>('active');
  const [validUntilDate, setValidUntilDate] = useState<string>('');

  // QRコードスキャン
  const [scanOpen, setScanOpen] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanLoading, setScanLoading] = useState(false);

  // ========== 認証 & データ取得 ==========
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoadingAuth(false);

      if (u) {
        await loadHistory();

        try {
          const idToken = await u.getIdToken();

          const res = await fetch('/api/create-shop', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({}),
          });
          const data = await res.json();

          if (data.success) {
            const currentShopId = data.shopId;
            setShopId(currentShopId);

            const dashRes = await fetch(`/api/admin/dashboard?shopId=${currentShopId}`, {
              headers: { 'Authorization': `Bearer ${idToken}` }
            });

            if (dashRes.ok) {
              const dashData = await dashRes.json();
              const shop = dashData.shop || data.shop;

              setShopName(shop?.name || '');
              if (shop?.plan) setPlan(String(shop.plan));
              if (shop?.role) setRole(shop.role);
              if (shop?.status) setShopStatus(shop.status);
              if (shop?.validUntil) {
                const vDate = shop.validUntil._seconds ? new Date(shop.validUntil._seconds * 1000) : new Date(shop.validUntil);
                setValidUntilDate(vDate.toISOString().slice(0, 10));
              }

              // 初回クーポン
              if (shop?.coupon) {
                setCouponEnabled(shop.coupon.enabled);
                setCouponTitle(shop.coupon.title || '');
                setCouponDesc(shop.coupon.description || '');
                setCouponRate(shop.coupon.discountRate || 0);
              }

              // 通常クーポン（Standard以上）
              if (shop?.normalCoupon) {
                setNormalCouponEnabled(shop.normalCoupon.enabled || false);
                setNormalCouponTitle(shop.normalCoupon.title || '');
                setNormalCouponDesc(shop.normalCoupon.description || '');
              }

              // 特別達成クーポン（Standard以上）
              if (shop?.loyaltyCoupon) {
                setLoyaltyEnabled(shop.loyaltyCoupon.enabled || false);
                setLoyaltyTargetCount(shop.loyaltyCoupon.targetCount || 3);
                setLoyaltyTitle(shop.loyaltyCoupon.title || '');
                setLoyaltyExpireType(shop.loyaltyCoupon.expireType || 'none');
                setLoyaltyCombinable(shop.loyaltyCoupon.combinable || false);
              }

              if (shop?.linkUrl) setClientLinkUrl(shop.linkUrl);
              if (shop?.iconUrl) setShopIconUrl(shop.iconUrl);

              if (dashData.stats && typeof dashData.stats.subscriberCount === 'number') {
                setSubscriberCount(dashData.stats.subscriberCount);
              }
            }
          }
        } catch (err) {
          console.error('店舗情報取得エラー:', err);
        }
      }
    });

    return () => unsub();
  }, []);

  const loadHistory = async () => {
    const all = await localDb.history.orderBy('sentAt').reverse().toArray();
    setHistory(all);
  };

  // ========== ログイン処理 ==========
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      alert('ログイン失敗: ' + err.message);
    }
  };

  // ========== QRスキャン ==========
  const startCamera = async () => {
    try {
      setScanLoading(true);
      const html5QrCode = new Html5Qrcode("qr-reader");
      (window as any).__html5QrCode = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          await stopCamera();
          handleRedeemCoupon(decodedText);
        },
        () => {}
      );
    } catch (err: any) {
      console.error("カメラ起動エラー:", err);
      alert("❌ カメラの起動に失敗しました。");
    } finally {
      setScanLoading(false);
    }
  };

  const stopCamera = async () => {
    const html5QrCode = (window as any).__html5QrCode;
    if (html5QrCode && html5QrCode.isScanning) {
      try {
        await html5QrCode.stop();
        html5QrCode.clear();
      } catch (err) {
        console.error("カメラ停止エラー:", err);
      }
    }
    (window as any).__html5QrCode = null;
  };

  const handleRedeemCoupon = async (qrDataStr: string) => {
    try {
      setScanLoading(true);
      const parsedData = JSON.parse(qrDataStr);
      if (!parsedData.shopId || !parsedData.couponType || !parsedData.token) {
        alert('❌ 無効なクーポンQRコードです。');
        setScanOpen(false);
        return;
      }

      if (user) {
        const idToken = await user.getIdToken();
        const res = await fetch('/api/redeem-coupon', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify(parsedData),
        });

        const data = await res.json();
        if (res.ok) {
          setScanResult(`✅ 消し込み完了！\n【${data.couponTitle}】を適用しました。`);
        } else {
          alert('❌ エラー: ' + data.error);
        }
      }
    } catch (err) {
      alert('❌ QRコードの形式が正しくありません。');
    } finally {
      setScanLoading(false);
    }
  };

  // ========== 即時通知送信 ==========
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !shopId) {
      setMessage('❌ ユーザーまたは店舗IDが取得できていません');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/send-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          shopId,
          title,
          body,
          url: linkUrl || undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '送信に失敗しました');
      }

      await localDb.history.add({
        title,
        body,
        linkUrl: linkUrl || undefined,
        sentAt: new Date(),
        status: 'success',
        successCount: data.successCount || 0,
      });

      await loadHistory();

      setMessage('✨ 送信が完了しました！');
      setTitle('');
      setBody('');
      setLinkUrl('');

      setTimeout(() => setMessage(''), 3000);

    } catch (err: any) {
      console.error('送信エラー:', err);
      setMessage(`❌ エラー: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ========== 設定保存（共通） ==========
  const handleSaveSettings = async () => {
    if (!user || !shopId) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/update-shop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          shopId,
          name: shopName,
          coupon: {
            enabled: couponEnabled,
            title: couponTitle,
            description: couponDesc,
            discountRate: couponRate,
          },
          normalCoupon: {
            enabled: normalCouponEnabled,
            title: normalCouponTitle,
            description: normalCouponDesc,
          },
          loyaltyCoupon: {
            enabled: loyaltyEnabled,
            targetCount: loyaltyTargetCount,
            title: loyaltyTitle,
            expireType: loyaltyExpireType,
            combinable: loyaltyCombinable,
          },
          linkUrl: clientLinkUrl,
          iconUrl: shopIconUrl,
        }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setMessage('✅ 設定を保存しました');
        setTimeout(() => {
          setSaveSuccess(false);
          setMessage('');
        }, 3000);
      } else {
        const data = await res.json();
        throw new Error(data.error);
      }
    } catch (err: any) {
      setMessage('❌ 保存エラー: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ========== 履歴エクスポート/インポート ==========
  const handleExport = async () => {
    const json = await exportHistoryToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `push-taro-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      await importHistoryFromJSON(text);
      await loadHistory();
      alert('履歴フォルダを読み込みました！');
    } catch (err) {
      alert('インポート失敗: 不正なJSONファイルです');
    }
  };

  const handleCleanup = async () => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/cleanup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert(`✅ ${data.removed}件の古いトークンを削除しました`);
      } else {
        alert('❌ クリーンアップ失敗: ' + data.error);
      }
    } catch (err: any) {
      alert('エラー: ' + err.message);
    }
  };

  // ========== レンダリング ==========
  if (loadingAuth) {
    return (
      <main style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center' }}>
        <p>読み込み中...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main style={{ maxWidth: '400px', margin: '60px auto', padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
          <img src="/icon-192x192.png" alt="Push-taro" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
        </div>
        <h1>Push-taro</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>オーナー専用ログイン画面</p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="email"
            placeholder="メールアドレス（ログインID）"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '12px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '12px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <button
            type="submit"
            style={{ padding: '14px', background: '#ff4500', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', borderRadius: '6px', marginTop: '5px' }}
          >
            ログイン
          </button>
        </form>
      </main>
    );
  }

  const isProPlan = String(plan || '').toLowerCase().trim() === 'pro';
  const qrUrl = typeof window !== 'undefined' ? `${window.location.origin}/subscribe?s=${shopId}` : '';

  return (
    <main style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>

      {/* ヘッダー */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '10px', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {shopIconUrl ? (
            <img src={shopIconUrl} alt="アイコン" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ddd' }} />
          ) : (
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#eee' }} />
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: '24px' }}>{shopName}</h1>
              <span style={{
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '3px 8px',
                borderRadius: '12px',
                color: '#fff',
                backgroundColor: role === 'agency' ? '#8b5cf6' : isProPlan ? '#ff4500' : String(plan).toLowerCase() === 'standard' ? '#0284c7' : '#64748b'
              }}>
                {role === 'agency' ? '代理店' : `${String(plan || '').toUpperCase()} プラン`}
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>{user.email}</span>
          <button onClick={() => signOut(auth)} style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}>
            ログアウト
          </button>
        </div>
      </div>

      {/* タブナビゲーション（push / shop のみ + Proリンク） */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '1px', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('push')}
          style={{
            padding: '10px 16px',
            border: 'none',
            borderBottom: activeTab === 'push' ? '3px solid #ff4500' : '3px solid transparent',
            background: 'none',
            fontWeight: 'bold',
            color: activeTab === 'push' ? '#ff4500' : '#64748b',
            cursor: 'pointer',
            fontSize: '15px',
            whiteSpace: 'nowrap'
          }}
        >
          📢 即時通知・消し込み
        </button>

        <button
          onClick={() => setActiveTab('shop')}
          style={{
            padding: '10px 16px',
            border: 'none',
            borderBottom: activeTab === 'shop' ? '3px solid #0284c7' : '3px solid transparent',
            background: 'none',
            fontWeight: 'bold',
            color: activeTab === 'shop' ? '#0284c7' : '#64748b',
            cursor: 'pointer',
            fontSize: '15px',
            whiteSpace: 'nowrap'
          }}
        >
          🏪 店舗・基本クーポン
        </button>

        {/* Proユーザーのみ表示 */}
        {isProPlan && (
          <Link
            href="/admin/pro"
            style={{
              padding: '10px 16px',
              border: 'none',
              borderBottom: '3px solid #16a34a',
              background: 'none',
              fontWeight: 'bold',
              color: '#16a34a',
              cursor: 'pointer',
              fontSize: '15px',
              whiteSpace: 'nowrap',
              textDecoration: 'none'
            }}
          >
            🔥 Pro専用ページへ ➜
          </Link>
        )}
      </div>

      {/* ============================================================ */}
      {/* タブ①：即時通知・消し込み */}
      {/* ============================================================ */}
      {activeTab === 'push' && (
        <>
          {/* 消し込みスキャンボタン */}
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={() => {
                setScanResult(null);
                setScanOpen(true);
              }}
              style={{
                width: '100%',
                padding: '16px',
                background: '#16a34a',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              📷 クーポンQRコードを読み取る（消し込み）
            </button>
          </div>

          {/* 即時送信フォーム */}
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px', background: '#fff', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>📢 プッシュ通知を作成・即時送信</h3>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>タイトル</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="例: 新着セールのお知らせ"
                style={{ width: '100%', padding: '10px', fontSize: '16px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>本文</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={4}
                placeholder="例: 本日から全品20%OFFセール開催中！"
                style={{ width: '100%', padding: '10px', fontSize: '16px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>リンク先URL（任意）</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com/sale"
                style={{ width: '100%', padding: '10px', fontSize: '16px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '14px',
                backgroundColor: loading ? '#ccc' : '#ff4500',
                color: '#fff',
                fontWeight: 'bold',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '18px',
                borderRadius: '6px',
                marginTop: '5px',
              }}
            >
              {loading ? '送信中...' : '🔥 Push 通知送信'}
            </button>
            {message && (
              <p style={{ marginTop: '10px', fontWeight: 'bold', color: message.includes('❌') ? '#d32f2f' : '#2e7d32' }}>
                {message}
              </p>
            )}
          </form>

          {/* 配信上限ゲージ */}
          {(() => {
            if (isProPlan) {
              return (
                <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', padding: '12px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#c2410c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🔥 月間送信ステータス
                    <span style={{ fontSize: '11px', background: '#ea580c', color: '#fff', padding: '2px 8px', borderRadius: '12px' }}>PROプラン</span>
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#c2410c' }}>配信無制限</span>
                </div>
              );
            }

            const limit = String(plan).toLowerCase() === 'standard' ? 15000 : 5000;
            const currentSent = history.reduce((acc, cur) => acc + (cur.successCount || 0), 0);
            const percentage = Math.min(Math.round((currentSent / limit) * 100), 100);

            return (
              <div style={{ background: '#ebf8ff', border: '1px solid #3182ce40', borderRadius: '10px', padding: '16px 20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#2b6cb0' }}>📈 今月の送信上限使用率 ({String(plan || '').toUpperCase()}プラン)</span>
                  <span style={{ fontSize: '15px', fontWeight: '800', color: '#2b6cb0' }}>{currentSent.toLocaleString()} / {limit.toLocaleString()} 通 ({percentage}%)</span>
                </div>
                <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${percentage}%`, height: '100%', background: '#3182ce', borderRadius: '6px' }} />
                </div>
              </div>
            );
          })()}

          {/* 送信履歴 */}
          <div style={{ borderTop: '2px solid #eee', paddingTop: '20px' }}>
            <div style={{ marginBottom: '15px', padding: '12px 16px', background: '#e3f2fd', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#0d47a1' }}>📱 現在の受取許可件数</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1565c0' }}>
                {subscriberCount !== null ? `${subscriberCount} 件` : '取得中...'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>📁 送信履歴</h2>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={handleExport} style={{ padding: '8px 16px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>📤 エクスポート</button>
                <label style={{ padding: '8px 16px', background: '#2196F3', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', display: 'inline-block' }}>
                  📥 インポート
                  <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
                </label>
                <button onClick={handleCleanup} style={{ padding: '8px 16px', background: '#ff5722', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>🧹 古いトークン削除</button>
              </div>
            </div>

            {history.length === 0 ? (
              <p style={{ color: '#999' }}>履歴がありません。通知を送信するとここに表示されます。</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {history.map((h) => (
                  <div key={h.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '12px', background: h.status === 'error' ? '#fff0f0' : '#f9f9f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <strong style={{ fontSize: '16px' }}>{h.title}</strong>
                      <span style={{ fontSize: '12px', color: '#666' }}>{new Date(h.sentAt).toLocaleString('ja-JP')}</span>
                    </div>
                    <p style={{ margin: '8px 0', fontSize: '14px', color: '#333' }}>{h.body}</p>
                    {h.linkUrl && (
                      <a href={h.linkUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#2196F3', wordBreak: 'break-all', display: 'block', marginBottom: '6px' }}>{h.linkUrl}</a>
                    )}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
                      {h.status === 'success' ? (
                        <span style={{ fontSize: '11px', color: '#4CAF50', background: '#e8f5e9', padding: '2px 8px', borderRadius: '12px' }}>送信成功</span>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#d32f2f', background: '#ffebee', padding: '2px 8px', borderRadius: '12px' }}>送信失敗</span>
                      )}
                      {typeof h.successCount === 'number' && (
                        <span style={{ fontSize: '12px', color: '#555', fontWeight: 'bold' }}>（送信数: {h.successCount}件）</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ============================================================ */}
      {/* タブ②：店舗・基本クーポン */}
      {/* ============================================================ */}
      {activeTab === 'shop' && shopId && (
        <div style={{ marginBottom: '20px' }}>

          {/* 店舗基本情報 & クーポン設定（フラット表示） */}
          <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>🏪 店舗基本情報 & クーポン設定</h3>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>店舗名</label>
              <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>店舗アイコン画像</label>
              <ImageUploader onImageUploaded={(url) => setShopIconUrl(url)} currentUrl={shopIconUrl} />
            </div>

            <p style={{ fontSize: '14px', color: '#666' }}>店舗ID: <code>{shopId}</code></p>

            {qrUrl && (
              <div style={{ marginTop: '15px', textAlign: 'center', padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <QRCodeSVG value={qrUrl} size={180} />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>📱 スマホで読み取って通知を受け取れます</p>
              </div>
            )}

            {/* 初回クーポン */}
            <h4 style={{ marginTop: '25px', marginBottom: '10px', fontSize: '16px' }}>🎫 初回クーポン設定</h4>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '10px' }}>
              <input type="checkbox" checked={couponEnabled} onChange={(e) => setCouponEnabled(e.target.checked)} /> 初回クーポンを有効にする
            </label>

            {couponEnabled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                <input type="text" placeholder="クーポンタイトル" value={couponTitle} onChange={(e) => setCouponTitle(e.target.value)} style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="text" placeholder="説明文" value={couponDesc} onChange={(e) => setCouponDesc(e.target.value)} style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="number" placeholder="割引率 (%)" value={couponRate} onChange={(e) => setCouponRate(Number(e.target.value))} style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
            )}

            {/* Standard以上：通常クーポン & 特別達成クーポン */}
            {String(plan).toLowerCase() === 'standard' || isProPlan ? (
              <>
                <div style={{ marginTop: '25px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>🎟️ 通常クーポン設定</h4>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginBottom: '10px' }}>
                    <input type="checkbox" checked={normalCouponEnabled} onChange={(e) => setNormalCouponEnabled(e.target.checked)} /> 通常クーポンを有効にする
                  </label>
                  {normalCouponEnabled && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      <input type="text" placeholder="クーポンタイトル" value={normalCouponTitle} onChange={(e) => setNormalCouponTitle(e.target.value)} style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }} />
                      <textarea placeholder="説明文・利用条件" value={normalCouponDesc} onChange={(e) => setNormalCouponDesc(e.target.value)} rows={2} style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </div>
                  )}
                </div>

                <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '16px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '15px' }}>🏆 特別達成クーポン設定</h4>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>
                    <input type="checkbox" checked={loyaltyEnabled} onChange={(e) => setLoyaltyEnabled(e.target.checked)} /> 有効にする
                  </label>
                  {loyaltyEnabled && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px' }}>累計消し込み回数:</span>
                        <input type="number" min="1" value={loyaltyTargetCount} onChange={(e) => setLoyaltyTargetCount(Number(e.target.value))} style={{ width: '60px', padding: '4px' }} />
                        <span style={{ fontSize: '13px' }}>回で達成</span>
                      </div>
                      <input type="text" placeholder="特典タイトル" value={loyaltyTitle} onChange={(e) => setLoyaltyTitle(e.target.value)} style={{ width: '100%', padding: '6px' }} />
                      <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                        <select value={loyaltyExpireType} onChange={(e) => setLoyaltyExpireType(e.target.value)}>
                          <option value="none">無制限</option>
                          <option value="days">出現からN日間有効</option>
                          <option value="date">日付固定指定</option>
                        </select>
                        <label>
                          <input type="checkbox" checked={loyaltyCombinable} onChange={(e) => setLoyaltyCombinable(e.target.checked)} /> 他クーポンと併用可能
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ marginTop: '20px', padding: '12px', background: '#e2e8f0', borderRadius: '6px', fontSize: '13px', color: '#475569' }}>
                🔒 <strong>通常クーポン・特別達成クーポン機能</strong>は STANDARD プラン以上でご利用いただけます。
              </div>
            )}

            <button onClick={handleSaveSettings} disabled={saving} style={{ marginTop: '20px', padding: '12px 20px', background: saveSuccess ? '#4CAF50' : saving ? '#cccccc' : '#2196F3', color: '#fff', border: 'none', borderRadius: '4px', cursor: saving ? 'wait' : 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
              {saving ? '保存中...' : saveSuccess ? '✨ 保存しました！' : '💾 基本設定を保存'}
            </button>
          </div>

          {/* 退会エリア */}
          <div style={{ marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            {shopStatus === 'canceled' ? (
              <div style={{ background: '#fff3e0', border: '1px solid #ffe0b2', padding: '16px', borderRadius: '8px', color: '#e65100', fontWeight: 'bold', fontSize: '14px' }}>
                ⚠️ 退会手続きが完了しています。{validUntilDate ? `${validUntilDate} までご利用いただけます。` : '有効期限までご利用いただけます。'}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => router.push(`/admin/cancel?shopId=${shopId}`)}
                style={{ padding: '10px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
              >
                店舗の退会手続きを行う
              </button>
            )}
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* QRスキャンモーダル */}
      {/* ============================================================ */}
      {scanOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>📱 顧客のQRコードをスキャン</h3>

            {scanResult ? (
              <div>
                <div style={{ padding: '20px', background: '#f0fdf4', border: '2px solid #22c55e', borderRadius: '8px', color: '#15803d', fontWeight: 'bold', fontSize: '18px', whiteSpace: 'pre-line', marginBottom: '20px' }}>
                  {scanResult}
                </div>
                <button
                  onClick={async () => {
                    await stopCamera();
                    setScanResult(null);
                    setScanOpen(false);
                  }}
                  style={{ width: '100%', padding: '12px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
                >
                  閉じる
                </button>
              </div>
            ) : (
              <div>
                <div id="qr-reader" style={{ width: '100%', minHeight: '250px', background: '#1e293b', borderRadius: '8px', overflow: 'hidden', marginBottom: '15px' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={startCamera}
                    disabled={scanLoading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: scanLoading ? '#ccc' : '#16a34a',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      cursor: scanLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {scanLoading ? 'カメラ初期化中...' : '📷 カメラを起動する'}
                  </button>

                  <button
                    onClick={async () => {
                      await stopCamera();
                      setScanOpen(false);
                    }}
                    style={{ width: '100%', padding: '10px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </main>
  );
}
