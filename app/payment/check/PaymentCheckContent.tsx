'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentCheckContent() {
  const searchParams = useSearchParams();
  const shopId = searchParams.get('shopId');
  const [isActive, setIsActive] = useState(false); // activeかどうか

  useEffect(() => {
    if (!shopId) {
      window.location.href = 'https://square.link/u/pORV1sXA';
      return;
    }

    fetch(`/api/shop-info?s=${shopId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.status === 'active') {
          setIsActive(true); // active なら表示
          return;
        }
        // active 以外はすべて Square へリダイレクト
        const plan = data.plan || 'light';
let paymentUrl = '';
if (plan === 'light') paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_TEST || 'https://square.link/u/pORV1sXA';
else if (plan === 'standard') paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_TEST || 'https://square.link/u/pORV1sXA';
else if (plan === 'pro') paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_TEST || 'https://square.link/u/pORV1sXA';
window.location.href = paymentUrl;

  }, [shopId]);

  // active のときだけ表示（それ以外はリダイレクト中 or 決済ページへ）
  if (isActive) {
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

  // それ以外は「確認中...」を表示（一瞬だけ）
  return <div style={{ padding: 40, textAlign: 'center' }}>確認中...</div>;
}
