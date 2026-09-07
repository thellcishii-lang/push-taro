'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import { db as localDb, PushHistory } from '@/lib/db'; // ✅ パス修正

export default function AdminProPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [shopId, setShopId] = useState<string | null>(null);
  const [shopName, setShopName] = useState('');
  const [plan, setPlan] = useState<string | null>(null);
  const [shopIconUrl, setShopIconUrl] = useState('');

  // PRO機能用
  const [stepUpEnabled, setStepUpEnabled] = useState(false);
  const [stepUpList, setStepUpList] = useState<Array<{ title: string; expireType: string; expireDays: number; combinable: boolean }>>([
    { title: '', expireType: 'days', expireDays: 7, combinable: false },
    { title: '', expireType: 'days', expireDays: 14, combinable: false },
  ]);
  const [repeatEnabled, setRepeatEnabled] = useState(false);
  const [repeatTitle, setRepeatTitle] = useState('');
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

  // 予約配信
  const [scheduledList, setScheduledList] = useState<any[]>([]);
  const [reserveType, setReserveType] = useState<'notification' | 'coupon'>('notification');
  const [reserveScheduleType, setReserveScheduleType] = useState<'once' | 'monthly' | 'weekly'>('once');
  const [reserveDate, setReserveDate] = useState('');
  const [reserveDayOfMonth, setReserveDayOfMonth] = useState('1');
  const [reserveDayOfWeek, setReserveDayOfWeek] = useState('mon');
  const [reserveTitle, setReserveTitle] = useState('');
  const [reserveBody, setReserveBody] = useState('');
  const [reserveLinkUrl, setReserveLinkUrl] = useState('');

  // 報酬・口座
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [accountType, setAccountType] = useState<'savings' | 'checking'>('savings');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  const [activeTab, setActiveTab] = useState<'pro' | 'reserve' | 'referral'>('pro');
  const [message, setMessage] = useState('');

  // ========== 認証 & データ取得 ==========
  useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (u) => {
    setUser(u);
    setLoadingAuth(false);

    if (u) {
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
            
            // ✅ ここで plan を確実にセット
            if (shop?.plan) {
                 setPlan(String(shop.plan));
                 console.log('📦 [pro/page] shop.plan:', shop.plan);
　　　　　　　　　　　　　　　　　　　　　　　　　　　　　}

            if (shop?.iconUrl) setShopIconUrl(shop.iconUrl);

            // 以下、proCoupons, bankAccount などの読み込み...
          }
        }
      } catch (err) {
        console.error('店舗情報取得エラー:', err);
      }
    }
  });

  return () => unsub();
}, []);

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
            repeat: { enabled: repeatEnabled, title: repeatTitle, expireType: 'days', expireDays: repeatExpireDays, combinable: repeatCombinable },
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
        setTimeout(() => { setSaveSuccess(false); setMessage(''); }, 3000);
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

  // ========== 予約配信 ==========
  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reserveTitle || !reserveBody) {
      alert('タイトルと本文を入力してください');
      return;
    }

    let val = '';
    if (reserveScheduleType === 'once') {
      if (!reserveDate) { alert('配信指定日を入力してください'); return; }
      val = reserveDate;
    } else if (reserveScheduleType === 'monthly') {
      val = `毎月 ${reserveDayOfMonth} 日`;
    } else {
      const dayMap: Record<string, string> = { mon: '月', tue: '火', wed: '水', thu: '木', fri: '金', sat: '土', sun: '日' };
      val = `毎週 ${dayMap[reserveDayOfWeek] || ''} 曜日`;
    }

    setScheduledList([...scheduledList, {
      id: Date.now().toString(),
      type: reserveType,
      scheduleType: reserveScheduleType,
      scheduleValue: val,
      title: reserveTitle,
      body: reserveBody,
      linkUrl: reserveLinkUrl || undefined,
    }]);
    setReserveTitle('');
    setReserveBody('');
    setReserveLinkUrl('');
    alert('✅ 予約をセットしました');
  };

  const handleDeleteSchedule = (id: string) => {
    if (confirm('この予約を取り消しますか？')) {
      setScheduledList(scheduledList.filter(item => item.id !== id));
    }
  };

  // ========== レンダリング ==========
  if (loadingAuth) {
    return <main style={{ padding: 40, textAlign: 'center' }}>読み込み中...</main>;
  }

  if (!user) {
    router.push('/admin');
    return null;
  }

  const isProPlan = String(plan || '').toLowerCase().trim() === 'pro';
  if (!isProPlan) {
    router.push('/admin');
    return null;
  }

  return (
    <main style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>

      {/* ヘッダー */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {shopIconUrl ? (
            <img src={shopIconUrl} alt="アイコン" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#eee' }} />
          )}
          <div>
            <h1 style={{ margin: 0, fontSize: '24px' }}>{shopName}</h1>
            <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '12px', color: '#fff', background: '#ff4500' }}>PRO プラン</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/admin" style={{ fontSize: '13px', color: '#0284c7', textDecoration: 'none' }}>← 管理画面TOPへ戻る</Link>
          <span style={{ fontSize: '14px', color: '#666' }}>{user.email}</span>
          <button onClick={() => signOut(auth)} style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}>ログアウト</button>
        </div>
      </div>

      {/* タブ */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '1px' }}>
        <button onClick={() => setActiveTab('pro')} style={{ padding: '10px 16px', border: 'none', borderBottom: activeTab === 'pro' ? '3px solid #16a34a' : '3px solid transparent', background: 'none', fontWeight: 'bold', color: activeTab === 'pro' ? '#16a34a' : '#64748b', cursor: 'pointer' }}>🔥 PRO機能</button>
        <button onClick={() => setActiveTab('reserve')} style={{ padding: '10px 16px', border: 'none', borderBottom: activeTab === 'reserve' ? '3px solid #d97706' : '3px solid transparent', background: 'none', fontWeight: 'bold', color: activeTab === 'reserve' ? '#d97706' : '#64748b', cursor: 'pointer' }}>📅 予約配信</button>
        <button onClick={() => setActiveTab('referral')} style={{ padding: '10px 16px', border: 'none', borderBottom: activeTab === 'referral' ? '3px solid #8b5cf6' : '3px solid transparent', background: 'none', fontWeight: 'bold', color: activeTab === 'referral' ? '#8b5cf6' : '#64748b', cursor: 'pointer' }}>🤝 報酬・口座</button>
      </div>

      {/* ===== PRO機能 ===== */}
      {activeTab === 'pro' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2 style={{ fontSize: '20px', color: '#16a34a' }}>🔥 PROマーケティング機能</h2>

          <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #86efac' }}>
            <h3>🐾 ステップアップクーポン</h3>
            <label><input type="checkbox" checked={stepUpEnabled} onChange={(e) => setStepUpEnabled(e.target.checked)} /> 有効にする</label>
            {stepUpEnabled && stepUpList.map((step, i) => (
              <div key={i} style={{ background: '#fff', padding: '12px', marginTop: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                <strong>ステップ {i+1}</strong>
                <input type="text" value={step.title} onChange={(e) => { const list = [...stepUpList]; list[i].title = e.target.value; setStepUpList(list); }} placeholder="特典タイトル" style={{ width: '100%', padding: '6px', margin: '4px 0' }} />
                <label>有効日数: <input type="number" value={step.expireDays} onChange={(e) => { const list = [...stepUpList]; list[i].expireDays = Number(e.target.value); setStepUpList(list); }} style={{ width: '60px' }} /> 日</label>
                <label><input type="checkbox" checked={step.combinable} onChange={(e) => { const list = [...stepUpList]; list[i].combinable = e.target.checked; setStepUpList(list); }} /> 併用可</label>
              </div>
            ))}
            {stepUpList.length < 10 && <button onClick={() => setStepUpList([...stepUpList, { title: '', expireType: 'days', expireDays: 7, combinable: false }])}>＋ ステップ追加</button>}
          </div>

          <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px', border: '1px solid #7dd3fc' }}>
            <h3>🔄 連続クーポン</h3>
            <label><input type="checkbox" checked={repeatEnabled} onChange={(e) => setRepeatEnabled(e.target.checked)} /> 有効にする</label>
            {repeatEnabled && (
              <>
                <input type="text" placeholder="特典タイトル" value={repeatTitle} onChange={(e) => setRepeatTitle(e.target.value)} style={{ width: '100%', padding: '8px', margin: '8px 0' }} />
                <label>有効日数: <input type="number" value={repeatExpireDays} onChange={(e) => setRepeatExpireDays(Number(e.target.value))} style={{ width: '60px' }} /> 日</label>
                <label><input type="checkbox" checked={repeatCombinable} onChange={(e) => setRepeatCombinable(e.target.checked)} /> 併用可</label>
              </>
            )}
          </div>

          <div style={{ background: '#fff5f5', padding: '16px', borderRadius: '8px', border: '1px solid #feb2b2' }}>
            <h3>🎂 誕生日クーポン</h3>
            <label><input type="checkbox" checked={birthdayEnabled} onChange={(e) => setBirthdayEnabled(e.target.checked)} /> 有効にする</label>
            {birthdayEnabled && (
              <>
                <input type="text" placeholder="タイトル" value={birthdayTitle} onChange={(e) => setBirthdayTitle(e.target.value)} style={{ width: '100%', padding: '8px', margin: '8px 0' }} />
                <textarea placeholder="メッセージ" value={birthdayMessage} onChange={(e) => setBirthdayMessage(e.target.value)} rows={2} style={{ width: '100%', padding: '8px' }} />
              </>
            )}
          </div>

          <div style={{ background: '#faf5ff', padding: '16px', borderRadius: '8px', border: '1px solid #e9d5ff' }}>
            <h3>💤 休眠復活クーポン</h3>
            <label><input type="checkbox" checked={dormantEnabled} onChange={(e) => setDormantEnabled(e.target.checked)} /> 有効にする</label>
            {dormantEnabled && (
              <>
                <div><span>最終利用から</span><input type="number" value={dormantTargetDays} onChange={(e) => setDormantTargetDays(Number(e.target.value))} style={{ width: '60px' }} /> 日経過</div>
                <input type="text" placeholder="タイトル" value={dormantTitle} onChange={(e) => setDormantTitle(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                <textarea placeholder="メッセージ" value={dormantMessage} onChange={(e) => setDormantMessage(e.target.value)} rows={2} style={{ width: '100%', padding: '8px' }} />
              </>
            )}
          </div>

          <button onClick={handleSaveSettings} disabled={saving} style={{ padding: '14px', background: saveSuccess ? '#4CAF50' : '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            {saving ? '保存中...' : saveSuccess ? '✅ 保存完了' : '💾 PRO設定を保存'}
          </button>
        </div>
      )}

      {/* ===== 予約配信 ===== */}
      {activeTab === 'reserve' && (
        <div>
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '20px', borderRadius: '8px' }}>
            <h3>📅 新規予約</h3>
            <form onSubmit={handleAddSchedule}>
              <div><label>種別</label>
                <label><input type="radio" name="rt" value="notification" checked={reserveType === 'notification'} onChange={() => setReserveType('notification')} /> 通知</label>
                <label><input type="radio" name="rt" value="coupon" checked={reserveType === 'coupon'} onChange={() => setReserveType('coupon')} /> クーポン</label>
              </div>
              <div>
                <label><input type="radio" name="st" value="once" checked={reserveScheduleType === 'once'} onChange={() => setReserveScheduleType('once')} /> 日付指定</label>
                <label><input type="radio" name="st" value="monthly" checked={reserveScheduleType === 'monthly'} onChange={() => setReserveScheduleType('monthly')} /> 毎月</label>
                <label><input type="radio" name="st" value="weekly" checked={reserveScheduleType === 'weekly'} onChange={() => setReserveScheduleType('weekly')} /> 毎週</label>
              </div>
              {reserveScheduleType === 'once' && <input type="date" value={reserveDate} onChange={(e) => setReserveDate(e.target.value)} />}
              {reserveScheduleType === 'monthly' && <><span>毎月</span><input type="number" min="1" max="31" value={reserveDayOfMonth} onChange={(e) => setReserveDayOfMonth(e.target.value)} style={{ width: '60px' }} /><span>日</span></>}
              {reserveScheduleType === 'weekly' && <select value={reserveDayOfWeek} onChange={(e) => setReserveDayOfWeek(e.target.value)}><option value="mon">月</option><option value="tue">火</option><option value="wed">水</option><option value="thu">木</option><option value="fri">金</option><option value="sat">土</option><option value="sun">日</option></select>}
              <input type="text" placeholder="タイトル" value={reserveTitle} onChange={(e) => setReserveTitle(e.target.value)} style={{ width: '100%', padding: '8px', margin: '8px 0' }} />
              <textarea placeholder="本文" value={reserveBody} onChange={(e) => setReserveBody(e.target.value)} rows={3} style={{ width: '100%', padding: '8px' }} />
              <input type="url" placeholder="リンクURL（任意）" value={reserveLinkUrl} onChange={(e) => setReserveLinkUrl(e.target.value)} style={{ width: '100%', padding: '8px' }} />
              <button type="submit" style={{ padding: '12px', background: '#d97706', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>予約をセット</button>
            </form>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>予約一覧（{scheduledList.length}件）</h3>
            {scheduledList.length === 0 ? <p>予約はありません</p> : scheduledList.map(item => (
              <div key={item.id} style={{ border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px', marginBottom: '8px' }}>
                <strong>{item.title}</strong> <span style={{ fontSize: '12px', background: '#fef3c7', padding: '2px 8px', borderRadius: '4px' }}>{item.scheduleValue}</span>
                <p>{item.body}</p>
                <button onClick={() => handleDeleteSchedule(item.id)} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer' }}>削除</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== 報酬・口座 ===== */}
      {activeTab === 'referral' && (
        <div>
          <div style={{ background: '#fff7ed', border: '1px solid #fdba74', padding: '20px', borderRadius: '8px' }}>
            <h3>🏦 振込先口座情報</h3>
            <p>累計報酬が10,000円に達すると自動振込</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="金融機関名" value={bankName} onChange={(e) => setBankName(e.target.value)} style={{ padding: '8px' }} />
              <input type="text" placeholder="支店名" value={branchName} onChange={(e) => setBranchName(e.target.value)} style={{ padding: '8px' }} />
              <select value={accountType} onChange={(e) => setAccountType(e.target.value as any)} style={{ padding: '8px' }}><option value="savings">普通</option><option value="checking">当座</option></select>
              <input type="text" placeholder="口座番号" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} style={{ padding: '8px' }} />
              <input type="text" placeholder="口座名義（カナ）" value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} style={{ padding: '8px' }} />
              <button onClick={handleSaveSettings} style={{ padding: '12px', background: '#ea580c', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>保存</button>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h4>🎁 紹介コード</h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" readOnly value={shopId ? shopId.slice(0,8).toUpperCase() : '---'} style={{ flex: 1, padding: '8px', fontWeight: 'bold', background: '#f1f5f9', border: '1px solid #cbd5e0', borderRadius: '6px' }} />
              <button onClick={() => { if(shopId) { navigator.clipboard.writeText(shopId.slice(0,8).toUpperCase()); alert('コピーしました'); } }} style={{ padding: '8px 16px', background: '#ea580c', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>コピー</button>
            </div>
            <div style={{ marginTop: '12px' }}>
              <h4>📥 明細CSV</h4>
              <button onClick={() => { const month = new Date().toISOString().slice(0,7); window.open(`/api/referrals/export-csv?referrer_id=${shopId}&month=${month}`, '_blank'); }} style={{ padding: '8px 16px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>CSVダウンロード</button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
