'use client';

import { useEffect, useState } from 'react';

export default function NotificationBackButton() {
  const [returnTo, setReturnTo] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const target = params.get('returnTo') || '';
    if (target.startsWith('/')) setReturnTo(target);
  }, []);

  if (!returnTo) return null;

  return (
    <a
      href={returnTo}
      style={{
        position: 'fixed',
        top: 'max(12px, env(safe-area-inset-top))',
        left: '12px',
        zIndex: 1000,
        padding: '9px 14px',
        background: '#1e293b',
        color: '#fff',
        borderRadius: '6px',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: 'bold',
        boxShadow: '0 2px 8px rgba(0,0,0,.2)',
      }}
    >
      ← 顧客画面へ戻る
    </a>
  );
}