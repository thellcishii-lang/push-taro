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
    // 🔑 店舗IDが存在しない場合は決済リンクへ飛ばさずエラー画面で安全に停止
    if (!shopId) {
      setErrorMessage('店舗ID（URLパラメータ ?s=店舗ID）が指定されていません。正しいリンクからアクセスしてください。');
      setLoading(false);
      return;
    }

    // 🔑 キャッシュを完全に無効化して最新の Firestore データを取得
    fetch(`/api/shop-info?s=${shopId}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        // 🔑 API通信自体が失敗・または店舗が存在しない場合も勝手に決済へ飛ばさずエラー表示
        if (!data.success) {
          setErrorMessage(data.error || '店舗情報の取得に失敗しました。');
          setLoading(false);
          return;
        }

        // ============================================================
        // 🔑 【判定1】アップグレード決済完了済みのチェック
        // Firestore 上で upgradeStatus が "completed" になっていれば最優先で通過
        // ============================================================
        if (data.upgradeStatus === 'completed') {
          setIsActive(true);
          setLoading(false);
          return;
        }

        // ============================================================
        // 🔑 【判定2】新規登録決済完了済みのチェック
        // status が "active" かつ upgradeStatus が "pending_payment" でない場合
        // ============================================================
        if (data.status === 'active' && data.upgradeStatus !== 'pending_payment') {
          setIsActive(true);
          setLoading(false);
          return;
        }

        // ============================================================
        // 🔑 【判定3】アップグレード未決済（Square 決済ページへリダイレクト）
        // upgradeStatus が "pending_payment" の時だけ実行
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
        // 🔑 【判定4】新規登録未決済（Square 決済ページへリダイレクト）
        // status が "pending_payment" の時だけ実行
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

        // ============================================================
        // 🔑 【判定5】フォールバック（上記条件に漏れた場合は完了扱いにする）
        // ============================================================
        setIsActive(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[PaymentCheck] エラー:', err);
        setErrorMessage('通信エラーが発生しました。ネットワーク接続を確認してください。');
        setLoading(false);
      });
  }, [shopId]);

  // ローディング表示
  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h3>決済ステータスを確認中...</h3>
        <p style={{ fontSize: 13, color: '#666' }}>しばらくお待ちください</p>
      </div>
    );
  }

  // エラー時の安全停止画面
  if (errorMessage) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', maxWidth: 500, margin: '0 auto', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h2 style={{ fontSize: 20, color: '#e11d48', marginBottom: 12 }}>確認エラー</h2>
        <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>{errorMessage}</p>
      </div>
    );
  }

  // 支払い完了画面（「✅ お支払いは完了しています」を表示）
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
