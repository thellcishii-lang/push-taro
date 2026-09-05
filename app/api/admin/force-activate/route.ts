import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase-admin'; // パスはプロジェクト環境に合わせてください
import { POST as webhookPOST } from '../../square-webhook/route';

export async function POST(request: Request) {
  try {
    const { shopId } = await request.json();

    if (!shopId) {
      return NextResponse.json({ error: 'shopIdが必要です' }, { status: 400 });
    }

    const shopDoc = await db.collection('shops').doc(shopId).get();
    if (!shopDoc.exists) {
      return NextResponse.json({ error: '店舗が見つかりません' }, { status: 404 });
    }

    const shopData = shopDoc.data();
    if (!shopData) {
      return NextResponse.json({ error: '店舗データが取得できません' }, { status: 404 });
    }

    // 新規（status）またはアップグレード（upgradeStatus）の申請中かチェック
    const isPending = shopData.status === 'pending_payment' || shopData.upgradeStatus === 'pending_payment';
    if (!isPending) {
      return NextResponse.json({ error: 'この店舗は pending_payment ではありません' }, { status: 400 });
    }

    // PRO特有データがあるかどうかのシンプル判定（targetPlan指定は排除）
    const isPro = Boolean(shopData.invoiceNumber || shopData.bankAccount);

    // ============================================================
    // Square Webhook を擬似的に呼び出す（決済をスキップ）
    // ============================================================
    const mockRequest = new Request(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/square-webhook`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'payment.updated',
          data: {
            object: {
              payment: {
                id: 'force_' + Date.now(),
                status: 'COMPLETED',
                buyer_email_address: shopData.email,
                customer_id: shopData.squareCustomerId || 'force_customer',
                note: shopId,
                amount_money: { amount: isPro ? 10000 : 3800 },
                reference_id: shopData.referralCode || '',
              },
            },
          },
        }),
      }
    );

    // ✅ 本番と同じ Webhook 処理を実行
    const response = await webhookPOST(mockRequest);
    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: '決済をスキップして Webhook を実行しました',
      webhookResult: result,
    });

  } catch (error: any) {
    console.error('[force-activate] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
