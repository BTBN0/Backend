// src/middleware/authorize.js
const prisma = require("../lib/prisma");

// ─── RBAC Middleware ────────────────────────────────────────────────────────
/**
 * Role-д суурилсан хандалт шалгах
 * @param  {...string} allowedRoles - жнь: requireRole("admin", "manager")
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const userRoles = req.user?.roles || [];
    const hasRole   = allowedRoles.some((r) => userRoles.includes(r));

    if (!hasRole) {
      return res.status(403).json({
        error: "Хандах эрхгүй",
        reason: `Шаардагдах role: [${allowedRoles.join(", ")}] — таны role: [${userRoles.join(", ")}]`,
      });
    }
    next();
  };
}

/**
 * Permission-д суурилсан хандалт шалгах
 * @param {string} action   - жнь: "read"
 * @param {string} resource - жнь: "users"
 */
function requirePermission(action, resource) {
  return async (req, res, next) => {
    const required = `${action}:${resource}`;
    const userPerms = req.user?.permissions || [];

    const hasPermission = userPerms.includes(required) || userPerms.includes(`manage:${resource}`);

    // Audit log бичих
    await logAudit({
      userId:   req.user?.id,
      action,
      resource,
      result:   hasPermission ? "allowed" : "denied",
      reason:   hasPermission ? "RBAC: permission found" : "RBAC: permission missing",
      req,
    });

    if (!hasPermission) {
      return res.status(403).json({
        error: "Хандах эрхгүй",
        reason: `Permission шаардлагатай: ${required}`,
      });
    }
    next();
  };
}

// ─── ABAC Middleware ────────────────────────────────────────────────────────
/**
 * Attribute-д суурилсан нарийн нөхцөлт хандалт
 * RBAC-аас гадна нэмэлт attribute шалгах хэрэгтэй үед
 *
 * @param {string} action
 * @param {string} resource
 * @param {Object} [resourceAttrs] - хандаж буй resource-ын attribute (заавал биш)
 */
function requireAbac(action, resource, resourceAttrs = {}) {
  return async (req, res, next) => {
    const user = req.user;

    try {
      // Active policy-уудыг priority-оор эрэмбэлж авах
      const policies = await prisma.abacPolicy.findMany({
        where: { isActive: true },
        orderBy: { priority: "desc" },
      });

      let decision = null; // null = шалгаагүй, "ALLOW" / "DENY"
      let matchedPolicy = null;

      for (const policy of policies) {
        const subjectMatch  = matchConditions(user, policy.subjectConditions);
        const resourceMatch = matchConditions(
          { ...resourceAttrs, resource, action },
          policy.resourceConditions
        );

        if (subjectMatch && resourceMatch) {
          decision = policy.effect; // "ALLOW" or "DENY"
          matchedPolicy = policy.name;
          break; // Хамгийн өндөр priority-тай нөхцөл тохирлоо
        }
      }

      // Policy тохирсонгүй бол RBAC-аар шийднэ (default: check permission)
      const rbacPerms = user?.permissions || [];
      const hasRbac   = rbacPerms.includes(`${action}:${resource}`) || rbacPerms.includes(`manage:${resource}`);

      const finalDecision =
        decision === "DENY"  ? false :
        decision === "ALLOW" ? true  :
        hasRbac;              // Policy байхгүй → RBAC fallback

      await logAudit({
        userId:   user?.id,
        action,
        resource,
        result:   finalDecision ? "allowed" : "denied",
        reason:   matchedPolicy
          ? `ABAC policy: ${matchedPolicy} (${decision})`
          : `RBAC fallback: permission ${hasRbac ? "found" : "missing"}`,
        req,
      });

      if (!finalDecision) {
        return res.status(403).json({
          error:  "Хандах эрхгүй",
          reason: matchedPolicy
            ? `ABAC: Policy "${matchedPolicy}" татгалзлаа`
            : `Permission шаардлагатай: ${action}:${resource}`,
        });
      }

      req.abacPolicy = matchedPolicy;
      next();
    } catch (err) {
      next(err);
    }
  };
}

// ─── Helper: нөхцөл тохирч байна уу? ────────────────────────────────────────
/**
 * subject дотор conditions-ын бүх утга тохирч байна уу шалгана
 * Дэмждэг operator: gte, lte, gt, lt, in, eq (default)
 */
function matchConditions(subject, conditions) {
  if (!conditions || Object.keys(conditions).length === 0) return true;

  for (const [key, value] of Object.entries(conditions)) {
    const subjectVal = subject?.[key];

    if (value === null || value === undefined) continue;

    if (typeof value === "object" && !Array.isArray(value)) {
      // Operator шалгах: { gte: 3 }, { in: ["finance","hr"] } гэх мэт
      for (const [op, opVal] of Object.entries(value)) {
        switch (op) {
          case "gte": if (!(subjectVal >= opVal)) return false; break;
          case "lte": if (!(subjectVal <= opVal)) return false; break;
          case "gt":  if (!(subjectVal >  opVal)) return false; break;
          case "lt":  if (!(subjectVal <  opVal)) return false; break;
          case "in":
            if (!Array.isArray(opVal) || !opVal.includes(subjectVal)) return false;
            break;
          case "ne":  if (subjectVal === opVal)   return false; break;
          default:    break;
        }
      }
    } else {
      // Энгийн тэгш байдал
      if (subjectVal !== value) return false;
    }
  }

  return true;
}

// ─── Audit log helper ────────────────────────────────────────────────────────
async function logAudit({ userId, action, resource, result, reason, req }) {
  try {
    await prisma.auditLog.create({
      data: {
        userId:    userId || null,
        action,
        resource,
        result,
        reason,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });
  } catch {
    // Audit log алдаа нь request-ыг зогсоохгүй
  }
}

module.exports = { requireRole, requirePermission, requireAbac };
