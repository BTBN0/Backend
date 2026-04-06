// ─── requestId.js ────────────────────────────────────────────
// Task 3: Request ID нэвтрүүлэх middleware
//
// Зорилго: Нэг HTTP хүсэлтийн бүх log-ийг requestId-аар
//          холбож, trace хийх боломж олгоно.
// ─────────────────────────────────────────────────────────────

const { randomUUID } = require('crypto');

/**
 * Task 3: Middleware — req.requestId тавина
 *
 * X-Request-ID header ирвэл ашиглана (upstream proxy-оос),
 * байхгүй бол шинэ UUID үүсгэнэ.
 */
function requestIdMiddleware(req, res, next) {
  const id = req.headers['x-request-id'] || `req_${randomUUID().slice(0, 8)}`;

  req.requestId = id;

  // Client-д буцааж явуулна — debugging-д ашигтай
  res.setHeader('X-Request-ID', id);

  next();
}

module.exports = requestIdMiddleware;
