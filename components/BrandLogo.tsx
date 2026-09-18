// components/BrandLogo.tsx
import Link from 'next/link';

interface BrandLogoProps {
  tagline?: string;
  className?: string;
  taglineStyle?: 'plain' | 'badge';
}

export default function BrandLogo({
  tagline = '実店舗のためのPush通知CRM',
  className,
  taglineStyle = 'plain',
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans JP", sans-serif',
        fontSize: '22px',
        fontWeight: 900,
        color: '#0f172a',
        letterSpacing: '-0.5px',
        textDecoration: 'none',
        lineHeight: 1,
      }}
    >
      {/* ロケットマーク */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '34px',
          height: '34px',
          flexShrink: 0,
          marginRight: '8px',
        }}
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

      {/* Push-taro ロゴ文字 */}
      <span style={{ color: '#0f172a' }}>Push-taro</span>
      <span style={{ color: '#ff4500', marginLeft: '1px' }}>.</span>

      {/* タグライン */}
      {tagline && (
        <small
          style={
            taglineStyle === 'badge'
              ? {
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#ff4500',
                  background: '#fff7ed',
                  border: '1.5px solid #ff4500',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  marginLeft: '10px',
                  letterSpacing: '0.3px',
                }
              : {
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#64748b',
                  letterSpacing: 0,
                  marginLeft: '8px',
                }
          }
        >
          {tagline}
        </small>
      )}
    </Link>
  );
}
