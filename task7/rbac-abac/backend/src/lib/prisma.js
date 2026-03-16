// src/lib/prisma.js
const { PrismaClient } = require("@prisma/client");

// Development дээр hot-reload хийхэд олон instance үүсэхийг сэргийлнэ
const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
