'use client';

import { useEffect, useState, useRef } from 'react';

export default function ReaderMode() {
  // ★ 初期値を true にして、開いた瞬間から自動スクロールを開始する
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [showControls, setShowControls] = useState(false);
  
  const scrollInterval = useRef<NodeJS.Timeout | undefined>(undefined);
  const isUserInteracted = useRef(false);

  // ① スクロール処理（iOS対応のため setInterval と scrollTo を使用）
  useEffect(() => {
    if (isAutoScrolling) {
      // iOSのスクロールブロックを解除するためのハック（微小スクロール）
      window.scrollTo(0, window.scrollY + 1);

      scrollInterval.current = setInterval(() => {
        // ユーザーが手動でスクロールしている間はスキップ
        if (isUserInteracted.current) return;

        // 現在の位置から1px下にスクロール（iOSでも動きやすい）
        window.scrollTo(0, window.scrollY + 1);

        // ページの最下部に達したら停止
        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 10) {
          setIsAutoScrolling(false);
        }
      }, 30); // 30ミリ秒ごとに1pxスクロール（約33px/秒のゆっくりした速度）
    }

    return () => {
      if (scrollInterval.current) clearInterval(scrollInterval.current);
    };
  }, [isAutoScrolling]);

  // ② ユーザー操作の検知とUI表示
  useEffect(() => {
    let controlTimer: NodeJS.Timeout;

    const handleUserScroll = () => {
      // ユーザーが操作したら即座に停止
      setIsAutoScrolling(false);
      
      // 少しの間（1秒間）は自動スクロールの干渉を止める
      isUserInteracted.current = true;
      setTimeout(() => { isUserInteracted.current = false; }, 1000);
    };

    window.addEventListener('wheel', handleUserScroll, { passive: true });
    window.addEventListener('touchmove', handleUserScroll, { passive: true });
    window.addEventListener('keydown', handleUserScroll, { passive: true }); // キーボード操作も検知

    // ページを開いて3秒後にコントロールUIを表示
    controlTimer = setTimeout(() => {
      setShowControls(true);
    }, 3000);

    return () => {
      window.removeEventListener('wheel', handleUserScroll);
      window.removeEventListener('touchmove', handleUserScroll);
      window.removeEventListener('keydown', handleUserScroll);
      clearTimeout(controlTimer);
    };
  }, []);

  return (
    <>
      <div className={`reader-controls ${showControls ? 'is-visible' : ''}`}>
        <button 
          onClick={() => setIsAutoScrolling(!isAutoScrolling)}
          className={`reader-btn ${isAutoScrolling ? 'is-active' : ''}`}
        >
          {isAutoScrolling ? '⏸ 自動スクロールを止める' : '▶ 自動スクロールを再開'}
        </button>
      </div>

      <style jsx global>{`
        .reader-controls {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          opacity: 0;
          visibility: hidden;
          z-index: 9999;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .reader-controls.is-visible {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }
        .reader-btn {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
          padding: 12px 24px;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }
        .reader-btn:hover {
          background: rgba(255, 69, 0, 0.9);
          border-color: rgba(255, 69, 0, 0.5);
          transform: scale(1.02);
        }
        .reader-btn.is-active {
          background: rgba(2, 132, 199, 0.9);
          border-color: rgba(2, 132, 199, 0.5);
        }
      `}</style>
    </>
  );
}
