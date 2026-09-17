// app/guide/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <>
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
    </>
  );
}
