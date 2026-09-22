// components/BrandLogo.tsx
import Link from 'next/link';

interface BrandLogoProps {
  className?: string;
}

export default function BrandLogo({ className = '' }: BrandLogoProps) {
  return (
    <>
      {/* LP と同じ Inter を読み込む（重複してもブラウザ側でキャッシュされる） */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      <Link href="/" className={`brand-logo ${className}`.trim()}>
        <svg
          className="brand-logo-mark"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="brandLogoGrad"
              x1="0"
              y1="0"
              x2="48"
              y2="48"
              gradientUnits="userSpaceOnUse"
            >
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

        <span className="brand-logo-name">Push-taro</span>
        <span className="brand-logo-dot">.</span>
        <small className="brand-logo-tagline">
          みんなの<span className="brand-logo-tagline-hl">プッシュ通知</span>
        </small>

        <style jsx global>{`
          .brand-logo {
            display: flex;
            align-items: center;
            /* ★ LP と同じく Inter を先頭に。日本語は Noto Sans JP へフォールバック */
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
              Roboto, 'Helvetica Neue', Arial, 'Noto Sans JP', sans-serif;
            font-size: 22px;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: -0.5px;
            text-decoration: none;
            line-height: 1;
            padding-top: 4px;
          }
          .brand-logo-mark {
            width: 34px;
            height: 34px;
            flex-shrink: 0;
            margin-right: 8px;
          }
          .brand-logo-name {
            color: #0f172a;
          }
          .brand-logo-dot {
            color: #ff4500;
            margin-left: 1px;
          }
          .brand-logo-tagline {
            font-size: 14px;
            font-weight: 600;
            color: #0f172a;
            letter-spacing: 0;
            line-height: 1;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            margin: 0 0 0 40px;
            padding: 4px;
            border: 0;
          }
          .brand-logo-tagline-hl {
            color: #ff4500;
            font-size: 22px;
            font-weight: 900;
            letter-spacing: -0.5px;
            margin-left: 2px;
            padding-top: 6px;
          }
          @media (max-width: 900px) {
            .brand-logo-tagline {
              display: none;
            }
          }
          @media (max-width: 640px) {
            .brand-logo {
              font-size: 18px;
            }
            .brand-logo-mark {
              width: 28px;
              height: 28px;
              margin-right: 6px;
            }
          }
        `}</style>
      </Link>
    </>
  );
}
