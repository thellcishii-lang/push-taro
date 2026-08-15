const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '..', 'public', 'firebase-messaging-sw.template.js');
const outputPath = path.join(__dirname, '..', 'public', 'firebase-messaging-sw.js');

if (!fs.existsSync(templatePath)) {
  console.error('Template file not found:', templatePath);
  process.exit(1);
}

let template = fs.readFileSync(templatePath, 'utf8');

template = template.replace('{{FIREBASE_API_KEY}}', process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '');
template = template.replace('{{FIREBASE_AUTH_DOMAIN}}', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '');
template = template.replace('{{FIREBASE_PROJECT_ID}}', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '');
template = template.replace('{{FIREBASE_STORAGE_BUCKET}}', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '');
template = template.replace('{{FIREBASE_MESSAGING_SENDER_ID}}', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '');
template = template.replace('{{FIREBASE_APP_ID}}', process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '');

fs.writeFileSync(outputPath, template);
console.log('✅ Service Worker built successfully');
