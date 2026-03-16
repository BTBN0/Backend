// src/app.js
require("dotenv").config();

const express = require("express");
const cors    = require("cors");
const routes  = require("./routes");

const app = express();

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Request logger ──────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use("/api", routes);

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route олдсонгүй: ${req.method} ${req.path}` });
});

// ─── Global error handler ────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error("[ERROR]", err);
  res.status(500).json({
    error:   "Серверийн алдаа",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 API endpoints: http://localhost:${PORT}/api`);
  console.log(`\nTest endpoints:`);
  console.log(`  POST /api/auth/login   → нэвтрэх`);
  console.log(`  GET  /api/auth/me      → өөрийн мэдээлэл`);
  console.log(`  GET  /api/admin/dashboard → admin тиш`);
  console.log(`  GET  /api/user/dashboard  → user тиш\n`);
});

module.exports = app;
