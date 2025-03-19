"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const express_1 = require("express");
const auth_validator_1 = require("../validators/auth.validator");
const auth_controller_1 = require("../controllers/auth/auth.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
exports.auth = router;
router.post("/login", auth_validator_1.loginValidator, auth_controller_1.authController.login);
router.post("/refresh-token", auth_validator_1.refreshTokenValidator, auth_controller_1.authController.refreshToken);
router.delete('/logout', auth_1.authenticate, auth_controller_1.authController.logout);
