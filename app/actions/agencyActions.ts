// app/actions/agencyActions.ts に追加
import { sendEmail } from '../../lib/mailer';
import { db } from '../../lib/firebase-admin';

// 代理店申請の承認処理
// app/actions/agencyActions.ts
export async function approveAgency(agencyShopId: string, email: string) {
  try {
    // ✅ ① isAgency だけでなく role と agencyId もセットする
    await db.collection('shops').doc(agencyShopId).update({
      isAgency: true,
      role: 'agency',                    // ← 追加（これがないと管理画面の分岐が発動しない）
      agencyId: agencyShopId,            // ← 追加（自身のUIDまたはショップIDを入れる）
      agencyApprovedAt: new Date(),
    });

    // 承認メール送信（変更なし）
    await sendEmail({
      to: email,
      subject: '【プッシュ太郎】代理店申請承認のお知らせ',
      html: `...`,
    });

    return { success: true };
  } catch (error) {
    console.error('代理店承認エラー:', error);
    return { success: false, error: '承認処理に失敗しました' };
  }
}

    return { success: true };
  } catch (error) {
    console.error('代理店承認エラー:', error);
    return { success: false, error: '承認処理に失敗しました' };
  }
}

// 代理店申請の却下処理
export async function rejectAgency(agencyShopId: string, email: string, reason?: string) {
  try {
    await db.collection('shops').doc(agencyShopId).update({
      agencyRejectedAt: new Date(),
      agencyRejectReason: reason || '',
    });

    await sendEmail({
      to: email,
      subject: '【プッシュ太郎】代理店申請結果のお知らせ',
      html: `
        <p>大変恐れ入りますが、審査の結果、今回の代理店申請は見送りとなりました。</p>
        ${reason ? `<p>理由: ${reason}</p>` : ''}
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('代理店却下エラー:', error);
    return { success: false, error: '却下処理に失敗しました' };
  }
}
