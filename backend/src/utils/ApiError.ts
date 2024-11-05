import { nodeEnv } from "../config";

export class ApiError extends Error {
  statusCode: number;
  message: string;
  errors: any;
  stack: string | undefined;
  data: any;
  success: boolean;

  constructor(
    statusCode: number,
    message: string,
    errors?: [],
    stack: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.data = null;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
