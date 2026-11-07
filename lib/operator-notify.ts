// lib/operator-notify.ts
/**
* 運営者への申込通知メール
*
* 各種申込フロー（店舗申込・アフィリエイト・代理店・affilishop・
* アップグレード申請）の受付時に、運営者へ通知メールを送る共通ヘルパー。
*
* - 送信先は OPERATOR_NOTIFICATION_EMAIL（lib/constants.ts）
* - 通知の失敗で申込フロー自体を落とさないよう、例外は内部で握りつぶして
* ログにだけ残す（呼び出し側は await するだけでよい）
*/
import { sendEmail} from './mailer';
import { OPERATOR_NOTIFICATION_EMAIL} from './constants';

export interface SignupNotificationField {
label: string;
value: string | number | null | undefined;
}

export async function notifyOperatorOfSignup(params: {
/** 件名（例: 店舗申込：◯◯店（PRO）） */
subject: string;
/** 本文の見出し */
heading: string;
/** 表示する申込項目（空の項目は自動で省く） */
fields: SignupNotificationField[];
/** 管理画面への相対パス（任意。例: '/system-admin'） */
adminPath?: string;
}): Promise<void> {
try {
const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo'});
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://push-taro.com';

const rows = params.fields
.filter((f) => f.value!== null && f.value!== undefined && String(f.value).trim()!== '')
.map(
(f) =>
`<tr><td style="padding: 6px; font-weight: bold;">${f.label}</td><td style="padding: 6px;">${f.value}</td></tr>`
)
.join('');

const result = await sendEmail({
to: OPERATOR_NOTIFICATION_EMAIL,
subject: params.subject,
html: `
<div style="font-family: sans-serif; padding: 20px;">
<h2>${params.heading}</h2>
<table style="font-size: 14px;">
<tr><td style="padding: 6px; font-weight: bold;">申込日時</td><td style="padding: 6px;">${now}</td></tr>
${rows}
</table>
${params.adminPath? `<hr /><p><a href="${appUrl}${params.adminPath}">管理画面で確認</a></p>`: ''}
<hr />
<p><strong>Push-taro.com</strong></p>
<p>運営会社：the合同会社</p>
<p>〒357-0123 埼玉県飯能市中藤下郷23-21</p>
<p><a href="mailto:info@push-taro.com">info@push-taro.com</a></p>
</div>
`,
});

if (!result.success) {
console.error(`[operator-notify] 運営者通知メール送信失敗: ${params.subject} / ${result.error || ''}`);
}
} catch (error) {
// 通知の失敗で申込フロー自体を落とさない
console.error('[operator-notify] 運営者通知メール送信エラー:', error);
}
}
