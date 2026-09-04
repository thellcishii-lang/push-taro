import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendEmail } from '../../../../lib/mailer';

export async function POST(request: Request) {
  try {
    const { shopId, targetPlan } = await request.json();

    if (!shopId || !targetPlan) {
      return NextResponse.json(
        { error: 'shopId と targetPlan が必要です' },
        { status: 400 }
      );
    }

    const shopDoc = await db.collection('shops').doc(shopId).get();

    if (!shopDoc.exists) {
      return NextResponse.json({ error: '店舗が見つかりません' }, { status: 404 });
    }

    const shopData = shopDoc.data();
    if (!shopData) {
      return NextResponse.json({ error: '店舗データが取得できません' }, { status: 404 });
    }

    // 🔥 upgradeStatus が pending_payment かチェック
    if (shopData.upgradeStatus !== 'pending_payment') {
      return NextResponse.json(
        { error: 'この店舗はアップグレード申請中ではありません' },
        { status: 400 }
      );
    }

    const customerEmail = shopData.email;
    const plan = targetPlan;

    // 店舗更新（plan を更新、upgradeStatus を completed に）
    await shopDoc.ref.update({
      plan: plan,
      upgradeStatus: 'completed',
      upgradeCompletedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // ============================================================
    // 本番と同じアップグレード完了メールを送信
    // ============================================================
    const planName = plan === 'pro' ? 'PRO' : 'スタンダード';
    await sendEmail({
      to: customerEmail,
      subject: `【Push-taro】${planName}プランへのアップグレードが完了しました（テスト用）`,
      html: `
        <h2>${shopData.name || '店舗'} 様</h2>
        <p>${planName}プランへのアップグレードが完了しました。</p>
        <p>新プランの全機能をご利用いただけます。</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin">管理画面へログイン</a></p>
        ${plan === 'pro' ? '<p>紹介報酬機能も有効になりました。</p>' : ''}
        <hr />
        <p><strong>Push-taro.com</strong></p>
        <p>運営会社：the合同会社</p>
        <p>〒357-0123 埼玉県飯能市中藤下郷23-21</p>
        <p><a href="mailto:pushtaro-info@gmail.com">pushtaro.info@gmail.com</a></p>
      `,
    });

    return NextResponse.json({
      success: true,
      shopId,
      email: customerEmail,
      targetPlan: plan,
      message: `アップグレード強制完了（${plan}）`,
    });
  } catch (error: any) {
    console.error('[force-upgrade] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
