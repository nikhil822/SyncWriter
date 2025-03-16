import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const findDocumentById = async (id: number, userId: number) => {
  // Find document if it's either owned by the user or public
  let document = await prisma.document.findFirst({
    where: {
      OR: [
        { id, userId },
        { id, isPublic: true },
      ],
    },
  });

  if (document) return document;

  // Check if the document is shared with the user
  const sharedDocument = await prisma.documentUser.findFirst({
    where: { userId, documentId: id },
    include: { document: true },
  });

  return sharedDocument ? sharedDocument.document : null;
};

const findAllDocumentsByUser = async (userId: number) => {
  // Fetch documents owned by the user
  const documents = await prisma.document.findMany({
    where: { userId },
  });

  // Fetch shared documents
  const sharedDocuments = await prisma.documentUser.findMany({
    where: { userId },
    include: {
      document: true,
    },
  });

  // Extract shared documents
  const sharedDocs = sharedDocuments.map((docUser) => docUser.document);

  return [...documents, ...sharedDocs];
};

const createDocument = async (userId: number) => {
  return await prisma.document.create({
    data: {
      userId,
      title: "Untitled Document",
      content: {},
      isPublic: false,
    },
  });
};

const updateDocument = async (
  id: number,
  userId: number,
  title?: string,
  content?: object,
  isPublic?: boolean
) => {
  const existingDocument = await findDocumentById(id, userId);

  if (!existingDocument) return null;

  return await prisma.document.update({
    where: { id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(content !== undefined ? { content } : {}),
      ...(isPublic !== undefined ? { isPublic } : {}),
    },
  });
};

const deleteDocument = async (id: number, userId: number) => {
  return await prisma.document.deleteMany({
    where: {
      id,
      userId,
    },
  });
};

export const documentService = {
  findDocumentById,
  findAllDocumentsByUser,
  createDocument,
  updateDocument,
  deleteDocument,
} as const;
