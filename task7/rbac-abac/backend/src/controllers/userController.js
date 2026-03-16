// src/controllers/userController.js
const prisma = require("../lib/prisma");

// ─── User Dashboard ──────────────────────────────────────────────────────────
async function getDashboard(req, res) {
  res.json({
    dashboard:   "user",
    message:     `Сайн байна уу, ${req.user.name}!`,
    user:        req.user,
    permissions: req.user.permissions,
  });
}

// ─── Profile харах ───────────────────────────────────────────────────────────
async function getProfile(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, email: true, name: true,
        department: true, level: true, region: true,
        isActive: true, createdAt: true,
        roles: { include: { role: { select: { name: true, description: true } } } },
      },
    });

    res.json({
      ...user,
      roles: user.roles.map((ur) => ur.role),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ─── Profile засах (зөвхөн өөрийнхөө) ─────────────────────────────────────
async function updateProfile(req, res) {
  try {
    const { name, region } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name   !== undefined && { name }),
        ...(region !== undefined && { region }),
      },
      select: { id: true, email: true, name: true, region: true, updatedAt: true },
    });

    res.json({ message: "Профайл шинэчлэгдлээ", user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ─── Posts (энгийн хэрэглэгч харж болно) ────────────────────────────────────
// ABAC жишээ: finance хэлтсийн хэрэглэгч reports харж болно
async function getPosts(req, res) {
  // Жишээ static data
  res.json({
    message: "Нийтлэлүүд (user зөвхөн read эрхтэй)",
    posts: [
      { id: 1, title: "Нийтлэл 1", body: "Агуулга..." },
      { id: 2, title: "Нийтлэл 2", body: "Агуулга..." },
    ],
    yourPermissions: req.user.permissions,
  });
}

// ABAC шаардлагатай resource: reports (finance + level 3+)
async function getReports(req, res) {
  res.json({
    message:       "Тайлангууд",
    note:          "ABAC policy: finance хэлтэс + level 3+ шаардлагатай",
    abacPolicy:    req.abacPolicy || "RBAC fallback",
    userProfile:   { department: req.user.department, level: req.user.level },
    reports: [
      { id: 1, title: "Q1 Санхүүгийн тайлан", date: "2024-03" },
      { id: 2, title: "Q2 Санхүүгийн тайлан", date: "2024-06" },
    ],
  });
}

module.exports = { getDashboard, getProfile, updateProfile, getPosts, getReports };
