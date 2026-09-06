# Melting Solution — Expo web → Railway
# Multi-stage: build static web-build, then serve with Node/Express

FROM node:18-bullseye-slim AS build
WORKDIR /app

# OpenSSL legacy provider needed by Expo SDK 44 / webpack 4 tooling
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV CI=1
ENV EXPO_NO_TELEMETRY=1

COPY package.json yarn.lock* package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npx expo-cli build:web --non-interactive

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package.json ./
RUN npm install --omit=dev --legacy-peer-deps express && npm cache clean --force

COPY --from=build /app/web-build ./web-build
COPY server.js ./

EXPOSE 3000
CMD ["node", "server.js"]
