# Deploy Melting Solution Web on Railway

## What gets hosted
Expo web export (`web-build/`) served by `server.js` (Express) on Railway’s `PORT`.

## One-time Railway setup

1. Push this repo to GitHub (or connect the local folder via Railway CLI).
2. In [Railway](https://railway.com): **New Project → Deploy from GitHub repo**.
3. Railway detects `Dockerfile` + `railway.toml` automatically.
4. Set optional variables (none required for basic Firebase web config already in `src/common/FirebaseConfig.js`):
   - `NODE_ENV=production`
5. Deploy. Health check: `GET /health`.

## CLI deploy (optional)

```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

## Local web production test

```bash
npm install --legacy-peer-deps
npm run build:web
npm run start:web
# open http://localhost:3000
```

On macOS/Linux use `npm run build:web:unix` (or set `NODE_OPTIONS=--openssl-legacy-provider`).

## Notes
- Push notifications are native-only; web skips Expo notification listeners.
- Maps on web use an OpenStreetMap embed (`AppMapView.web.js`); native still uses Google Maps.
- Firebase Auth Email/Password must allow your Railway domain under **Authorized domains** in Firebase Console.
