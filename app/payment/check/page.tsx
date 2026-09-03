'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentCheckPage() {
  const searchParams = useSearchParams();
  const shopId = searchParams.get('shopId');
  const [status, setStatus] = useState<'loading' | 'pending' | 'active' | 'error'>('loading');

  useEffect(() => {
    if (!shopId) {
      setStatus('error');
      return;
    }

    fetch(`/api/shop-info?s=${shopId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.status === 'active') {
          setStatus('active');
        } else if (data.success && data.status === 'pending_payment') {
          setStatus('pending');
          // Square決済リンクにリダイレクト
          const plan = data.plan || 'light';
          let paymentUrl = '';
          if (plan === 'light') paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_LIGHT || '';
          else if (plan === 'standard') paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_STANDARD || '';
          else if (plan === 'pro') paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_PRO || '';
          window.location.href = paymentUrl;
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [shopId]);

  if (status === 'loading') {
    return <div style={{ padding: 40, textAlign: 'center' }}>確認中...</div>;
  }

  if (status === 'active') {
    return (
      <div style={{ padding: 40, textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
        <h2>✅ 決済は完了しています</h2>
        <p>この度はご登録ありがとうございます。</p>
        <p>すでに決済が完了しておりますので、追加の決済手続きは不要です。</p>
        <a href="/admin" style={{ display: 'inline-block', marginTop: 20, padding: '12px 24px', background: '#ff4500', color: '#fff', borderRadius: 6, textDecoration: 'none' }}>
          管理画面へログイン
        </a>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h2>❌ エラーが発生しました</h2>
      <p>決済情報を確認できませんでした。サポートまでお問い合わせください。</p>
    </div>
  );
}
