const express = require('express');
const router = express.Router();
const { register, login, refresh, logout } = require('../controllers/auth.controller');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Түр зуурын admin үүсгэх route
router.post('/make-admin', async (req, res) => {
    const { email } = req.body;
    const user = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
    });
    res.json({ message: `${email} ADMIN боллоо`, role: user.role });
});

module.exports = router;