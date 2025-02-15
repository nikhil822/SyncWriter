import { PrismaClient } from "@prisma/client";
import { compare, genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  return user;
};

const createUser = async (email: string, password: string) => {
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
};

const checkPassword = async (user: { password: string }, password: string) => {
  return await compare(password, user.password);
};

const getRequestUser = async (user: { id: number; email: string }) => {
  const userWithRoles = await prisma.user.findUnique({
    where: { id: user.id },
    include: { userRoles: { include: { role: true } } },
  });
  return {
    id: user.id,
    email: user.email,
    roles: userWithRoles?.userRoles.map((userRole) => userRole.role.name) || [],
  };
};

const generateAuthResponse = async (user: { id: number; email: string }) => {
  const requestUser = await getRequestUser(user);
  const accessToken = jwt.sign(requestUser, "access_token", {
    expiresIn: "24h",
  });
  const refreshToken = jwt.sign(requestUser, "refresh_token", {
    expiresIn: "7d",
  });
  await prisma.refreshToken.deleteMany({ where: { userId: requestUser.id } });
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: requestUser.id },
  });
  return { accessToken, refreshToken };
};

const getIsTokenActive = async (token: string) => {
  return Boolean(await prisma.refreshToken.findFirst({ where: { token } }));
};

const logoutUser = async (userId: number) => {
  await prisma.refreshToken.deleteMany({ where: { userId } });
};

const findUserById = async (id: number) => {
  return await prisma.user.findUnique({ where: { id } });
};

const resetPassword = async (user: { id: number; email: string }) => {
  const passwordResetToken = jwt.sign(
    { id: user.id, email: user.email },
    "password_reset",
    { expiresIn: "24h" }
  );
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordResetToken },
  });
  // await sendPasswordResetEmail(user);
};

const updatePassword = async (userId: number, password: string) => {
  const salt = await genSalt();
  const hashedPassword = await hash(password, salt);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword, passwordResetToken: null },
  });
}

const findUserByVerificationToken = async ( email: string, verificationToken: string) => {
  return await prisma.user.findFirst({
    where: { email, verificationToken },
  });
}

const updateIsVerified = async (userId: number, isVerified: boolean) => {
  await prisma.user.update({
    where: { id: userId },
    data: { isVerified, verificationToken: null },
  });
};

const findUserByPasswordResetToken = async (
  email: string,
  passwordResetToken: string
) => {
  return await prisma.user.findFirst({
    where: { email, passwordResetToken },
  });
};

export const userService = {
  findUserByEmail,
  createUser,
  checkPassword,
  generateAuthResponse,
  getIsTokenActive,
  logoutUser,
  findUserById,
  resetPassword,
  findUserByPasswordResetToken,
  updatePassword,
  updateIsVerified,
  findUserByVerificationToken,
} as const;
