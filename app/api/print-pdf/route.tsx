import { NextRequest, NextResponse } from 'next/server';
import { renderToString } from 'react-dom/server';
import { StyleRegistry, createStyleRegistry } from 'styled-jsx';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import TrifoldBrochure from '@/components/print/TrifoldBrochure';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const BLEED = 3;
const TRIM_W = 297;
const TRIM_H = 210;
const PAGE_W = TRIM_W + BLEED * 2; // 303
const PAGE_H = TRIM_H + BLEED * 2; // 216

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json();
    if (type !== 'trifold') {
      return NextResponse.json({ error: 'unsupported type' }, { status: 400 });
    }
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'data required' }, { status: 400 });
    }

    // サーバー側で TrifoldBrochure をレンダリング
    const registry = createStyleRegistry();
    const body = renderToString(
      <StyleRegistry registry={registry}>
        <TrifoldBrochure data={data} />
      </StyleRegistry>
    );
    const css = registry.styles().join('\n');

    // Puppeteer 用の完全なHTML
    const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8" />
<style>${css}</style>
<style>
  @page { size: ${PAGE_W}mm ${PAGE_H}mm; margin: 0; }
  html, body { margin: 0; padding: 0; background: #fff; }
  *, *::before, *::after {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* 各 tf-page を 303×216mm の用紙に、3mm の塗り足し付きで配置 */
  .p-page.tf-page {
    width: ${PAGE_W}mm !important;
    height: ${PAGE_H}mm !important;
    padding: ${BLEED}mm !important;
    box-sizing: border-box !important;
    position: relative !important;
    overflow: hidden !important;
    page-break-after: always;
    break-after: page;
  }
  .p-page.tf-page:last-of-type {
    page-break-after: auto;
    break-after: auto;
  }

  /* 塗り足し領域を各面の背景色で埋める */
  .p-page.tf-page::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
  }
  /* 外側面：左=ベージュ / 中=ライトグレー / 右=濃紺 */
  .p-page.tf-page:nth-of-type(1)::before {
    background: linear-gradient(to right,
      #fffbf5 0 33.333%,
      #fafafa 33.333% 66.666%,
      #0f172a 66.666% 100%);
  }
  /* 内側面：左=白 / 中=薄水色 / 右=温かい白 */
  .p-page.tf-page:nth-of-type(2)::before {
    background: linear-gradient(to right,
      #ffffff 0 33.333%,
      #f0f9ff 33.333% 66.666%,
      #fffbf5 66.666% 100%);
  }

  /* グリッドとパネルを前面に */
  .p-page.tf-page > .tf-panel {
    position: relative;
    z-index: 1;
  }
</style>
</head>
<body>${body}</body>
</html>`;

    // Puppeteer 起動
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

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
          'Content-Disposition': `attachment; filename="trifold_${Date.now()}.pdf"`,
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
