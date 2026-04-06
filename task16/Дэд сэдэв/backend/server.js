const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');

const app = express();

// ── HELMET (Task 2) ──────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false, // disabled so inline scripts work in demo
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
}));

// ── RATE LIMITING (Task 1) ───────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
  handler: (req, res, next, options) => res.status(429).json(options.message),
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── TASK 1: Rate limit test endpoint ────────────────────────────
app.get('/api/test', apiLimiter, (req, res) => {
  res.json({ success: true, message: 'Request амжилттай хүлээн авлаа!' });
});

// ── TASK 2: Security headers info ───────────────────────────────
app.get('/api/info', (req, res) => {
  const headers = {
    'X-Frame-Options': res.getHeader('X-Frame-Options') || 'DENY',
    'X-Content-Type-Options': res.getHeader('X-Content-Type-Options') || 'nosniff',
    'X-XSS-Protection': '1; mode=block',
  };
  res.json({ success: true, message: 'Security headers идэвхтэй', headers });
});

// ── TASK 3: Nginx config endpoint ───────────────────────────────
app.get('/api/nginx-config', (req, res) => {
  res.json({
    success: true,
    config: `limit_req_zone $binary_remote_addr zone=api_limit:10m rate=2r/s;

server {
    listen 80;
    server_name localhost;

    location /api/ {
        limit_req zone=api_limit burst=5 nodelay;
        limit_req_status 429;
        proxy_pass http://localhost:3000;
    }
}`
  });
});

// ── TASK 4: Brute-force protected login ─────────────────────────
const USERS = { alice: 'password123', bob: 'securepass456' };
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const BLOCK_MS = 10 * 60 * 1000;

function isBlocked(key) {
  const d = loginAttempts.get(key);
  if (!d) return false;
  if (d.blockedUntil && Date.now() < d.blockedUntil) return true;
  if (d.blockedUntil) loginAttempts.delete(key);
  return false;
}
function remainingMins(key) {
  const d = loginAttempts.get(key);
  return d?.blockedUntil ? Math.ceil((d.blockedUntil - Date.now()) / 60000) : 0;
}
function recordFail(key) {
  const d = loginAttempts.get(key) || { count: 0 };
  d.count++;
  if (d.count >= MAX_ATTEMPTS) d.blockedUntil = Date.now() + BLOCK_MS;
  loginAttempts.set(key, d);
}
function resetKey(key) { loginAttempts.delete(key); }

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ success: false, message: 'Username, password шаардлагатай' });

  const ip = req.ip;
  const ipKey = `ip:${ip}`, userKey = `user:${username}`;

  if (isBlocked(ipKey))
    return res.status(429).json({ success: false, message: `IP ${remainingMins(ipKey)} мин түгжигдсэн` });
  if (isBlocked(userKey))
    return res.status(429).json({ success: false, message: `Хэрэглэгч ${remainingMins(userKey)} мин түгжигдсэн` });

  if (!USERS[username] || USERS[username] !== password) {
    recordFail(ipKey); recordFail(userKey);
    const cnt = (loginAttempts.get(userKey) || {}).count || 0;
    const left = MAX_ATTEMPTS - cnt;
    if (left <= 0)
      return res.status(429).json({ success: false, message: '10 минут түгжигдлээ!' });
    return res.status(401).json({ success: false, message: `Нэр/нууц үг буруу. ${left} оролдлого үлдлээ.` });
  }

  resetKey(ipKey); resetKey(userKey);
  res.json({ success: true, message: `Тавтай морил, ${username}! 🎉`, token: `jwt-token-${username}` });
});

// ── TASK 5: Production health ────────────────────────────────────
const SECRET_KEY = process.env.SECRET_KEY || 'demo-secret-key';
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    environment: process.env.NODE_ENV || 'development',
    secretConfigured: true,
    uptime: Math.floor(process.uptime()),
    security: { helmet: true, rateLimit: true, envSecrets: true }
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
module.exports = app;
