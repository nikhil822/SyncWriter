import { validationResult } from "express-validator";
import catchAsync from "../../middlewares/catch-async";
import { Request, Response } from "express";
import { userService } from "../../services/user.service";
import { resetPassword } from "../../../responses";
import jwt, { VerifyErrors } from "jsonwebtoken";

export const register = catchAsync(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password1 } = req.body;
  await userService.createUser(email, password1);
  return res.sendStatus(200);
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const user = await userService.findUserById(userId);
  if (user === null)
    return res.sendStatus(400).json({ message: "User not found" });
  return res.status(200).json(user);
});

export const resetPasswordHandler = catchAsync(
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const user = await userService.findUserByEmail(email);
    if (!user) return res.status(200).json(resetPassword);
    await userService.resetPassword(email);
    return res.status(200).json(resetPassword);
  }
);

export const verifyEmail = catchAsync(async(req: Request, res: Response) => {
    const verificationToken = req.params.token
    jwt.verify(verificationToken, "verify_email", async(err: VerifyErrors | null, decoded: unknown) => {
        if(err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        try {
            const {email} = decoded as {email: string}
            const user = await userService.findUserByVerificationToken(email, verificationToken)
            if(!user || user.isVerified) {
                return res.status(400).json({ message: "Invalid verification request" });
            }
            await userService.updateIsVerified(user.id, true)
            return res.sendStatus(200)
        } catch (error) {
            console.log("error", error)
            return res.sendStatus(500)
        }
    });
})

export const confirmResetPassword = catchAsync(
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const resetPasswordToken = req.params.token;
    const { password1 } = req.body;
    jwt.verify(
      resetPasswordToken,
      "password_reset",
      async (err: VerifyErrors | null, decoded: unknown) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        try {
          const { email } = decoded as { email: string };

          const user = await userService.findUserByPasswordResetToken(
            email,
            resetPasswordToken
          );
          if (!user) return res.status(403).json({ message: "Invalid token" });
          await userService.updatePassword(user.id, password1);
          return res.sendStatus(200);
        } catch (error) {
          console.log("error", error);
          return res.sendStatus(500);
        }
      }
    );
  }
);
