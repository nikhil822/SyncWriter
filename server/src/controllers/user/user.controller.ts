import { validationResult } from "express-validator";
import catchAsync from "../../middlewares/catch-async";
import { Request, Response } from "express";
import { userService } from "../../services/user.service";
import { resetPassword } from "../../../responses";

export const register = catchAsync(async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const {email, password1} = req.body
    await userService.createUser(email, password1)
    return res.sendStatus(200)
})

export const getUser = catchAsync(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id)
    const user = await userService.findUserById(userId)
    if(user === null)return res.sendStatus(400).json({message: 'User not found'})
    return res.status(200).json(user)
})

export const resetPasswordHandler = catchAsync(async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const {email} = req.body
    const user = await userService.findUserByEmail(email)
    if(!user)return res.status(200).json(resetPassword)
    await userService.resetPassword(email)
    return res.status(200).json(resetPassword)
})