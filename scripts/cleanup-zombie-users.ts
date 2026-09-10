// scripts/cleanup-zombie-users.ts
import { authAdmin } from '../lib/firebase-admin';
import { db } from '../lib/firebase-admin';

async function cleanupZombieUsers() {
  // 1. Authの全ユーザーを取得
  const listUsersResult = await authAdmin.listUsers();
  const authUsers = listUsersResult.users;

  // 2. shops コレクションから ownerUid の一覧を取得
  const shopsSnapshot = await db.collection('shops').get();
  const shopUids = new Set(shopsSnapshot.docs.map(doc => doc.data().ownerUid));

  // 3. shopに存在しないAuthユーザーを削除
  let deletedCount = 0;
  for (const user of authUsers) {
    if (!shopUids.has(user.uid)) {
      try {
        await authAdmin.deleteUser(user.uid);
        console.log(`🗑️ 削除: ${user.email} (${user.uid})`);
        deletedCount++;
      } catch (err) {
        console.error(`❌ 削除失敗: ${user.email}`, err);
      }
    }
  }

  console.log(`✅ 完了: ${deletedCount}件のゾンビユーザーを削除しました`);
}

cleanupZombieUsers();
