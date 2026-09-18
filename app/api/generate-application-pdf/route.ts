// app/api/generate-application-pdf/route.ts
/**
 * 申込書（お申し込み内容確認書）PDFを生成して返す
 * 店舗・代理店・アフィリエイトいずれの申込確認画面からも利用
 */
import { NextResponse } from 'next/server';
import { generateApplicationPDF } from '@/lib/pdf-generator';

export const dynamic = 'force-dynamic';

const VALID_TYPES = ['shop', 'agency', 'affiliate'] as const;

export async function POST(request: Request) {
  try {
    const { type, data } = await request.json();

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `type は ${VALID_TYPES.join(' / ')} のいずれかです` },
        { status: 400 }
      );
    }
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'data が必要です' }, { status: 400 });
    }

    const pdfBuffer = await generateApplicationPDF(type, data);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="application_${type}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('[generate-application-pdf] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
