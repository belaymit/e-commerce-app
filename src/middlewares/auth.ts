import { NextFunction, Request, Response } from "express";
import { UnAuthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";
import { User } from "@prisma/client";

interface AuthenticatedRequest extends Request {
  user: User;  
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    return next(new UnAuthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }

  try {
    const payload = jwt.verify(token as string, JWT_SECRET) as any;
    const user = await prismaClient.user.findFirst({ where: { id: payload.userId } });

    if (!user) {
      return next(new UnAuthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    }

    (req as AuthenticatedRequest).user = user;
    next();

  } catch (error) {
    return next(new UnAuthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};

export default authMiddleware;