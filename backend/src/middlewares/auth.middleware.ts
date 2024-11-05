import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { decodeToken } from "../utils/JWT";
import { AuthModel } from "../models/auth.model";
import { JwtPayload } from "jsonwebtoken";
import { ProtectedRequest } from "../types/app-request";

export const verifyJwt = asyncHandler(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // return 401 error if no token provided
    if (!token) {
      return res.status(401).json(new ApiResponse(401, "No token provided!"));
    }

    try {
      // decode the token
      const decoded = (await decodeToken(token)) as JwtPayload;
      const userData = await AuthModel.getUserById(decoded.sub ?? "");

      if (!userData) {
        return res.status(401).json(new ApiError(401, "authentication failed"));
      }

      req.user = userData;

      next();
    } catch (error) {
      return res.status(400).json(new ApiResponse(400, "invalid token"));
    }
  }
);
