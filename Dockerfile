# ベースイメージ（Node.js 20の例）
FROM node:20-slim

# Chromiumの実行に必要なシステムライブラリをインストール
RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係をコピーしてインストール
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# アプリケーションコードをコピー
COPY . .

# Next.jsアプリをビルド
RUN npm run build

# ポートを公開
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "start"]
