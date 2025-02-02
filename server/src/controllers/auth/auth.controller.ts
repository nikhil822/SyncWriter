import { validationResult } from "express-validator";
import catchAsync from "../../middlewares/catch-async";
import { userService } from "../../services/user.service";
import { emailNotVerified, userNotFound } from "../../../responses";
import jwt, { VerifyErrors } from "jsonwebtoken";

const login = catchAsync(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }
  const { email, password } = req.body;
  const user = await userService.findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ errors: userNotFound });
  }
  const validPassword = await userService.checkPassword(user, password);
  if (!validPassword) {
    return res.status(401).json({ errors: userNotFound });
  }
  if (!user.isVerified) {
    return res.status(401).json({ errors: emailNotVerified });
  }
  const authResponse = await userService.generateAuthResponse(user);
  return res.status(200).json(authResponse);
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json(err);
  }

  const { token: refreshToken } = req.body;

  const isTokenActive = await userService.getIsTokenActive(refreshToken);
  if (!isTokenActive) return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    "refresh_token",
    async (error: VerifyErrors | null, decoded: unknown) => {
      if (error) return res.sendStatus(403);
      try {
        const { id, email, roles } = decoded as {
          id: number;
          email: string;
          roles: string[];
        };
        const user = { id, email, roles };

        const authResponse = await userService.generateAuthResponse(user);
        return res.status(200).json(authResponse);
      } catch (error) {
        console.error(error);
        res.sendStatus(403);
      }
    }
  );
});

export const authController = { login, refreshToken };
