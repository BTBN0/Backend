// src/resolver.js
const { PrismaClient } = require("@prisma/client"); // стандарт import
const prisma = new PrismaClient();

module.exports = {
    users: async () => prisma.user.findMany(),
    user: async ({ id }) => prisma.user.findUnique({ where: { id } }),
    createUser: async ({ name, email }) =>
        prisma.user.create({ data: { name, email } }),
    updateUser: async ({ id, name, email }) =>
        prisma.user.update({ where: { id }, data: { name, email } }),
    deleteUser: async ({ id }) => prisma.user.delete({ where: { id } }),
};