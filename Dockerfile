# --- Stage 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# 依存関係ファイルをコピー
COPY package.json package-lock.json ./

# ユーザーが成功したオプションを指定してインストール
RUN npm install --legacy-peer-deps

# 全ファイルをコピーしてビルド
COPY . .
RUN npm run build

# --- Stage 2: Serve ---
FROM nginx:alpine

# Viteのデフォルト出力先である dist フォルダをNginxの公開ディレクトリにコピー
COPY --from=builder /app/dist /usr/share/nginx/html

# ポート80を公開
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]