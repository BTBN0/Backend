// ─── logger.js ───────────────────────────────────────────────
// Task 2: JSON Structured Logger
// Task 1: request + error log функцуудыг дэмжинэ
// ─────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

const LOG_LEVEL = { info: 0, warn: 1, error: 2 };
const CURRENT_LEVEL = LOG_LEVEL[process.env.LOG_LEVEL || 'info'];

// Log файлд бичих stream (production)
const logStream = process.env.NODE_ENV === 'production'
  ? fs.createWriteStream(path.join(__dirname, '../logs/app.log'), { flags: 'a' })
  : null;

/**
 * Task 2: JSON structured log бичих үндсэн функц
 */
function writeLog(level, data) {
  if (LOG_LEVEL[level] < CURRENT_LEVEL) return;

  const entry = {
    timestamp: new Date().toISOString(),   // UTC ISO 8601
    level,
    service: process.env.SERVICE_NAME || 'api',
    ...data,
  };

  const line = JSON.stringify(entry);

  // Development: pretty print
  if (process.env.NODE_ENV !== 'production') {
    const colors = { info: '\x1b[36m', warn: '\x1b[33m', error: '\x1b[31m' };
    const reset = '\x1b[0m';
    console.log(`${colors[level]}${line}${reset}`);
  } else {
    // Production: файлд бич + stdout
    logStream?.write(line + '\n');
    process.stdout.write(line + '\n');
  }
}

// ─── Public API ───────────────────────────────────────────────

const logger = {
  info:  (data) => writeLog('info',  data),
  warn:  (data) => writeLog('warn',  data),
  error: (data) => writeLog('error', data),
};

module.exports = logger;
