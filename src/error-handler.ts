import { NextFunction, Request, Response } from "express"
import { ErrorCode, HttpException } from "./exceptions/root"
import { InternalServerErrorException } from "./exceptions/internal-exceptions"

export const errorHandler = (method: Function) => {
  return async(req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next)
    }catch(error){
      let exception: HttpException;
      if(error instanceof HttpException){
        exception = error;
      }else{
        exception = new InternalServerErrorException("Something went wrong", error, ErrorCode.INTERNAL_SERVER_ERROR);
      }
      next(exception);
    }
  }
}