import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import catchAsync from "../../../middlewares/catch-async";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

export const shareDocument = catchAsync(async (req: Request, res: Response) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json(err);
  }

  const { id } = req.params; // Document ID
  const { email, permission } = req.body;

  const document = await prisma.document.findUnique({
    where: { id: parseInt(id) },
  });

  if (!document) return res.sendStatus(400);

  // Check if the current user is the owner of the document
  if (!req.user?.id || document.userId !== parseInt(req.user.id)) {
    return res.sendStatus(400);
  }

  // Find the user by email
  const sharedUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!sharedUser) return res.sendStatus(400);

  // Share the document
  const documentUser = await prisma.documentUser.create({
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
});

export const unshareDocument = catchAsync(async (req: Request, res: Response) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json(err);
    }
  
    const { documentId, userId } = req.params;
  
    // Check if the user making the request owns the document
    const document = await prisma.document.findFirst({
      where: {
        id: parseInt(documentId),
        userId: parseInt(req.user?.id),
      },
    });
  
    if (!document) return res.sendStatus(400);
  
    // Check if the document is shared with the user
    const documentUser = await prisma.documentUser.findFirst({
      where: {
        documentId: parseInt(documentId),
        userId: parseInt(userId),
      },
    });
  
    if (!documentUser) return res.sendStatus(400);
  
    // Remove sharing access
    await prisma.documentUser.delete({
      where: {
        id: documentUser.id,
      },
    });
  
    return res.sendStatus(200);
  });
