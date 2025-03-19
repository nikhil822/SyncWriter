import { NextFunction, Request, Response } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import RoleEnum from "../../types/enums/role-enum";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

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
            return res.sendStatus(403)
        }
};

const authorize = (permittedRoles: Array<RoleEnum>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) return res.sendStatus(401);
      const userId = req.user.id;
  
      await prisma.userRole.findAll({ where: { userId }, include: Role })
        .then((data) => {
          const roles = data.map((userRole) => userRole.role.name);
          if (
            permittedRoles.some((permittedRole) => roles.includes(permittedRole))
          ) {
            next();
          } else {
            return res.sendStatus(403);
          }
        })
        .catch((error) => {
          console.log(error);
          return res.sendStatus(403);
        });
    };
  };

export {authenticate, authorize}
