import { NextFunction, Request, Response } from "express";
import { UnAuthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import { User } from "@prisma/client";

interface AuthenticatedRequest extends Request {
  user: User;  
}

const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as AuthenticatedRequest).user;
  if(user.role ==="ADMIN"){
    next();
  }else {
    next(new UnAuthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
  }
};

export default adminMiddleware