/**
 * Production static file server for Expo web-build (Railway-compatible).
 * Listens on process.env.PORT (Railway sets this automatically).
 */
const path = require('path');
const fs = require('fs');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const STATIC_DIR = path.join(__dirname, 'web-build');

if (!fs.existsSync(STATIC_DIR)) {
  console.error(`Missing web-build/ at ${STATIC_DIR}. Run "npm run build:web" first.`);
  process.exit(1);
}

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'melting-solution-web' });
});

app.use(express.static(STATIC_DIR, {
  maxAge: '1h',
  index: ['index.html'],
}));

// SPA fallback — React Navigation client routes
app.get('*', (req, res) => {
  res.sendFile(path.join(STATIC_DIR, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Melting Solution web listening on http://0.0.0.0:${PORT}`);
});
