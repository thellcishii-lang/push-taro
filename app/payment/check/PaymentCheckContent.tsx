'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentCheckContent() {
  const searchParams = useSearchParams();
  const shopId = searchParams.get('shopId') || searchParams.get('s');
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_TEST || 'https://square.link/u/pORV1sXA';

    if (!shopId) {
      window.location.href = testUrl;
      return;
    }

    fetch(`/api/shop-info?s=${shopId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          window.location.href = testUrl;
          return;
        }

        // 🔑 ① アップグレード専用フィールド（upgradeStatus）をピンポイントで読み出す
        if (data.upgradeStatus === 'pending_payment') {
          // アップグレードの未決済なので Square へリダイレクト
          window.location.href = testUrl;
          return;
        }

        // 🔑 ② 新規用のステータス（status）を読み出す
        if (data.status === 'pending_payment') {
          // 新規登録の未決済なので Square へリダイレクト
          window.location.href = testUrl;
          return;
        }

        // 🔑 ③ 上記の pending_payment（未決済）に該当しない場合はすべて支払い済み！
        setIsActive(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[PaymentCheck] エラー:', err);
        window.location.href = testUrl;
      });
  }, [shopId]);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h3>決済ステータスを確認中...</h3>
      </div>
    );
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

  return null;
}
