import { NextFunction, Request, Response } from "express";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler =
  (execFunc: AsyncFunction) =>
  (req: Request, res: Response, next: NextFunction) => {
    execFunc(req, res, next).catch(next);
  };
