'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import { PRINT_MATERIALS } from '@/lib/print/constants';
import type { PartnerPrintData, PrintMaterialType } from '@/lib/print/types';
import TrifoldBrochure from '@/components/print/TrifoldBrochure';
import LeafletA5 from '@/components/print/LeafletA5';
import LeafletA4 from '@/components/print/LeafletA4';
import BusinessCard from '@/components/print/BusinessCard';
import Card from '@/components/print/Card';
import '../print.css';

const VALID_TYPES: PrintMaterialType[] = [
  'trifold', 'leaflet-a5', 'leaflet-a4', 'card', 'business-card',
];

export default function PrintPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const type = String(params.type || '') as PrintMaterialType;

  const [data, setData] = useState<PartnerPrintData | null>(null);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!VALID_TYPES.includes(type)) {
      setError('不明なテンプレートです。');
      return;
    }

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push('/');
        return;
      }
      try {
        const idToken = await u.getIdToken();
        const res = await fetch('/api/print-materials', {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!res.ok) {
          setError('パートナー情報の取得に失敗しました。');
          return;
        }
        setData(await res.json());
      } catch {
        setError('通信エラーが発生しました。');
      }
    });
    return () => unsub();
  }, [type, router]);

  async function handleDownload() {
    if (!data) return;
    setDownloading(true);
    try {
      const res = await fetch('/api/print-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'PDF生成に失敗しました');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(e.message || 'PDF生成に失敗しました');
    } finally {
      setDownloading(false);
    }
  }

  if (error) {
    return (
      <main style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
        <p style={{ color: '#dc2626' }}>{error}</p>
        <button onClick={() => router.back()}>← 戻る</button>
      </main>
    );
  }

  if (!data) {
    return (
      <main style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
        <p>読み込み中...</p>
      </main>
    );
  }

  const meta = PRINT_MATERIALS.find((m) => m.type === type)!;

  const props = { data };
  const Template =
    type === 'trifold' ? <TrifoldBrochure {...props} />
    : type === 'leaflet-a5' ? <LeafletA5 {...props} />
    : type === 'leaflet-a4' ? <LeafletA4 {...props} />
    : type === 'card' ? <Card {...props} />
    : <BusinessCard {...props} />;

  return (
    <div className="print-wrap">
      <div className="print-toolbar no-print">
        <div className="print-toolbar-info">
          <strong>{meta.label}</strong>
          <span>{meta.sizeText}／{meta.pagesText}</span>
        </div>
        <div className="print-toolbar-actions">
          <button onClick={() => router.back()}>← 戻る</button>
          <button className="primary" onClick={handleDownload} disabled={downloading}>
            {downloading ? '⏳ 生成中…' : '⬇️ 入稿用PDFをダウンロード'}
          </button>
        </div>
      </div>

      <div className="print-note no-print">
        💡 「入稿用PDFをダウンロード」を押すと、塗り足し3mm込みのPDFが落ちてきます。
      </div>

      <div className="print-doc">
        {Template}
      </div>
    </div>
  );
}
