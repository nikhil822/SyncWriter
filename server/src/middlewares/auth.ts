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
    if (!req.user) return res.sendStatus(401); // User not authenticated

    const userId = req.user.id;

    try {
      // Fetch the roles associated with the user
      const userRoles = await prisma.userRole.findMany({
        where: { userId },
        include: {
          role: true, // Include the Role relation to get the role name
        },
      });

      // Extract role names from the result
      const roles = userRoles.map((userRole) => userRole.role.name);

      // Check if the user has any of the permitted roles
      const hasPermission = permittedRoles.some((permittedRole) =>
        roles.includes(permittedRole)
      );

      if (hasPermission) {
        return next(); // User is authorized
      } else {
        return res.sendStatus(403); // Forbidden
      }
    } catch (error) {
      console.error("Authorization error:", error);
      return res.sendStatus(500); // Internal Server Error
    }
  };
};

export {authenticate, authorize}
