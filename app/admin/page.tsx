'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../../lib/firebase-client';
import { db as localDb, exportHistoryToJSON, importHistoryFromJSON, PushHistory } from '../../lib/db';
import { QRCodeSVG } from 'qrcode.react';
import ImageUploader from '../../components/ImageUploader';

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
  const [plan, setPlan] = useState<'light' | 'standard' | 'pro'>('light');
  const [role, setRole] = useState<'normal' | 'pro' | 'agency'>('normal');
  const [couponEnabled, setCouponEnabled] = useState(false);
  const [couponTitle, setCouponTitle] = useState('');
  const [couponDesc, setCouponDesc] = useState('');
  const [couponRate, setCouponRate] = useState(0);
  const [clientLinkUrl, setClientLinkUrl] = useState('');
  const [shopIconUrl, setShopIconUrl] = useState('');

  // アップグレード展開UI用ステート
  const [upgradeExpandOpen, setUpgradeExpandOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'pro'>('standard');
  const [upgradeSubmitted, setUpgradeSubmitted] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  // 振込先口座情報（Proプラン用）
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
  const [referralInfoOpen, setReferralInfoOpen] = useState(false);
  const [bankInfoOpen, setBankInfoOpen] = useState(false);
  const [cronInfoOpen, setCronInfoOpen] = useState(false);

  // 自動配信（Cron）設定ステート
  const [autoBirthdayEnabled, setAutoBirthdayEnabled] = useState(true);
  const [autoDormantEnabled, setAutoDormantEnabled] = useState(true);
  const [cronLogMessage, setCronLogMessage] = useState('');
  const [cronLoading, setCronLoading] = useState(false);

  // 履歴＆受取許可件数
  const [history, setHistory] = useState<PushHistory[]>([]);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);

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
            body: JSON.stringify({ name: u.email?.split('@')[0] || '未設定の店舗' }),
          });
          const data = await res.json();
          if (data.success) {
            const currentShopId = data.shopId;
            setShopId(currentShopId);
            setShopName(data.shop?.name || '');
            if (data.shop?.plan) setPlan(data.shop.plan);
            if (data.shop?.role) setRole(data.shop.role);

            if (data.shop?.coupon) {
              setCouponEnabled(data.shop.coupon.enabled);
              setCouponTitle(data.shop.coupon.title || '');
              setCouponDesc(data.shop.coupon.description || '');
              setCouponRate(data.shop.coupon.discountRate || 0);
            }
            if (data.shop?.linkUrl) setClientLinkUrl(data.shop.linkUrl);
            if (data.shop?.iconUrl) setShopIconUrl(data.shop.iconUrl);

            if (data.shop?.bankAccount) {
              setBankName(data.shop.bankAccount.bankName || '');
              setBranchName(data.shop.bankAccount.branchName || '');
              setAccountType(data.shop.bankAccount.accountType || 'savings');
              setAccountNumber(data.shop.bankAccount.accountNumber || '');
              setAccountHolder(data.shop.bankAccount.accountHolder || '');
            }

            const dashRes = await fetch(`/api/admin/dashboard?shopId=${currentShopId}`);
            if (dashRes.ok) {
              const dashData = await dashRes.json();
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

  // STANDARDプランへのインラインアップグレード処理
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
      setUpgradeSubmitted(true); // エラー時も送信案内を表示
    } finally {
      setUpgradeLoading(false);
    }
  };

  // PROプランへ進む場合のハンドラー（PRO専用申込画面へ遷移）
  const handleProceedPro = () => {
    if (shopId) {
      router.push(`/upgrade/pro?shopId=${shopId}`);
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
          <img src="/icon-192x192.png" alt="プッシュ太郎" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
        </div>
        <h1>プッシュ太郎</h1>
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

  const qrUrl = shopId ? `https://push-taro.com/?s=${shopId}` : '';

  return (
    <main style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      {/* ヘッダー：アイコン・店舗名・プランバッジ（上部アップグレードボタン削除済み） */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '10px', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={shopIconUrl || "/icon-192x192.png"} alt="アイコン" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ddd' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: '24px' }}>{shopName || 'プッシュ太郎'}</h1>
              <span style={{
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '3px 8px',
                borderRadius: '12px',
                color: '#fff',
                backgroundColor: role === 'agency' ? '#8b5cf6' : plan === 'pro' ? '#ff4500' : plan === 'standard' ? '#0284c7' : '#64748b'
              }}>
                {role === 'agency' ? '代理店' : `${plan.toUpperCase()} プラン`}
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

      {/* 🏪 店舗情報ボタン */}
      {shopId && (
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setShopInfoOpen(!shopInfoOpen)}
            style={{ width: '100%', padding: '14px 20px', background: '#f8f9fa', border: '1px solid #ced4da', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>🏪 店舗情報・QRコード設定</span>
            <span>{shopInfoOpen ? '▲ 閉じる' : '▼ 展開する'}</span>
          </button>

          {shopInfoOpen && (
            <div style={{ marginTop: '10px', padding: '20px', background: '#f5f5f5', borderRadius: '8px', border: '1px solid #e9ecef' }}>
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
                <div style={{ marginTop: '15px', textAlign: 'center', padding: '15px', background: '#fff', borderRadius: '8px' }}>
                  <QRCodeSVG value={qrUrl} size={180} />
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                    📱 スマホで読み取って通知を受け取れます
                  </p>
                  <p style={{ fontSize: '11px', color: '#999', wordBreak: 'break-all' }}>
                    {qrUrl}
                  </p>
                </div>
              )}

              <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>🎫 初回クーポン設定</h4>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '10px' }}>
                <input
                  type="checkbox"
                  checked={couponEnabled}
                  onChange={(e) => setCouponEnabled(e.target.checked)}
                />
                初回クーポンを有効にする
              </label>

              {couponEnabled && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
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

              <button
                onClick={handleSaveSettings}
                disabled={saving}
                style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  background: saveSuccess ? '#4CAF50' : saving ? '#cccccc' : '#2196F3',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: saving ? 'wait' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                {saving ? '保存中...' : saveSuccess ? '✨ 保存しました！' : '💾 設定を保存'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 🤖 自動配信（Cron）設定 & 手動実行セクション */}
      {shopId && (plan === 'pro' || role === 'agency') && (
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setCronInfoOpen(!cronInfoOpen)}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: '#f0fdf4',
              border: '1px solid #86efac',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>🤖 自動配信（Cron）設定 & 手動実行</span>
            <span>{cronInfoOpen ? '▲ 閉じる' : '▼ 展開する'}</span>
          </button>

          {cronInfoOpen && (
            <div style={{ marginTop: '10px', padding: '20px', background: '#f6fef9', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <div style={{ padding: '12px 16px', background: '#e0f2fe', borderLeft: '4px solid #0284c7', borderRadius: '4px', marginBottom: '20px', color: '#0369a1', fontSize: '13px', lineHeight: '1.6' }}>
                <p style={{ margin: '0 0 6px 0', fontWeight: 'bold', fontSize: '14px' }}>
                  💡 自動配信（Cron処理）について
                </p>
                <p style={{ margin: 0 }}>
                  本機能は、設定された条件（誕生日・最終来店日・契約ステータス等）に基づいて毎日深夜にサーバー側で全自動実行されます。<br />
                  各配信の有効/無効の切り替えのほか、下の「テスト手動実行」ボタンを押すことで、定期配信時間を待たずに今すぐ動作確認を行うことができます。
                </p>
              </div>

              <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>⚙️ 自動配信機能のオン/オフ</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={autoBirthdayEnabled}
                    onChange={(e) => setAutoBirthdayEnabled(e.target.checked)}
                  />
                  🎂 誕生日自動お祝いクーポンの送信
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={autoDormantEnabled}
                    onChange={(e) => setAutoDormantEnabled(e.target.checked)}
                  />
                  👋 休眠顧客（60日未来店）フォローの自動送信
                </label>
              </div>

              <h4 style={{ margin: '15px 0 10px 0', fontSize: '16px' }}>⚡️ テスト手動実行（動作確認用）</h4>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
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
                <button
                  onClick={() => handleRunCron('special')}
                  disabled={cronLoading}
                  style={{ padding: '8px 14px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                >
                  ⚠️ 猶予期限チェックを実行
                </button>
              </div>

              {cronLogMessage && (
                <div style={{ padding: '10px 14px', background: '#fff', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px', fontWeight: 'bold' }}>
                  {cronLogMessage}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 🏦 報酬お振り込み口座設定（Proプラン専用） */}
      {shopId && plan === 'pro' && (
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setBankInfoOpen(!bankInfoOpen)}
            style={{ width: '100%', padding: '14px 20px', background: '#fff7ed', border: '1px solid #fdba74', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>🏦 紹介報酬受取 口座情報（Proプラン特典: 10%還元）</span>
            <span>{bankInfoOpen ? '▲ 閉じる' : '▼ 展開する'}</span>
          </button>

          {bankInfoOpen && (
            <div style={{ marginTop: '10px', padding: '20px', background: '#fffdfb', borderRadius: '8px', border: '1px solid #fed7aa' }}>
              {role === 'agency' ? (
                <div style={{ padding: '15px', background: '#f3e8ff', border: '1px solid #d8b4fe', borderRadius: '6px', color: '#581c87' }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>🤝 代理店アカウント統合中</h4>
                  <p style={{ margin: 0, fontSize: '14px' }}>
                    代理店アカウントへの昇格に伴い、紹介報酬は30%へ引き上げられ、毎月のシステム利用料とのまとめて請求・相殺管理へ移行しました（個別自動振込は停止されています）。
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '13px', color: '#ea580c', marginBottom: '15px' }}>
                    ※紹介手数料（10%）の累計額が **10,000円** に達すると、登録された口座へ自動的にお振り込みいたします。
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>金融機関名</label>
                      <input
                        type="text"
                        placeholder="例: 〇〇銀行"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>支店名</label>
                      <input
                        type="text"
                        placeholder="例: △△支店"
                        value={branchName}
                        onChange={(e) => setBranchName(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>預金種目</label>
                      <select
                        value={accountType}
                        onChange={(e: any) => setAccountType(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                      >
                        <option value="savings">普通</option>
                        <option value="checking">当座</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>口座番号</label>
                      <input
                        type="text"
                        placeholder="1234567"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>口座名義（カナ）</label>
                      <input
                        type="text"
                        placeholder="ヤマダ タロウ"
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
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
                      口座情報を保存
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 🚀 プラン比較・インライン展開付きアップグレード訴求カード */}
      {shopId && role !== 'agency' && plan !== 'pro' && (
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

          {/* 🔽 ボタン押下で下に展開される比較・選択エリア */}
          {upgradeExpandOpen && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                
                {/* STANDARDカード */}
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

                {/* PROカード */}
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

              {/* ボタン表示エリア */}
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

                  {/* 登録完了メッセージ */}
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

      {/* 🤝 紹介・代理店 報酬管理セクション (PROプランまたは代理店アカウントのみ表示) */}
      {shopId && (plan === 'pro' || role === 'agency') && (
        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={() => setReferralInfoOpen(!referralInfoOpen)}
            style={{ width: '100%', padding: '14px 20px', background: '#f0f4f8', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>🤝 紹介・代理店 報酬管理</span>
            <span>{referralInfoOpen ? '▲ 閉じる' : '▼ 展開する'}</span>
          </button>

          {referralInfoOpen && (
            <div style={{ marginTop: '10px', padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>今月の報酬明細</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                    現在の適用料率: <strong>{role === 'agency' ? '30%' : '10%'}</strong>
                  </p>
                </div>
                <button
                  onClick={() => {
                    const currentMonth = new Date().toISOString().slice(0, 7);
                    window.open(`/api/referrals/export-csv?referrer_id=${shopId}&month=${currentMonth}`, '_blank');
                  }}
                  style={{ padding: '10px 16px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                >
                  📥 明細CSVダウンロード
                </button>
              </div>

              <h4 style={{ marginBottom: '10px', fontSize: '16px' }}>紹介経由の店舗一覧（アクティブ）</h4>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>
                ※紹介された店舗が解約（離脱）すると、この一覧から自動的に非表示になります。
              </p>

              <div style={{ background: '#fff', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
                現在、紹介しているアクティブな店舗はありません。
              </div>
            </div>
          )}
        </div>
      )}

      {/* 送信フォーム */}
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

     {/* 📊 月間送信数ゲージ（LIGHT・STANDARDプランのみ表示） */}
{(() => {
  // adminページ内で定義されている店舗データの変数を安全に参照
  const currentShop = (typeof shopData !== 'undefined' ? shopData : null) 
    || (typeof shop !== 'undefined' ? shop : null) 
    || (typeof shopInfo !== 'undefined' ? shopInfo : null);

  const plan = currentShop?.plan || 'light';

  // PROプランの場合はゲージを表示しない（専用バッジのみ）
  if (plan === 'pro') {
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
          今月の送信数: {(currentShop?.currentMonthSent || 0).toLocaleString()} 通（配信無制限）
        </span>
      </div>
    );
  }

  // LIGHT（5,000通）/ STANDARD（15,000通）のみゲージを表示
  const limit = currentShop?.monthlyLimit || (plan === 'standard' ? 15000 : 5000);
  const currentSent = currentShop?.currentMonthSent || 0;
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
            {plan.toUpperCase()}プラン
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
    </main>
  );
}
