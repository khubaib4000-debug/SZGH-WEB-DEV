# Stage 1: Build the React + Vite application and run full-stack Express + WhatsApp Direct Image Server
FROM node:20-alpine
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=2048"
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
ENV NODE_ENV="production"
ENV USE_PROD_DIST="true"
ENV PORT="80"
EXPOSE 80
CMD ["npx", "tsx", "server.ts"]

