import { Router } from "express";

const router = Router();

// Жишээ ажиллаж байгаа route
router.get("/health", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

export default router;