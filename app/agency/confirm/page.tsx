'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AgencyConfirmPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('agency_signup_data');
    if (!stored) {
      router.push('/agency');
      return;
    }
    try {
      setFormData(JSON.parse(stored));
    } catch {
      router.push('/agency');
    }
  }, [router]);

  const handleBack = () => {
    router.push('/agency');
  };

  const handleSubmit = async () => {
    if (!formData) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/agency/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '申込処理に失敗しました');
      }

      sessionStorage.removeItem('agency_signup_data');
      router.push('/agency?success=true');

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!formData) {
    return <div style={{ padding: 40, textAlign: 'center' }}>読み込み中...</div>;
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <main style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '36px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <h1 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '8px' }}>代理店申し込み内容の確認</h1>
        <p style={{ textAlign: 'center', color: '#718096', fontSize: '14px', marginBottom: '30px' }}>
          ご入力内容に間違いがないかご確認ください。
        </p>

        {error && (
          <div style={{ background: '#fecaca', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>代理店申し込み内容</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div><strong>会社名 / 屋号</strong><br />{formData.companyName || '未入力'}</div>
            <div><strong>ご担当者様</strong><br />{formData.ownerName || '未入力'}</div>
            <div><strong>メールアドレス</strong><br />{formData.email || '未入力'}</div>
            <div><strong>電話番号</strong><br />{formData.phone || '未入力'}</div>
            <div><strong>住所</strong><br />{formData.address || '未入力'}</div>
            <div><strong>インボイス番号</strong><br />{formData.invoiceNumber || '未登録'}</div>
            <div><strong>振込先口座</strong><br />{formData.bankInfo || '未入力'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={handleBack}
            style={{ flex: 1, padding: '14px', background: '#e2e8f0', color: '#2d3748', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
          >
            ← 戻る（修正する）
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px',
              background: loading ? '#94a3b8' : '#ff4500',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '処理中...' : '申し込む'}
          </button>
        </div>
      </main>
    </div>
  );
}
