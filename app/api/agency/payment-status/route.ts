import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agencyId = searchParams.get('agencyId');
  const type = searchParams.get('type');

  if (!agencyId || (type !== 'initial' && type !== 'monthly')) {
    return NextResponse.json({ error: '決済情報が正しくありません。' }, { status: 400 });
  }

  const agencyDoc = await db.collection('agencies').doc(agencyId).get();
  if (!agencyDoc.exists) {
    return NextResponse.json({ error: '代理店情報が見つかりません。' }, { status: 404 });
  }

  const agency = agencyDoc.data()!;
  if (!['approved_pending_payment', 'active'].includes(agency.status)) {
    return NextResponse.json({ error: '決済案内後にお手続きいただけます。' }, { status: 403 });
  }
  const paid = type === 'initial'
    ? agency.initialPayment?.paid === true
    : agency.monthlyPayment?.status === 'active';

  if (paid) {
    return NextResponse.json({ paid: true });
  }

  const squareUrl = type === 'initial'
    ? process.env.SQUARE_AGENCY_INITIAL_URL
    : process.env.SQUARE_AGENCY_MONTHLY_URL;
  if (!squareUrl) {
    return NextResponse.json({ error: '決済リンクが設定されていません。' }, { status: 503 });
  }

  const separator = squareUrl.includes('?') ? '&' : '?';
  return NextResponse.json({ paid: false, paymentUrl: `${squareUrl}${separator}client_id=${encodeURIComponent(agencyId)}` });
}