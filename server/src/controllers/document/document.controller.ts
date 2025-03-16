import { Request, Response } from "express";
import { validationResult } from "express-validator";
import catchAsync from "../../middlewares/catch-async";
import { documentService } from "../../services/document.service";

export const getOne = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) return res.sendStatus(401);

  const { id } = req.params;

  const document = await documentService.findDocumentById(
    parseInt(id),
    parseInt(req.user.id)
  );

  if (!document) return res.sendStatus(404);

  return res.status(200).json(document);
});

export const getAll = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) return res.sendStatus(401);

  const documents = await documentService.findAllDocumentsByUser(
    parseInt(req.user.id)
  );
  return res.status(200).json(documents);
});

export const create = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) return res.sendStatus(401);

  const { title, content, isPublic } = req.body;

  const document = await documentService.createDocument(parseInt(req.user.id));

  return res.status(201).json(document);
});

export const update = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) return res.sendStatus(401);

  const err = validationResult(req);
  if (!err.isEmpty()) return res.status(400).json(err);

  const { id } = req.params;
  const { title, content, isPublic } = req.body;

  const updatedDocument = await documentService.updateDocument(
    parseInt(id),
    parseInt(req.user.id),
    title,
    content,
    isPublic
  );

  if (!updatedDocument) return res.sendStatus(404);

  return res.sendStatus(200);
});

export const deleteDocument = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) return res.sendStatus(401);

    const { id } = req.params;

    await documentService.deleteDocument(parseInt(id), parseInt(req.user.id));

    return res.sendStatus(200);
  }
);
