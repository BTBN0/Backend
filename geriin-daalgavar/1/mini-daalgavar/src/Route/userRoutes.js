import express from "express";
import { param } from "express-validator";
import { getUserById } from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get(
  "/:id",
  [param("id").isInt().withMessage("id тоо байх ёстой")],
  validate,
  getUserById
);

export default router;