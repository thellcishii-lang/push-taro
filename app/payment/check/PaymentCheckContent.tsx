'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentCheckContent() {
  const searchParams = useSearchParams();
  const shopId = searchParams.get('shopId');
  const [status, setStatus] = useState<'loading' | 'pending' | 'active' | 'error'>('loading');

  useEffect(() => {
    if (!shopId) {
      setStatus('error');
      return;
    }

    fetch(`/api/shop-info?s=${shopId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('API error');
        }
        return res.json();
      })
      .then((data) => {
        if (data.success && data.status === 'active') {
          setStatus('active');
          return;
        }
        if (data.success) {
          // active 以外は pending 扱い（テスト用リンクにリダイレクト）
          setStatus('pending');
          const paymentUrl = 'https://square.link/u/pORV1sXA';
          window.location.href = paymentUrl;
          return;
        }
        setStatus('error');
      })
      .catch(() => {
        setStatus('error');
      });
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
        <a
          href="/admin"
          style={{
            display: 'inline-block',
            marginTop: 20,
            padding: '12px 24px',
            background: '#ff4500',
            color: '#fff',
            borderRadius: 6,
            textDecoration: 'none',
          }}
        >
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
