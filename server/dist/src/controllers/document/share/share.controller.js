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
exports.unshareDocument = exports.shareDocument = void 0;
const client_1 = require("@prisma/client");
const catch_async_1 = __importDefault(require("../../../middlewares/catch-async"));
const express_validator_1 = require("express-validator");
const prisma = new client_1.PrismaClient();
exports.shareDocument = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const err = (0, express_validator_1.validationResult)(req);
    if (!err.isEmpty()) {
        return res.status(400).json(err);
    }
    const { id } = req.params; // Document ID
    const { email, permission } = req.body;
    const document = yield prisma.document.findUnique({
        where: { id: parseInt(id) },
    });
    if (!document)
        return res.sendStatus(400);
    // Check if the current user is the owner of the document
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || document.userId !== parseInt(req.user.id)) {
        return res.sendStatus(400);
    }
    // Find the user by email
    const sharedUser = yield prisma.user.findUnique({
        where: { email },
    });
    if (!sharedUser)
        return res.sendStatus(400);
    // Share the document
    const documentUser = yield prisma.documentUser.create({
        data: {
            documentId: document.id,
            userId: sharedUser.id,
            permission,
        },
    });
    // Send email notification
    const mail = {
        from: "sahu13nikhil@gmail.com",
        to: sharedUser.email,
        subject: `${req.user.email} shared a document with you!`,
        text: `Click the following link to view and edit the document: http://localhost:5173/document/${id}`,
    };
    //   await mailservice.sendMail(mail);
    return res.status(201).json(documentUser);
}));
exports.unshareDocument = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const err = (0, express_validator_1.validationResult)(req);
    if (!err.isEmpty()) {
        return res.status(400).json(err);
    }
    const { documentId, userId } = req.params;
    // Check if the user making the request owns the document
    const document = yield prisma.document.findFirst({
        where: {
            id: parseInt(documentId),
            userId: parseInt((_a = req.user) === null || _a === void 0 ? void 0 : _a.id),
        },
    });
    if (!document)
        return res.sendStatus(400);
    // Check if the document is shared with the user
    const documentUser = yield prisma.documentUser.findFirst({
        where: {
            documentId: parseInt(documentId),
            userId: parseInt(userId),
        },
    });
    if (!documentUser)
        return res.sendStatus(400);
    // Remove sharing access
    yield prisma.documentUser.delete({
        where: {
            id: documentUser.id,
        },
    });
    return res.sendStatus(200);
}));
