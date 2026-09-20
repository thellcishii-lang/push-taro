'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function NotificationLinkContent() {
  const searchParams = useSearchParams();
  const rawTarget = searchParams.get('target') || '';

  let target = '';
  try {
    const parsed = new URL(rawTarget);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') target = parsed.toString();
  } catch {}

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#f8fafc', fontFamily: 'sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '440px', padding: '32px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'center', boxSizing: 'border-box' }}>
        <h1 style={{ margin: '0 0 12px', fontSize: '22px', color: '#1e293b' }}>お知らせのリンク</h1>
        <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: '14px', lineHeight: 1.7 }}>
          リンク先をブラウザで開くか、顧客画面へ戻ってください。
        </p>
        {target ? (
          <a
            href={target}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', padding: '13px 18px', background: '#ff4500', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', marginBottom: '12px' }}
          >
            リンク先をブラウザで開く
          </a>
        ) : (
          <p role="alert" style={{ padding: '12px', background: '#fff5f5', color: '#c53030', borderRadius: '6px' }}>リンク先が正しくありません。</p>
        )}
      </div>
    </main>
  );
}

export default function NotificationLinkPage() {
  return (
    <Suspense fallback={<main style={{ padding: '40px', textAlign: 'center' }}>読み込み中...</main>}>
      <NotificationLinkContent />
    </Suspense>
  );
}