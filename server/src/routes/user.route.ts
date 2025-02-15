import { Router } from "express";
import { userValidator } from "../validators/user.validator";
import {
  confirmResetPassword,
  getUser,
  register,
  resetPasswordHandler,
  verifyEmail,
} from "../controllers/user/user.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/", userValidator.register, register);
router.put('/verify-email/:token', verifyEmail)
router.get("/:id", authenticate, getUser);
router.post(
  "/reset-password",
  userValidator.resetPassword,
  resetPasswordHandler
);
router.put(
  "/password/:token",
  userValidator.confirmResetPassword,
  confirmResetPassword
);

export { router as user };
