'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import PaymentFailuresSection from '@/components/PaymentFailuresSection';

interface ReferralShop {
  id: string;
  shopCode: string;
  name: string;
  plan: string;
  status: string;
  rewardRate: number;
  monthlyReward: number;
  startedAt: string;
}

interface RewardHistory {
  id: string;
  billingMonth: string;
  shopName: string;
  amount: number;
  status: 'unpaid' | 'paid';
}

export default function ProShopDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 店舗情報
  const [shopId, setShopId] = useState<string | null>(null);
  const [shopName, setShopName] = useState('');

  // サマリー
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [unpaidReward, setUnpaidReward] = useState(0);
  const [referralCount, setReferralCount] = useState(0);

  // 紹介コード・URL
  const [referralCode, setReferralCode] = useState('');

  // 振込先口座
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [accountType, setAccountType] = useState<'savings' | 'checking'>('savings');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  // 紹介店舗一覧
  const [referrals, setReferrals] = useState<ReferralShop[]>([]);

  // 報酬履歴
  const [rewards, setRewards] = useState<RewardHistory[]>([]);

  // タブ
  const [activeTab, setActiveTab] = useState<'referrals' | 'rewards'>('referrals');

  // 検索
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setLoading(false);
        return;
      }

      try {
        const idToken = await u.getIdToken();

        // 店舗情報取得（create-shop で存在確認 + shopId取得）
        const createRes = await fetch('/api/create-shop', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify({}),
        });
        const createData = await createRes.json();

        if (!createData.success) {
          setLoading(false);
          return;
        }

        const currentShopId = createData.shopId;
        setShopId(currentShopId);

        // ダッシュボードデータ取得
        const res = await fetch(`/api/pro-shop/dashboard?shopId=${currentShopId}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        if (res.ok) {
          const data = await res.json();
          const shop = data.shop || {};
          const summary = data.summary || {};

          setShopName(shop.name || '');
          setReferralCode(shop.referralCode || '');
          setTotalEarnings(summary.totalEarnings || 0);
          setUnpaidReward(summary.unpaidReward || 0);
          setReferralCount(summary.referralCount || 0);

          if (shop.bankAccount) {
            setBankName(shop.bankAccount.bankName || '');
            setBranchName(shop.bankAccount.branchName || '');
            setAccountType(shop.bankAccount.accountType || 'savings');
            setAccountNumber(shop.bankAccount.accountNumber || '');
            setAccountHolder(shop.bankAccount.accountHolder || '');
          }

          setReferrals(data.referrals || []);
          setRewards(data.rewards || []);
        }
      } catch (err) {
        console.error('ダッシュボード取得エラー:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const handleSaveBank = async () => {
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
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const data = await res.json();
        alert('保存失敗: ' + data.error);
      }
    } catch (err: any) {
      alert('保存エラー: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      alert('紹介コードをコピーしました！');
    }
  };

  const handleCopyUrl = () => {
    if (referralCode) {
      const url = `${window.location.origin}/signup?ref=${referralCode}`;
      navigator.clipboard.writeText(url);
      alert('紹介URLをコピーしました！');
    }
  };

  const handleDownloadCSV = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    window.open(`/api/referrals/export-csv?referrer_id=${shopId}&month=${currentMonth}`, '_blank');
  };

  const filteredReferrals = referrals.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.shopCode.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <main style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <p>読み込み中...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main style={{ maxWidth: '400px', margin: '60px auto', padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h2>ログインが必要です</h2>
        <Link href="/pro-shop" style={{ color: '#ff4500', textDecoration: 'none', fontWeight: 'bold' }}>
          ← PROコンソールへ戻る
        </Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '800', margin: 0 }}>
              🤝 紹介・報酬ダッシュボード
            </h1>
            <span style={{
              fontSize: '11px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '12px',
              color: '#fff', backgroundColor: '#ff4500',
            }}>
              PRO
            </span>
          </div>
          <p style={{ color: '#718096', fontSize: '14px', margin: '6px 0 0 0' }}>
            {shopName} / <strong>{user.email}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Link
            href="/pro-shop"
            style={{ padding: '8px 16px', background: '#fff7ed', color: '#c2410c', border: '1px solid #fdba74', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none' }}
          >
            ← コンソールに戻る
          </Link>
          <button
            onClick={() => signOut(auth)}
            style={{ padding: '8px 16px', background: '#edf2f7', color: '#4a5568', border: '1px solid #cbd5e0', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
          >
            ログアウト
          </button>
        </div>
      </div>

      {/* サマリーカード */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '30px' }}>
        <div style={{ background: '#fff7ed', padding: '20px', borderRadius: '12px', border: '2px solid #fdba74' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#9a3412', marginBottom: '6px' }}>累計報酬</div>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#c2410c' }}>
            ¥{totalEarnings.toLocaleString()}
          </div>
        </div>
        <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '12px', border: '2px solid #86efac' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#166534', marginBottom: '6px' }}>未払い報酬</div>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#15803d' }}>
            ¥{unpaidReward.toLocaleString()}
          </div>
        </div>
        <div style={{ background: '#ebf8ff', padding: '20px', borderRadius: '12px', border: '2px solid #90cdf4' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#2c5282', marginBottom: '6px' }}>紹介店舗数</div>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#2b6cb0' }}>
            {referralCount} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>店舗</span>
          </div>
        </div>
      </div>

      {/* 紹介コード & URL */}
      <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#c2410c' }}>
          🎁 あなたの紹介特典コード・専用URL
        </h3>
        <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#9a3412', lineHeight: '1.5' }}>
          他店舗へご紹介の際、こちらのコードまたは専用URLをご案内ください。新規店舗がご契約すると紹介報酬が発生します。
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#78350f', marginBottom: '4px' }}>
              紹介コード
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input
                type="text"
                readOnly
                value={referralCode || '取得中...'}
                style={{ flex: 1, minWidth: '200px', padding: '10px 14px', fontSize: '15px', fontWeight: 'bold', letterSpacing: '1px', background: '#fff', border: '1px solid #cbd5e0', borderRadius: '6px' }}
              />
              <button
                onClick={handleCopyCode}
                style={{ padding: '10px 18px', background: '#ea580c', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
              >
                コードをコピー
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#78350f', marginBottom: '4px' }}>
              専用登録URL（紹介コード自動入力）
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input
                type="text"
                readOnly
                value={referralCode ? `${typeof window !== 'undefined' ? window.location.origin : ''}/signup?ref=${referralCode}` : '取得中...'}
                style={{ flex: 1, minWidth: '200px', padding: '10px 14px', fontSize: '12px', color: '#475569', background: '#fff', border: '1px solid #cbd5e0', borderRadius: '6px' }}
              />
              <button
                onClick={handleCopyUrl}
                style={{ padding: '10px 18px', background: '#475569', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
              >
                URLをコピー
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 振込先口座情報 */}
      <div style={{ background: '#fff7ed', border: '1px solid #fdba74', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#c2410c' }}>
          🏦 振込先口座情報（紹介報酬受取用）
        </h3>
        <p style={{ fontSize: '12px', color: '#9a3412', marginBottom: '16px' }}>
          ※紹介手数料（PRO特典 10%）をお振り込みする口座を指定してください。
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}>金融機関名</label>
            <input
              type="text"
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
              onChange={(e: any) => setAccountType(e.target.value)}
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
              placeholder="ヤマダ タロウ"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box', background: '#fff' }}
            />
          </div>
        </div>

        <button
          onClick={handleSaveBank}
          disabled={saving}
          style={{
            marginTop: '16px', padding: '12px 24px',
            background: saveSuccess ? '#4CAF50' : saving ? '#ccc' : '#ea580c',
            color: '#fff', border: 'none', borderRadius: '6px',
            fontWeight: 'bold', cursor: saving ? 'wait' : 'pointer', fontSize: '14px',
          }}
        >
          {saving ? '保存中...' : saveSuccess ? '✨ 保存しました！' : '💾 口座情報を保存'}
        </button>
      </div>

      {/* タブ */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e2e8f0', paddingBottom: '4px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('referrals')}
          style={{
            padding: '10px 16px', border: 'none',
            borderBottom: activeTab === 'referrals' ? '3px solid #ff4500' : '3px solid transparent',
            background: 'none', fontWeight: 'bold',
            color: activeTab === 'referrals' ? '#ff4500' : '#64748b',
            cursor: 'pointer', fontSize: '15px', whiteSpace: 'nowrap'
          }}
        >
          🏪 紹介店舗一覧（{referrals.length}）
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          style={{
            padding: '10px 16px', border: 'none',
            borderBottom: activeTab === 'rewards' ? '3px solid #16a34a' : '3px solid transparent',
            background: 'none', fontWeight: 'bold',
            color: activeTab === 'rewards' ? '#16a34a' : '#64748b',
            cursor: 'pointer', fontSize: '15px', whiteSpace: 'nowrap'
          }}
        >
          💰 報酬明細（{rewards.length}）
        </button>
      </div>

      {/* 紹介店舗一覧タブ */}
      {activeTab === 'referrals' && (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>紹介経由の店舗一覧</h3>
            <input
              type="text"
              placeholder="🔍 店舗名・コードで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '13px', minWidth: '200px' }}
            />
          </div>

          {filteredReferrals.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0', fontSize: '14px' }}>
              紹介している店舗はまだありません。
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>店舗名</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>店舗コード</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>プラン</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>報酬率</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>月額報酬</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>ステータス</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>利用開始日</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReferrals.map((r) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{r.name}</td>
                      <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '11px', color: '#4a5568' }}>{r.shopCode}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{
                          padding: '2px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold',
                          background: r.plan === 'pro' ? '#fef3c7' : r.plan === 'standard' ? '#dbeafe' : '#f1f5f9',
                          color: r.plan === 'pro' ? '#b45309' : r.plan === 'standard' ? '#1d4ed8' : '#475569',
                        }}>
                          {r.plan.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#16a34a' }}>
                        {(r.rewardRate * 100).toFixed(0)}%
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#1a202c' }}>
                        ¥{r.monthlyReward.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold',
                          background: r.status === 'active' ? '#c6f6d5' : '#fed7d7',
                          color: r.status === 'active' ? '#22543d' : '#9b2c2c',
                        }}>
                          {r.status === 'active' ? '契約中' : '停止'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#4a5568' }}>
                        {r.startedAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 報酬明細タブ */}
      {activeTab === 'rewards' && (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>今月の報酬明細</h3>
            <button
              onClick={handleDownloadCSV}
              style={{ padding: '8px 16px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
            >
              📥 明細CSVダウンロード
            </button>
          </div>

          {rewards.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0', fontSize: '14px' }}>
              報酬明細はまだありません。
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>対象月</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>紹介元店舗</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>報酬額</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>ステータス</th>
                  </tr>
                </thead>
                <tbody>
                  {rewards.map((r) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                      <td style={{ padding: '12px', fontFamily: 'monospace' }}>{r.billingMonth}</td>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{r.shopName}</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#c2410c' }}>
                        ¥{r.amount.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold',
                          background: r.status === 'paid' ? '#c6f6d5' : '#fef3c7',
                          color: r.status === 'paid' ? '#22543d' : '#92400e',
                        }}>
                          {r.status === 'paid' ? '振込済み' : '未払い'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* フッター */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <Link href="/pro-shop" style={{ color: '#64748b', fontSize: '13px', textDecoration: 'none' }}>
          ← PROコンソールに戻る
        </Link>
      </div>
    </main>
  );
}
