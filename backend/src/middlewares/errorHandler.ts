import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { nodeEnv } from "../config";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  let error = err;

  // check if error is instance of ApiError class if not make it instance of ApiError class
  if (!(error instanceof ApiError)) {
    const statusCode = (error as ApiError).statusCode || 500;
    const message = error.message || "something went wrong!";
    error = new ApiError(statusCode, message, [], error.stack);
  }

  const response = {
    ...error,
    message: error.message,

    // add stack info only for devlopement environment
    ...(nodeEnv === "development" ? { stack: error.stack } : {}),
  };

  return res.status((error as ApiError).statusCode).json(response);
};
