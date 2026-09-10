import { NextResponse } from 'next/server';
import { notifyAdmins } from '@/lib/error-notifier';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { message, stack, digest, url } = await request.json();

    const error = new Error(message || 'Unknown frontend error');
    if (stack) error.stack = stack;

    await notifyAdmins(error, {
      source: 'frontend',
      details: { url, digest },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
