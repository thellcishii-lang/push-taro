import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET() {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(`
      <html>
        <body style="font-family: sans-serif;">
          <h1>Puppeteer OK</h1>
          <p>生成日時: ${new Date().toISOString()}</p>
          <p style="background: linear-gradient(90deg, #ff4500, #0f172a); color:#fff; padding:20px;">
            背景グラデーションのテスト
          </p>
        </body>
      </html>
    `);

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="test.pdf"',
      },
    });
  } catch (err: any) {
    console.error('[print-pdf-test]', err);
    return NextResponse.json(
      { error: err.message, stack: err.stack },
      { status: 500 }
    );
  } finally {
    if (browser) await browser.close();
  }
}
