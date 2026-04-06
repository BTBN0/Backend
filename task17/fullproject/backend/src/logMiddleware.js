// ─── logMiddleware.js ─────────────────────────────────────────
// Task 1: Request log + Error log middleware
// Task 2: JSON бүтэц ашиглана
// Task 3: requestId-аар холбоно
// ─────────────────────────────────────────────────────────────

const logger = require('./logger');

// ─── Task 1A: Request Log Middleware ─────────────────────────
/**
 * Хүсэлт ирэх ба дуусах мөчийг лог хийнэ.
 * durationMs: хариу хэдэн ms-д бэлэн болсон
 */
function requestLogger(req, res, next) {
  const start = Date.now();

  // Хүсэлт ирлээ
  logger.info({
    event:     'request_received',
    requestId: req.requestId,
    method:    req.method,
    path:      req.path,
    ip:        req.ip || req.socket?.remoteAddress,
    userAgent: req.headers['user-agent'],
  });

  // Хариу илгээгдэх үед
  res.on('finish', () => {
    const durationMs = Date.now() - start;
    const level = res.statusCode >= 500 ? 'error'
                : res.statusCode >= 400 ? 'warn'
                : 'info';

    logger[level]({
      event:      'request_completed',
      requestId:  req.requestId,
      method:     req.method,
      path:       req.path,
      statusCode: res.statusCode,
      durationMs,
      ip:         req.ip || req.socket?.remoteAddress,
    });
  });

  next();
}

// ─── Task 1B: Error Log Middleware ───────────────────────────
/**
 * Express error middleware — 4 параметртэй байх ёстой.
 * Catch хийгдсэн бүх алдааг JSON structured format-аар лог хийнэ.
 */
function errorLogger(err, req, res, next) {
  logger.error({
    event:      'unhandled_error',
    requestId:  req.requestId,
    method:     req.method,
    path:       req.path,
    statusCode: err.status || 500,
    errorName:  err.name,
    message:    err.message,
    // Production-д stack заавал бич, dev-д консолд харагдана
    stack:      err.stack,
  });

  res.status(err.status || 500).json({
    error:     'Internal Server Error',
    requestId: req.requestId,   // Client-д requestId буцаана — debug амар
  });
}

module.exports = { requestLogger, errorLogger };
