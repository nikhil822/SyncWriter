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
exports.documentService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const findDocumentById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Find document if it's either owned by the user or public
    let document = yield prisma.document.findFirst({
        where: {
            OR: [
                { id, userId },
                { id, isPublic: true },
            ],
        },
    });
    if (document)
        return document;
    // Check if the document is shared with the user
    const sharedDocument = yield prisma.documentUser.findFirst({
        where: { userId, documentId: id },
        include: { document: true },
    });
    return sharedDocument ? sharedDocument.document : null;
});
const findAllDocumentsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch documents owned by the user
    const documents = yield prisma.document.findMany({
        where: { userId },
    });
    // Fetch shared documents
    const sharedDocuments = yield prisma.documentUser.findMany({
        where: { userId },
        include: {
            document: true,
        },
    });
    // Extract shared documents
    const sharedDocs = sharedDocuments.map((docUser) => docUser.document);
    return [...documents, ...sharedDocs];
});
const createDocument = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.document.create({
        data: {
            userId,
            title: "Untitled Document",
            content: {},
            isPublic: false,
        },
    });
});
const updateDocument = (id, userId, title, content, isPublic) => __awaiter(void 0, void 0, void 0, function* () {
    const existingDocument = yield findDocumentById(id, userId);
    if (!existingDocument)
        return null;
    return yield prisma.document.update({
        where: { id },
        data: Object.assign(Object.assign(Object.assign({}, (title !== undefined ? { title } : {})), (content !== undefined ? { content } : {})), (isPublic !== undefined ? { isPublic } : {})),
    });
});
const deleteDocument = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.document.deleteMany({
        where: {
            id,
            userId,
        },
    });
});
exports.documentService = {
    findDocumentById,
    findAllDocumentsByUser,
    createDocument,
    updateDocument,
    deleteDocument,
};
