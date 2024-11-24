import { PrismaClient } from "@prisma/client";
import { genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const userService = {
  findUserByEmail: async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  },

  createUser: async (email: string, password: string) => {
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);
    const verificationToken = jwt.sign({ email }, "verify_email");
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verificationToken,
      },
    });
    // await userService.sendVerificationEmail(user);
  },

  // sendVerificationEmail: async (user) => {},
};
