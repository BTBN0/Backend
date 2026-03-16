const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// POST /payments  - process payment (mock)
router.post('/', async (req, res) => {
  try {
    const { orderId, userId, amount, method = 'mock' } = req.body;

    // Mock payment: always succeeds
    const payment = await prisma.payment.create({
      data: { orderId, userId, amount, method, status: 'SUCCESS' },
    });

    // Notify order service (webhook-style)
    const orderServiceUrl = process.env.ORDER_SERVICE_URL;
    await fetch(`${orderServiceUrl}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'PAID' }),
    }).catch(() => {}); // fire and forget

    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /payments/:orderId
router.get('/:orderId', async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { orderId: Number(req.params.orderId) },
    });
    if (!payment) return res.status(404).json({ error: 'Not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /payments/webhook  - Stripe webhook (future)
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  // TODO: verify Stripe signature and update payment status
  res.json({ received: true });
});

module.exports = router;
