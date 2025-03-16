import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { create, deleteDocument, getAll, getOne, update } from "../controllers/document/document.controller";
import { documentValidator } from "../validators/document.validator";
import { shareValidator } from "../validators/share.validator";

const router = Router()

router.get("/:id", authenticate, getOne)
router.get('/', authenticate, getAll)
router.put('/:id', authenticate, documentValidator.update, update)
router.post('/', authenticate, create)
router.delete('/:id', authenticate, deleteDocument)
router.post('/:id/share', authenticate, shareValidator.create)