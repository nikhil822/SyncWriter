import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const userService = {
  findUserByEmail: async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  },
};
