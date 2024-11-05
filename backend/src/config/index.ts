import dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT;
export const corsUrl = process.env.CORS_URL?.split(",") || [];
export const nodeEnv = process.env.NODE_ENV || "developement";

export const jwtconfig = {
  secretKey: process.env.JWT_SECRET_KEY || "",
  accessTokenValidity: parseInt(process.env.JWT_ACCESS_TOKEN_VALIDITY ?? "0"),
  refreshTokenValidity: parseInt(process.env.JWT_REFRESH_TOKEN_VALIDITY ?? "0"),
};
