'use client';

import { useEffect, useState, type ComponentType } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import TrifoldBrochure from '@/components/print/TrifoldBrochure';
import LeafletA4 from '@/components/print/LeafletA4';
import LeafletA5 from '@/components/print/LeafletA5';
import Card from '@/components/print/Card';
import BusinessCard from '@/components/print/BusinessCard';
import type { PartnerPrintData, PrintMaterialType } from '@/lib/print/types';

const COMPONENTS: Record<PrintMaterialType, ComponentType<{ data: PartnerPrintData }>> = {
  trifold: TrifoldBrochure,
  'leaflet-a4': LeafletA4,
  'leaflet-a5': LeafletA5,
  card: Card,
  'business-card': BusinessCard,
};

const SPECS: Record<PrintMaterialType, { trimW: number; trimH: number; bleed: number }> = {
  trifold:         { trimW: 297, trimH: 210, bleed: 3 },
  'leaflet-a4':    { trimW: 210, trimH: 297, bleed: 3 },
  'leaflet-a5':    { trimW: 148, trimH: 210, bleed: 3 },
  card:            { trimW: 91,  trimH: 55,  bleed: 3 },
  'business-card': { trimW: 91,  trimH: 55,  bleed: 3 },
};

export default function PrintRenderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const type = String(params.type) as PrintMaterialType;

  const [data, setData] = useState<PartnerPrintData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const encoded = searchParams.get('d');
    if (!encoded) { setError('no data'); return; }
    try {
      const json = decodeURIComponent(escape(atob(encoded)));
      setData(JSON.parse(json));
    } catch {
      setError('decode error');
    }
  }, [searchParams]);

  if (error) return <div style={{ padding: 20 }}>{error}</div>;
  if (!data) return <div style={{ padding: 20 }}>Loading...</div>;

  const Component = COMPONENTS[type];
  const spec = SPECS[type];
  if (!Component || !spec) return <div style={{ padding: 20 }}>unsupported type: {type}</div>;

  const PAGE_W = spec.trimW + spec.bleed * 2;
  const PAGE_H = spec.trimH + spec.bleed * 2;

  return (
    <>
      <div className="bleed-wrap" data-type={type}>
        <Component data={data} />
      </div>

      <style jsx global>{`
        @page {
          size: ${PAGE_W}mm ${PAGE_H}mm;
          margin: 0;
        }
        html, body {
          margin: 0;
          padding: 0;
          background: #fff;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .bleed-wrap {
          padding: ${spec.bleed}mm;
          box-sizing: border-box;
          width: ${PAGE_W}mm;
        }
        .bleed-wrap .p-page {
          position: relative;
          overflow: visible !important;
          box-shadow: none !important;
          page-break-after: always;
          break-after: page;
        }
        .bleed-wrap .p-page:last-child {
          page-break-after: auto;
          break-after: auto;
        }
        .bleed-wrap .p-page::before {
          content: '';
          position: absolute;
          inset: -${spec.bleed}mm;
          z-index: 0;
          pointer-events: none;
        }
        .bleed-wrap .p-page > * {
          position: relative;
          z-index: 1;
        }

        /* 塗り足しの背景色（type別） */
        .bleed-wrap[data-type="trifold"] .p-page:nth-of-type(1)::before {
          background: linear-gradient(to right,
            #fffbf5 0 33.66%, #fafafa 33.66% 66.34%, #0f172a 66.34% 100%);
        }
        .bleed-wrap[data-type="trifold"] .p-page:nth-of-type(2)::before {
          background: #ffffff;
        }
        .bleed-wrap[data-type="leaflet-a4"] .p-page:nth-of-type(1)::before,
        .bleed-wrap[data-type="leaflet-a5"] .p-page:nth-of-type(1)::before,
        .bleed-wrap[data-type="card"] .p-page:nth-of-type(1)::before,
        .bleed-wrap[data-type="business-card"] .p-page:nth-of-type(1)::before {
          background: #0f172a;
        }
        .bleed-wrap[data-type="leaflet-a4"] .p-page:nth-of-type(2)::before,
        .bleed-wrap[data-type="leaflet-a5"] .p-page:nth-of-type(2)::before,
        .bleed-wrap[data-type="card"] .p-page:nth-of-type(2)::before,
        .bleed-wrap[data-type="business-card"] .p-page:nth-of-type(2)::before {
          background: #ffffff;
        }
      `}</style>
    </>
  );
}
