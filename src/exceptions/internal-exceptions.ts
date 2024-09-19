import { HttpException } from "./root";

export class InternalServerErrorException extends HttpException {
  constructor(message: string, errors:any, errorCode: number) {
    super(message, errorCode, 500, errors);
  }
}