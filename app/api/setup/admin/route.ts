import { NextResponse } from 'next/server';
import { authAdmin } from '@/lib/firebase-admin';

const TARGET_UID = 'ePh0sLeKEPaLNMdtCmNKXqw164W2';

export async function GET() {
  try {
    await authAdmin.setCustomUserClaims(TARGET_UID, { admin: true });
    const userRecord = await authAdmin.getUser(TARGET_UID);

    return NextResponse.json({
      success: true,
      message: '管理者権限を付与しました。ログアウト→再ログインしてください。',
      uid: TARGET_UID,
      email: userRecord.email,
      currentClaims: userRecord.customClaims,
    });
  } catch (err: any) {
    console.error('[setup/admin] エラー:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
