'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, ReactNode } from 'react';
import './guide.css';

export default function GuideLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <div>
      {/* ヘッダー */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 1000,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '14px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 24,
        }}>
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 20, fontWeight: 900, color: '#0f172a',
            letterSpacing: '-0.5px', textDecoration: 'none',
          }}>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginLeft: 4 }}>
              / 使い方ガイド
            </span>
          </Link>
          <Link href="/signup" style={{
            background: '#ff4500', color: '#fff',
            padding: '10px 22px', borderRadius: 8,
            fontWeight: 700, fontSize: 14, textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(255,69,0,0.25)',
          }}>
            今すぐ申し込む →
          </Link>
        </div>
      </nav>

      <div className="guide-layout">

        {/* モバイル用トグル */}
        <button
          className="guide-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ gridColumn: '1 / -1' }}
        >
          <span>📖 メニュー</span>
          <span>{mobileOpen ? '▲' : '▼'}</span>
        </button>

        {/* サイドバー */}
        <aside className={`guide-sidebar ${mobileOpen ? '' : 'collapsed'}`}>
          <h3>業種別ガイド</h3>
          <nav>
            <Link href="/guide/salon" className={isActive('/guide/salon') ? 'active' : ''}>
              <span className="sidebar-icon">💇</span>
              美容室・サロン
              <span className="sidebar-badge">NEW</span>
            </Link>
            <Link href="/guide/cafe" className={isActive('/guide/cafe') ? 'active' : ''}>
              <span className="sidebar-icon">☕</span>
              飲食店・カフェ
            </Link>
            <Link href="/guide/massage" className={isActive('/guide/massage') ? 'active' : ''}>
              <span className="sidebar-icon">💆</span>
              マッサージ・エステ
            </Link>
            <Link href="/guide/apparel" className={isActive('/guide/apparel') ? 'active' : ''}>
              <span className="sidebar-icon">👕</span>
              アパレル・雑貨
            </Link>
          </nav>

          <h3>テーマ別ガイド</h3>
          <nav>
            <Link href="/guide/themes/new-customer" className={isActive('/guide/themes/new-customer') ? 'active' : ''}>
              <span className="sidebar-icon">🆕</span>
              新規顧客の獲得
            </Link>
            <Link href="/guide/themes/repeat" className={isActive('/guide/themes/repeat') ? 'active' : ''}>
              <span className="sidebar-icon">🔄</span>
              リピート施策
            </Link>
            <Link href="/guide/themes/dormant" className={isActive('/guide/themes/dormant') ? 'active' : ''}>
              <span className="sidebar-icon">💤</span>
              休眠顧客の復活
            </Link>
            <Link href="/guide/themes/birthday" className={isActive('/guide/themes/birthday') ? 'active' : ''}>
              <span className="sidebar-icon">🎂</span>
              誕生日クーポン
            </Link>
          </nav>

          <h3>運用ノウハウ</h3>
          <nav>
            <Link href="/guide/ng-actions" className={isActive('/guide/ng-actions') ? 'active' : ''}>
              <span className="sidebar-icon">⚠️</span>
              NG行為集
            </Link>
            <Link href="/guide/case-studies" className={isActive('/guide/case-studies') ? 'active' : ''}>
              <span className="sidebar-icon">📈</span>
              導入事例
            </Link>
            <Link href="/guide/faq" className={isActive('/guide/faq') ? 'active' : ''}>
              <span className="sidebar-icon">❓</span>
              運用FAQ
            </Link>
          </nav>

          <h3>その他</h3>
          <nav>
            <Link href="/guide" className={pathname === '/guide' ? 'active' : ''}>
              <span className="sidebar-icon">🏠</span>
              ガイドTOP
            </Link>
            <Link href="/">
              <span className="sidebar-icon">🚀</span>
              サービスTOPへ
            </Link>
          </nav>
        </aside>

        {/* メインコンテンツ */}
        <main>
          {children}
        </main>

      </div>
    </div>
  );
}
