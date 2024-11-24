"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidator = void 0;
const express_validator_1 = require("express-validator");
const user_service_1 = require("../services/user.service");
const registerValidator = [
    (0, express_validator_1.body)("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Must provide email address"),
    (0, express_validator_1.body)("email").custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_service_1.userService.findUserByEmail(value);
        if (user) {
            return Promise.reject("User with this email already exists.");
        }
        return true;
    })),
    (0, express_validator_1.body)("password1")
        .isLength({ min: 8, max: 20 })
        .withMessage("Password must be 8 to 20 characters"),
    (0, express_validator_1.body)("password1")
        .matches(/\d/)
        .withMessage("Password must contain at least one digit."),
    (0, express_validator_1.body)("password2").custom((value, { req }) => {
        if (value !== req.body.password1) {
            throw new Error("Passwords must match.");
        }
        return true;
    }),
];
const resetPasswordValidator = [
    (0, express_validator_1.body)("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Must provide a valid email address"),
];
const confirmResetPasswordValidator = [];
exports.userValidator = {
    register: registerValidator,
    resetPassword: resetPasswordValidator,
    //   confirmResetPassword: confirmResetPasswordValidator,
};
