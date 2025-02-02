import { validationResult } from "express-validator";
import catchAsync from "../../middlewares/catch-async";
import { userService } from "../../services/user.service";
import { emailNotVerified, userNotFound } from "../../../responses";

const login = catchAsync(async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json(errors)
    }
    const {email, password} = req.body
    const user = await userService.findUserByEmail(email)
    if(!user) {
        return res.status(401).json({errors: userNotFound})
    }
    const validPassword = await userService.checkPassword(user, password)
    if(!validPassword) {
        return res.status(401).json({errors: userNotFound})
    }
    if(!user.isVerified) {
        return res.status(401).json({errors: emailNotVerified})
    }
    const authResponse = await userService.generateAuthResponse(user)
    return res.status(200).json(authResponse)
})

export const authController = {login}