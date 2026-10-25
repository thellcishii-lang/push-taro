// app/api/pro-shop/pos-api-key/route.ts
/**
 * PRO店舗の POS連携用APIキー 管理
 *
 * - POST:   新規発行（既存キーは即時失効する）
 * - GET:    現在のキー情報（keyPrefix のみ、平文は返さない）
 * - DELETE: キー失効
 *
 * 参照元: app/pro-shop/page.tsx（将来「POS連携」タブから呼ぶ）
 */
import { NextResponse } from 'next/server';
import { db, authAdmin } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { generatePosApiKey } from '@/lib/pos-api-key';

export const dynamic = 'force-dynamic';

// ─── 認証 + PRO店舗オーナーチェック ───
async function authenticateProOwner(
  request: Request
): Promise<{ shopId: string; uid: string } | { error: NextResponse }> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: NextResponse.json({ error: '認証が必要です' }, { status: 401 }) };
  }

  let uid: string;
  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await authAdmin.verifyIdToken(idToken);
    uid = decoded.uid;
  } catch {
    return { error: NextResponse.json({ error: '無効なトークンです' }, { status: 401 }) };
  }

  const shopSnap = await db
    .collection('shops')
    .where('ownerUid', '==', uid)
    .where('plan', '==', 'pro')
    .limit(1)
    .get();

  if (shopSnap.empty) {
    return {
      error: NextResponse.json(
        { error: 'POS連携はPROプラン専用の機能です' },
        { status: 403 }
      ),
    };
  }

  return { shopId: shopSnap.docs[0].id, uid };
}

// ============================================================
// POST: 新規発行
// ============================================================
export async function POST(request: Request) {
  const auth = await authenticateProOwner(request);
  if ('error' in auth) return auth.error;

  try {
    const { key, keyHash, keyPrefix } = generatePosApiKey();

    await db.collection('shops').doc(auth.shopId).update({
      'posApi.keyHash': keyHash,
      'posApi.keyPrefix': keyPrefix,
      'posApi.createdAt': FieldValue.serverTimestamp(),
      'posApi.lastUsedAt': null,
      'posApi.revokedAt': null,
      'posApi.terminals': [],
    });

    console.log(`[pos-api-key] 発行 shopId=${auth.shopId} prefix=${keyPrefix}`);

    // 平文キーはこのレスポンスでのみ返す
    return NextResponse.json({
      success: true,
      key,          // ★ この1回だけ表示
      keyPrefix,
      message: 'APIキーを発行しました。このキーは再表示できません。必ず安全な場所に保管してください。',
    });
  } catch (error: any) {
    console.error('[pos-api-key] 発行エラー:', error);
    return NextResponse.json(
      { error: error.message || 'APIキーの発行に失敗しました' },
      { status: 500 }
    );
  }
}

// ============================================================
// GET: 現在のキー情報
// ============================================================
export async function GET(request: Request) {
  const auth = await authenticateProOwner(request);
  if ('error' in auth) return auth.error;

  try {
    const shopDoc = await db.collection('shops').doc(auth.shopId).get();
    const posApi = shopDoc.data()?.posApi;

    if (!posApi || !posApi.keyHash) {
      return NextResponse.json({
        success: true,
        hasKey: false,
        keyPrefix: null,
        createdAt: null,
        lastUsedAt: null,
        revokedAt: null,
        terminals: [],
      });
    }

    return NextResponse.json({
      success: true,
      hasKey: !posApi.revokedAt,
      keyPrefix: posApi.keyPrefix || null,
      createdAt: posApi.createdAt?.toDate?.()?.toISOString() || null,
      lastUsedAt: posApi.lastUsedAt?.toDate?.()?.toISOString() || null,
      revokedAt: posApi.revokedAt?.toDate?.()?.toISOString() || null,
      terminals: Array.isArray(posApi.terminals) ? posApi.terminals : [],
    });
  } catch (error: any) {
    console.error('[pos-api-key] 取得エラー:', error);
    return NextResponse.json(
      { error: error.message || 'キー情報の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE: キー失効
// ============================================================
export async function DELETE(request: Request) {
  const auth = await authenticateProOwner(request);
  if ('error' in auth) return auth.error;

  try {
    const shopDoc = await db.collection('shops').doc(auth.shopId).get();
    const posApi = shopDoc.data()?.posApi;

    if (!posApi || !posApi.keyHash || posApi.revokedAt) {
      return NextResponse.json(
        { error: '有効なAPIキーが存在しません' },
        { status: 400 }
      );
    }

    await db.collection('shops').doc(auth.shopId).update({
      'posApi.revokedAt': FieldValue.serverTimestamp(),
    });

    console.log(`[pos-api-key] 失効 shopId=${auth.shopId}`);

    return NextResponse.json({
      success: true,
      message: 'APIキーを失効しました',
    });
  } catch (error: any) {
    console.error('[pos-api-key] 失効エラー:', error);
    return NextResponse.json(
      { error: error.message || 'APIキーの失効に失敗しました' },
      { status: 500 }
    );
  }
}
