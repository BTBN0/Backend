// src/routes/index.js
const express  = require("express");
const router   = express.Router();

const { authenticate }                          = require("../middleware/auth");
const { requireRole, requirePermission, requireAbac } = require("../middleware/authorize");

const authCtrl  = require("../controllers/authController");
const adminCtrl = require("../controllers/adminController");
const userCtrl  = require("../controllers/userController");

// ─── Auth Routes (public) ───────────────────────────────────────────────────
router.post("/auth/register", authCtrl.register);
router.post("/auth/login",    authCtrl.login);
router.get ("/auth/me",       authenticate, authCtrl.getMe);

// ─── Admin Routes ───────────────────────────────────────────────────────────
// requireRole("admin") — admin role шаардлагатай
router.get ("/admin/dashboard",          authenticate, requireRole("admin"),                        adminCtrl.getDashboard);
router.get ("/admin/users",              authenticate, requireRole("admin"), requirePermission("read",   "users"), adminCtrl.getUsers);
router.get ("/admin/users/:id",          authenticate, requireRole("admin"), requirePermission("read",   "users"), adminCtrl.getUserById);
router.post("/admin/users",              authenticate, requireRole("admin"), requirePermission("write",  "users"), adminCtrl.createUser);
router.put ("/admin/users/:id",          authenticate, requireRole("admin"), requirePermission("write",  "users"), adminCtrl.updateUser);
router.post("/admin/users/:id/role",     authenticate, requireRole("admin"), requirePermission("manage", "users"), adminCtrl.assignRole);
router.delete("/admin/users/:id/role",   authenticate, requireRole("admin"), requirePermission("manage", "users"), adminCtrl.removeRole);
router.get ("/admin/audit-logs",         authenticate, requireRole("admin"),                        adminCtrl.getAuditLogs);
router.get ("/admin/roles",              authenticate, requireRole("admin"),                        adminCtrl.getRoles);
router.get ("/admin/abac-policies",      authenticate, requireRole("admin"),                        adminCtrl.getAbacPolicies);

// ─── Manager Routes ─────────────────────────────────────────────────────────
router.get ("/manager/users",   authenticate, requireRole("admin", "manager"), requirePermission("read", "users"),   adminCtrl.getUsers);
router.get ("/manager/reports", authenticate, requireRole("admin", "manager"), requirePermission("read", "reports"), userCtrl.getReports);

// ─── User Routes ────────────────────────────────────────────────────────────
router.get ("/user/dashboard",  authenticate, userCtrl.getDashboard);
router.get ("/user/profile",    authenticate, userCtrl.getProfile);
router.put ("/user/profile",    authenticate, userCtrl.updateProfile);

// Posts — RBAC: user read:posts permission шаардлагатай
router.get ("/user/posts",      authenticate, requirePermission("read",  "posts"), userCtrl.getPosts);

// Reports — ABAC: finance хэлтэс + level 3+ шаардлагатай (role-аас гадна)
router.get ("/user/reports",    authenticate, requireAbac("read", "reports"), userCtrl.getReports);

// ─── Health check ────────────────────────────────────────────────────────────
router.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date() }));

module.exports = router;
