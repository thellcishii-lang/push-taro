// app/api/agency/approve/route.ts
import { NextResponse } from 'next/server';
import { db as adminDb } from '../../../../lib/firebase-admin';
import { sendEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const applicationId = searchParams.get('id');

  if (!applicationId) {
    return NextResponse.json({ error: '申請IDが指定されていません。' }, { status: 400 });
  }

  try {
    const appRef = adminDb.collection('agency_applications').doc(applicationId);
    const appDoc = await appRef.get();

    if (!appDoc.exists) {
      return NextResponse.json({ error: '該当の申請データが見つかりません。' }, { status: 404 });
    }

    const appData = appDoc.data();

    // 🔥 appData が undefined の場合のガード
    if (!appData) {
      return NextResponse.json({ error: '申請データが不正です。' }, { status: 400 });
    }

    // 1. 申請ステータスを「承認済み（決済待ち）」に更新
    await appRef.update({
      status: 'approved_pending_payment',
      approvedAt: new Date().toISOString(),
    });

    // 🔥 2. agencies コレクションのステータスも更新
    const agencySnapshot = await adminDb.collection('agencies')
      .where('email', '==', appData.email)
      .get();

    if (!agencySnapshot.empty) {
      const agencyDoc = agencySnapshot.docs[0];
      await agencyDoc.ref.update({
        status: 'active',
        approvedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log(`[承認] agencies コレクションのステータスを更新: ${agencyDoc.id}`);
    } else {
      console.warn(`[承認] agencies コレクションに対応するドキュメントが見つかりません: ${appData.email}`);
    }

    // 3. Square 決済リンクの準備
    const initialFeeUrl = process.env.SQUARE_AGENCY_INITIAL_URL || 'https://square.link/u/your-initial-fee-link';
    const monthlyFeeUrl = process.env.SQUARE_AGENCY_MONTHLY_URL || 'https://square.link/u/your-monthly-fee-link';

    const initialPaymentLink = `${initialFeeUrl}?client_id=${applicationId}`;
    const monthlyPaymentLink = `${monthlyFeeUrl}?client_id=${applicationId}`;

    // 4. 決済案内メールを送信
    await sendEmail({
      to: appData.email,
      subject: '【Push-taro】代理店パートナー 審査完了・決済手続きのご案内',
      html: `
        <h2>${appData.companyName || appData.ownerName} 様</h2>
        <p>この度はPush-taro代理店パートナーへのご申請、誠にありがとうございます。</p>
        <p>社内審査が完了いたしましたので、今後の決済手続きについてご案内いたします。</p>
        <hr />
        <p>以下の2つのリンクより、加盟金および初月月額費用のお手続きをお進めください。</p>
        <p><strong>1. 代理店加盟金（初期費用：300,000円・税別）</strong><br />
        <a href="${initialPaymentLink}" style="display:inline-block;padding:10px 20px;background:#3182ce;color:#fff;border-radius:6px;text-decoration:none;">加盟金を決済する</a></p>
        <p><strong>2. 代理店月額費用（月額：30,000円・税別）</strong><br />
        <a href="${monthlyPaymentLink}" style="display:inline-block;padding:10px 20px;background:#3182ce;color:#fff;border-radius:6px;text-decoration:none;">月額費用を決済する</a></p>
        <hr />
        <p>両方のお支払いが確認され次第、代理店専用アカウントが完全に有効化されます。</p>
        <p><strong>Push-taro.com</strong></p>
        <p>運営会社：the合同会社</p>
        <p><a href="mailto:pushtaro-info@gmail.com">pushtaro-info@gmail.com</a></p>
      `,
    });

    console.log(`[承認完了] 申請ID: ${applicationId} / 送信先: ${appData.email}`);

    // 5. レスポンス
    const acceptHeader = request.headers.get('accept') || '';
    if (acceptHeader.includes('text/html')) {
      return new NextResponse(
        `<html>
          <body style="font-family: sans-serif; padding: 40px; text-align: center;">
            <h2>代理店申請を承認しました</h2>
            <p>${appData.companyName} (${appData.email}) 宛てに決済案内メールを送信しました。</p>
            <p><a href="/system-admin">全体管理画面に戻る</a></p>
          </body>
        </html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    return NextResponse.json({
      success: true,
      message: '承認処理および決済案内メールの送信が完了しました。',
      applicationId,
    });
  } catch (error: any) {
    console.error('承認処理エラー:', error);
    return NextResponse.json({ error: error.message || 'サーバーエラーが発生しました' }, { status: 500 });
  }
}
