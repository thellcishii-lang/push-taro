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
  const [plan, setPlan] = useState<'light' | 'standard' | 'pro' | null>(null);
  const [role, setRole] = useState<'normal' | 'pro' | 'agency'>('normal');
  const [couponEnabled, setCouponEnabled] = useState(false);
  const [couponTitle, setCouponTitle] = useState('');
  const [couponDesc, setCouponDesc] = useState('');
  const [couponRate, setCouponRate] = useState(0);
  const [clientLinkUrl, setClientLinkUrl] = useState('');
  const [shopIconUrl, setShopIconUrl] = useState('');

  // 🗂️ タブ管理ステート
  const [activeTab, setActiveTab] = useState<'push' | 'shop' | 'pro' | 'referral'>('push');

  // アップグレード展開UI用ステート
  const [upgradeExpandOpen, setUpgradeExpandOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'pro'>('standard');
  const [upgradeSubmitted, setUpgradeSubmitted] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  // 振込先口座情報（PROプラン用）
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [accountType, setAccountType] = useState<'savings' | 'checking'>('savings');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  // 送信フォーム
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // UI開閉用ステート
  const [shopInfoOpen, setShopInfoOpen] = useState(false);
  const [cronInfoOpen, setCronInfoOpen] = useState(false);

  // 自動配信（Cron）設定ステート
  const [autoBirthdayEnabled, setAutoBirthdayEnabled] = useState(true);
  const [autoDormantEnabled, setAutoDormantEnabled] = useState(true);
  const [cronLogMessage, setCronLogMessage] = useState('');
  const [cronLoading, setCronLoading] = useState(false);

  // 履歴＆受取許可件数
  const [history, setHistory] = useState<PushHistory[]>([]);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);

  // 退会ステート
  const [shopStatus, setShopStatus] = useState<string>('active');
  const [validUntilDate, setValidUntilDate] = useState<string>('');

  // 🎟️ 通常クーポン用ステート（STANDARDプラン以上）
  const [normalCouponEnabled, setNormalCouponEnabled] = useState(false);
  const [normalCouponTitle, setNormalCouponTitle] = useState('');
  const [normalCouponDesc, setNormalCouponDesc] = useState('');

  // 🏆 特別達成クーポン用ステート
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(false);
  const [loyaltyTargetCount, setLoyaltyTargetCount] = useState(3);
  const [loyaltyTitle, setLoyaltyTitle] = useState('');
  const [loyaltyExpireType, setLoyaltyExpireType] = useState('none');
  const [loyaltyCombinable, setLoyaltyCombinable] = useState(false);

  // 🔥 PRO機能用ステート
  const [stepUpEnabled, setStepUpEnabled] = useState(false);
  const [stepUpList, setStepUpList] = useState<Array<{ title: string; expireType: string; expireDays: number; combinable: boolean }>>([
    { title: '', expireType: 'days', expireDays: 7, combinable: false },
    { title: '', expireType: 'days', expireDays: 14, combinable: false },
  ]);

  const [repeatEnabled, setRepeatEnabled] = useState(false);
  const [repeatTitle, setRepeatTitle] = useState('');
  const [repeatExpireType, setRepeatExpireType] = useState('days');
  const [repeatExpireDays, setRepeatExpireDays] = useState(14);
  const [repeatCombinable, setRepeatCombinable] = useState(false);

  const [birthdayEnabled, setBirthdayEnabled] = useState(false);
  const [birthdayTitle, setBirthdayTitle] = useState('');
  const [birthdayMessage, setBirthdayMessage] = useState('');
  const [birthdayCombinable, setBirthdayCombinable] = useState(true);

  const [dormantEnabled, setDormantEnabled] = useState(false);
  const [dormantTargetDays, setDormantTargetDays] = useState(60);
  const [dormantTitle, setDormantTitle] = useState('');
  const [dormantMessage, setDormantMessage] = useState('');
  const [dormantExpireDays, setDormantExpireDays] = useState(14);
  const [dormantCombinable, setDormantCombinable] = useState(false);

  // QR code scan State 
  const [scanOpen, setScanOpen] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanLoading, setScanLoading] = useState(false);

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
              
              // プラン文字列を強制的に小文字化して保持
              if (shop?.plan) {
                const normalizedPlan = String(shop.plan).toLowerCase() as 'light' | 'standard' | 'pro';
                setPlan(normalizedPlan);
              }
              if (shop?.role) setRole(shop.role);
              if (shop?.status) setShopStatus(shop.status);
              if (shop?.validUntil) {
                const vDate = shop.validUntil._seconds ? new Date(shop.validUntil._seconds * 1000) : new Date(shop.validUntil);
                setValidUntilDate(vDate.toISOString().slice(0, 10));
              }

              if (shop?.normalCoupon) {
                setNormalCouponEnabled(shop.normalCoupon.enabled || false);
                setNormalCouponTitle(shop.normalCoupon.title || '');
                setNormalCouponDesc(shop.normalCoupon.description || '');
              }

              if (shop?.loyaltyCoupon) {
                setLoyaltyEnabled(shop.loyaltyCoupon.enabled || false);
                setLoyaltyTargetCount(shop.loyaltyCoupon.targetCount || 3);
                setLoyaltyTitle(shop.loyaltyCoupon.title || '');
                setLoyaltyExpireType(shop.loyaltyCoupon.expireType || 'none');
                setLoyaltyCombinable(shop.loyaltyCoupon.combinable || false);
              }

              if (shop?.proCoupons) {
                const pro = shop.proCoupons;
                if (pro.stepUp) {
                  setStepUpEnabled(pro.stepUp.enabled || false);
                  if (pro.stepUp.steps) setStepUpList(pro.stepUp.steps);
                }
                if (pro.repeat) {
                  setRepeatEnabled(pro.repeat.enabled || false);
                  setRepeatTitle(pro.repeat.title || '');
                  setRepeatExpireType(pro.repeat.expireType || 'days');
                  setRepeatExpireDays(pro.repeat.expireDays || 14);
                  setRepeatCombinable(pro.repeat.combinable || false);
                }
                if (pro.birthday) {
                  setBirthdayEnabled(pro.birthday.enabled || false);
                  setBirthdayTitle(pro.birthday.title || '');
                  setBirthdayMessage(pro.birthday.message || '');
                  setBirthdayCombinable(pro.birthday.combinable || false);
                }
                if (pro.dormant) {
                  setDormantEnabled(pro.dormant.enabled || false);
                  setDormantTargetDays(pro.dormant.targetDays || 60);
                  setDormantTitle(pro.dormant.title || '');
                  setDormantMessage(pro.dormant.message || '');
                  setDormantExpireDays(pro.dormant.expireDays || 14);
                  setDormantCombinable(pro.dormant.combinable || false);
                }
              }
              
              if (shop?.coupon) {
                setCouponEnabled(shop.coupon.enabled);
                setCouponTitle(shop.coupon.title || '');
                setCouponDesc(shop.coupon.description || '');
                setCouponRate(shop.coupon.discountRate || 0);
              }
              if (shop?.linkUrl) setClientLinkUrl(shop.linkUrl);
              if (shop?.iconUrl) setShopIconUrl(shop.iconUrl);

              if (shop?.bankAccount) {
                setBankName(shop.bankAccount.bankName || '');
                setBranchName(shop.bankAccount.branchName || '');
                setAccountType(shop.bankAccount.accountType || 'savings');
                setAccountNumber(shop.bankAccount.accountNumber || '');
                setAccountHolder(shop.bankAccount.accountHolder || '');
              }

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      alert('ログイン失敗: ' + err.message);
    }
  };

  const handleUpgradeStandard = async () => {
    setUpgradeLoading(true);
    try {
      if (user && shopId) {
        const idToken = await user.getIdToken();
        await fetch('/api/upgrade-request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify({ shopId, targetPlan: 'standard' }),
        });
      }
      setUpgradeSubmitted(true);
    } catch (err) {
      console.error('アップグレード申請エラー:', err);
      setUpgradeSubmitted(true);
    } finally {
      setUpgradeLoading(false);
    }
  };

  const handleProceedPro = () => {
    if (shopId) {
      router.push(`/upgrade/pro?shopId=${shopId}`);
    }
  };

  const startCamera = async () => {
    try {
      setScanLoading(true);
      const html5QrCode = new Html5Qrcode("qr-reader");
      (window as any).__html5QrCode = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        async (decodedText) => {
          await stopCamera();
          handleRedeemCoupon(decodedText);
        },
        (errorMessage) => {}
      );
    } catch (err: any) {
      console.error("カメラ起動エラー:", err);
      alert("❌ カメラの起動に失敗しました。カメラのアクセス許可を確認してください。\n" + err);
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
          proCoupons: {
            stepUp: { enabled: stepUpEnabled, steps: stepUpList },
            repeat: { enabled: repeatEnabled, title: repeatTitle, expireType: repeatExpireType, expireDays: repeatExpireDays, combinable: repeatCombinable },
            birthday: { enabled: birthdayEnabled, title: birthdayTitle, message: birthdayMessage, combinable: birthdayCombinable },
            dormant: { enabled: dormantEnabled, targetDays: dormantTargetDays, title: dormantTitle, message: dormantMessage, expireDays: dormantExpireDays, combinable: dormantCombinable },
          },
          coupon: {
            enabled: couponEnabled,
            title: couponTitle,
            description: couponDesc,
            discountRate: couponRate,
          },
          linkUrl: clientLinkUrl,
          iconUrl: shopIconUrl,
          bankAccount: {
            bankName,
            branchName,
            accountType,
            accountNumber,
            accountHolder,
          },
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

  const handleRunCron = async (type: 'birthday' | 'dormant' | 'special') => {
    if (!user) return;
    setCronLoading(true);
    setCronLogMessage('⏳ Cron処理を実行中...');
    try {
      const idToken = await user.getIdToken();
      const res = await fetch(`/api/cron/${type}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setCronLogMessage(`✅ 実行完了: ${data.message || JSON.stringify(data)}`);
      } else {
        setCronLogMessage(`❌ 実行失敗: ${data.error || 'エラーが発生しました'}`);
      }
    } catch (err: any) {
      setCronLogMessage(`❌ エラー: ${err.message}`);
    } finally {
      setCronLoading(false);
    }
  };

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
        body: JSON.stringify({ title, body, linkUrl }),
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
        successCount: data.successCount,
      });

      await loadHistory();

      setMessage('✨ 送信が完了しました。');
      setTitle('');
      setBody('');
      setLinkUrl('');

      setTimeout(() => {
        setMessage('');
      }, 3000);

    } catch (err: any) {
      console.error('送信エラー:', err);
      setMessage(`❌ エラー: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

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

  const qrUrl = typeof window !== 'undefined' ? `${window.location.origin}/subscribe?s=${shopId}` : '';
  const isProPlan = plan === 'pro';

  if (loading) {
    return <p style={{ padding: '20px', textAlign: 'center' }}>読み込み中...</p>;
  }

  return (
    <main style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      {/* ヘッダー：アイコン・店舗名・プランバッジ */}
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
                backgroundColor: role === 'agency' ? '#8b5cf6' : isProPlan ? '#ff4500' : plan === 'standard' ? '#0284c7' : '#64748b'
              }}>
                {role === 'agency' ? '代理店' : `${plan?.toUpperCase()} プラン`}
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>{user.email}</span>
          <button onClick={() => signOut(auth)} style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}>
            ログアウト
          </button>
        </div>
      </div>

      {/* 🗂️ ナビゲーションタブ（小文字判定でPROプラン時のみ特有タブを表示） */}
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
          📢 通知・消し込み
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

        {isProPlan && (
          <button
            onClick={() => setActiveTab('pro')}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderBottom: activeTab === 'pro' ? '3px solid #16a34a' : '3px solid transparent',
              background: 'none',
              fontWeight: 'bold',
              color: activeTab === 'pro' ? '#16a34a' : '#64748b',
              cursor: 'pointer',
              fontSize: '15px',
              whiteSpace: 'nowrap'
            }}
          >
            🔥 PRO機能（回数特典/ステップ）
          </button>
        )}

        {isProPlan && (
          <button
            onClick={() => setActiveTab('referral')}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderBottom: activeTab === 'referral' ? '3px solid #8b5cf6' : '3px solid transparent',
              background: 'none',
              fontWeight: 'bold',
              color: activeTab === 'referral' ? '#8b5cf6' : '#64748b',
              cursor: 'pointer',
              fontSize: '15px',
              whiteSpace: 'nowrap'
            }}
          >
            🤝 報酬・口座管理
          </button>
        )}
      </div>

      {/* 🏪 1. 店舗・基本クーポン タブの内容 */}
      {shopId && activeTab === 'shop' && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>🏪 店舗基本情報 & クーポン設定</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>店舗名</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                style={{ width: '100%', padding: '10px', fontSize: '16px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>店舗アイコン画像</label>
              <ImageUploader
                onImageUploaded={(url) => setShopIconUrl(url)}
                currentUrl={shopIconUrl}
              />
            </div>

            <p style={{ fontSize: '14px', color: '#666' }}>店舗ID: <code>{shopId}</code></p>
            
            {qrUrl && (
              <div style={{ marginTop: '15px', textAlign: 'center', padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <QRCodeSVG value={qrUrl} size={180} />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                  📱 スマホで読み取って通知を受け取れます
                </p>
                <p style={{ fontSize: '11px', color: '#999', wordBreak: 'break-all' }}>
                  {qrUrl}
                </p>
              </div>
            )}

            <h4 style={{ marginTop: '25px', marginBottom: '10px', fontSize: '16px' }}>🎫 初回クーポン設定</h4>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '10px' }}>
              <input
                type="checkbox"
                checked={couponEnabled}
                onChange={(e) => setCouponEnabled(e.target.checked)}
              />
              初回クーポンを有効にする
            </label>

            {couponEnabled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                <input
                  type="text"
                  placeholder="クーポンタイトル（例: 初回限定20%OFF）"
                  value={couponTitle}
                  onChange={(e) => setCouponTitle(e.target.value)}
                  style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <input
                  type="text"
                  placeholder="説明文"
                  value={couponDesc}
                  onChange={(e) => setCouponDesc(e.target.value)}
                  style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <input
                  type="number"
                  placeholder="割引率 (%)"
                  value={couponRate}
                  onChange={(e) => setCouponRate(Number(e.target.value))}
                  style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
            )}

            {/* 通常クーポン設定（STANDARD / PRO プラン限定） */}
            {(plan === 'standard' || isProPlan) ? (
              <>
                <div style={{ marginTop: '25px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>🎟️ 通常クーポン設定（STANDARDプラン以上）</h4>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginBottom: '10px' }}>
                    <input
                      type="checkbox"
                      checked={normalCouponEnabled}
                      onChange={(e) => setNormalCouponEnabled(e.target.checked)}
                    />
                    通常クーポンを有効にする
                  </label>

                  {normalCouponEnabled && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      <input
                        type="text"
                        placeholder="クーポンタイトル（例: 全品10%OFFクーポン）"
                        value={normalCouponTitle}
                        onChange={(e) => setNormalCouponTitle(e.target.value)}
                        style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                      <textarea
                        placeholder="説明文・利用条件"
                        value={normalCouponDesc}
                        onChange={(e) => setNormalCouponDesc(e.target.value)}
                        rows={2}
                        style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                    </div>
                  )}
                </div>

                {/* 🏆 特別達成クーポン（STANDARD / PRO） */}
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
              <div style={{ marginTop: '20px', padding: '10px', background: '#e2e8f0', borderRadius: '6px', fontSize: '12px', color: '#475569' }}>
                🔒 <strong>通常クーポン・特別達成クーポン機能</strong>は STANDARD プラン以上でご利用いただけます。
              </div>
            )}

            <button
              onClick={handleSaveSettings}
              disabled={saving}
              style={{
                marginTop: '20px',
                padding: '12px 20px',
                background: saveSuccess ? '#4CAF50' : saving ? '#cccccc' : '#2196F3',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: saving ? 'wait' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              {saving ? '保存中...' : saveSuccess ? '✨ 保存しました！' : '💾 基本設定を保存'}
            </button>

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
        </div>
      )}

      {/* 🔥 2. PRO機能タブの内容（ステップアップ・自動配信Cron設定等を全集約） */}
      {isProPlan && activeTab === 'pro' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '30px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#16a34a' }}>🔥 PROマーケティング機能設定</h2>

          {/* 🐾 1. ステップアップクーポン */}
          <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #86efac' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#166534' }}>🐾 ステップアップクーポン</h3>
            <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>
              <input type="checkbox" checked={stepUpEnabled} onChange={(e) => setStepUpEnabled(e.target.checked)} /> 有効にする
            </label>

            {stepUpEnabled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {stepUpList.map((step, index) => (
                  <div key={index} style={{ background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    <strong style={{ fontSize: '13px', color: '#166534' }}>ステップ {index + 1}</strong>
                    <input
                      type="text"
                      placeholder={`例: ${index + 1}回目来店特典`}
                      value={step.title}
                      onChange={(e) => {
                        const newList = [...stepUpList];
                        newList[index].title = e.target.value;
                        setStepUpList(newList);
                      }}
                      style={{ width: '100%', padding: '8px', margin: '6px 0', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', alignItems: 'center' }}>
                      <label>
                        有効日数: 
                        <input
                          type="number"
                          value={step.expireDays}
                          onChange={(e) => {
                            const newList = [...stepUpList];
                            newList[index].expireDays = Number(e.target.value);
                            setStepUpList(newList);
                          }}
                          style={{ width: '50px', marginLeft: '4px', padding: '2px 4px' }}
                        /> 日間
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={step.combinable}
                          onChange={(e) => {
                            const newList = [...stepUpList];
                            newList[index].combinable = e.target.checked;
                            setStepUpList(newList);
                          }}
                        /> 他クーポンと併用可能
                      </label>
                    </div>
                  </div>
                ))}

                {stepUpList.length < 10 && (
                  <button
                    type="button"
                    onClick={() => setStepUpList([...stepUpList, { title: '', expireType: 'days', expireDays: 7, combinable: false }])}
                    style={{ padding: '8px', background: '#dcfce7', border: '1px solid #86efac', color: '#166534', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    ＋ ステップを追加（最大10段階）
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 🔄 2. 連続クーポン */}
          <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px', border: '1px solid #7dd3fc' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#0369a1' }}>🔄 連続クーポン（消し込みで次回クーポン即時発効）</h3>
            <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>
              <input type="checkbox" checked={repeatEnabled} onChange={(e) => setRepeatEnabled(e.target.checked)} /> 有効にする
            </label>

            {repeatEnabled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="次回使える特典タイトル"
                  value={repeatTitle}
                  onChange={(e) => setRepeatTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', alignItems: 'center' }}>
                  <label>
                    有効日数: 
                    <input type="number" value={repeatExpireDays} onChange={(e) => setRepeatExpireDays(Number(e.target.value))} style={{ width: '50px', marginLeft: '4px', padding: '2px 4px' }} /> 日間
                  </label>
                  <label>
                    <input type="checkbox" checked={repeatCombinable} onChange={(e) => setRepeatCombinable(e.target.checked)} /> 他クーポンと併用可能
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* 🎂 3. 誕生日クーポン */}
          <div style={{ background: '#fff5f5', padding: '16px', borderRadius: '8px', border: '1px solid #feb2b2' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#9b2c2c' }}>🎂 誕生日クーポン & お祝い自動通知</h3>
            <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>
              <input type="checkbox" checked={birthdayEnabled} onChange={(e) => setBirthdayEnabled(e.target.checked)} /> 有効にする
            </label>

            {birthdayEnabled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="誕生日クーポンタイトル"
                  value={birthdayTitle}
                  onChange={(e) => setBirthdayTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <textarea
                  placeholder="お祝いメッセージ本文"
                  value={birthdayMessage}
                  onChange={(e) => setBirthdayMessage(e.target.value)}
                  rows={2}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <label style={{ fontSize: '12px' }}>
                  <input type="checkbox" checked={birthdayCombinable} onChange={(e) => setBirthdayCombinable(e.target.checked)} /> 他クーポンと併用可能
                </label>
              </div>
            )}
          </div>

          {/* 💤 4. 休眠復活クーポン */}
          <div style={{ background: '#faf5ff', padding: '16px', borderRadius: '8px', border: '1px solid #e9d5ff' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#6b21a8' }}>💤 休眠復活クーポン & お久しぶり自動通知</h3>
            <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>
              <input type="checkbox" checked={dormantEnabled} onChange={(e) => setDormantEnabled(e.target.checked)} /> 有効にする
            </label>

            {dormantEnabled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  <span>対象条件: 最終利用から</span>
                  <input type="number" value={dormantTargetDays} onChange={(e) => setDormantTargetDays(Number(e.target.value))} style={{ width: '60px', padding: '4px' }} />
                  <span>日経過した顧客</span>
                </div>
                <input
                  type="text"
                  placeholder="復帰クーポンタイトル"
                  value={dormantTitle}
                  onChange={(e) => setDormantTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <textarea
                  placeholder="お久しぶりメッセージ本文"
                  value={dormantMessage}
                  onChange={(e) => setDormantMessage(e.target.value)}
                  rows={2}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', alignItems: 'center' }}>
                  <label>
                    有効日数: 
                    <input type="number" value={dormantExpireDays} onChange={(e) => setDormantExpireDays(Number(e.target.value))} style={{ width: '50px', marginLeft: '4px', padding: '2px 4px' }} /> 日間
                  </label>
                  <label>
                    <input type="checkbox" checked={dormantCombinable} onChange={(e) => setDormantCombinable(e.target.checked)} /> 他クーポンと併用可能
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* 🤖 5. 自動配信（Cron）設定 & 手動テスト実行セクション */}
          <div style={{ background: '#f6fef9', border: '1px solid #bbf7d0', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#15803d' }}>🤖 自動配信（Cron）動作設定 & 手動テスト</h3>
            
            <div style={{ padding: '12px', background: '#e0f2fe', borderLeft: '4px solid #0284c7', borderRadius: '4px', marginBottom: '15px', color: '#0369a1', fontSize: '13px', lineHeight: '1.6' }}>
              毎日深夜にサーバー側で全自動実行されます。「テスト手動実行」ボタンで今すぐ動作確認が可能です。
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={autoBirthdayEnabled}
                  onChange={(e) => setAutoBirthdayEnabled(e.target.checked)}
                />
                🎂 誕生日自動お祝いクーポンの送信を許可
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={autoDormantEnabled}
                  onChange={(e) => setAutoDormantEnabled(e.target.checked)}
                />
                👋 休眠顧客フォローの自動送信を許可
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
              <button
                onClick={() => handleRunCron('birthday')}
                disabled={cronLoading}
                style={{ padding: '8px 14px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
              >
                🎂 誕生日判定を実行
              </button>
              <button
                onClick={() => handleRunCron('dormant')}
                disabled={cronLoading}
                style={{ padding: '8px 14px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
              >
                👋 休眠顧客判定を実行
              </button>
            </div>

            {cronLogMessage && (
              <div style={{ padding: '10px', background: '#fff', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }}>
                {cronLogMessage}
              </div>
            )}
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={saving}
            style={{
              padding: '14px 24px',
              background: saveSuccess ? '#4CAF50' : saving ? '#cccccc' : '#16a34a',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: saving ? 'wait' : 'pointer',
            }}
          >
            {saving ? '保存中...' : saveSuccess ? '✨ 保存しました！' : '💾 PRO設定を保存'}
          </button>
        </div>
      )}

      {/* 🤝 3. 報酬・口座管理タブ（PROプラン契約店舗のみ表示） */}
      {shopId && isProPlan && activeTab === 'referral' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
          
          {/* 🏦 口座設定エリア */}
          <div style={{ background: '#fff7ed', border: '1px solid #fdba74', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#c2410c' }}>
              🏦 振込先口座情報（紹介報酬受取用）
            </h3>
            <div>
              <p style={{ fontSize: '13px', color: '#ea580c', marginBottom: '15px' }}>
                ※紹介手数料（PRO特典 10%）の累計額が **10,000円** に達すると、こちらの登録口座へ自動的にお振り込みいたします。
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>金融機関名</label>
                  <input
                    type="text"
                    placeholder="例: 〇〇銀行"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>支店名</label>
                  <input
                    type="text"
                    placeholder="例: △△支店"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>預金種目</label>
                  <select
                    value={accountType}
                    onChange={(e: any) => setAccountType(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="savings">普通</option>
                    <option value="checking">当座</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>口座番号</label>
                  <input
                    type="text"
                    placeholder="1234567"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>口座名義（カナ）</label>
                  <input
                    type="text"
                    placeholder="ヤマダ タロウ"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  style={{
                    marginTop: '10px',
                    padding: '10px',
                    background: '#ea580c',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  💾 口座情報を保存
                </button>
              </div>
            </div>
          </div>

          {/* 🎁 紹介コード & 成果報酬管理 */}
          <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#c2410c' }}>
                🎁 あなたの紹介特典コード・専用URL
              </h4>
              <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#9a3412', lineHeight: '1.5' }}>
                他店舗へご紹介の際、こちらのコードまたは専用URLをご案内ください。新規店舗がご契約すると紹介報酬が発生します。
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#78350f', marginBottom: '4px' }}>
                    紹介コード
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      readOnly
                      value={shopId ? shopId.slice(0, 8).toUpperCase() : '取得中...'}
                      style={{ flex: 1, padding: '8px 12px', fontSize: '15px', fontWeight: 'bold', letterSpacing: '1px', background: '#fff', border: '1px solid #cbd5e0', borderRadius: '6px' }}
                    />
                    <button
                      onClick={() => {
                        if (shopId) {
                          navigator.clipboard.writeText(shopId.slice(0, 8).toUpperCase());
                          alert('紹介コードをコピーしました！');
                        }
                      }}
                      style={{ padding: '8px 14px', background: '#ea580c', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                    >
                      コードコピー
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#78350f', marginBottom: '4px' }}>
                    専用登録URL（紹介コード自動入力）
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      readOnly
                      value={shopId ? `${window.location.origin}/signup?ref=${shopId.slice(0, 8).toUpperCase()}` : '取得中...'}
                      style={{ flex: 1, padding: '8px 12px', fontSize: '12px', color: '#475569', background: '#fff', border: '1px solid #cbd5e0', borderRadius: '6px' }}
                    />
                    <button
                      onClick={() => {
                        if (shopId) {
                          navigator.clipboard.writeText(`${window.location.origin}/signup?ref=${shopId.slice(0, 8).toUpperCase()}`);
                          alert('紹介URLをコピーしました！');
                        }
                      }}
                      style={{ padding: '8px 14px', background: '#475569', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                    >
                      URLコピー
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>今月の報酬明細</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                  現在の適用料率: <strong>10%</strong>
                </p>
              </div>
              <button
                onClick={() => {
                  const currentMonth = new Date().toISOString().slice(0, 7);
                  window.open(`/api/referrals/export-csv?referrer_id=${shopId}&month=${currentMonth}`, '_blank');
                }}
                style={{ padding: '8px 14px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
              >
                📥 明細CSVダウンロード
              </button>
            </div>

            <h4 style={{ marginBottom: '10px', fontSize: '15px' }}>紹介経由の店舗一覧（アクティブ）</h4>
            <div style={{ background: '#fff', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
              現在、紹介しているアクティブな店舗はありません。
            </div>
          </div>

        </div>
      )}

      {/* 🚀 プラン比較・インライン展開付きアップグレード訴求カード（PRO以外のとき表示） */}
      {shopId && role !== 'agency' && !isProPlan && activeTab === 'push' && (
        <div style={{
          marginBottom: '20px',
          padding: '20px',
          background: plan === 'light' ? 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' : 'linear-gradient(135deg, #fff7ed 0%, #fffbeb 100%)',
          border: plan === 'light' ? '1px solid #bae6fd' : '1px solid #fed7aa',
          borderRadius: '12px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              {plan === 'light' ? (
                <>
                  <div style={{ fontWeight: 'bold', color: '#0369a1', fontSize: '16px', marginBottom: '4px' }}>
                    🚀 STANDARD または PRO プランへアップグレード
                  </div>
                  <div style={{ fontSize: '13px', color: '#0c4a6e' }}>
                    配信数の上限拡大や、Proプランでは紹介報酬（PRO限定 10%還元）をご利用いただけます。
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontWeight: 'bold', color: '#c2410c', fontSize: '16px', marginBottom: '4px' }}>
                    🔥 PROプランにアップグレード（紹介報酬 10%還元）
                  </div>
                  <div style={{ fontSize: '13px', color: '#78350f' }}>
                    他店舗を紹介して毎月のシステム利用料を相殺・成果報酬を獲得しましょう。
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => {
                setUpgradeExpandOpen(!upgradeExpandOpen);
                setUpgradeSubmitted(false);
              }}
              style={{
                padding: '10px 20px',
                background: plan === 'light' ? '#0284c7' : '#ea580c',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {upgradeExpandOpen ? '▲ 閉じる' : 'プラン比較・変更'}
            </button>
          </div>

          {upgradeExpandOpen && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                
                <div
                  onClick={() => setSelectedPlan('standard')}
                  style={{
                    background: '#fff',
                    padding: '18px',
                    borderRadius: '8px',
                    border: selectedPlan === 'standard' ? '2px solid #0284c7' : '1px solid #cbd5e0',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '16px', color: '#0369a1' }}>STANDARD プラン</strong>
                    <input type="radio" checked={selectedPlan === 'standard'} onChange={() => setSelectedPlan('standard')} />
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>
                    ¥3,800 <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#666' }}>/月（税別）</span>
                  </div>
                  <ul style={{ fontSize: '12px', color: '#4a5568', paddingLeft: '18px', margin: 0, lineHeight: 1.6 }}>
                    <li>月間15,000配信</li>
                    <li>LIGHTプランの３倍の配信量</li>
                    <li>クーポン機能搭載</li>
                  </ul>
                </div>

                <div
                  onClick={() => setSelectedPlan('pro')}
                  style={{
                    background: '#fff',
                    padding: '18px',
                    borderRadius: '8px',
                    border: selectedPlan === 'pro' ? '2px solid #ff4500' : '1px solid #cbd5e0',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '16px', color: '#ff4500' }}>PRO プラン</strong>
                    <input type="radio" checked={selectedPlan === 'pro'} onChange={() => setSelectedPlan('pro')} />
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>
                    ¥10,000 <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#666' }}>/月（税別）</span>
                  </div>
                  <ul style={{ fontSize: '12px', color: '#4a5568', paddingLeft: '18px', margin: 0, lineHeight: 1.6 }}>
                    <li><strong>バースデー自動配信</strong></li>
                    <li><strong>各種自動配信</strong></li>
                    <li><strong>10%紹介成果報酬還元</strong></li>
                  </ul>
                </div>

              </div>

              {selectedPlan === 'standard' ? (
                <div>
                  <button
                    onClick={handleUpgradeStandard}
                    disabled={upgradeLoading || upgradeSubmitted}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: upgradeSubmitted ? '#a0aec0' : '#0284c7',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: upgradeSubmitted ? 'default' : 'pointer'
                    }}
                  >
                    {upgradeLoading ? '処理中...' : upgradeSubmitted ? '✓ 申請完了' : 'STANDARDへアップグレードする'}
                  </button>

                  {upgradeSubmitted && (
                    <div style={{ marginTop: '15px', padding: '14px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '6px', color: '#15803d', fontSize: '14px', fontWeight: 'bold', lineHeight: 1.6, textAlign: 'center' }}>
                      アップグレードお申し込みありがとうございます。ご登録メールアドレスに詳細をお送りいたしました。ご確認ください。
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <button
                    onClick={handleProceedPro}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: '#ff4500',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    PROプラン専用の申込画面へ進む →
                  </button>
                  <p style={{ fontSize: '12px', color: '#718096', textAlign: 'center', marginTop: '8px', margin: '8px 0 0 0' }}>
                    ※PROプランは特典（紹介報酬還元・振込口座等）の手続きがあるため、専用画面にてお申込みいただきます（既存の店舗データ・顧客数は引き継がれます）。
                  </p>
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* 📷 4. 店舗用 クーポンスキャンボタン（通知タブ内） */}
      {activeTab === 'push' && (
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
      )}

      {/* 📷 スキャン用ダイアログ（モーダル） */}
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
      
      {/* 送信フォーム */}
      {activeTab === 'push' && (
        <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px', background: '#fff', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>📢 プッシュ通知を作成</h3>
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
      )}

      {/* 📊 月間送信数ゲージ */}
      {activeTab === 'push' && (() => {
        if (isProPlan) {
          return (
            <div style={{
              background: '#fff7ed',
              border: '1px solid #fed7aa',
              borderRadius: '10px',
              padding: '12px 20px',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#c2410c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🔥 月間送信ステータス
                <span style={{ fontSize: '11px', background: '#ea580c', color: '#fff', padding: '2px 8px', borderRadius: '12px' }}>
                  PROプラン
                </span>
              </span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#c2410c' }}>
                配信無制限
              </span>
            </div>
          );
        }

        const limit = plan === 'standard' ? 15000 : 5000;
        const currentSent = history.reduce((acc, cur) => acc + (cur.successCount || 0), 0);
        const percentage = Math.min(Math.round((currentSent / limit) * 100), 100);

        let gaugeColor = '#3182ce';
        let bgColor = '#ebf8ff';
        let textColor = '#2b6cb0';

        if (percentage >= 90) {
          gaugeColor = '#e53e3e';
          bgColor = '#fff5f5';
          textColor = '#c53030';
        } else if (percentage >= 70) {
          gaugeColor = '#dd6b20';
          bgColor = '#fffaf0';
          textColor = '#c05621';
        }

        return (
          <div style={{
            background: bgColor,
            border: `1px solid ${gaugeColor}40`,
            borderRadius: '10px',
            padding: '16px 20px',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: textColor, display: 'flex', alignItems: 'center', gap: '6px' }}>
                📈 今月の送信上限使用率
                <span style={{ fontSize: '11px', background: gaugeColor, color: '#fff', padding: '2px 8px', borderRadius: '12px' }}>
                  {plan?.toUpperCase()}プラン
                </span>
              </span>
              <span style={{ fontSize: '15px', fontWeight: '800', color: textColor }}>
                {currentSent.toLocaleString()} / {limit.toLocaleString()} 通 ({percentage}%)
              </span>
            </div>

            <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${percentage}%`,
                  height: '100%',
                  background: gaugeColor,
                  borderRadius: '6px',
                  transition: 'width 0.5s ease-in-out',
                }}
              />
            </div>

            {percentage >= 90 && (
              <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#e53e3e', fontWeight: 'bold' }}>
                ⚠️ 送信上限（90%超）に近づいています。上位プランへアップグレードすると上限を拡大できます。
              </p>
            )}
          </div>
        );
      })()}

      {/* 履歴セクション */}
      {activeTab === 'push' && (
        <div style={{ borderTop: '2px solid #eee', paddingTop: '20px' }}>
          <div style={{ marginBottom: '15px', padding: '12px 16px', background: '#e3f2fd', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#0d47a1' }}>📱 現在の受取許可件数</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1565c0' }}>
              {subscriberCount !== null ? `${subscriberCount} 件` : '取得中...'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ margin: 0, fontSize: '20px' }}>📁 送信履歴（ローカルフォルダ）</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={handleExport}
                style={{ padding: '8px 16px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
              >
                📤 エクスポート
              </button>
              <label
                style={{ padding: '8px 16px', background: '#2196F3', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', display: 'inline-block' }}
              >
                📥 インポート
                <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
              </label>
              <button
                onClick={handleCleanup}
                style={{ padding: '8px 16px', background: '#ff5722', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
              >
                🧹 古いトークン削除
              </button>
            </div>
          </div>

          {history.length === 0 ? (
            <p style={{ color: '#999' }}>履歴がありません。通知を送信するとここに表示されます。</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {history.map((h) => (
                <div
                  key={h.id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '12px',
                    background: h.status === 'error' ? '#fff0f0' : '#f9f9f9',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <strong style={{ fontSize: '16px' }}>{h.title}</strong>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {new Date(h.sentAt).toLocaleString('ja-JP')}
                    </span>
                  </div>
                  <p style={{ margin: '8px 0', fontSize: '14px', color: '#333' }}>{h.body}</p>
                  {h.linkUrl && (
                    <a href={h.linkUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#2196F3', wordBreak: 'break-all', display: 'block', marginBottom: '6px' }}>
                      {h.linkUrl}
                    </a>
                  )}
                  
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
                    {h.status === 'success' ? (
                      <span style={{ fontSize: '11px', color: '#4CAF50', background: '#e8f5e9', padding: '2px 8px', borderRadius: '12px' }}>
                        送信成功
                      </span>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#d32f2f', background: '#ffebee', padding: '2px 8px', borderRadius: '12px' }}>
                        送信失敗
                      </span>
                    )}
                    {typeof h.successCount === 'number' && (
                      <span style={{ fontSize: '12px', color: '#555', fontWeight: 'bold' }}>
                        （送信数: {h.successCount}件）
                      </span>
                    )}
                  </div>

                  {h.status === 'error' && h.errorMessage && (
                    <p style={{ color: '#d32f2f', fontSize: '12px', marginTop: '6px' }}>エラー: {h.errorMessage}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
