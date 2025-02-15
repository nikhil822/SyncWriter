import { Router } from "express";
import { userValidator } from "../validators/user.validator";
import { getUser, register } from "../controllers/user/user.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/", userValidator.register, register);

router.get('/:id', authenticate, getUser)
router.post('/reset-password', userValidator.resetPassword)

export { router as user };
