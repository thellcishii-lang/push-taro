// lib/firebase/services/auth.service.ts
import { authAdmin } from '../admin';

export async function verifyToken(token: string): Promise<string> {
  try {
    const decoded = await authAdmin.verifyIdToken(token);
    return decoded.uid;
  } catch (error) {
    throw new Error('認証エラー: 無効なトークンです');
  }
}

export async function createUser(email: string, password: string) {
  return await authAdmin.createUser({
    email,
    password,
    emailVerified: true,
  });
}
