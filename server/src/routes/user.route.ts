import { Router } from "express";
import { userValidator } from "../validators/user.validator";
import { register } from "../controllers/user/user.controller";

const router = Router();

router.post("/", userValidator.register, register);

export { router as user };
