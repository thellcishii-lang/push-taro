'use client';

import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';

interface AdminHeaderProps {
  shopName: string;
  shopIconUrl?: string;
  plan: string | null;
  role: 'normal' | 'pro' | 'agency';
  email: string;
  isProPlan: boolean;
}

export function AdminHeader({ shopName, shopIconUrl, plan, role, email, isProPlan }: AdminHeaderProps) {
  // プランバッジの色を決定
  const getBadgeColor = () => {
    if (role === 'agency') return '#8b5cf6';
    if (isProPlan) return '#ff4500';
    if (String(plan).toLowerCase() === 'standard') return '#0284c7';
    return '#64748b';
  };

  const getBadgeText = () => {
    if (role === 'agency') return '代理店';
    return `${String(plan || '').toUpperCase()} プラン`;
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px',
      flexWrap: 'wrap',
      gap: '10px',
      borderBottom: '2px solid #eee',
      paddingBottom: '15px'
    }}>
      {/* 左側：アイコン + 店舗名 + バッジ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {shopIconUrl ? (
          <img
            src={shopIconUrl}
            alt="アイコン"
            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ddd' }}
          />
        ) : (
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#eee' }} />
        )}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: '24px' }}>{shopName || '未設定の店舗'}</h1>
            <span style={{
              fontSize: '11px',
              fontWeight: 'bold',
              padding: '3px 8px',
              borderRadius: '12px',
              color: '#fff',
              backgroundColor: getBadgeColor()
            }}>
              {getBadgeText()}
            </span>
          </div>
        </div>
      </div>

      {/* 右側：メールアドレス + ログアウト */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '14px', color: '#666' }}>{email}</span>
        <button
          onClick={() => signOut(auth)}
          style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}
        >
          ログアウト
        </button>
      </div>
    </div>
  );
}
