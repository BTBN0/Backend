import express from "express";
import prisma from "../prisma/client.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// POST /api/orders  токен шаардлагатай
router.post("/", verifyToken, async (req, res) => {
  try {
    const { items, totalPrice } = req.body;
    if (!items?.length)
      return res.status(400).json({ error: "Захиалгын бүтээгдэхүүн байхгүй" });
    const order = await prisma.order.create({
      data: {
        userId:     req.user.id,
        totalPrice: Number(totalPrice),
        items: {
          create: items.map(i => ({
            productId: Number(i.productId),
            quantity:  Number(i.quantity),
            price:     Number(i.price),
          })),
        },
      },
      include: { items: true },
    });
    res.status(201).json(order);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/orders  Admin→бүгд, User→өөрийнх
router.get("/", verifyToken, async (req, res) => {
  try {
    const where = req.user.role === "admin" ? {} : { userId: req.user.id };
    const orders = await prisma.order.findMany({
      where,
      include: {
        items: { include: { product: true } },
        user:  { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/orders/:id
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        items: { include: { product: true } },
        user:  { select: { id: true, name: true, email: true } },
      },
    });
    if (!order) return res.status(404).json({ error: "Захиалга олдсонгүй" });
    if (req.user.role !== "admin" && order.userId !== req.user.id)
      return res.status(403).json({ error: "Хандах эрх байхгүй" });
    res.json(order);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/orders/:id/status  Admin токен
router.put("/:id/status", verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ["pending", "processing", "delivered", "cancelled"];
    if (!valid.includes(status))
      return res.status(400).json({ error: `Статус: ${valid.join(", ")}` });
    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data:  { status },
    });
    res.json(order);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
