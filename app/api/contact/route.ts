// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendEmail } from '@/lib/mailer';
import { enforceRateLimit } from '@/lib/rate-limit';
import { notifyAdmins } from '@/lib/error-notifier';

export async function POST(request: Request) {
  try {
    // ① レートリミット（1時間に5回まで）
    const retryAfter = await enforceRateLimit(request, 'contact', 5, 60 * 60 * 1000);
    if (retryAfter) {
      return NextResponse.json(
        { error: `送信回数が多すぎます。${Math.ceil(retryAfter / 60)}分後にお試しください。` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, company, category, message } = body;

    // ② バリデーション
    if (!name || !email || !message) {
      return NextResponse.json({ error: '必須項目が入力されていません' }, { status: 400 });
    }
    if (typeof name !== 'string' || name.length > 100) {
      return NextResponse.json({ error: 'お名前が長すぎます' }, { status: 400 });
    }
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
      return NextResponse.json({ error: 'メールアドレスの形式が正しくありません' }, { status: 400 });
    }
    if (typeof message !== 'string' || message.length > 5000) {
      return NextResponse.json({ error: 'お問い合わせ内容が長すぎます' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();
    const normalizedCompany = (company || '').trim();
    const normalizedCategory = category || 'その他';
    const normalizedMessage = message.trim();

    // ③ Firestore に保存
    const docRef = await db.collection('contact_inquiries').add({
      name: normalizedName,
      email: normalizedEmail,
      company: normalizedCompany,
      category: normalizedCategory,
      message: normalizedMessage,
      status: 'unread',
      createdAt: FieldValue.serverTimestamp(),
    });

    // ④ 管理者宛メール
    await sendEmail({
      to: 'info@push-taro.com',
      subject: `【お問い合わせ】${normalizedCategory} - ${normalizedName}様`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>📩 お問い合わせ</h2>
          <table style="font-size: 14px; border-collapse: collapse;">
            <tr><th style="text-align:left; padding:8px; background:#f1f5f9;">お名前</th><td style="padding:8px;">${normalizedName}</td></tr>
            <tr><th style="text-align:left; padding:8px; background:#f1f5f9;">メール</th><td style="padding:8px;">${normalizedEmail}</td></tr>
            <tr><th style="text-align:left; padding:8px; background:#f1f5f9;">会社名</th><td style="padding:8px;">${normalizedCompany || '未記入'}</td></tr>
            <tr><th style="text-align:left; padding:8px; background:#f1f5f9;">種別</th><td style="padding:8px;">${normalizedCategory}</td></tr>
          </table>
          <h3>お問い合わせ内容</h3>
          <p style="white-space: pre-wrap; background:#f8fafc; padding:12px; border-radius:6px;">${normalizedMessage}</p>
          <hr />
          <p style="font-size:12px; color:#64748b;">Firestore ID: ${docRef.id}</p>
        </div>
      `,
    });

    // ⑤ 自動返信（お客様宛）
    await sendEmail({
      to: normalizedEmail,
      subject: '【Push-taro】お問い合わせを受け付けました',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>${normalizedName} 様</h2>
          <p>お問い合わせいただきありがとうございます。<br />
          以下の内容で受け付けました。</p>
          <hr />
          <p><strong>種別:</strong> ${normalizedCategory}</p>
          <p><strong>お問い合わせ内容:</strong></p>
          <p style="white-space: pre-wrap; background:#f8fafc; padding:12px; border-radius:6px;">${normalizedMessage}</p>
          <hr />
          <p>2〜3営業日以内にご返信いたします。<br />しばらくお待ちくださいませ。</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('[contact] エラー:', error);
    await notifyAdmins(error, { source: 'contact-form' });
    return NextResponse.json(
      { error: '送信に失敗しました。時間をおいて再度お試しください。' },
      { status: 500 }
    );
  }
}
