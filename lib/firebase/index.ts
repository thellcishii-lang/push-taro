// lib/firebase/index.ts
// 基盤
export { db, authAdmin, messaging } from './admin';
export { auth, storage, onForegroundMessage } from './client';

// サービス
export * from './services';

// プラットフォーム
export { detectPlatform, isStandalone, getPlatformRequirements } from './platform';

// トークン管理＆SW管理
export * from './token-manager';
export * from './sw-manager';
