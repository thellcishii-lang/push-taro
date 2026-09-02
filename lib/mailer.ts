import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    const info = await transporter.sendMail({
      from: `the.LLC Push-taro.com <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('[Mailer] メール送信成功:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('[Mailer] メール送信エラー:', error);
    return { success: false, error };
  }
}
