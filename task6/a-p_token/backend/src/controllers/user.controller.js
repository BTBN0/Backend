const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /me
const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, email: true, role: true },
        });

        if (!user) {
            return res.status(404).json({ message: 'Хэрэглэгч олдсонгүй' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Серверийн алдаа', error: err.message });
    }
};

// GET /admin/metrics
const getAdminMetrics = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const activeSessions = await prisma.refreshToken.count({ where: { revoked: false } });
        const revokedTokens = await prisma.refreshToken.count({ where: { revoked: true } });

        res.json({
            message: 'Admin metrics',
            data: { totalUsers, activeSessions, revokedTokens },
        });
    } catch (err) {
        res.status(500).json({ message: 'Серверийн алдаа', error: err.message });
    }
};

module.exports = { getMe, getAdminMetrics };