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
exports.userService = {
    findUserByEmail: (email) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield prisma.user.findUnique({ where: { email } });
        return user;
    }),
    createUser: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
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
    }),
    // sendVerificationEmail: async (user) => {},
};
