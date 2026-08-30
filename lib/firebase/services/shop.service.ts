// lib/firebase/services/shop.service.ts
import { db } from '../admin';
import { FieldValue } from 'firebase-admin/firestore';

// 🔥 型を追加
export interface Shop {
  id: string;
  name?: string;
  email?: string;
  plan?: string;
  status?: string;
  coupon?: any;
  linkUrl?: string;
  iconUrl?: string;
  ownerUid?: string;
  [key: string]: any; // その他のプロパティも許可
}

export async function getShop(shopId: string): Promise<Shop | null> {
  const doc = await db.collection('shops').doc(shopId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Shop;
}

// ... 他の関数は同じ

export async function getShopByOwner(uid: string) {
  const query = await db.collection('shops').where('ownerUid', '==', uid).limit(1).get();
  if (query.empty) return null;
  const doc = query.docs[0];
  return { id: doc.id, ...doc.data() };
}

export async function updateShop(shopId: string, data: any) {
  await db.collection('shops').doc(shopId).update(data);
}

export async function createShop(data: any) {
  const ref = db.collection('shops').doc();
  await ref.set({
    ...data,
    createdAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}
