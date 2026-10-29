'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ShopPop from '@/components/print/ShopPop';
import type { ShopPopData } from '@/lib/print/types';
import '@/app/print/print.css';

function PopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const shopId = searchParams.get('s') || '';
  const sizeParam = searchParams.get('size');
  
  // 👇 a5 から b5 に変更
  const size: 'a4' | 'b5' = sizeParam === 'b5' ? 'b5' : 'a4';

  const [data, setData] = useState<ShopPopData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!shopId) {
      setError('店舗IDが指定されていません。');
      return;
    }

    fetch(`/api/shop-info?s=${encodeURIComponent(shopId)}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((res) => {
        if (!res.success) throw new Error(res.error || '店舗情報の取得に失敗しました');

        const appUrl =
          process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

        setData({
          shopId: res.shopId,
          shopName: res.name || '店舗',
          subscribeUrl: `${appUrl}/subscribe?s=${res.shopId}`,
          plan: (res.plan || 'light') as ShopPopData['plan'],
          firstCoupon: res.coupon
            ? {
                enabled: res.coupon.enabled === true,
                title: res.coupon.title || '',
                description: res.coupon.description || '',
              }
            : undefined,
        });
      })
      .catch((e) => setError(e.message));
  }, [shopId]);

  useEffect(() => {
    document.title = `店頭ポップ（${size.toUpperCase()}） | Push-taro`;
    return () => {
      document.title = 'Push-taro';
    };
  }, [size]);

  if (error) {
    return (
      <main style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
        <p style={{ color: '#dc2626' }}>{error}</p>
        <button onClick={() => window.close()}>← 閉じる</button>
      </main>
    );
  }

  if (!data) {
    return <main style={{ padding: 40, textAlign: 'center' }}>読み込み中...</main>;
  }

  // 👇 a5 から b5 に変更
  const switchSize = (nextSize: 'a4' | 'b5') => {
    router.replace(`/shop/print/pop?s=${shopId}&size=${nextSize}`);
  };

  const returnTo = searchParams.get('returnTo') || '/shop';

  const handleClose = () => {
    window.close();
    setTimeout(() => {
      window.location.href = returnTo;
    }, 200);
  };

  return (
    <div className="print-wrap">
      <div className="print-toolbar no-print">
        <div className="print-toolbar-info">
          {/* 👇 表示テキストとサイズをB5に変更 */}
          <strong>店頭ポップ（{size === 'a4' ? 'A4 縦' : 'B5 縦'}）</strong>
          <span>{size === 'a4' ? '210×297mm' : '182×257mm'}／店頭掲示用</span>
        </div>
        <div className="print-toolbar-actions">
          <button onClick={() => switchSize(size === 'a4' ? 'b5' : 'a4')}>
            📐 {size === 'a4' ? 'B5に切り替え' : 'A4に切り替え'}
          </button>
          <button className="primary" onClick={() => window.print()}>
            🖨️ 印刷 / PDF保存
          </button>
          <button onClick={handleClose}>← 閉じる</button>
        </div>
      </div>

      <div className="print-note no-print">
        💡 「PDFに保存」を選ぶと、コンビニのマルチコピー機でも印刷できます。レジ横やカウンターに立ててご利用ください。
      </div>

      <div className="print-doc">
        <ShopPop data={data} size={size} />
      </div>
    </div>
  );
}

export default function ShopPopPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>読み込み中...</div>}>
      <PopContent />
    </Suspense>
  );
}
