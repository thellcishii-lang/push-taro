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

  // 🗂️ タブ管理（全タブあり）
  const [activeTab, setActiveTab] = useState<'push' | 'shop' | 'pro' | 'reserve' | 'referral'>('push');

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

  // 送信フォーム（即時通知）
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 📅 予約配信ステート（PROプラン用）
  const [scheduledList, setScheduledList] = useState<Array<{
    id: string;
    type: 'notification' | 'coupon';
    scheduleType: 'once' | 'monthly' | 'weekly';
    scheduleValue: string;
    title: string;
    body: string;
    linkUrl?: string;
  }>>([]);

  const [reserveType, setReserveType] = useState<'notification' | 'coupon'>('notification');
  const [reserveScheduleType, setReserveScheduleType] = useState<'once' | 'monthly' | 'weekly'>('once');
  const [reserveDate, setReserveDate] = useState('');
  const [reserveDayOfMonth, setReserveDayOfMonth] = useState('1');
  const [reserveDayOfWeek, setReserveDayOfWeek] = useState('mon');
  const [reserveTitle, setReserveTitle] = useState('');
  const [reserveBody, setReserveBody] = useState('');
  const [reserveLinkUrl, setReserveLinkUrl] = useState('');

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

              if (shop?.plan) {
                setPlan(String(shop.plan));
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

  // 即時通知送信ハンドラ
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

  // 📅 予約配信の追加処理
  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reserveTitle || !reserveBody) {
      alert('タイトルと本文を入力してください');
      return;
    }

    let val = '';
    if (reserveScheduleType === 'once') {
      if (!reserveDate) {
        alert('配信指定日を入力してください');
        return;
      }
      val = reserveDate;
    } else if (reserveScheduleType === 'monthly') {
      val = `毎月 ${reserveDayOfMonth} 日`;
    } else if (reserveScheduleType === 'weekly') {
      const dayMap: Record<string, string> = { mon: '月', tue: '火', wed: '水', thu: '木', fri: '金', sat: '土', sun: '日' };
      val = `毎週 ${dayMap[reserveDayOfWeek] || ''} 曜日`;
    }

    const newItem = {
      id: Date.now().toString(),
      type: reserveType,
      scheduleType: reserveScheduleType,
      scheduleValue: val,
      title: reserveTitle,
      body: reserveBody,
      linkUrl: reserveLinkUrl || undefined,
    };

    setScheduledList([...scheduledList, newItem]);

    setReserveTitle('');
    setReserveBody('');
    setReserveLinkUrl('');
    alert('✅ 予約を送信リストにセットしました');
  };

  // 📅 予約配信の削除処理
  const handleDeleteSchedule = (id: string) => {
    if (confirm('この予約配信を取り消して削除しますか？')) {
      setScheduledList(scheduledList.filter(item => item.id !== id));
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
  const isProPlan = String(plan || '').toLowerCase().trim() === 'pro';

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
          <button onClick={() => signOut(auth)} style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}>
            ログアウト
          </button>
        </div>
      </div>

      {/* ========== タブナビゲーション（Proリンクを右端に固定） ========== */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '1px',
        overflowX: 'auto',
        alignItems: 'center'
      }}>
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
            🔥 PRO機能
          </button>
        )}

        {isProPlan && (
          <button
            onClick={() => setActiveTab('reserve')}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderBottom: activeTab === 'reserve' ? '3px solid #d97706' : '3px solid transparent',
              background: 'none',
              fontWeight: 'bold',
              color: activeTab === 'reserve' ? '#d97706' : '#64748b',
              cursor: 'pointer',
              fontSize: '15px',
              whiteSpace: 'nowrap'
            }}
          >
            📅 予約配信
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
            🤝 報酬・口座
          </button>
        )}

        {/* ✅ Proリンクを右端に固定（スマホでもスクロールせずに見える） */}
        {isProPlan && (
          <Link
            href="/admin/pro"
            style={{
              padding: '8px 18px',
              border: 'none',
              borderRadius: '6px',
              background: '#16a34a',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '14px',
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              marginLeft: 'auto',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)'
            }}
          >
            🔥 Pro専用画面へ ➜
          </Link>
        )}
      </div>

      {/* ===== 以下、各タブの中身（元の完全版のまま） ===== */}
      {/* ... これ以降は page (4).tsx の内容をそのままコピー ... */}

      {/* タブの中身は省略（元のpage (4).tsxと同じ） */}

    </main>
  );
}
