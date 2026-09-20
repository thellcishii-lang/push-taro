// lib/mailer.ts
import nodemailer from 'nodemailer';
import sanitizeHtml from 'sanitize-html';

const infoMailUser = process.env.INFOMAIL_USER?.trim();
const infoMailPass = process.env.INFOMAIL_PASS?.trim();

const transporter = infoMailUser && infoMailPass
  ? nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: infoMailUser,
        pass: infoMailPass,
      },
    })
  : null;

export function sanitizeEmailHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      'div', 'span', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'img',
    ],
    allowedAttributes: {
      '*': ['style'],
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: false,
  });
}

export async function sendEmail({
  to,
  subject,
  html,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  attachments?: any[];
}) {
  if (!transporter || !infoMailUser || !infoMailPass) {
    const errorMessage = 'メール送信は未設定です。INFOMAIL_USER と INFOMAIL_PASS を環境変数に設定してください。';
    console.error('[Mailer]', errorMessage);
    return { success: false, error: errorMessage };
  }

  try {
    const info = await transporter.sendMail({
      from: `Push-taro <${infoMailUser}>`,
      to,
      subject,
      html: sanitizeEmailHtml(html),
      attachments,
    });
    console.log('[Mailer] メール送信成功:', info.messageId);
    return { success: true, info };
  } catch (error: any) {
    const message = error?.message || 'メール送信に失敗しました';
    console.error('[Mailer] メール送信エラー:', message, error);
    return { success: false, error: message };
  }
}
