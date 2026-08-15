const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '..', 'public', 'firebase-messaging-sw.template.js');
const outputPath = path.join(__dirname, '..', 'public', 'firebase-messaging-sw.js');

// テンプレート存在確認
if (!fs.existsSync(templatePath)) {
  console.error('❌ Template file not found:', templatePath);
  process.exit(1);
}

let template = fs.readFileSync(templatePath, 'utf8');

// 必須環境変数を厳密にチェック
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

let missing = [];
for (const v of requiredVars) {
  if (!process.env[v]) missing.push(v);
}

if (missing.length > 0) {
  console.error('❌ 以下の環境変数が未設定です:');
  missing.forEach(v => console.error(`   - ${v}`));
  console.error('❌ Service Worker のビルドを中止しました。');
  process.exit(1);
}

// 置換
template = template.replace(/{{FIREBASE_API_KEY}}/g, process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
template = template.replace(/{{FIREBASE_AUTH_DOMAIN}}/g, process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
template = template.replace(/{{FIREBASE_PROJECT_ID}}/g, process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
template = template.replace(/{{FIREBASE_STORAGE_BUCKET}}/g, process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
template = template.replace(/{{FIREBASE_MESSAGING_SENDER_ID}}/g, process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
template = template.replace(/{{FIREBASE_APP_ID}}/g, process.env.NEXT_PUBLIC_FIREBASE_APP_ID);

fs.writeFileSync(outputPath, template);
console.log('✅ Service Worker built successfully');

// 二重チェック：プレースホルダーが残っていないか
const built = fs.readFileSync(outputPath, 'utf8');
const remaining = built.match(/{{[A-Z_]+}}/g);
if (remaining) {
  console.error('❌ プレースホルダーが残っています:', remaining);
  process.exit(1);
}
console.log('✅ プレースホルダー置換を確認しました');
