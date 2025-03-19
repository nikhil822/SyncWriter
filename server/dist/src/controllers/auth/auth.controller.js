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
exports.authController = void 0;
const express_validator_1 = require("express-validator");
const catch_async_1 = __importDefault(require("../../middlewares/catch-async"));
const user_service_1 = require("../../services/user.service");
const responses_1 = require("../../../responses");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const login = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    const { email, password } = req.body;
    const user = yield user_service_1.userService.findUserByEmail(email);
    if (!user) {
        return res.status(401).json({ errors: responses_1.userNotFound });
    }
    const validPassword = yield user_service_1.userService.checkPassword(user, password);
    if (!validPassword) {
        return res.status(401).json({ errors: responses_1.userNotFound });
    }
    if (!user.isVerified) {
        return res.status(401).json({ errors: responses_1.emailNotVerified });
    }
    const authResponse = yield user_service_1.userService.generateAuthResponse(user);
    return res.status(200).json(authResponse);
}));
const refreshToken = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const err = (0, express_validator_1.validationResult)(req);
    if (!err.isEmpty()) {
        return res.status(400).json(err);
    }
    const { token: refreshToken } = req.body;
    const isTokenActive = yield user_service_1.userService.getIsTokenActive(refreshToken);
    if (!isTokenActive)
        return res.sendStatus(403);
    jsonwebtoken_1.default.verify(refreshToken, "refresh_token", (error, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (error)
            return res.sendStatus(403);
        try {
            const { id, email, roles } = decoded;
            const user = { id, email, roles };
            const authResponse = yield user_service_1.userService.generateAuthResponse(user);
            return res.status(200).json(authResponse);
        }
        catch (error) {
            console.error(error);
            res.sendStatus(403);
        }
    }));
}));
const logout = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        return res.sendStatus(401);
    const userId = parseInt(req.user.id);
    yield user_service_1.userService.logoutUser(userId);
    return res.sendStatus(200);
}));
exports.authController = { login, refreshToken, logout };
