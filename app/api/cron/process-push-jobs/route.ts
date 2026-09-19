import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { isValidCronRequest } from '@/lib/cron-auth';
import { processPushJobBatch } from '@/lib/push-job';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!isValidCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const queued = await db.collection('push_jobs').where('status', '==', 'queued').limit(10).get();
    const stale = await db.collection('push_jobs').where('status', '==', 'processing').limit(10).get();
    const jobIds = [...queued.docs, ...stale.docs].map((doc) => doc.id).slice(0, 10);
    const results = [];
    for (const jobId of jobIds) {
      results.push({ jobId, result: await processPushJobBatch(jobId) });
    }
    return NextResponse.json({ success: true, processed: results.length, results });
  } catch (error: any) {
    console.error('[process-push-jobs] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
