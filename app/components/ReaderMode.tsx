'use client';

import { useEffect, useState, useRef } from 'react';

export default function ReaderMode() {
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const scrollSpeed = 0.8; // 1フレームあたりのスクロール量（調整可能）
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const isUserScrolling = useRef(false);

  // ① カラオケエフェクト（見出しと段落のみ対象）
  useEffect(() => {
    // prefers-reduced-motion の確認
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const targets = document.querySelectorAll('main h1, main h2, main h3, main p');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          if (!el.classList.contains('karaoke-active') && !el.dataset.animated) {
            el.dataset.animated = 'true';
            applyKaraokeEffect(el);
            observer.unobserve(el);
          }
        }
      });
    }, { threshold: 0.5 });

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  // カラオケアニメーション関数（文字を分割して順番にハイライト）
  const applyKaraokeEffect = (el: HTMLElement) => {
    const text = el.innerText;
    // 句読点で分割し、一息置くための配列を作成
    const chars = text.split(/(?=[、。！？])|(?<=[、。！？])/);
    
    el.innerHTML = '';
    el.classList.add('karaoke-active');
    el.style.opacity = '0.3';

    let delay = 0;
    chars.forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.transition = 'color 0.3s ease';
      span.style.opacity = '0.3';
      el.appendChild(span);

      // 文字が表示されるアニメーション（IntersectionObserverで画面内に入ったら）
      setTimeout(() => {
        span.style.opacity = '1';
      }, delay);

      // 1文字あたりの時間（日本語は1文字約0.15秒）
      delay += 150; 
      
      // 句読点が来たら一息置く（0.4秒追加）
      if (['、', '。', '！', '？'].includes(char)) {
        delay += 400;
      }
    });
  };

  // ② オートスクロール機能
  const scroll = (time: number) => {
    if (previousTimeRef.current !== undefined && isAutoScrolling && !isUserScrolling.current) {
      const deltaTime = time - previousTimeRef.current;
      const pixelsToScroll = scrollSpeed * (deltaTime / 16.6); // 60fps基準
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

  useEffect(() => {
    if (isAutoScrolling) {
      previousTimeRef.current = undefined;
      requestRef.current = requestAnimationFrame(scroll);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isAutoScrolling]);

  // ③ ユーザー操作の検知（戻る＋3秒後のUI表示）
  useEffect(() => {
    let controlTimer: NodeJS.Timeout;

    // マウスホイール・タッチ操作で一時停止
    const handleUserScroll = (e: WheelEvent | TouchEvent) => {
      // 上方向へのスクロール（戻る）を検知
      let isScrollingUp = false;
      if (e.type === 'wheel') {
        isScrollingUp = (e as WheelEvent).deltaY < 0;
      } else if (e.type === 'touchmove') {
        // タッチの場合は簡易的に全ての手動スクロールを検知
        isScrollingUp = true; 
      }

      if (isScrollingUp) {
        setIsAutoScrolling(false); // 戻ったら停止
      } else {
        // 下方向への手動スクロールの場合は一時停止（進んだ位置から再開できるように）
        isUserScrolling.current = true;
        setTimeout(() => { isUserScrolling.current = false; }, 1000);
      }
    };

    window.addEventListener('wheel', handleUserScroll, { passive: true });
    window.addEventListener('touchmove', handleUserScroll, { passive: true });

    // 表示から3秒後にコントロールUIを出す
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
      {/* コントロールUI */}
      <div className={`reader-controls ${showControls ? 'is-visible' : ''}`}>
        <button 
          onClick={() => setIsAutoScrolling(!isAutoScrolling)}
          className={`reader-btn ${isAutoScrolling ? 'is-active' : ''}`}
        >
          {isAutoScrolling ? '⏸ 自動スクロールを止める' : '▶ 自動スクロールを再開'}
        </button>
      </div>

      {/* CSSアニメーション用（全ページに適用される） */}
      <style jsx global>{`
        .karaoke-active span {
          transition: opacity 0.4s ease-out;
        }
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
