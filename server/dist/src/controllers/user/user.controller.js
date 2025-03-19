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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmResetPassword = exports.verifyEmail = exports.resetPasswordHandler = exports.getUser = exports.register = void 0;
const express_validator_1 = require("express-validator");
const catch_async_1 = __importDefault(require("../../middlewares/catch-async"));
const user_service_1 = require("../../services/user.service");
const responses_1 = require("../../../responses");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.register = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password1 } = req.body;
    yield user_service_1.userService.createUser(email, password1);
    return res.sendStatus(200);
}));
exports.getUser = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id);
    const user = yield user_service_1.userService.findUserById(userId);
    if (user === null)
        return res.sendStatus(400).json({ message: "User not found" });
    return res.status(200).json(user);
}));
exports.resetPasswordHandler = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    const user = yield user_service_1.userService.findUserByEmail(email);
    if (!user)
        return res.status(200).json(responses_1.resetPassword);
    yield user_service_1.userService.resetPassword(email);
    return res.status(200).json(responses_1.resetPassword);
}));
exports.verifyEmail = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificationToken = req.params.token;
    jsonwebtoken_1.default.verify(verificationToken, "verify_email", (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        try {
            const { email } = decoded;
            const user = yield user_service_1.userService.findUserByVerificationToken(email, verificationToken);
            if (!user || user.isVerified) {
                return res.status(400).json({ message: "Invalid verification request" });
            }
            yield user_service_1.userService.updateIsVerified(user.id, true);
            return res.sendStatus(200);
        }
        catch (error) {
            console.log("error", error);
            return res.sendStatus(500);
        }
    }));
}));
exports.confirmResetPassword = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const resetPasswordToken = req.params.token;
    const { password1 } = req.body;
    jsonwebtoken_1.default.verify(resetPasswordToken, "password_reset", (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(403).json({ message: "Invalid token" });
        try {
            const { email } = decoded;
            const user = yield user_service_1.userService.findUserByPasswordResetToken(email, resetPasswordToken);
            if (!user)
                return res.status(403).json({ message: "Invalid token" });
            yield user_service_1.userService.updatePassword(user.id, password1);
            return res.sendStatus(200);
        }
        catch (error) {
            console.log("error", error);
            return res.sendStatus(500);
        }
    }));
}));
