// ─── backend/app.js ───────────────────────────────────────────
// Task 1–5 + Frontend-д зориулсан REST API endpoints
// ─────────────────────────────────────────────────────────────

const express = require('express');
const cors    = require('cors');
const logger  = require('./src/logger');
const requestIdMiddleware    = require('./src/requestId');
const { requestLogger,
        errorLogger }        = require('./src/logMiddleware');
const { startMonitoring,
        getCpuPercent,
        getMemoryMB }        = require('./src/monitor');
const { ALERT_RULES,
        checkAlerts }        = require('./src/alertRules');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', exposedHeaders: ['X-Request-ID'] }));

// ─── Middleware ───────────────────────────────────────────────
app.use(requestIdMiddleware);   // Task 3
app.use(requestLogger);         // Task 1A

// ─── In-memory log store (frontend-д буцаана) ─────────────────
const LOG_STORE = [];
const MAX_LOGS  = 200;

// Logger-ийг wrap хийж LOG_STORE-д хадгална
const origWrite = process.stdout.write.bind(process.stdout);
function patchLogger() {
  ['info', 'warn', 'error'].forEach((level) => {
    const orig = logger[level];
    logger[level] = (data) => {
      orig(data);
      const entry = { timestamp: new Date().toISOString(), level, ...data };
      LOG_STORE.unshift(entry);
      if (LOG_STORE.length > MAX_LOGS) LOG_STORE.pop();
    };
  });
}
patchLogger();

// ─── API Routes ───────────────────────────────────────────────

// Task 1 + 2: Login — request / error log жишээ
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.warn({ event: 'validation_failed', requestId: req.requestId,
      path: req.path, missing: [!email && 'email', !password && 'password'].filter(Boolean) });
    return res.status(400).json({ error: 'Email and password required', requestId: req.requestId });
  }

  if (password !== 'correct') {
    logger.warn({ event: 'auth_failed', requestId: req.requestId,
      path: req.path, email, reason: 'invalid_credentials' });
    return res.status(401).json({ error: 'Invalid credentials', requestId: req.requestId });
  }

  res.json({ token: 'jwt_example_token', requestId: req.requestId });
});

// DB error симуляци
app.get('/api/users', async (req, res, next) => {
  try {
    throw Object.assign(new Error('connection_timeout'), { name: 'DBError' });
  } catch (err) {
    logger.error({ event: 'db_query_failed', requestId: req.requestId,
      queryName: 'findAllUsers', error: err.message, stack: err.stack });
    next(err);
  }
});

// ─── Frontend-д зориулсан endpoints ──────────────────────────

// Task 4: Live metrics snapshot
app.get('/api/metrics', (req, res) => {
  const mem = getMemoryMB();
  const cpu = getCpuPercent();
  res.json({ cpu, ...mem, uptime: Math.round(process.uptime()), timestamp: new Date().toISOString() });
});

// Task 1+2: Log history буцаана
app.get('/api/logs', (req, res) => {
  const { level, limit = 50 } = req.query;
  const filtered = level ? LOG_STORE.filter(l => l.level === level) : LOG_STORE;
  res.json(filtered.slice(0, Number(limit)));
});

// Task 5: Alert rules-ийн тодорхойлолт
app.get('/api/alerts', (req, res) => {
  res.json(ALERT_RULES.map(r => ({
    name: r.name, level: r.level, cooldownMs: r.cooldownMs,
  })));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', requestId: req.requestId, uptime: process.uptime() });
});

// ─── Task 1B: Error middleware ────────────────────────────────
app.use(errorLogger);

// ─── Task 4: Monitoring эхлүүлнэ ─────────────────────────────
startMonitoring(10_000); // 10 секунд тутамд (demo-д богино)

// ─── Start ───────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info({ event: 'server_started', port: PORT,
    env: process.env.NODE_ENV || 'development', pid: process.pid });
});

module.exports = app;
