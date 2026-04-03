import { Router } from "express";
import {
  registerController,
  loginController,
  getMeController,
} from "../controllers/auth.controller";
import { validateBody } from "../middlewares/validate.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validator";

const router = Router();

router.post("/register", validateBody(registerSchema), registerController);
router.post("/login", validateBody(loginSchema), loginController);
router.get("/me", authMiddleware, getMeController);

export default router;