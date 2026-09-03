// lib/pdf-generator.ts
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export async function generateInvoicePDF(data: any): Promise<Buffer> {
  // 日本語フォントを読み込む
  const fontPath = path.join(process.cwd(), 'fonts', 'NotoSansJP-Regular.ttf');
  const fontBytes = fs.readFileSync(fontPath);

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(fontBytes);

  const page = doc.addPage([600, 800]);
  const { height } = page.getSize();

  // 日本語で描画
  page.drawText('お申し込み内容確認書', {
    x: 50,
    y: height - 50,
    size: 18,
    font,
  });

  const items = [
    ['会社名 / 屋号', data.name || ''],
    ['メールアドレス', data.email || ''],
    ['電話番号', data.phone || ''],
    ['住所', data.address || ''],
    ['選択プラン', data.plan ? data.plan.toUpperCase() : ''],
    ['インボイス番号', data.invoiceNumber || '未登録'],
  ];

  let y = height - 100;
  for (const [label, value] of items) {
    page.drawText(`${label}: ${value}`, { x: 50, y, size: 12, font });
    y -= 25;
  }

  if (data.plan === 'pro' && data.bankAccount) {
    page.drawText('--- 銀行口座情報 ---', { x: 50, y, size: 12, font });
    y -= 25;
    const bankItems = [
      ['金融機関名', data.bankAccount.bankName || ''],
      ['支店名', data.bankAccount.branchName || ''],
      ['口座種別', data.bankAccount.accountType === 'savings' ? '普通' : '当座'],
      ['口座番号', data.bankAccount.accountNumber || ''],
      ['口座名義', data.bankAccount.accountHolder || ''],
    ];
    for (const [label, value] of bankItems) {
      page.drawText(`${label}: ${value}`, { x: 50, y, size: 12, font });
      y -= 25;
    }
  }

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}
