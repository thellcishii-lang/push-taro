import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const SPECS = {
  trifold:         { trimW: 297, trimH: 210, bleed: 3 },
  'leaflet-a4':    { trimW: 210, trimH: 297, bleed: 3 },
  'leaflet-a5':    { trimW: 148, trimH: 210, bleed: 3 },
  card:            { trimW: 91,  trimH: 55,  bleed: 3 },
  'business-card': { trimW: 91,  trimH: 55,  bleed: 3 },
} as const;

type PrintType = keyof typeof SPECS;

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json();

    if (!(type in SPECS)) {
      return NextResponse.json({ error: `unsupported type: ${type}` }, { status: 400 });
    }
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'data required' }, { status: 400 });
    }

    const spec = SPECS[type as PrintType];
    const PAGE_W = spec.trimW + spec.bleed * 2;
    const PAGE_H = spec.trimH + spec.bleed * 2;

    const encoded = encodeURIComponent(
      Buffer.from(JSON.stringify(data)).toString('base64')
    );
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const renderUrl = `${baseUrl}/print/${type}/render?d=${encoded}`;

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    try {
      const page = await browser.newPage();
      await page.goto(renderUrl, { waitUntil: 'networkidle0' });
      await page.waitForSelector('.bleed-wrap .p-page', { timeout: 10000 });

      const pdf = await page.pdf({
        width: `${PAGE_W}mm`,
        height: `${PAGE_H}mm`,
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        preferCSSPageSize: true,
      });

      return new NextResponse(new Uint8Array(pdf), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${type}_${Date.now()}.pdf"`,
        },
      });
    } finally {
      await browser.close();
    }
  } catch (err: any) {
    console.error('[print-pdf]', err);
    return NextResponse.json(
      { error: err.message, stack: err.stack },
      { status: 500 }
    );
  }
}
