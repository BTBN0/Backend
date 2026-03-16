// ============================================================
// 🧪 LAB 1 — Task 3: Global Exception Handler
// Express-ийн error middleware — 4 параметртэй байх ёстой!
// Controller дээр try/catch байхгүй ✅
// ============================================================

const globalErrorHandler = (err, req, res, next) => {
  // Error төрлөөс statusCode авна, эсвэл 500
  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_ERROR";

  // LAB 1 — Task 4: Error response format
  const errorResponse = {
    timestamp: new Date().toISOString(),
    status: statusCode,
    code: code,
    message: err.message || "Unexpected error occurred",
    path: req.originalUrl,
  };

  console.error(`[ERROR] ${code}: ${err.message}`);

  res.status(statusCode).json(errorResponse);
};

module.exports = globalErrorHandler;
