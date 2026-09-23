'use client';

import { useState, useEffect } from 'react';
import type { PrintMaterialType } from '@/lib/print/types';
import { PRINT_MATERIALS } from '@/lib/print/constants';
import { SAMPLE_DATA } from '@/lib/print/sample-data';

import TrifoldBrochure from '@/components/print/TrifoldBrochure';
import LeafletA5 from '@/components/print/LeafletA5';
import LeafletA4 from '@/components/print/LeafletA4';
import BusinessCard from '@/components/print/BusinessCard';
import Card from '@/components/print/Card';

import '@/app/print/print.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function PromoToolsModal({ isOpen, onClose }: Props) {
  const [activeType, setActiveType] = useState<PrintMaterialType>('trifold');

  // ESCキーで閉じる
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const renderPreview = () => {
    switch (activeType) {
      case 'trifold':
        return <TrifoldBrochure data={SAMPLE_DATA} />;
      case 'leaflet-a4':
        return <LeafletA4 data={SAMPLE_DATA} />;
      case 'leaflet-a5':
        return <LeafletA5 data={SAMPLE_DATA} />;
      case 'business-card':
        return <BusinessCard data={SAMPLE_DATA} />;
      case 'card':
        return <Card data={SAMPLE_DATA} />;
      default:
        return null;
    }
  };

  return (
    <div className="promo-modal-overlay" onClick={onClose}>
      <div className="promo-modal" onClick={(e) => e.stopPropagation()}>
        {/* ヘッダー */}
        <div className="promo-modal-head">
          <div>
            <h2>販促ツール サンプル</h2>
            <p>あなたの会社名・紹介コード入りで、こう仕上がります。</p>
          </div>
          <button className="promo-modal-close" onClick={onClose} aria-label="閉じる">
            ✕
          </button>
        </div>

        {/* タブ */}
        <div className="promo-modal-tabs">
          {PRINT_MATERIALS.map((m) => (
            <button
              key={m.type}
              className={`promo-modal-tab ${activeType === m.type ? 'is-active' : ''}`}
              onClick={() => setActiveType(m.type)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* プレビュー */}
        <div className="promo-modal-body">
          <div className="promo-modal-preview">
            {renderPreview()}
          </div>
        </div>

        {/* フッター */}
        <div className="promo-modal-foot">
          <p>※ 実際のダウンロードは、管理画面から行えます。</p>
        </div>
      </div>

      <style jsx global>{`
        .promo-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          overflow-y: auto;
        }

        .promo-modal {
          background: #f8fafc;
          border-radius: 16px;
          width: 100%;
          max-width: 1200px;
          max-height: 92vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
        }

        .promo-modal-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 20px 28px;
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          flex-shrink: 0;
        }
        .promo-modal-head h2 {
          font-size: 18px;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 4px;
        }
        .promo-modal-head p {
          font-size: 13px;
          color: #64748b;
          margin: 0;
        }
        .promo-modal-close {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #f1f5f9;
          border: none;
          font-size: 16px;
          cursor: pointer;
          color: #64748b;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .promo-modal-close:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .promo-modal-tabs {
          display: flex;
          gap: 4px;
          padding: 16px 28px 0;
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          overflow-x: auto;
          flex-shrink: 0;
        }
        .promo-modal-tab {
          padding: 10px 18px;
          background: transparent;
          border: none;
          font-size: 13px;
          font-weight: 800;
          color: #64748b;
          cursor: pointer;
          white-space: nowrap;
          border-bottom: 3px solid transparent;
          margin-bottom: -1px;
          transition: all 0.2s;
        }
        .promo-modal-tab:hover {
          color: #0f172a;
        }
        .promo-modal-tab.is-active {
          color: #ff4500;
          border-bottom-color: #ff4500;
        }

        .promo-modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 32px 28px;
          background: #e2e8f0;
        }
        .promo-modal-preview {
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }
        /* 印刷用 .p-page を縮小 */
        .promo-modal-preview .p-page {
          transform: scale(0.75);
          transform-origin: top center;
        }

        .promo-modal-foot {
          padding: 12px 28px;
          background: #fff;
          border-top: 1px solid #e2e8f0;
          flex-shrink: 0;
        }
        .promo-modal-foot p {
          font-size: 12px;
          color: #94a3b8;
          margin: 0;
          text-align: center;
        }

        @media (max-width: 768px) {
          .promo-modal-overlay { padding: 0; }
          .promo-modal {
            max-width: 100%;
            max-height: 100vh;
            border-radius: 0;
          }
          .promo-modal-head,
          .promo-modal-tabs,
          .promo-modal-body,
          .promo-modal-foot { padding-left: 16px; padding-right: 16px; }
          .promo-modal-preview .p-page {
            transform: scale(0.4);
          }
        }
      `}</style>
    </div>
  );
}
