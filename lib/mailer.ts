import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendEmail({ 
  to, 
  subject, 
  html, 
  attachments 
}: { 
  to: string; 
  subject: string; 
  html: string; 
  attachments?: any[]; 
}) {
  try {
    const info = await transporter.sendMail({
      from: `Push-taro <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
      attachments, // ← これを追加
    });
    console.log('[Mailer] メール送信成功:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('[Mailer] メール送信エラー:', error);
    return { success: false, error };
  }
}
