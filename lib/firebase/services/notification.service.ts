// lib/firebase/services/notification.service.ts
import { messaging } from '../admin';

const CHUNK_SIZE = 450;

export async function sendPush(tokens: string[], messageData: any) {
  let totalSuccess = 0;
  let totalFailure = 0;
  const failedTokens: string[] = [];

  for (let i = 0; i < tokens.length; i += CHUNK_SIZE) {
    const chunk = tokens.slice(i, i + CHUNK_SIZE);
    try {
      const response = await messaging.sendEachForMulticast({
        ...messageData,
        tokens: chunk,
      });
      totalSuccess += response.successCount;
      totalFailure += response.failureCount;
      response.responses.forEach((resp, idx) => {
        if (!resp.success) failedTokens.push(chunk[idx]);
      });
    } catch (err) {
      console.error('[sendPush] Batch error:', err);
      totalFailure += chunk.length;
    }
  }

  return { totalSuccess, totalFailure, failedTokens };
}

export async function subscribeToTopic(tokens: string[], topic: string) {
  if (tokens.length === 0) return;
  await messaging.subscribeToTopic(tokens, topic);
}

export async function unsubscribeFromTopic(tokens: string[], topic: string) {
  if (tokens.length === 0) return;
  await messaging.unsubscribeFromTopic(tokens, topic);
}
