import express from "express";
import { body } from "express-validator";
import { login } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.post(
  "/",
  [
    body("email").isEmail().withMessage("Email буруу байна"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password 6+ тэмдэгт байх ёстой")
  ],
  validate,
  login
);

export default router;