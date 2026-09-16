// lib/mailer.ts
import nodemailer from 'nodemailer';

const gmailUser = process.env.GMAIL_USER?.trim();
const gmailPass = process.env.GMAIL_PASS?.trim();

const transporter = gmailUser && gmailPass
  ? nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    })
  : null;

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
  if (!transporter || !gmailUser || !gmailPass) {
    const errorMessage = 'メール送信は未設定です。GMAIL_USER と GMAIL_PASS を .env.local に設定してください（Gmail は 16 文字の App Password を使用）。';
    console.error('[Mailer]', errorMessage);
    return { success: false, error: errorMessage };
  }

  try {
    const info = await transporter.sendMail({
      from: `Push-taro <${gmailUser}>`,
      to,
      subject,
      html,
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
