// lib/pos-api-auth.ts
/**
 * POS API 用の認証ヘルパー
 * - Bearer トークンから店舗を特定
 * - 必要に応じて X-POS-Terminal-Id のホワイトリスト検証
 */
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyPosApiKey } from '@/lib/pos-api-key';

export interface PosAuthResult {
  shopId: string;
  shopData: FirebaseFirestore.DocumentData;
  terminalId: string | null;
}

export interface PosAuthError {
  status: number;
  error: string;
}

/**
 * POS API のリクエストを認証する。
 */
export async function authenticatePosRequest(
  request: Request
): Promise<PosAuthResult | PosAuthError> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { status: 401, error: '認証が必要です' };
  }

  const apiKey = authHeader.slice('Bearer '.length).trim();
  if (!apiKey.startsWith('pt_live_')) {
    return { status: 401, error: '無効なAPIキーです' };
  }

  // PRO店舗から keyHash を検索
  const shopsSnap = await db
    .collection('shops')
    .where('plan', '==', 'pro')
    .get();

  let matchedShopId: string | null = null;
  let matchedShopData: FirebaseFirestore.DocumentData | null = null;

  for (const doc of shopsSnap.docs) {
    const data = doc.data();
    const posApi = data.posApi;
    if (!posApi?.keyHash || posApi.revokedAt) continue;
    if (verifyPosApiKey(apiKey, posApi.keyHash)) {
      matchedShopId = doc.id;
      matchedShopData = data;
      break;
    }
  }

  if (!matchedShopId || !matchedShopData) {
    return { status: 401, error: '無効なAPIキーです' };
  }

  const terminalId = request.headers.get('X-POS-Terminal-Id') || null;
  const terminals: string[] = Array.isArray(matchedShopData.posApi?.terminals)
    ? matchedShopData.posApi.terminals
    : [];

  if (terminals.length > 0 && terminalId && !terminals.includes(terminalId)) {
    return { status: 403, error: '未登録のレジ識別子です' };
  }

  try {
    await db.collection('shops').doc(matchedShopId).update({
      'posApi.lastUsedAt': FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.warn('[pos-api-auth] lastUsedAt 更新失敗:', err);
  }

  return {
    shopId: matchedShopId,
    shopData: matchedShopData,
    terminalId,
  };
}

export function isPosAuthError(
  result: PosAuthResult | PosAuthError
): result is PosAuthError {
  return 'error' in result;
}
