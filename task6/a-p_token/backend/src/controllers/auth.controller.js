const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/token.utils');

const prisma = new PrismaClient();

// Refresh token cookie тохиргоо
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,       // JS-ээр уншигдахгүй
  secure: process.env.NODE_ENV === 'production', // HTTPS дээр л илгээнэ
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 өдөр (ms)
};

/**
 * POST /auth/register
 */
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email болон password шаардлагатай' });
    }

    // Email давхардал шалгах
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Энэ email бүртгэлтэй байна' });
    }

    // Password hash хийх
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, passwordHash },
      select: { id: true, email: true, role: true, createdAt: true },
    });

    res.status(201).json({ message: 'Бүртгэл амжилттай', user });
  } catch (err) {
    res.status(500).json({ message: 'Серверийн алдаа', error: err.message });
  }
};

/**
 * POST /auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email болон password шаардлагатай' });
    }

    // Хэрэглэгч олох
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email эсвэл password буруу байна' });
    }

    // Password шалгах
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Email эсвэл password буруу байна' });
    }

    // Token-ууд үүсгэх
    const payload = { id: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Refresh token DB-д хадгалах
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Refresh token → HttpOnly Cookie
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

    res.json({
      message: 'Нэвтрэлт амжилттай',
      accessToken,
    });
  } catch (err) {
    res.status(500).json({ message: 'Серверийн алдаа', error: err.message });
  }
};

/**
 * POST /auth/refresh
 * Cookie-н refresh token-оор шинэ access token авах
 * BONUS: Token Rotation хийнэ
 */
const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token байхгүй байна' });
    }

    // JWT verify
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(401).json({ message: 'Refresh token буруу эсвэл хугацаа дууссан' });
    }

    // DB-ээс шалгах (revoked эсэх, оршин байгаа эсэх)
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
      // Хэрэв revoked token ирвэл бүх session-ийг цэвэрлэ (security)
      res.clearCookie('refreshToken');
      return res.status(401).json({ message: 'Refresh token хүчингүй байна' });
    }

    // ── TOKEN ROTATION ──────────────────────────────────────────
    // Хуучин token-ийг revoke хийх
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });

    // Шинэ token-ууд үүсгэх
    const payload = { id: decoded.id, role: decoded.role };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    // Шинэ refresh token DB-д хадгалах
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: decoded.id,
        expiresAt,
      },
    });

    // Cookie шинэчлэх
    res.cookie('refreshToken', newRefreshToken, REFRESH_COOKIE_OPTIONS);

    res.json({
      message: 'Token шинэчлэгдлээ',
      accessToken: newAccessToken,
    });
  } catch (err) {
    res.status(500).json({ message: 'Серверийн алдаа', error: err.message });
  }
};

/**
 * POST /auth/logout
 */
const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      // DB дээр revoke хийх
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { revoked: true },
      });
    }

    // Cookie устгах
    res.clearCookie('refreshToken');

    res.json({ message: 'Гарлаа' });
  } catch (err) {
    res.status(500).json({ message: 'Серверийн алдаа', error: err.message });
  }
};

module.exports = { register, login, refresh, logout };
