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
exports.userService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({ where: { email } });
    return user;
});
const createUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield (0, bcrypt_1.genSalt)();
    const hashedPassword = yield (0, bcrypt_1.hash)(password, salt);
    const verificationToken = jsonwebtoken_1.default.sign({ email }, "verify_email");
    const user = yield prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            verificationToken,
        },
    });
    // await userService.sendVerificationEmail(user);
});
const checkPassword = (user, password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, bcrypt_1.compare)(password, user.password);
});
const getRequestUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userWithRoles = yield prisma.user.findUnique({
        where: { id: user.id },
        include: { userRoles: { include: { role: true } } },
    });
    return {
        id: user.id,
        email: user.email,
        roles: (userWithRoles === null || userWithRoles === void 0 ? void 0 : userWithRoles.userRoles.map((userRole) => userRole.role.name)) || [],
    };
});
const generateAuthResponse = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const requestUser = yield getRequestUser(user);
    const accessToken = jsonwebtoken_1.default.sign(requestUser, "access_token", {
        expiresIn: "24h",
    });
    const refreshToken = jsonwebtoken_1.default.sign(requestUser, "refresh_token", {
        expiresIn: "7d",
    });
    yield prisma.refreshToken.deleteMany({ where: { userId: requestUser.id } });
    yield prisma.refreshToken.create({
        data: { token: refreshToken, userId: requestUser.id },
    });
    return { accessToken, refreshToken };
});
const getIsTokenActive = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return Boolean(yield prisma.refreshToken.findFirst({ where: { token } }));
});
const logoutUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.refreshToken.deleteMany({ where: { userId } });
});
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.user.findUnique({ where: { id } });
});
const resetPassword = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const passwordResetToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, "password_reset", { expiresIn: "24h" });
    yield prisma.user.update({
        where: { id: user.id },
        data: { passwordResetToken },
    });
    // await sendPasswordResetEmail(user);
});
const updatePassword = (userId, password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield (0, bcrypt_1.genSalt)();
    const hashedPassword = yield (0, bcrypt_1.hash)(password, salt);
    yield prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword, passwordResetToken: null },
    });
});
const findUserByVerificationToken = (email, verificationToken) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.user.findFirst({
        where: { email, verificationToken },
    });
});
const updateIsVerified = (userId, isVerified) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.user.update({
        where: { id: userId },
        data: { isVerified, verificationToken: null },
    });
});
const findUserByPasswordResetToken = (email, passwordResetToken) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.user.findFirst({
        where: { email, passwordResetToken },
    });
});
exports.userService = {
    findUserByEmail,
    createUser,
    checkPassword,
    generateAuthResponse,
    getIsTokenActive,
    logoutUser,
    findUserById,
    resetPassword,
    findUserByPasswordResetToken,
    updatePassword,
    updateIsVerified,
    findUserByVerificationToken,
};
