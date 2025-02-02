import { NextFunction, Request, Response } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if(!token) return res.sendStatus(401)
        try {
            const decoded = await new Promise((resolve, reject) => {
                jwt.verify(token, "access_token", (err: VerifyErrors | null, decoded: unknown) => {
                    if(err) return reject(err)
                    return resolve(decoded)
                })
            })
            const {id, email, roles} = decoded as RequestUser
            req.user = {id, email, roles}
            next()
        }
        catch(err) {
            console.log(err)
            return res.sendStatus(403
        }
};

export {authenticate}
