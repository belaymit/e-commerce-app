import { ErrorCode, HttpException } from "./root";

export class BadRequestException extends HttpException {
  constructor(message: string, errorCode:ErrorCode, error?: Error) {
    super(message, errorCode, 400, null);
  }
}