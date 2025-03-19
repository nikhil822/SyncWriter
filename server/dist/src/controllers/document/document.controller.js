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
exports.deleteDocument = exports.update = exports.create = exports.getAll = exports.getOne = void 0;
const express_validator_1 = require("express-validator");
const catch_async_1 = __importDefault(require("../../middlewares/catch-async"));
const document_service_1 = require("../../services/document.service");
exports.getOne = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        return res.sendStatus(401);
    const { id } = req.params;
    const document = yield document_service_1.documentService.findDocumentById(parseInt(id), parseInt(req.user.id));
    if (!document)
        return res.sendStatus(404);
    return res.status(200).json(document);
}));
exports.getAll = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        return res.sendStatus(401);
    const documents = yield document_service_1.documentService.findAllDocumentsByUser(parseInt(req.user.id));
    return res.status(200).json(documents);
}));
exports.create = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        return res.sendStatus(401);
    const { title, content, isPublic } = req.body;
    const document = yield document_service_1.documentService.createDocument(parseInt(req.user.id));
    return res.status(201).json(document);
}));
exports.update = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        return res.sendStatus(401);
    const err = (0, express_validator_1.validationResult)(req);
    if (!err.isEmpty())
        return res.status(400).json(err);
    const { id } = req.params;
    const { title, content, isPublic } = req.body;
    const updatedDocument = yield document_service_1.documentService.updateDocument(parseInt(id), parseInt(req.user.id), title, content, isPublic);
    if (!updatedDocument)
        return res.sendStatus(404);
    return res.sendStatus(200);
}));
exports.deleteDocument = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        return res.sendStatus(401);
    const { id } = req.params;
    yield document_service_1.documentService.deleteDocument(parseInt(id), parseInt(req.user.id));
    return res.sendStatus(200);
}));
