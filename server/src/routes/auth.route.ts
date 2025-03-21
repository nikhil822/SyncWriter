import { Router } from "express";
import { loginValidator, refreshTokenValidator } from "../validators/auth.validator";
import { authController } from "../controllers/auth/auth.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/login", loginValidator, authController.login)
router.post("/refresh-token", refreshTokenValidator, authController.refreshToken);
router.delete('/logout', authenticate, authController.logout)

export { router as auth };
