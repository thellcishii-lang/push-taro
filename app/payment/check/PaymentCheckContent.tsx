'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentCheckContent() {
  const searchParams = useSearchParams();
  const shopId = searchParams.get('shopId');

  useEffect(() => {
    if (!shopId) {
      // shopIdがない場合も、とりあえずSquareテストリンクに飛ばす
      window.location.href = 'https://square.link/u/pORV1sXA';
      return;
    }

    fetch(`/api/shop-info?s=${shopId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.status === 'active') {
          // 決済済みなら「決済済み」ページを表示
          // ここでは何もせず、ページがそのまま表示される
          return;
        }
        // active 以外（pending やエラーも含めて）すべて決済ページに飛ばす
        window.location.href = 'https://square.link/u/pORV1sXA';
      })
      .catch(() => {
        // エラーが起きても決済ページに飛ばす
        window.location.href = 'https://square.link/u/pORV1sXA';
      });
  }, [shopId]);

  // 決済済み（active）の場合のみ表示
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
