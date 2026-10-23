'use client';

import { useEffect, useState, useRef } from 'react';

export default function ReaderMode() {
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [showControls, setShowControls] = useState(false);
  
  // スクロールの速度（1フレームあたりのピクセル数）調整用
  const scrollSpeed = 0.8; 
  
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);
  const isUserScrolling = useRef(false);

  // ① オートスクロールのメイン処理
  const scroll = (time: number) => {
    if (previousTimeRef.current !== undefined && isAutoScrolling && !isUserScrolling.current) {
      const deltaTime = time - previousTimeRef.current;
      // 60fpsを基準にスクロール量を計算
      const pixelsToScroll = scrollSpeed * (deltaTime / 16.6); 
      window.scrollBy(0, pixelsToScroll);

      // ページの最下部に達したら停止
      if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 10) {
        setIsAutoScrolling(false);
      }
    }
    previousTimeRef.current = time;
    
    if (isAutoScrolling) {
      requestRef.current = requestAnimationFrame(scroll);
    }
  };

  // ② オートスクロールの開始・停止
  useEffect(() => {
    if (isAutoScrolling) {
      previousTimeRef.current = undefined;
      requestRef.current = requestAnimationFrame(scroll);
    }
    return () => {
      if (requestRef.current !== undefined) cancelAnimationFrame(requestRef.current);
    };
  }, [isAutoScrolling]);

  // ③ ユーザー操作の検知とUI表示
  useEffect(() => {
    let controlTimer: NodeJS.Timeout;

    const handleUserScroll = (e: WheelEvent | TouchEvent) => {
      let isScrollingUp = false;
      if (e.type === 'wheel') {
        // マウスホイールを上に回した場合
        isScrollingUp = (e as WheelEvent).deltaY < 0;
      } else if (e.type === 'touchmove') {
        // スマホで指で触ってスクロールした場合（簡易判定）
        isScrollingUp = true; 
      }

      if (isScrollingUp) {
        // 上に戻ったら即座にオートスクロールを停止
        setIsAutoScrolling(false); 
      } else {
        // 下に手動で進めた場合は、一時的にオートスクロールの干渉を止める（1秒間）
        isUserScrolling.current = true;
        setTimeout(() => { isUserScrolling.current = false; }, 1000);
      }
    };

    window.addEventListener('wheel', handleUserScroll, { passive: true });
    window.addEventListener('touchmove', handleUserScroll, { passive: true });

    // ページを開いて3秒後にコントロールUIを表示
    controlTimer = setTimeout(() => {
      setShowControls(true);
    }, 3000);

    return () => {
      window.removeEventListener('wheel', handleUserScroll);
      window.removeEventListener('touchmove', handleUserScroll);
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
