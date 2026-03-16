const { verifyAccessToken } = require('../utils/token.utils');

/**
 * MIDDLEWARE: authenticate
 * Authorization: Bearer <accessToken> header шалгана
 * req.user = { id, role } set хийнэ
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access token байхгүй байна' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access token хугацаа дууссан байна' });
    }
    return res.status(401).json({ message: 'Access token буруу байна' });
  }
};

/**
 * MIDDLEWARE: authorize (RBAC)
 * Жишээ: authorize('ADMIN') эсвэл authorize('ADMIN', 'MODERATOR')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Нэвтрээгүй байна' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Хандах эрх хүрэлцэхгүй байна. Шаардлагатай role: ${roles.join(' эсвэл ')}`,
      });
    }

    next();
  };
};

module.exports = { authenticate, authorize };
