import { Suspense } from 'react';
import PaymentCheckContent from './PaymentCheckContent';

// 🔥 この1行を追加（動的レンダリングを強制）
export const dynamic = 'force-dynamic';

export default function PaymentCheckPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>確認中...</div>}>
      <PaymentCheckContent />
    </Suspense>
  );
}
