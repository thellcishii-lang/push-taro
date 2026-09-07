'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import { db as localDb, exportHistoryToJSON, importHistoryFromJSON, PushHistory } from '../../lib/db';
import ImageUploader from '../../components/ImageUploader';

export default function AdminProPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 店舗情報 & プラン・ロールステート
  const [shopId, setShopId] = useState<string | null>(null);
  const [shopName, setShopName] = useState('');
  const [plan, setPlan] = useState<'light' | 'standard' | 'pro' | string | null>(null);
  const [role, setRole] = useState<'normal' | 'pro' | 'agency'>('normal');
  const [shopIconUrl, setShopIconUrl] = useState('');

  // 送信フォーム（即時通知）← Proページでも残す
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 履歴＆受取許可件数
  const [history, setHistory] = useState<PushHistory[]>([]);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);

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

  // 📅 予約配信ステート
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

  // 🤝 報酬・口座管理ステート
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [accountType, setAccountType] = useState<'savings' | 'checking'>('savings');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  // 🗂️ タブ管理（Pro専用3タブ）
  const [activeTab, setActiveTab] = useState<'pro' | 'reserve' | 'referral'>('pro');

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
              if (shop?.iconUrl) setShopIconUrl(shop.iconUrl);

              // PRO機能の読み込み
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

              // 口座情報
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

  // ========== 保存処理 ==========
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
          iconUrl: shopIconUrl,
          proCoupons: {
            stepUp: { enabled: stepUpEnabled, steps: stepUpList },
            repeat: { enabled: repeatEnabled, title: repeatTitle, expireType: repeatExpireType, expireDays: repeatExpireDays, combinable: repeatCombinable },
            birthday: { enabled: birthdayEnabled, title: birthdayTitle, message: birthdayMessage, combinable: birthdayCombinable },
            dormant: { enabled: dormantEnabled, targetDays: dormantTargetDays, title: dormantTitle, message: dormantMessage, expireDays: dormantExpireDays, combinable: dormantCombinable },
          },
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

  // 📅 予約配信の追加
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

  const handleDeleteSchedule = (id: string) => {
    if (confirm('この予約配信を取り消して削除しますか？')) {
      setScheduledList(scheduledList.filter(item => item.id !== id));
    }
  };

  // 即時通知送信
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

  // ローディング中
  if (loadingAuth) {
    return (
      <main style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center' }}>
        <p>読み込み中...</p>
      </main>
    );
  }

  // 未認証なら /admin にリダイレクト（ログイン画面へ）
  if (!user) {
    router.push('/admin');
    return null;
  }

  const isProPlan = String(plan || '').toLowerCase().trim() === 'pro';

  // Pro以外のユーザーが直接アクセスした場合
  if (!isProPlan) {
    router.push('/admin');
    return null;
  }

  // ========== レンダリング ==========
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
                backgroundColor: '#ff4500'
              }}>
                PRO プラン
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/admin" style={{ fontSize: '13px', color: '#0284c7', textDecoration: 'none' }}>
            ← 管理画面TOPへ戻る
          </Link>
          <span style={{ fontSize: '14px', color: '#666' }}>{user.email}</span>
          <button onClick={() => signOut(auth)} style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}>
            ログアウト
          </button>
        </div>
      </div>

      {/* タブナビゲーション（Pro専用3タブ） */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '1px', overflowX: 'auto' }}>
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
          🔥 PRO機能（ステップ/回数特典）
        </button>

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
          📅 予約配信・自動配信
        </button>

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
      </div>

      {/* ============================================================ */}
      {/* タブ①：PRO機能 */}
      {/* ============================================================ */}
      {activeTab === 'pro' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '30px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#16a34a' }}>🔥 PROマーケティング機能設定</h2>

          {/* ステップアップクーポン */}
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

          {/* 連続クーポン */}
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

          {/* 誕生日クーポン */}
          <div style={{ background: '#fff5f5', padding: '16px', borderRadius: '8px', border: '1px solid #feb2b2' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#9b2c2c' }}>🎂 誕生日クーポン設定</h3>
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
              </div>
            )}
          </div>

          {/* 休眠復活クーポン */}
          <div style={{ background: '#faf5ff', padding: '16px', borderRadius: '8px', border: '1px solid #e9d5ff' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#6b21a8' }}>💤 休眠復活クーポン設定</h3>
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

      {/* ============================================================ */}
      {/* タブ②：予約配信 */}
      {/* ============================================================ */}
      {activeTab === 'reserve' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '30px' }}>

          {/* 新規予約フォーム */}
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#b45309' }}>📅 新規配信予約をセット</h3>

            <form onSubmit={handleAddSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '6px' }}>① 配信の種別</label>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <label style={{ cursor: 'pointer', fontSize: '14px' }}>
                    <input type="radio" name="reserveType" value="notification" checked={reserveType === 'notification'} onChange={() => setReserveType('notification')} /> 📢 通常通知メッセージ
                  </label>
                  <label style={{ cursor: 'pointer', fontSize: '14px' }}>
                    <input type="radio" name="reserveType" value="coupon" checked={reserveType === 'coupon'} onChange={() => setReserveType('coupon')} /> 🎫 クーポン付き通知
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '6px' }}>② 予約スケジュール形式</label>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <label style={{ cursor: 'pointer', fontSize: '14px' }}>
                    <input type="radio" name="scheduleType" value="once" checked={reserveScheduleType === 'once'} onChange={() => setReserveScheduleType('once')} /> 日付指定（1回のみ）
                  </label>
                  <label style={{ cursor: 'pointer', fontSize: '14px' }}>
                    <input type="radio" name="scheduleType" value="monthly" checked={reserveScheduleType === 'monthly'} onChange={() => setReserveScheduleType('monthly')} /> 定期予約（毎月指定日）
                  </label>
                  <label style={{ cursor: 'pointer', fontSize: '14px' }}>
                    <input type="radio" name="scheduleType" value="weekly" checked={reserveScheduleType === 'weekly'} onChange={() => setReserveScheduleType('weekly')} /> 定期予約（毎週指定曜日）
                  </label>
                </div>
              </div>

              <div style={{ background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                {reserveScheduleType === 'once' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>配信指定日</label>
                    <input type="date" value={reserveDate} onChange={(e) => setReserveDate(e.target.value)} style={{ padding: '8px', fontSize: '14px' }} />
                  </div>
                )}

                {reserveScheduleType === 'monthly' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px' }}>毎月</span>
                    <input type="number" min="1" max="31" value={reserveDayOfMonth} onChange={(e) => setReserveDayOfMonth(e.target.value)} style={{ width: '60px', padding: '6px' }} />
                    <span style={{ fontSize: '14px' }}>日に自動配信</span>
                  </div>
                )}

                {reserveScheduleType === 'weekly' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px' }}>毎週</span>
                    <select value={reserveDayOfWeek} onChange={(e) => setReserveDayOfWeek(e.target.value)} style={{ padding: '6px' }}>
                      <option value="mon">月曜日</option>
                      <option value="tue">火曜日</option>
                      <option value="wed">水曜日</option>
                      <option value="thu">木曜日</option>
                      <option value="fri">金曜日</option>
                      <option value="sat">土曜日</option>
                      <option value="sun">日曜日</option>
                    </select>
                    <span style={{ fontSize: '14px' }}>に自動配信</span>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>③ タイトル</label>
                <input
                  type="text"
                  placeholder="予約通知のタイトル"
                  value={reserveTitle}
                  onChange={(e) => setReserveTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>④ 本文</label>
                <textarea
                  placeholder="予約通知の本文"
                  value={reserveBody}
                  onChange={(e) => setReserveBody(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>リンク先URL（任意）</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={reserveLinkUrl}
                  onChange={(e) => setReserveLinkUrl(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <button
                type="submit"
                style={{ padding: '12px', background: '#d97706', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}
              >
                ➕ この内容で予約をセットする
              </button>
            </form>
          </div>

          {/* 現在の予約リスト */}
          <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>📋 現在設定されている予約配信一覧（{scheduledList.length} 件）</h3>

            {scheduledList.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', margin: '20px 0' }}>
                現在セットされている予約配信はありません。上のフォームから登録できます。
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {scheduledList.map((item) => (
                  <div key={item.id} style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', background: item.type === 'coupon' ? '#7c3aed' : '#2563eb', color: '#fff', padding: '2px 8px', borderRadius: '12px' }}>
                          {item.type === 'coupon' ? '🎫 クーポン予約' : '📢 通知予約'}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#d97706', background: '#fef3c7', padding: '2px 8px', borderRadius: '4px' }}>
                          {item.scheduleValue}
                        </span>
                      </div>
                      <strong style={{ fontSize: '15px', display: 'block', color: '#1e293b' }}>{item.title}</strong>
                      <p style={{ fontSize: '13px', color: '#475569', margin: '4px 0 0 0' }}>{item.body}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteSchedule(item.id)}
                      style={{ padding: '8px 14px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      🗑️ 予約を取り消す
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* タブ③：報酬・口座管理 */}
      {/* ============================================================ */}
      {activeTab === 'referral' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>

          {/* 口座設定エリア */}
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

          {/* 紹介コード & 明細 */}
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

    </main>
  );
}
