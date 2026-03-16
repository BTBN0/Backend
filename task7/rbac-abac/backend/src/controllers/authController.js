// src/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const prisma = require("../lib/prisma");

// ─── Register ───────────────────────────────────────────────────────────────
async function register(req, res) {
  try {
    const { email, password, name, department, region } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "email, password, name заавал шаардлагатай" });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: "И-мэйл аль хэдийн бүртгэлтэй" });

    const hashed = await bcrypt.hash(password, 12);

    // Шинэ хэрэглэгч — "user" role автоматаар өгнө
    const userRole = await prisma.role.findUnique({ where: { name: "user" } });

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name,
        department: department || null,
        region:     region     || null,
        roles: {
          create: userRole ? [{ roleId: userRole.id, assignedBy: "auto" }] : [],
        },
      },
      include: { roles: { include: { role: true } } },
    });

    const token = signToken(user.id);

    res.status(201).json({
      message: "Бүртгэл амжилттай",
      token,
      user:    formatUser(user),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ─── Login ──────────────────────────────────────────────────────────────────
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email, password шаардлагатай" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { roles: { include: { role: true } } },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "И-мэйл эсвэл нууц үг буруу" });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "Таны акаунт идэвхгүй болсон" });
    }

    const token = signToken(user.id);
    const roles = user.roles.map((ur) => ur.role.name);

    // ─── Redirect URL-ыг role-оор тодорхойлох ──────────────────────────
    const redirectTo = roles.includes("admin") ? "/admin/dashboard" : "/user/dashboard";

    res.json({
      message: "Нэвтрэлт амжилттай",
      token,
      redirectTo,          // Frontend энэ URL руу redirect хийнэ
      user: formatUser(user),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ─── Me (өөрийн мэдээлэл) ───────────────────────────────────────────────────
async function getMe(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        roles: {
          include: {
            role: {
              include: { permissions: { include: { permission: true } } },
            },
          },
        },
      },
    });

    if (!user) return res.status(404).json({ error: "Хэрэглэгч олдсонгүй" });

    const permissions = new Set();
    for (const ur of user.roles) {
      for (const rp of ur.role.permissions) {
        permissions.add(`${rp.permission.action}:${rp.permission.resource}`);
      }
    }

    res.json({
      ...formatUser(user),
      permissions: [...permissions],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ─── Helper ─────────────────────────────────────────────────────────────────
function signToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function formatUser(user) {
  return {
    id:         user.id,
    email:      user.email,
    name:       user.name,
    department: user.department,
    level:      user.level,
    region:     user.region,
    isActive:   user.isActive,
    roles:      user.roles.map((ur) => ur.role?.name || ur.roleId),
  };
}

module.exports = { register, login, getMe };
