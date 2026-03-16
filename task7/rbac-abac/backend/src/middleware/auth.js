// src/middleware/auth.js
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

/**
 * JWT токен шалгах middleware
 * Authorization: Bearer <token>
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Токен олдсонгүй" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // DB-с хэрэглэгчийн мэдээлэл + role + permission авах
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Хэрэглэгч олдсонгүй эсвэл идэвхгүй" });
    }

    // Permission-уудыг flatten хийж req.user-д хавсаргах
    const permissions = new Set();
    const roleNames   = [];

    for (const ur of user.roles) {
      roleNames.push(ur.role.name);
      for (const rp of ur.role.permissions) {
        permissions.add(`${rp.permission.action}:${rp.permission.resource}`);
      }
    }

    req.user = {
      id:         user.id,
      email:      user.email,
      name:       user.name,
      isActive:   user.isActive,
      department: user.department,
      level:      user.level,
      region:     user.region,
      roles:      roleNames,
      permissions: [...permissions], // ["read:users", "write:posts", ...]
    };

    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError")  return res.status(401).json({ error: "Токен буруу" });
    if (err.name === "TokenExpiredError")  return res.status(401).json({ error: "Токен хугацаа дууссан" });
    next(err);
  }
}

module.exports = { authenticate };
