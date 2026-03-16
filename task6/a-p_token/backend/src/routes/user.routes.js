const express = require('express');
const router = express.Router();
const { getMe, getAdminMetrics } = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// GET /me
router.get('/me', authenticate, getMe);

// GET /admin/metrics - ADMIN only
router.get('/admin/metrics', authenticate, authorize('ADMIN'), getAdminMetrics);

module.exports = router;