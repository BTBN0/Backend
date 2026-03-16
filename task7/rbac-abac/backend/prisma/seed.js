// prisma/seed.js
// npx prisma db seed -- ажиллуулна
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── 1. Permissions үүсгэх ────────────────────────────────────────────
  const permissions = await Promise.all([
    // Users resource
    prisma.permission.upsert({ where: { action_resource: { action: "read",   resource: "users"    } }, update: {}, create: { action: "read",   resource: "users",    description: "Хэрэглэгчдийн жагсаалт харах" } }),
    prisma.permission.upsert({ where: { action_resource: { action: "write",  resource: "users"    } }, update: {}, create: { action: "write",  resource: "users",    description: "Хэрэглэгч үүсгэх/засах" } }),
    prisma.permission.upsert({ where: { action_resource: { action: "delete", resource: "users"    } }, update: {}, create: { action: "delete", resource: "users",    description: "Хэрэглэгч устгах" } }),
    prisma.permission.upsert({ where: { action_resource: { action: "manage", resource: "users"    } }, update: {}, create: { action: "manage", resource: "users",    description: "Хэрэглэгч бүрэн удирдах (role өгөх гэх мэт)" } }),

    // Posts resource
    prisma.permission.upsert({ where: { action_resource: { action: "read",   resource: "posts"    } }, update: {}, create: { action: "read",   resource: "posts",    description: "Постуудыг харах" } }),
    prisma.permission.upsert({ where: { action_resource: { action: "write",  resource: "posts"    } }, update: {}, create: { action: "write",  resource: "posts",    description: "Пост үүсгэх/засах" } }),
    prisma.permission.upsert({ where: { action_resource: { action: "delete", resource: "posts"    } }, update: {}, create: { action: "delete", resource: "posts",    description: "Пост устгах" } }),

    // Reports resource
    prisma.permission.upsert({ where: { action_resource: { action: "read",   resource: "reports"  } }, update: {}, create: { action: "read",   resource: "reports",  description: "Тайлан харах" } }),
    prisma.permission.upsert({ where: { action_resource: { action: "write",  resource: "reports"  } }, update: {}, create: { action: "write",  resource: "reports",  description: "Тайлан үүсгэх" } }),

    // Settings resource
    prisma.permission.upsert({ where: { action_resource: { action: "read",   resource: "settings" } }, update: {}, create: { action: "read",   resource: "settings", description: "Тохиргоо харах" } }),
    prisma.permission.upsert({ where: { action_resource: { action: "manage", resource: "settings" } }, update: {}, create: { action: "manage", resource: "settings", description: "Тохиргоо удирдах" } }),
  ]);

  console.log(`✅ ${permissions.length} permissions created`);

  // ─── 2. Roles үүсгэх ─────────────────────────────────────────────────
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
      description: "Системийн бүрэн эрхт администратор",
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: "user" },
    update: {},
    create: {
      name: "user",
      description: "Энгийн хэрэглэгч",
    },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: "manager" },
    update: {},
    create: {
      name: "manager",
      description: "Менежер — хязгаарлагдмал удирдах эрхтэй",
    },
  });

  console.log("✅ Roles created: admin, user, manager");

  // ─── 3. Role-Permission холбох ────────────────────────────────────────
  // Admin: БҮГД
  const allPermIds = permissions.map((p) => ({ permissionId: p.id }));
  for (const { permissionId } of allPermIds) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId } },
      update: {},
      create: { roleId: adminRole.id, permissionId },
    });
  }

  // User: зөвхөн өөрийн posts read/write, profile read
  const userPerms = permissions.filter(
    (p) =>
      (p.resource === "posts" && ["read", "write"].includes(p.action)) ||
      (p.resource === "users" && p.action === "read")
  );
  for (const perm of userPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: userRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: userRole.id, permissionId: perm.id },
    });
  }

  // Manager: users read, posts бүгд, reports read/write
  const managerPerms = permissions.filter(
    (p) =>
      (p.resource === "users" && ["read", "write"].includes(p.action)) ||
      p.resource === "posts" ||
      p.resource === "reports"
  );
  for (const perm of managerPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: managerRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: managerRole.id, permissionId: perm.id },
    });
  }

  console.log("✅ Role permissions assigned");

  // ─── 4. ABAC Policies үүсгэх ─────────────────────────────────────────
  await prisma.abacPolicy.upsert({
    where: { name: "finance-reports-access" },
    update: {},
    create: {
      name: "finance-reports-access",
      description: "Finance хэлтсийн level 3+ хэрэглэгч тайлан уншиж болно",
      subjectConditions: { department: "finance", level: { gte: 3 } },
      resourceConditions: { resource: "reports", action: "read" },
      effect: "ALLOW",
      priority: 10,
    },
  });

  await prisma.abacPolicy.upsert({
    where: { name: "mn-region-only" },
    update: {},
    create: {
      name: "mn-region-only",
      description: "MN бүсийн хэрэглэгч л settings харж болно",
      subjectConditions: { region: "MN" },
      resourceConditions: { resource: "settings", action: "read" },
      effect: "ALLOW",
      priority: 5,
    },
  });

  await prisma.abacPolicy.upsert({
    where: { name: "deny-inactive-write" },
    update: {},
    create: {
      name: "deny-inactive-write",
      description: "Inactive хэрэглэгч write хийж болохгүй",
      subjectConditions: { isActive: false },
      resourceConditions: { action: "write" },
      effect: "DENY",
      priority: 100, // өндөр priority — эхэлж шалгагдана
    },
  });

  console.log("✅ ABAC policies created");

  // ─── 5. Demo хэрэглэгчид ─────────────────────────────────────────────
  const hashedAdmin = await bcrypt.hash("Admin@1234", 12);
  const hashedUser  = await bcrypt.hash("User@1234",  12);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: hashedAdmin,
      name: "System Admin",
      department: "engineering",
      level: 4,
      region: "MN",
    },
  });

  const normalUser = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      password: hashedUser,
      name: "Энгийн Хэрэглэгч",
      department: "sales",
      level: 1,
      region: "MN",
    },
  });

  // Role өгөх
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
    update: {},
    create: { userId: adminUser.id, roleId: adminRole.id, assignedBy: "seed" },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: normalUser.id, roleId: userRole.id } },
    update: {},
    create: { userId: normalUser.id, roleId: userRole.id, assignedBy: "seed" },
  });

  console.log("✅ Demo users created:");
  console.log("   👑 admin@example.com  / Admin@1234  → /admin/dashboard");
  console.log("   👤 user@example.com   / User@1234   → /user/dashboard");
  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
