import { NextResponse } from 'next/server';
import { db as adminDb } from '../../../lib/firebase-admin';

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

    // 1. ステータスを「承認済み（決済待ち）」に更新
    await appRef.update({
      status: 'approved_pending_payment',
      approvedAt: new Date().toISOString(),
    });

    // 2. Square 決済リンクの準備（環境変数または固定URL）
    const initialFeeUrl = process.env.SQUARE_AGENCY_INITIAL_URL || 'https://square.link/u/your-initial-fee-link';
    const monthlyFeeUrl = process.env.SQUARE_AGENCY_MONTHLY_URL || 'https://square.link/u/your-monthly-fee-link';

    // applicationId をパラメータとして付与（決済Webhookでの特定用）
    const initialPaymentLink = `${initialFeeUrl}?client_id=${applicationId}`;
    const monthlyPaymentLink = `${monthlyFeeUrl}?client_id=${applicationId}`;

    // 3. 申請者へ案内メールを自動送信（メール送信ライブラリ等を使用）
    /* 
      送信メール本文のイメージ:
      --------------------------------------------------
      ${appData?.companyName}
      ${appData?.ownerName} 様

      Push-taro 代理店パートナーへのご申請ありがとうございます。
      社内審査が完了いたしましたので、今後の決済手続きについてご案内いたします。

      以下の2つのリンクより、加盟金および初月月額費用のお手続きをお進めください。

      1. 代理店加盟金（初期費用：30万円・税別）決済リンク
         ${initialPaymentLink}

      2. 代理店月額費用（月額：3万円・税別）決済リンク
         ${monthlyPaymentLink}

      両方のお支払いが確認され次第、代理店専用アカウントおよびログイン用URLを発行いたします。
      --------------------------------------------------
    */

    console.log(`[承認完了] 申請ID: ${applicationId} / 送信先: ${appData?.email}`);

    // ブラウザから直接アクセスされた場合は完了画面を表示、APIからの場合はJSONを返却
    const acceptHeader = request.headers.get('accept') || '';
    if (acceptHeader.includes('text/html')) {
      return new NextResponse(
        `<html>
          <body style="font-family: sans-serif; padding: 40px; text-align: center;">
            <h2>代理店申請を承認しました</h2>
            <p>${appData?.companyName} (${appData?.email}) 宛てに決済案内メールを送信しました。</p>
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
