'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentCheckContent() {
  const searchParams = useSearchParams();
  const shopId = searchParams.get('shopId');
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shopId) {
      // shopId が存在しない場合はトップページまたはログイン画面へ
      window.location.href = '/admin';
      return;
    }

    // 店舗の最新ステータスを取得
    fetch(`/api/shop-info?s=${shopId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.status === 'active') {
          // 🔑 支払い済み（active）の場合はメッセージ画面を表示（リダイレクトしない）
          setIsActive(true);
          setLoading(false);
          return;
        }

        // 未決済（pending_payment等）の場合のみ Square の決済画面へリダイレクト
        const plan = data.plan || 'light';
        
        // APIから送られてくる決済URLがあればそれを優先、無ければプラン別リンク
        let paymentUrl = data.paymentUrl || '';

        if (!paymentUrl) {
          if (plan === 'light') paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_LIGHT || process.env.NEXT_PUBLIC_SQUARE_LINK_TEST || 'https://square.link/u/pORV1sXA';
          else if (plan === 'standard') paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_STANDARD || process.env.NEXT_PUBLIC_SQUARE_LINK_TEST || 'https://square.link/u/pORV1sXA';
          else if (plan === 'pro') paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_PRO || process.env.NEXT_PUBLIC_SQUARE_LINK_TEST || 'https://square.link/u/pORV1sXA';
        }

        window.location.href = paymentUrl;
      })
      .catch((err) => {
        console.error('店舗情報取得エラー:', err);
        setLoading(false);
      });
  }, [shopId]);

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', fontSize: 16 }}>決済ステータスを確認中...</div>;
  }

  if (isActive) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', maxWidth: 500, margin: '0 auto', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 22, color: '#1e293b', marginBottom: 12 }}>お支払いは完了しています</h2>
        <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
          この度はご登録ありがとうございます。<br />
          すでに本登録・決済手続きが完了しておりますので、追加の決済は不要です。
        </p>
        <a
          href="/admin"
          style={{
            display: 'inline-block',
            marginTop: 24,
            padding: '14px 28px',
            background: '#ff4500',
            color: '#fff',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: 16,
            boxShadow: '0 4px 12px rgba(255, 69, 0, 0.3)',
          }}
        >
          管理画面へログインする
        </a>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, textAlign: 'center', fontSize: 14, color: '#64748b' }}>
      決済画面へリダイレクトしています...
    </div>
  );
}
