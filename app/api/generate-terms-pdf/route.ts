// app/api/generate-terms-pdf/route.ts
/**
 * 利用規約PDFを生成して返す（店舗 / 代理店 / アフィリエイト）
 */
import { NextResponse } from 'next/server';
import { generateTermsPDF } from '@/lib/pdf-generator';

export const dynamic = 'force-dynamic';

const VALID_TYPES = ['shop', 'agency', 'affiliate'] as const;
type TermsType = typeof VALID_TYPES[number];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = (searchParams.get('type') || 'shop') as TermsType;

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `type は ${VALID_TYPES.join(' / ')} のいずれかです` },
        { status: 400 }
      );
    }

    const pdfBuffer = await generateTermsPDF(type);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="terms_${type}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('[generate-terms-pdf] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
