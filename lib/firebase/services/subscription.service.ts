// lib/firebase/services/subscription.service.ts
import { db } from '../admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function saveSubscription(token: string, shopId: string, birthDate?: string) {
  const docRef = db.collection('subscriptions').doc(token);
  const doc = await docRef.get();

  // 🔥 データを安全に構築 (undefinedを排除)
  const data: any = {
    token,
    lastActive: FieldValue.serverTimestamp(),
  };
  
  if (birthDate) {
    const date = new Date(birthDate);
    if (!isNaN(date.getTime())) {
      data.birthDate = birthDate;
      data.birthMonth = date.getMonth() + 1;
      data.birthDay = date.getDate();
    }
  }

  if (doc.exists) {
    const existing = doc.data();
    const shopIds = existing?.shopIds || [];
    if (!shopIds.includes(shopId)) {
      data.shopIds = FieldValue.arrayUnion(shopId);
      data.topics = FieldValue.arrayUnion(`shop_${shopId}_users`);
    }
    await docRef.update(data);
  } else {
    data.shopIds = [shopId];
    data.topics = [`shop_${shopId}_users`];
    data.createdAt = FieldValue.serverTimestamp();
    await docRef.set(data);
  }
}

export async function getTokensForShop(shopId: string): Promise<string[]> {
  const chunks = await db.collection('shops').doc(shopId).collection('token_chunks').get();
  const tokens: string[] = [];
  chunks.forEach(doc => {
    const data = doc.data();
    if (Array.isArray(data.tokens)) {
      tokens.push(...data.tokens);
    }
  });
  return tokens;
}

export async function saveTokenChunk(shopId: string, token: string) {
  const chunksRef = db.collection('shops').doc(shopId).collection('token_chunks');
  const snapshot = await chunksRef.orderBy('createdAt', 'desc').limit(1).get();

  let targetDocRef;
  let currentTokens: string[] = [];

  if (snapshot.empty) {
    targetDocRef = chunksRef.doc('chunk_1');
  } else {
    const lastDoc = snapshot.docs[0];
    const data = lastDoc.data();
    currentTokens = data.tokens || [];

    if (currentTokens.length >= 5000) {
      const nextIndex = snapshot.docs.length + 1;
      targetDocRef = chunksRef.doc(`chunk_${nextIndex}`);
      currentTokens = [];
    } else {
      targetDocRef = lastDoc.ref;
    }
  }

  if (!currentTokens.includes(token)) {
    currentTokens.push(token);
    // 🔥 undefinedを絶対に渡さない
    const chunkData: any = {
      tokens: currentTokens,
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (snapshot.empty) {
      chunkData.createdAt = FieldValue.serverTimestamp();
    }
    await targetDocRef.set(chunkData, { merge: true });
  }
}
