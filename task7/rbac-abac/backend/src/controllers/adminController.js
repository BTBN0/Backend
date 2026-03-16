// src/controllers/adminController.js
const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");

// ─── Admin Dashboard мэдээлэл ────────────────────────────────────────────────
async function getDashboard(req, res) {
  try {
    const [totalUsers, totalRoles, totalPerms, recentLogs] = await Promise.all([
      prisma.user.count(),
      prisma.role.count(),
      prisma.permission.count(),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: { userId: true, action: true, resource: true, result: true, reason: true, createdAt: true },
      }),
    ]);

    res.json({
      dashboard: "admin",
      stats: { totalUsers, totalRoles, totalPerms },
      recentActivity: recentLogs,
      admin: req.user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ─── Хэрэглэгчдийн жагсаалт ──────────────────────────────────────────────────
async function getUsers(req, res) {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {};
    if (search) {
      where.OR = [
        { name:  { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      skip,
      take: Number(limit),
      include: { roles: { include: { role: true } } },
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.user.count({ where });

    res.json({
      data:  users.map(safeUser),
      meta:  { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ─── Нэг хэрэглэгч харах ────────────────────────────────────────────────────
async function getUserById(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } },
    });
    if (!user) return res.status(404).json({ error: "Хэрэглэгч олдсонгүй" });
    res.json(safeUser(user));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ─── Хэрэглэгч үүсгэх ───────────────────────────────────────────────────────
async function createUser(req, res) {
  try {
    const { email, password, name, roles = ["user"], department, level, region } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "email, password, name шаардлагатай" });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: "И-мэйл аль хэдийн бүртгэлтэй" });

    const roleRecords = await prisma.role.findMany({ where: { name: { in: roles } } });
    if (roleRecords.length === 0) return res.status(400).json({ error: "Role олдсонгүй" });

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name,
        department: department || null,
        level:      level      || 1,
        region:     region     || null,
        roles: {
          create: roleRecords.map((r) => ({ roleId: r.id, assignedBy: req.user.id })),
        },
      },
      include: { roles: { include: { role: true } } },
    });

    res.status(201).json({ message: "Хэрэглэгч үүслээ", user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ─── Хэрэглэгч засах ────────────────────────────────────────────────────────
async function updateUser(req, res) {
  try {
    const { name, department, level, region, isActive } = req.body;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        ...(name       !== undefined && { name }),
        ...(department !== undefined && { department }),
        ...(level      !== undefined && { level: Number(level) }),
        ...(region     !== undefined && { region }),
        ...(isActive   !== undefined && { isActive }),
      },
      include: { roles: { include: { role: true } } },
    });

    res.json({ message: "Хэрэглэгч шинэчлэгдлээ", user: safeUser(user) });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Хэрэглэгч олдсонгүй" });
    res.status(500).json({ error: err.message });
  }
}

// ─── Хэрэглэгчид Role өгөх / авах ──────────────────────────────────────────
async function assignRole(req, res) {
  try {
    const { roleName } = req.body;
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) return res.status(404).json({ error: `Role "${roleName}" олдсонгүй` });

    await prisma.userRole.upsert({
      where:  { userId_roleId: { userId: req.params.id, roleId: role.id } },
      update: {},
      create: { userId: req.params.id, roleId: role.id, assignedBy: req.user.id },
    });

    res.json({ message: `Role "${roleName}" амжилттай өгөгдлөө` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function removeRole(req, res) {
  try {
    const { roleName } = req.body;
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) return res.status(404).json({ error: `Role "${roleName}" олдсонгүй` });

    await prisma.userRole.delete({
      where: { userId_roleId: { userId: req.params.id, roleId: role.id } },
    });

    res.json({ message: `Role "${roleName}" авагдлаа` });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Role олдсонгүй" });
    res.status(500).json({ error: err.message });
  }
}

// ─── Audit Logs харах ────────────────────────────────────────────────────────
async function getAuditLogs(req, res) {
  try {
    const { page = 1, limit = 50, userId, resource, result } = req.query;
    const skip  = (Number(page) - 1) * Number(limit);
    const where = {};

    if (userId)   where.userId   = userId;
    if (resource) where.resource = resource;
    if (result)   where.result   = result;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: "desc" } }),
      prisma.auditLog.count({ where }),
    ]);

    res.json({ data: logs, meta: { total, page: Number(page), limit: Number(limit) } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ─── Roles & Permissions жагсаалт ───────────────────────────────────────────
async function getRoles(req, res) {
  try {
    const roles = await prisma.role.findMany({
      include: { permissions: { include: { permission: true } }, _count: { select: { users: true } } },
    });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAbacPolicies(req, res) {
  try {
    const policies = await prisma.abacPolicy.findMany({ orderBy: { priority: "desc" } });
    res.json(policies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ─── Helper ─────────────────────────────────────────────────────────────────
function safeUser(user) {
  const { password, ...rest } = user;
  return {
    ...rest,
    roles: user.roles?.map((ur) => ur.role?.name || ur.roleId) || [],
  };
}

module.exports = {
  getDashboard, getUsers, getUserById, createUser, updateUser,
  assignRole, removeRole, getAuditLogs, getRoles, getAbacPolicies,
};
