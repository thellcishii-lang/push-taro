'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentCheckContent() {
  const searchParams = useSearchParams();
  const shopId = searchParams.get('shopId') || searchParams.get('s');
  const [isActive, setIsActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shopId) {
      setErrorMessage('店舗ID（URLパラメータ ?s=店舗ID）が指定されていません。');
      setLoading(false);
      return;
    }

    // 店舗情報を取得
    fetch(`/api/shop-info?s=${shopId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setErrorMessage(data.error || '店舗情報の取得に失敗しました。');
          setLoading(false);
          return;
        }

        // ============================================================
        // 🔑 【最優先判定】アップグレード完了（completed）
        // これを1番最初に判定することで、絶対にSquareへ転送させない
        // ============================================================
        if (data.upgradeStatus === 'completed') {
          setIsActive(true);
          setLoading(false);
          return;
        }

        // ============================================================
        // 🔑 【第2判定】新規登録の支払い済み（active）
        // ============================================================
        if (data.status === 'active' && data.upgradeStatus !== 'pending_payment') {
          setIsActive(true);
          setLoading(false);
          return;
        }

        // ============================================================
        // 🔑 【転送処理】アップグレード未決済（pending_payment）
        // ============================================================
        if (data.upgradeStatus === 'pending_payment') {
          const targetPlan = data.upgradeTargetPlan || data.targetPlan || 'standard';
          let paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_TEST || 'https://square.link/u/pORV1sXA';

          if (targetPlan === 'standard') {
            paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_TEST || 'https://square.link/u/pORV1sXA';
          } else if (targetPlan === 'pro') {
            paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_TEST || 'https://square.link/u/pORV1sXA';
          }

          window.location.href = paymentUrl;
          return;
        }

        // ============================================================
        // 🔑 【転送処理】新規登録の未決済（pending_payment）
        // ============================================================
        if (data.status === 'pending_payment') {
          const plan = data.plan || 'light';
          let paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_TEST || 'https://square.link/u/pORV1sXA';

          if (plan === 'light') {
            paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_TEST || 'https://square.link/u/pORV1sXA';
          } else if (plan === 'standard') {
            paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_TEST || 'https://square.link/u/pORV1sXA';
          } else if (plan === 'pro') {
            paymentUrl = process.env.NEXT_PUBLIC_SQUARE_LINK_TEST || 'https://square.link/u/pORV1sXA';
          }

          window.location.href = paymentUrl;
          return;
        }

        // 上記いずれにも当てはまらない場合（安全策として完了扱い）
        setIsActive(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[PaymentCheck] エラー:', err);
        setErrorMessage('通信エラーが発生しました。');
        setLoading(false);
      });
  }, [shopId]);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h3>決済ステータスを確認中...</h3>
        <p style={{ fontSize: 13, color: '#666' }}>しばらくお待ちください</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', maxWidth: 500, margin: '0 auto', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h2 style={{ fontSize: 20, color: '#e11d48', marginBottom: 12 }}>確認エラー</h2>
        <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>{errorMessage}</p>
      </div>
    );
  }

  if (isActive) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', maxWidth: 500, margin: '0 auto', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 22, color: '#1e293b', marginBottom: 12 }}>お支払いは完了しています</h2>
        <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
          この度はご登録ありがとうございます。<br />
          すでに本登録・決済手続きが完了しておりますので、追加の決済は不要です。
        </p>
        <a
          href="/admin"
          style={{
            display: 'inline-block',
            marginTop: 24,
            padding: '14px 28px',
            background: '#ff4500',
            color: '#fff',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: 16,
            boxShadow: '0 4px 12px rgba(255, 69, 0, 0.3)',
          }}
        >
          管理画面へログインする
        </a>
      </div>
    );
  }

  return null;
}
