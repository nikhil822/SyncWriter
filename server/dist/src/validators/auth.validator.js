"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenValidator = exports.loginValidator = void 0;
const express_validator_1 = require("express-validator");
const emailValidator = () => (0, express_validator_1.body)("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Must provide a valid email address");
const passwordValidator = () => (0, express_validator_1.body)("password").exists().withMessage("Must provide a password");
const tokenValidator = () => (0, express_validator_1.body)("token").exists().withMessage("Must provide a valid token.");
exports.loginValidator = [emailValidator(), passwordValidator()];
exports.refreshTokenValidator = [tokenValidator()];
