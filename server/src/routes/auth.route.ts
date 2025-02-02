import { Router } from "express";
import { loginValidator } from "../validators/auth.validator";
import { authController } from "../controllers/auth/auth.controller";

const router = Router();

router.post("/login", loginValidator, authController.login)

export { router as auth };
