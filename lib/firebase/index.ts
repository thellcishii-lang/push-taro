// lib/firebase/index.ts
// 基盤
export { db, authAdmin, messaging } from './admin';
export { auth, storage } from './client';

// サービス
export * from './services';

// プラットフォーム
export { detectPlatform, isStandalone, getPlatformRequirements } from './platform';
