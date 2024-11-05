import { jwtconfig } from "../config";
import { sign, verify, decode } from "jsonwebtoken";
class JwtPayload {
  sub: string;
  iat?: number;
  exp: number;

  constructor(userId: string, validity: number) {
    this.sub = userId;
    this.iat = Math.floor(Date.now() / 1000);
    this.exp = this.iat + validity;
  }
}

// generate a token
const generateToken = async (payload: JwtPayload) => {
  if (!jwtconfig?.secretKey) {
    throw new Error("provide a jwt access key");
  }

  return new Promise<string>((resolve, reject) => {
    sign({ ...payload }, jwtconfig.secretKey, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token as string);
    });
  });
};

// verify JWT token
export const validateToken = async (token: string) => {
  if (!token) {
    throw new Error("Token not provided!");
  }

  // validate the token
  return new Promise((resolve, reject) => {
    verify(token, jwtconfig.secretKey, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
};

// decode the token
export const decodeToken = async (token: string) => {
  // throw error if token not provided
  if (!token) throw new Error("token not provided");

  // validate token
  return new Promise((resolve, reject) => {
    verify(token, jwtconfig.secretKey, (err, decodedToken) => {
      // reject if error
      if (err) {
        reject(err);
      }
      // return the decoded token
      resolve(decodedToken);
    });
  });
};

// generate access and refresh tokens
export const generateTokens = async (userId: string) => {
  // generate an access token
  const accessToken = await generateToken(
    new JwtPayload(userId, jwtconfig.accessTokenValidity)
  );

  // generate an refresh token
  const refreshToken = await generateToken(
    new JwtPayload(userId, jwtconfig.refreshTokenValidity)
  );

  // throw error if token not generated
  if (!accessToken || !refreshToken) {
    throw new Error("Error while generating tokens");
  }

  // return the tokens
  return { accessToken, refreshToken };
};
