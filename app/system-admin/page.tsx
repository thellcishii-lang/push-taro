'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth } from '@/lib/firebase-client';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

interface ShopData {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  plan?: string;
  status?: string;
  agencyId?: string;
  referrerId?: string;
  pushCount?: number;
  subscriberCount?: number;
  squareConnected?: boolean;
}

interface AgencyData {
  id: string;
  companyName?: string;
  ownerName?: string;
  email?: string;
  status?: string;
  approvedAt?: string | null;
  referralCode?: string;
  createdAt?: string | null;
}

// ============================================================
// アフィリエイト一覧タブ
// ============================================================
function AffiliatesTab() {
  const [loading, setLoading] = useState(true);
  const [affiliates, setAffiliates] = useState<any[]>([]);

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/affiliates', {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAffiliates(data.affiliates || []);
      }
    } catch (err) {
      console.error('アフィリエイトデータ取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>読み込み中...</div>;

  return (
    <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>アフィリエイト一覧</h2>
        <span style={{ fontSize: '13px', color: '#64748b' }}>全 {affiliates.length} 件</span>
      </div>

      {affiliates.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
          まだアフィリエイト登録はありません
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>氏名</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>メール</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>紹介コード</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>報酬タイプ</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>累計報酬</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>未払い</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>インボイス</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>ステータス</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>登録日</th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map((aff) => (
                <tr key={aff.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{aff.name}</td>
                  <td style={{ padding: '10px', fontSize: '12px' }}>{aff.email}</td>
                  <td style={{ padding: '10px', fontFamily: 'monospace', fontSize: '12px' }}>{aff.referralCode}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ padding: '2px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', background: aff.rewardType === 'recurring' ? '#dbeafe' : '#fef3c7', color: aff.rewardType === 'recurring' ? '#1d4ed8' : '#d97706' }}>
                      {aff.rewardType === 'recurring' ? '継続課金' : '一括'}
                    </span>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#1a202c' }}>¥{aff.totalEarnings?.toLocaleString() || 0}</td>
                  <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: (aff.unpaidReward || 0) >= 5000 ? '#22c55e' : '#eab308' }}>¥{aff.unpaidReward?.toLocaleString() || 0}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <span style={{ padding: '2px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', background: aff.hasInvoice ? '#c6f6d5' : '#fecaca', color: aff.hasInvoice ? '#22543d' : '#dc2626' }}>
                      {aff.hasInvoice ? 'あり' : 'なし'}
                    </span>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', background: aff.status === 'active' ? '#c6f6d5' : '#f1f5f9', color: aff.status === 'active' ? '#22543d' : '#64748b' }}>
                      {aff.status === 'active' ? '有効' : '停止'}
                    </span>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', fontSize: '11px', color: '#64748b' }}>
                    {aff.createdAt ? new Date(aff.createdAt).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 決済不履行一覧タブ（改修版）
// ============================================================
function PaymentFailuresTab() {
  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState<any[]>([]);
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [shopDetail, setShopDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [sendingInvoice, setSendingInvoice] = useState<string | null>(null);

  const fetchPaymentFailures = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/payment-failures', {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setShops(data.shops || []);
      }
    } catch (err) {
      console.error('決済不履行データ取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchShopDetail = async (shopId: string) => {
    setSelectedShopId(shopId);
    setDetailLoading(true);
    setShopDetail(null);
    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();
      const res = await fetch(`/api/admin/payment-history/${shopId}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setShopDetail(data);
      } else {
        alert('詳細の取得に失敗しました');
      }
    } catch (err: any) {
      alert('通信エラー: ' + err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleManualAction = async (shopId: string, action: string, done: boolean) => {
    const label = done ? '記録' : '取り消し';
    if (!confirm(`${action} を${label}しますか？`)) return;

    setActionLoading(`${shopId}-${action}`);
    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/manual-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ shopId, action, done }),
      });
      const data = await res.json();
      if (res.ok) {
        // 詳細とリストを更新
        if (selectedShopId === shopId) {
          await fetchShopDetail(shopId);
        }
        fetchPaymentFailures();
      } else {
        alert('エラー: ' + data.error);
      }
    } catch (err: any) {
      alert('通信エラー: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendInvoice = async (shopId: string, months: number) => {
    if (!confirm(`${months}ヶ月分の決済リンクを送信しますか？`)) return;
    setSendingInvoice(`${shopId}-${months}`);
    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/send-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ shopId, months }),
      });
      if (res.ok) {
        alert(`${months}ヶ月分の決済リンクを送信しました`);
        fetchPaymentFailures();
      } else {
        const data = await res.json();
        alert('エラー: ' + data.error);
      }
    } catch (err: any) {
      alert('通信エラー: ' + err.message);
    } finally {
      setSendingInvoice(null);
    }
  };

  const handleDelete = async (shopId: string) => {
    if (!confirm(`店舗を完全に削除しますか？（復元できません）`)) return;
    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/delete-shop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ shopId }),
      });
      if (res.ok) {
        alert('削除しました');
        setSelectedShopId(null);
        setShopDetail(null);
        fetchPaymentFailures();
      } else {
        const data = await res.json();
        alert('エラー: ' + data.error);
      }
    } catch (err: any) {
      alert('通信エラー: ' + err.message);
    }
  };

  // 状態の日本語ラベルと色
  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; bg: string; color: string }> = {
      normal:            { label: '正常',        bg: '#c6f6d5', color: '#22543d' },
      failure_1:         { label: '不履行1',     bg: '#fef3c7', color: '#92400e' },
      failure_2:         { label: '不履行2',     bg: '#fed7aa', color: '#9a3412' },
      failure_3_stopped: { label: '停止中',      bg: '#fecaca', color: '#991b1b' },
      recovering:        { label: '復活中',      bg: '#dbeafe', color: '#1e40af' },
      canceled:          { label: '退会処理',    bg: '#e2e8f0', color: '#475569' },
    };
    const s = map[status] || { label: status, bg: '#f1f5f9', color: '#475569' };
    return (
      <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', background: s.bg, color: s.color }}>
        {s.label}
      </span>
    );
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>読み込み中...</div>;

  return (
    <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>決済不履行店舗一覧</h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
            paymentStatus が failure_* / recovering / canceled の店舗
          </p>
        </div>
        <span style={{ fontSize: '13px', color: '#64748b' }}>全 {shops.length} 件</span>
      </div>

      {shops.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>現在、決済不履行の店舗はありません</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>店舗名</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>プラン</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>状態</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>最終更新</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>詳細</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <tr key={shop.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{shop.name}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '2px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold',
                      background: shop.plan === 'pro' ? '#fef3c7' : shop.plan === 'standard' ? '#dbeafe' : '#f1f5f9',
                      color: shop.plan === 'pro' ? '#b45309' : shop.plan === 'standard' ? '#1d4ed8' : '#475569',
                    }}>
                      {shop.plan?.toUpperCase() || 'LIGHT'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{getStatusBadge(shop.paymentStatus)}</td>
                  <td style={{ padding: '12px', fontSize: '12px', color: '#64748b' }}>
                    {shop.lastUpdatedAt ? new Date(shop.lastUpdatedAt).toLocaleString('ja-JP') : '-'}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => fetchShopDetail(shop.id)}
                      style={{ padding: '6px 14px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                    >
                      🔍 開く
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 詳細モーダル */}
      {selectedShopId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '20px', overflowY: 'auto' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', maxWidth: '900px', width: '100%', marginTop: '40px' }}>
            {detailLoading ? (
              <p style={{ textAlign: 'center', padding: '40px' }}>読み込み中...</p>
            ) : shopDetail ? (
              <>
                {/* ヘッダー */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '20px' }}>{shopDetail.shopName}</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                      店舗ID: <code>{shopDetail.shopId}</code>
                    </p>
                  </div>
                  <button
                    onClick={() => { setSelectedShopId(null); setShopDetail(null); }}
                    style={{ padding: '8px 16px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    ✕ 閉じる
                  </button>
                </div>

                {/* 現在の状態 */}
                <div style={{ marginBottom: '20px', padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#475569' }}>現在の状態</span>
                  {getStatusBadge(shopDetail.paymentStatus)}
                </div>

                {/* 手動アクション */}
                <div style={{ marginBottom: '24px', padding: '16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#92400e' }}>🔧 手動アクション</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { key: 'squareStopped', label: 'Square サブスク停止' },
                      { key: 'invoice2MonthsSent', label: '2ヶ月分請求書送信' },
                      { key: 'invoice3MonthsSent', label: '3ヶ月分請求書送信' },
                      { key: 'paymentConfirmed', label: '決済確認（復活）' },
                      { key: 'squareResumed', label: 'Square 再開' },
                      { key: 'canceled', label: '退会処理' },
                    ].map(({ key, label }) => {
                      const action = shopDetail.manualActions?.[key] || { done: false, doneAt: null, doneBy: null };
                      const isLoading = actionLoading === `${shopDetail.shopId}-${key}`;
                      return (
                        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: '#fff', borderRadius: '6px', border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
                          <input
                            type="checkbox"
                            checked={!!action.done}
                            disabled={isLoading}
                            onChange={(e) => handleManualAction(shopDetail.shopId, key, e.target.checked)}
                            style={{ width: '18px', height: '18px', cursor: isLoading ? 'wait' : 'pointer' }}
                          />
                          <span style={{ flex: 1, fontWeight: 'bold', fontSize: '13px' }}>{label}</span>
                          {action.done && action.doneAt && (
                            <span style={{ fontSize: '11px', color: '#64748b' }}>
                              {new Date(action.doneAt).toLocaleString('ja-JP')} に実施
                            </span>
                          )}
                          {isLoading && <span style={{ fontSize: '11px', color: '#0284c7' }}>処理中...</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 請求書送信 */}
                <div style={{ marginBottom: '24px', padding: '16px', background: '#f0f9ff', border: '1px solid #7dd3fc', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#0369a1' }}>📧 請求書送信</h4>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[1, 2, 3].map((m) => (
                      <button
                        key={m}
                        onClick={() => handleSendInvoice(shopDetail.shopId, m)}
                        disabled={sendingInvoice === `${shopDetail.shopId}-${m}`}
                        style={{
                          padding: '8px 16px', background: sendingInvoice === `${shopDetail.shopId}-${m}` ? '#ccc' : m === 3 ? '#ef4444' : m === 2 ? '#8b5cf6' : '#3b82f6',
                          color: '#fff', border: 'none', borderRadius: '6px', cursor: sendingInvoice === `${shopDetail.shopId}-${m}` ? 'wait' : 'pointer', fontWeight: 'bold', fontSize: '13px',
                        }}
                      >
                        {sendingInvoice === `${shopDetail.shopId}-${m}` ? '送信中...' : `${m}ヶ月分を送信`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 決済履歴 */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>📊 決済履歴</h4>
                  {(!shopDetail.history || shopDetail.history.length === 0) ? (
                    <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', padding: '20px' }}>履歴がありません</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {Object.entries(shopDetail.groupedByMonth || {}).map(([month, records]: [string, any]) => {
                        // その月のサマリーを計算
                        const successCount = records.filter((r: any) => r.result === 'success').length;
                        const failedCount = records.filter((r: any) => r.result === 'failed').length;
                        const totalAmount = records[0]?.amount || 0;

                        return (
                          <div key={month} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', background: '#fff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                              <strong style={{ fontSize: '15px', color: '#1a202c' }}>{month}</strong>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569' }}>¥{totalAmount.toLocaleString()}</span>
                                {successCount > 0 && (
                                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', background: '#c6f6d5', color: '#22543d', fontWeight: 'bold' }}>
                                    成功 {successCount}
                                  </span>
                                )}
                                {failedCount > 0 && (
                                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', background: '#fecaca', color: '#991b1b', fontWeight: 'bold' }}>
                                    失敗 {failedCount}
                                  </span>
                                )}
                              </div>
                            </div>
                            {records.map((r: any) => (
                              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '6px 0', color: '#475569' }}>
                                <span>
                                  {new Date(r.attemptedAt).toLocaleString('ja-JP')}
                                </span>
                                <span style={{ fontWeight: 'bold', color: r.result === 'success' ? '#15803d' : '#dc2626' }}>
                                  {r.result === 'success' ? '✅ 成功' : `❌ 失敗（${r.failureAttempt}回目）`}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 店舗削除 */}
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', textAlign: 'right' }}>
                  <button
                    onClick={() => handleDelete(shopDetail.shopId)}
                    style={{ padding: '8px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                  >
                    🗑️ 店舗を完全削除
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 報酬振込管理タブ
// ============================================================
function PendingPayoutsTab() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchPendingPayouts = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/pending-payouts', {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('報酬振込データ取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPayouts();
  }, []);

    const handlePayoutComplete = async (
    userId: string,
    amount: number,
    userName: string,
    collection: string
  ) => {
    if (!confirm(`${userName} への振込 ¥${amount.toLocaleString()} を「完了」として処理しますか？\n\n※実際の銀行振込が完了していることを確認してください。`)) {
      return;
    }

    setProcessing(userId);
    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();

      const res = await fetch('/api/admin/complete-payout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ userId, amount, collection }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ 振込完了処理を実行しました。ユーザーにメールを送信しました。');
        fetchPendingPayouts();
      } else {
        alert('エラー: ' + data.error);
      }
    } catch (err: any) {
      alert('通信エラー: ' + err.message);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>読み込み中...</div>;

  const totalPending = users.reduce((acc, u) => acc + (u.unpaidReward || 0), 0);

  return (
    <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>報酬振込管理</h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
            未払い報酬があるユーザー一覧。振込完了後、右のボタンで処理してください。
          </p>
        </div>
        <div style={{ fontSize: '13px', color: '#64748b' }}>
          合計未払い: <strong style={{ color: '#dc2626', fontSize: '16px' }}>¥{totalPending.toLocaleString()}</strong>
        </div>
      </div>

      {users.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
          現在、未払い報酬のあるユーザーはいません
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>氏名/店舗名</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>種別</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>メール</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>未払い報酬</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>振込先口座</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>ステータス</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>アクション</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{u.name}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ padding: '2px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', background: u.type === '代理店' ? '#c6f6d5' : u.type === 'PRO紹介者' ? '#fef3c7' : '#dbeafe', color: u.type === '代理店' ? '#22543d' : u.type === 'PRO紹介者' ? '#b45309' : '#1d4ed8' }}>
                      {u.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '12px' }}>{u.email}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: u.unpaidReward >= 10000 ? '#dc2626' : '#1a202c' }}>
                    ¥{u.unpaidReward.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', fontSize: '11px', color: '#475569' }}>
                    {u.bankAccount ? (
                      <>
                        {u.bankAccount.bankName} {u.bankAccount.branchName}<br />
                        {u.bankAccount.accountNumber} / {u.bankAccount.accountHolder}
                      </>
                    ) : (
                      <span style={{ color: '#dc2626' }}>未登録</span>
                    )}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {u.payoutStatus === 'pending' ? (
                      <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', background: '#fecaca', color: '#dc2626' }}>
                        振込依頼中
                      </span>
                    ) : (
                      <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', background: '#fef3c7', color: '#d97706' }}>
                        累積中
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => handlePayoutComplete(u.id, u.unpaidReward, u.name, u.collection)}
                              disabled={processing === u.id}
                      style={{ padding: '6px 14px', background: processing === u.id ? '#94a3b8' : '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', cursor: processing === u.id ? 'wait' : 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                    >
                      {processing === u.id ? '処理中...' : '✓ 振込完了'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 代理店一覧タブ
// ============================================================
function AgenciesTab() {
  const [loading, setLoading] = useState(true);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedAgency, setSelectedAgency] = useState<any>(null);

  const fetchAgencies = async () => {
    try {
      const res = await fetch('/api/system-admin/stats');
      if (res.ok) {
        const data = await res.json();
        setAgencies(data.agencies || []);
      }
    } catch (err) {
      console.error('代理店データ取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  const handleApprove = async (agencyId: string, companyName: string) => {
    if (!confirm(`${companyName} を承認して、決済案内メールを送信しますか？`)) return;

    setActionLoading(agencyId);
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('ログインが必要です');
        return;
      }
      const idToken = await user.getIdToken();

      const res = await fetch(`/api/agency/approve?agencyId=${agencyId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${idToken}` },
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ 承認処理が完了しました。決済案内メールを送信しました。');
        fetchAgencies();
      } else {
        alert('エラー: ' + data.error);
      }
    } catch (err: any) {
      alert('通信エラー: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (agencyId: string, companyName: string) => {
    const reason = prompt(`【却下理由】（空欄でもOK）\n\n${companyName} を却下します。\n理由を入力してください（任意）:`);
    if (reason === null) return;

    setActionLoading(agencyId);
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('ログインが必要です');
        return;
      }
      const idToken = await user.getIdToken();

      const res = await fetch('/api/agency/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ agencyId, reason }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ 却下処理が完了しました。通知メールを送信しました。');
        fetchAgencies();
      } else {
        alert('エラー: ' + data.error);
      }
    } catch (err: any) {
      alert('通信エラー: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; bg: string; color: string }> = {
      pending_approval:         { label: '審査中',    bg: '#fef3c7', color: '#92400e' },
      approved_pending_payment: { label: '決済待ち',  bg: '#dbeafe', color: '#1e40af' },
      active:                   { label: '稼働中',    bg: '#c6f6d5', color: '#22543d' },
      suspended:                { label: '停止中',    bg: '#fecaca', color: '#991b1b' },
      rejected:                 { label: '却下',      bg: '#e2e8f0', color: '#475569' },
    };
    const s = map[status] || { label: status, bg: '#f1f5f9', color: '#475569' };
    return (
      <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', background: s.bg, color: s.color }}>
        {s.label}
      </span>
    );
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>読み込み中...</div>;

  return (
    <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>代理店一覧 & 審査</h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
            審査中の代理店には承認・却下ボタンが表示されます
          </p>
        </div>
        <span style={{ fontSize: '13px', color: '#64748b' }}>全 {agencies.length} 件</span>
      </div>

      {agencies.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>代理店はまだありません</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>会社名</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>担当者</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>メール</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>紹介コード</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>ステータス</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {agencies.map((agency) => {
                const isPending = agency.status === 'pending_approval';
                const isLoading = actionLoading === agency.id;

                return (
                  <tr key={agency.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>
                      <button
                        onClick={() => setSelectedAgency(agency)}
                        style={{ background: 'none', border: 'none', color: '#3182ce', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline', padding: 0, fontSize: '13px' }}
                      >
                        {agency.companyName || agency.ownerName || '未設定'}
                      </button>
                    </td>
                    <td style={{ padding: '12px' }}>{agency.ownerName || '-'}</td>
                    <td style={{ padding: '12px', fontSize: '12px' }}>{agency.email || '-'}</td>
                    <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px' }}>{agency.referralCode || '-'}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{getStatusBadge(agency.status)}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {isPending ? (
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => handleApprove(agency.id, agency.companyName || agency.ownerName)}
                            disabled={isLoading}
                            style={{
                              padding: '6px 14px',
                              background: isLoading ? '#94a3b8' : '#16a34a',
                              color: '#fff', border: 'none', borderRadius: '4px',
                              cursor: isLoading ? 'wait' : 'pointer',
                              fontSize: '12px', fontWeight: 'bold',
                            }}
                          >
                            {isLoading ? '処理中...' : '✓ 承認'}
                          </button>
                          <button
                            onClick={() => handleReject(agency.id, agency.companyName || agency.ownerName)}
                            disabled={isLoading}
                            style={{
                              padding: '6px 14px',
                              background: isLoading ? '#94a3b8' : '#dc2626',
                              color: '#fff', border: 'none', borderRadius: '4px',
                              cursor: isLoading ? 'wait' : 'pointer',
                              fontSize: '12px', fontWeight: 'bold',
                            }}
                          >
                            却下
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>―</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedAgency && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '20px', overflowY: 'auto' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', maxWidth: '600px', width: '100%', marginTop: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '2px solid #eee', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>代理店 詳細情報</h3>
              <button
                onClick={() => setSelectedAgency(null)}
                style={{ padding: '6px 14px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
              >
                ✕ 閉じる
              </button>
            </div>

            <div style={{ display: 'grid', gap: '12px', fontSize: '13px' }}>
              <div><strong>会社名 / 屋号</strong><br />{selectedAgency.companyName || '未設定'}</div>
              <div><strong>担当者名</strong><br />{selectedAgency.ownerName || '未設定'}</div>
              <div><strong>メールアドレス</strong><br />{selectedAgency.email || '未設定'}</div>
              <div><strong>電話番号</strong><br />{selectedAgency.phone || '未設定'}</div>
              <div><strong>住所</strong><br />{selectedAgency.address || '未設定'}</div>
              <div><strong>事業形態</strong><br />{selectedAgency.businessType === 'corporation' ? '法人' : '個人事業主'}</div>
              <div><strong>インボイス番号</strong><br />{selectedAgency.invoiceNumber || '未登録'}</div>
              <div><strong>紹介コード</strong><br /><code>{selectedAgency.referralCode || '未設定'}</code></div>
              <div><strong>ステータス</strong><br />{getStatusBadge(selectedAgency.status)}</div>
              {selectedAgency.approvedAt && (
                <div><strong>承認日時</strong><br />{new Date(selectedAgency.approvedAt).toLocaleString('ja-JP')}</div>
              )}
              {selectedAgency.rejectReason && (
                <div><strong>却下理由</strong><br />{selectedAgency.rejectReason}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ============================================================
// 代理店月額決済状況タブ
// ============================================================
function AgencyMonthlyTab() {
  const [loading, setLoading] = useState(true);
  const [agencies, setAgencies] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/agency-monthly-payments', {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAgencies(data.agencies || []);
      }
    } catch (err) {
      console.error('代理店月額決済データ取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusBadge = (monthlyStatus: string, failedCount: number) => {
    if (monthlyStatus === 'failed') {
      const isHigh = failedCount >= 3;
      return (
        <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', background: isHigh ? '#fecaca' : '#fef3c7', color: isHigh ? '#991b1b' : '#92400e' }}>
          決済失敗 {failedCount}回
        </span>
      );
    }
    if (monthlyStatus === 'suspended') {
      return (
        <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', background: '#e2e8f0', color: '#475569' }}>
          停止中
        </span>
      );
    }
    return (
      <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', background: '#f1f5f9', color: '#64748b' }}>
        未設定
      </span>
    );
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>読み込み中...</div>;

  return (
    <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>代理店 月額決済状況</h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
            月額決済が失敗・未完了の代理店一覧。人為的にご連絡ください。
          </p>
        </div>
        <span style={{ fontSize: '13px', color: '#64748b' }}>全 {agencies.length} 件</span>
      </div>

      {agencies.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>現在、月額決済に問題のある代理店はありません</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>会社名</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>担当者</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>メール</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>電話</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>月額決済状況</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>最終失敗日時</th>
              </tr>
            </thead>
            <tbody>
              {agencies.map((a) => (
                <tr key={a.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{a.companyName || a.ownerName || '未設定'}</td>
                  <td style={{ padding: '12px' }}>{a.ownerName || '-'}</td>
                  <td style={{ padding: '12px', fontSize: '12px' }}>{a.email || '-'}</td>
                  <td style={{ padding: '12px', fontSize: '12px' }}>{a.phone || '-'}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{getStatusBadge(a.monthlyStatus, a.failedCount)}</td>
                  <td style={{ padding: '12px', fontSize: '12px', color: '#64748b' }}>
                    {a.lastFailedAt ? new Date(a.lastFailedAt).toLocaleString('ja-JP') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p style={{ margin: '16px 0 0 0', fontSize: '11px', color: '#94a3b8', textAlign: 'right' }}>
        ※ 自動停止はしません。代理店へ個別にご連絡ください。
      </p>
    </div>
  );
}

// ============================================================
// メインコンポーネント
// ============================================================
export default function SystemAdminPage() {
  const [user, setUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [loading, setLoading] = useState(true);
 const [activeTab, setActiveTab] = useState<'all' | 'pro' | 'agencies' | 'affiliates' | 'pending-payouts' | 'payment-failures' | 'agency-monthly'>('all');
  const [filterType, setFilterType] = useState<'all' | 'direct' | 'referral' | 'agency'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [isCircuitBreakerOpen, setIsCircuitBreakerOpen] = useState(false);
  const [circuitLoading, setCircuitLoading] = useState(false);

  const [summary, setSummary] = useState({
    totalSubscribers: 0,
    lightCount: 0,
    standardCount: 0,
    proCount: 0,
    proDetails: { direct: 0, referral: 0, agency: 0 },
    agencyTotal: 0,
  });

  const [shops, setShops] = useState<ShopData[]>([]);
  const [agencies, setAgencies] = useState<AgencyData[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthChecking(false);

      if (u) {
        try {
          const idTokenResult = await u.getIdTokenResult(true);
          const hasAdminClaim = idTokenResult.claims.admin === true;
          setIsAdmin(hasAdminClaim);

          if (hasAdminClaim) {
            fetchSystemStats();
            fetchSystemStatus();
            fetchErrorCount();
          }
        } catch (err) {
          console.error('クレーム取得エラー:', err);
          setIsAdmin(false);
        }
      }
    });
    return () => unsub();
  }, []);

  const fetchSystemStats = async () => {
    try {
      const res = await fetch('/api/system-admin/stats');
      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary || summary);
        setShops(data.shops || []);
        setAgencies(data.agencies || []);
      }
    } catch (err) {
      console.error('システムデータ取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemStatus = async () => {
    try {
      const res = await fetch('/api/admin/system-status');
      if (res.ok) {
        const data = await res.json();
        setIsCircuitBreakerOpen(data.isCircuitBreakerOpen || false);
      }
    } catch (err) {
      console.error('システム状態取得エラー:', err);
    }
  };

  const fetchErrorCount = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/error-logs', {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setErrorCount(data.logs?.length || 0);
      }
    } catch (err) {
      console.error('エラー件数取得失敗:', err);
    }
  };

  const toggleCircuitBreaker = async () => {
    const action = isCircuitBreakerOpen ? '再開' : '緊急停止';
    if (!confirm(`⚠️ システムを${action}しますか？`)) return;

    setCircuitLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();

      const res = await fetch('/api/admin/system-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ isCircuitBreakerOpen: !isCircuitBreakerOpen }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsCircuitBreakerOpen(data.isCircuitBreakerOpen);
        alert(`✅ ${data.message}`);
      } else {
        alert('エラー: ' + data.error);
      }
    } catch (err: any) {
      alert('通信エラー: ' + err.message);
    } finally {
      setCircuitLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (err: any) {
      console.error('ログインエラー:', err);
      setLoginError('メールアドレスまたはパスワードが正しくありません。');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const filteredShops = shops.filter((shop) => {
    if (activeTab === 'pro' && shop.plan?.toLowerCase() !== 'pro') return false;

    if (filterType === 'agency') return !!shop.agencyId;
    if (filterType === 'referral') return !!shop.referrerId && !shop.agencyId;
    if (filterType === 'direct') return !shop.agencyId && !shop.referrerId;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const name = (shop.name || '').toLowerCase();
      const id = shop.id.toLowerCase();
      const email = (shop.email || '').toLowerCase();
      const phone = (shop.phone || '').replace(/[-－]/g, '');
      const address = (shop.address || '').toLowerCase();
      const qClean = q.replace(/[-－]/g, '');
      return (
        name.includes(q) ||
        id.includes(q) ||
        email.includes(q) ||
        phone.includes(qClean) ||
        address.includes(q)
      );
    }

    return true;
  });

  if (authChecking) {
    return (
      <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', color: '#64748b' }}>
        認証を確認中...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', padding: '20px' }}>
        <div style={{ background: '#1e293b', padding: '40px', borderRadius: '12px', border: '1px solid #334155', maxWidth: '400px', width: '100%' }}>
          <h1 style={{ color: '#38bdf8', fontSize: '20px', marginBottom: '8px', textAlign: 'center' }}>🖥️ System Admin</h1>
          <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', marginBottom: '24px' }}>管理者権限を持つアカウントでログインしてください</p>

          {loginError && (
            <div style={{ background: '#7f1d1d', color: '#fecaca', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>{loginError}</div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="email" placeholder="メールアドレス" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#f8fafc', fontSize: '14px' }} />
            <input type="password" placeholder="パスワード" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#f8fafc', fontSize: '14px' }} />
            <button type="submit" disabled={isLoggingIn} style={{ padding: '12px', background: isLoggingIn ? '#475569' : '#3182ce', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: isLoggingIn ? 'wait' : 'pointer', fontSize: '14px' }}>
              {isLoggingIn ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          <p style={{ color: '#64748b', fontSize: '12px', textAlign: 'center', marginTop: '20px' }}>
            <Link href="/admin" style={{ color: '#38bdf8', textDecoration: 'none' }}>← 店舗管理画面へ</Link>
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', padding: '20px' }}>
        <div style={{ background: '#1e293b', padding: '40px', borderRadius: '12px', border: '1px solid #7f1d1d', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</div>
          <h1 style={{ color: '#ef4444', fontSize: '18px', marginBottom: '8px' }}>アクセス権限がありません</h1>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '24px', lineHeight: 1.6 }}>
            このページは管理者専用です。<br />
            ログイン中のアカウント: <strong style={{ color: '#f8fafc' }}>{user.email}</strong>
          </p>
          <button onClick={handleLogout} style={{ padding: '12px 24px', background: '#475569', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>ログアウト</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'sans-serif', color: '#718096' }}>全体管理データを読み込み中...</div>;
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a202c', margin: '0 0 6px 0' }}>Push-taro 全体管理画面 Dashboard</h1>
          <p style={{ color: '#718096', fontSize: '14px', margin: 0 }}>全店舗・代理店の稼働状況および顧客登録件数の全体サマリーです。</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            ログイン中: <strong style={{ color: '#1a202c' }}>{user?.email}</strong>
          </div>
          <button onClick={handleLogout} style={{ padding: '6px 16px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>ログアウト</button>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <Link href="/system-admin/console" style={{ padding: '10px 20px', background: '#0f172a', color: '#38bdf8', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px', fontFamily: 'monospace', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            🖥️ エラーコンソール
            {errorCount > 0 && (
              <span style={{ background: '#ef4444', color: '#fff', borderRadius: '12px', padding: '2px 8px', fontSize: '11px', fontWeight: 'bold' }}>{errorCount}</span>
            )}
          </Link>
          <Link href="/system-admin/emails" style={{ padding: '10px 20px', background: '#3182ce', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            📧 メール一斉配信
          </Link>
        </div>

        <div style={{ background: isCircuitBreakerOpen ? '#fecaca' : '#f0fdf4', border: isCircuitBreakerOpen ? '2px solid #dc2626' : '2px solid #22c55e', padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: isCircuitBreakerOpen ? '#dc2626' : '#15803d' }}>
              {isCircuitBreakerOpen ? '🚨 システム緊急停止中' : '✅ システム正常稼働中'}
            </div>
            <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
              {isCircuitBreakerOpen ? 'プッシュ通知の送信が全て停止されています。' : 'プッシュ通知は正常に送信されています。'}
            </div>
          </div>
          <button onClick={toggleCircuitBreaker} disabled={circuitLoading} style={{ padding: '12px 24px', background: isCircuitBreakerOpen ? '#22c55e' : '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: circuitLoading ? 'wait' : 'pointer', minWidth: '160px' }}>
            {circuitLoading ? '処理中...' : isCircuitBreakerOpen ? '▶ システムを再開' : '⏸ システムを緊急停止'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '30px' }}>
          <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '12px', border: '2px solid #22c55e' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#15803d', marginBottom: '6px' }}>全店舗 累計登録顧客数</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#166534' }}>{summary.totalSubscribers.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>件</span></div>
          </div>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#718096', marginBottom: '6px' }}>ライトプラン</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#2b6cb0' }}>{summary.lightCount} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>件</span></div>
          </div>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#718096', marginBottom: '6px' }}>スタンダードプラン</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#2b6cb0' }}>{summary.standardCount} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>件</span></div>
          </div>
          <div style={{ background: '#ebf8ff', padding: '20px', borderRadius: '12px', border: '2px solid #3182ce' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#2b6cb0', marginBottom: '6px' }}>プロプラン（合計）</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#2b6cb0' }}>{summary.proCount} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>件</span></div>
          </div>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#718096', marginBottom: '6px' }}>加盟代理店数</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#38a169' }}>{summary.agencyTotal} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>社</span></div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', borderBottom: '2px solid #e2e8f0', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('all')} style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'all' ? '3px solid #3182ce' : 'none', fontWeight: 'bold', color: activeTab === 'all' ? '#3182ce' : '#718096', cursor: 'pointer' }}>全店舗リスト</button>
          <button onClick={() => setActiveTab('pro')} style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'pro' ? '3px solid #3182ce' : 'none', fontWeight: 'bold', color: activeTab === 'pro' ? '#3182ce' : '#718096', cursor: 'pointer' }}>プロプラン顧客詳細</button>
          <button onClick={() => setActiveTab('agencies')} style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'agencies' ? '3px solid #3182ce' : 'none', fontWeight: 'bold', color: activeTab === 'agencies' ? '#3182ce' : '#718096', cursor: 'pointer' }}>代理店一覧 & 審査</button>
          <button onClick={() => setActiveTab('affiliates')} style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'affiliates' ? '3px solid #16a34a' : 'none', fontWeight: 'bold', color: activeTab === 'affiliates' ? '#16a34a' : '#718096', cursor: 'pointer' }}>📢 アフィリエイト一覧</button>
          <button onClick={() => setActiveTab('pending-payouts')} style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'pending-payouts' ? '3px solid #f59e0b' : 'none', fontWeight: 'bold', color: activeTab === 'pending-payouts' ? '#f59e0b' : '#718096', cursor: 'pointer' }}>💰 報酬振込管理</button>
          <button onClick={() => setActiveTab('payment-failures')} style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'payment-failures' ? '3px solid #ef4444' : 'none', fontWeight: 'bold', color: activeTab === 'payment-failures' ? '#ef4444' : '#718096', cursor: 'pointer' }}>⚠️ 決済不履行一覧</button>
          <button onClick={() => setActiveTab('agency-monthly')} style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'agency-monthly' ? '3px solid #f97316' : 'none', fontWeight: 'bold', color: activeTab === 'agency-monthly' ? '#f97316' : '#718096', cursor: 'pointer' }}>💳 代理店月額決済</button>
        </div>

        {activeTab !== 'agencies' && activeTab !== 'payment-failures' && activeTab !== 'affiliates' && activeTab !== 'pending-payouts' && (
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(['all', 'direct', 'referral', 'agency'] as const).map((type) => {
                  const labels = { all: 'すべて', direct: '直接申込', referral: 'プロ紹介', agency: '代理店経由' };
                  return (
                    <button key={type} onClick={() => setFilterType(type)} style={{ padding: '6px 14px', borderRadius: '20px', border: filterType === type ? '2px solid #3182ce' : '1px solid #cbd5e0', background: filterType === type ? '#ebf8ff' : '#fff', fontWeight: filterType === type ? 'bold' : 'normal', color: filterType === type ? '#1d4ed8' : '#475569', cursor: 'pointer', fontSize: '13px' }}>
                      {labels[type]}
                    </button>
                  );
                })}
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <input type="text" placeholder="🔍 店舗名・ID・メール・電話・住所で検索" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f7fafc', borderBottom: '2px solid #edf2f7' }}>
                    <th style={{ padding: '10px', color: '#4a5568' }}>店舗名</th>
                    <th style={{ padding: '10px', color: '#4a5568' }}>ID</th>
                    <th style={{ padding: '10px', color: '#4a5568' }}>プラン</th>
                    <th style={{ padding: '10px', color: '#4a5568' }}>メール</th>
                    <th style={{ padding: '10px', color: '#4a5568' }}>電話</th>
                    <th style={{ padding: '10px', color: '#4a5568' }}>住所</th>
                    <th style={{ padding: '10px', color: '#4a5568' }}>流入</th>
                    <th style={{ padding: '10px', color: '#4a5568', textAlign: 'center' }}>顧客数</th>
                    <th style={{ padding: '10px', color: '#4a5568', textAlign: 'center' }}>PUSH</th>
                    <th style={{ padding: '10px', color: '#4a5568' }}>ステータス</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShops.map((shop) => {
                    const statusMap: Record<string, { label: string; bg: string; color: string }> = {
                      'active': { label: '契約中', bg: '#c6f6d5', color: '#22543d' },
                      'payment_warning': { label: '支払い警告', bg: '#fef3c7', color: '#d97706' },
                      'send_disabled': { label: '送信停止', bg: '#fecaca', color: '#dc2626' },
                      'canceled': { label: '退会済み', bg: '#f1f5f9', color: '#64748b' },
                      'cancelled': { label: '退会済み', bg: '#f1f5f9', color: '#64748b' },
                      'pending_payment': { label: '仮登録（未決済）', bg: '#fef3c7', color: '#d97706' },
                    };
                    const s = statusMap[shop.status?.toLowerCase() || ''] || { label: '契約中', bg: '#c6f6d5', color: '#22543d' };

                    return (
                      <tr key={shop.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{shop.name || '未設定'}</td>
                        <td style={{ padding: '10px', fontFamily: 'monospace', fontSize: '11px', color: '#64748b' }}>{shop.id}</td>
                        <td style={{ padding: '10px' }}>
                          <span style={{ padding: '2px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', background: shop.plan === 'pro' ? '#fef3c7' : shop.plan === 'standard' ? '#dbeafe' : '#f1f5f9', color: shop.plan === 'pro' ? '#b45309' : shop.plan === 'standard' ? '#1d4ed8' : '#475569' }}>
                            {shop.plan?.toUpperCase() || 'LIGHT'}
                          </span>
                        </td>
                        <td style={{ padding: '10px', fontSize: '12px' }}>{shop.email || '-'}</td>
                        <td style={{ padding: '10px', fontSize: '12px' }}>{shop.phone || '-'}</td>
                        <td style={{ padding: '10px', fontSize: '12px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={shop.address || ''}>{shop.address || '-'}</td>
                        <td style={{ padding: '10px' }}>
                          <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', background: shop.agencyId ? '#c6f6d5' : shop.referrerId ? '#feebc8' : '#edf2f7', color: shop.agencyId ? '#22543d' : shop.referrerId ? '#742a2a' : '#4a5568' }}>
                            {shop.agencyId ? '代理店' : shop.referrerId ? '紹介' : '直接'}
                          </span>
                        </td>
                        <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#0284c7' }}>{shop.subscriberCount || 0}</td>
                        <td style={{ padding: '10px', textAlign: 'center', color: '#2d3748' }}>{shop.pushCount || 0}</td>
                        <td style={{ padding: '10px' }}>
                          <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', background: s.bg, color: s.color }}>{s.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredShops.length === 0 && (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>条件に一致する店舗はありません</p>
            )}
          </div>
        )}

        
　　　　　　　　　　　　　　　　{activeTab === 'agencies' && <AgenciesTab />}
        {activeTab === 'agency-monthly' && <AgencyMonthlyTab />}
        {activeTab === 'affiliates' && <AffiliatesTab />}
        {activeTab === 'pending-payouts' && <PendingPayoutsTab />}
        {activeTab === 'payment-failures' && <PaymentFailuresTab />}
      </main>
    </div>
  );
}
