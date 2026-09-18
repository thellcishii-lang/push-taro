// components/BrandLogo.tsx
import Link from 'next/link';

interface BrandLogoProps {
  tagline?: string;
  className?: string;
}

// LPのTOP(app/page.tsx)と同じロケットロゴ・「Push-taro.」表記を全ページで共通利用するためのコンポーネント
export default function BrandLogo({ tagline, className }: BrandLogoProps) {
  return (
    <Link href="/" className={`brand-logo${className ? ` ${className}` : ''}`}>
      <svg className="brand-logo-mark" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="brandLogoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="100%" stopColor="#ff4500" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="23" fill="url(#brandLogoGrad)" />
        <path d="M24 8 L33 22 L28 22 L28 30 L20 30 L20 22 L15 22 Z" fill="#ffffff" />
        <circle cx="24" cy="20" r="3" fill="#ff4500" opacity="0.5" />
        <path d="M18 30 L14 38 L20 34 Z" fill="#ffffff" />
        <path d="M30 30 L34 38 L28 34 Z" fill="#ffffff" />
        <path d="M22 30 L24 40 L26 30 Z" fill="#fbbf24" />
      </svg>
      Push-taro<span className="brand-logo-dot">.</span>
      {tagline && <small className="brand-logo-tagline">{tagline}</small>}
      <style jsx>{`
        .brand-logo {
          display: flex;
          align-items: center;
          font-size: 22px;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.5px;
          text-decoration: none;
        }
        .brand-logo-mark {
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          margin-right: 8px;
        }
        .brand-logo-dot {
          color: #ff4500;
          margin-left: 1px;
        }
        .brand-logo-tagline {
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          letter-spacing: 0;
          margin-left: 8px;
        }
      `}</style>
    </Link>
  );
}
