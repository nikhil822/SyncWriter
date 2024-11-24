import { validationResult } from "express-validator";
import catchAsync from "../../middlewares/catch-async";
import { Request, Response } from "express";
import { userService } from "../../services/user.service";

export const register = catchAsync(async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const {email, password1} = req.body
    await userService.createUser(email, password1)
    return res.sendStatus(200)
})