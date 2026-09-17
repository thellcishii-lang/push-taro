// app/guide/Header.tsx
'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e2e8f0',
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
      }}>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 20,
            fontWeight: 900,
            color: '#0f172a',
            letterSpacing: '-0.5px',
            textDecoration: 'none',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="gLogo" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ff6b6b" />
                <stop offset="100%" stopColor="#ff4500" />
              </linearGradient>
            </defs>
            <circle cx="24" cy="24" r="23" fill="url(#gLogo)" />
            <path d="M24 8 L33 22 L28 22 L28 30 L20 30 L20 22 L15 22 Z" fill="#ffffff" />
            <circle cx="24" cy="20" r="3" fill="#ff4500" opacity="0.5" />
            <path d="M18 30 L14 38 L20 34 Z" fill="#ffffff" />
            <path d="M30 30 L34 38 L28 34 Z" fill="#ffffff" />
            <path d="M22 30 L24 40 L26 30 Z" fill="#fbbf24" />
          </svg>
          Push-taro
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#64748b',
            marginLeft: 4,
          }}>
            / 使い方ガイド
          </span>
        </Link>

        <Link
          href="/signup"
          style={{
            background: '#ff4500',
            color: '#fff',
            padding: '10px 22px',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 14,
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(255,69,0,0.25)',
          }}
        >
          今すぐ申し込む →
        </Link>
      </div>
    </nav>
  );
}
