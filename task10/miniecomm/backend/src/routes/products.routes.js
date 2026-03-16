import express from "express";
import prisma from "../prisma/client.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET /api/products  public — ?search=&category=
router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;
    const where = {};
    if (search) where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
    if (category) where.category = category;
    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    res.json(products);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/products/:id  public
router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!product) return res.status(404).json({ error: "Бүтээгдэхүүн олдсонгүй" });
    res.json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/products  Admin токен
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, description, price, imageUrl, category } = req.body;
    if (!name || !price)
      return res.status(400).json({ error: "Нэр болон үнэ заавал байх ёстой" });
    const product = await prisma.product.create({
      data: { name, description, price: Number(price), imageUrl, category },
    });
    res.status(201).json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/products/:id  Admin токен
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, description, price, imageUrl, category } = req.body;
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: { name, description, price: price ? Number(price) : undefined, imageUrl, category },
    });
    res.json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/products/:id  Admin токен
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Бүтээгдэхүүн устгагдлаа" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
