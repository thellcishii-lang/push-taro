// lib/firebase/services/shop.service.ts
import { db } from '../admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function getShop(shopId: string) {
  const doc = await db.collection('shops').doc(shopId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

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
