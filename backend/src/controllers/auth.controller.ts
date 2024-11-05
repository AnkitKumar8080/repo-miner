import { AuthModel } from "../models/auth.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import bcrypt from "bcrypt";
import { generateTokens } from "../utils/JWT";

export const register = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  // validate body
  if (!email || !username || !password) {
    return res
      .status(400)
      .json(new ApiResponse(400, "invalid email, username or password"));
  }

  // check for existing user
  const existingUser = await AuthModel.findUserByEmail(email);
  if (existingUser) {
    return res
      .status(400)
      .json(new ApiResponse(400, "email already registered!"));
  }

  // generate hashed password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create a new user
  const user = await AuthModel.createUser(username, email, hashedPassword);

  if (!user) {
    return res.status(500).json(new ApiResponse(500, "failed to create user"));
  }
  // filter the fields to be sent to the user as response
  const { password: pwd, status, createdAt, updatedAt, id, ...rest } = user;
  return res
    .status(201)
    .json(new ApiResponse(201, "user registered successfully! ", rest));
});

// login user
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return new ApiError(400, "no email or password provided");
  }

  // check if user exist with email
  const user = await AuthModel.findUserByEmail(email);

  if (!user) {
    return res.status(404).json(new ApiResponse(404, "invalid email!"));
  }

  // check for password
  const compareResult = await bcrypt.compare(password, user.password);

  if (!compareResult) {
    return res.status(401).json(new ApiResponse(401, "wrong password"));
  }

  // create a jwt session token
  const tokens = await generateTokens(user.id);

  // filter the field to be sent to the user as response
  const { password: pwd, status, createdAt, updatedAt, ...rest } = user;

  return res
    .status(200)
    .json(new ApiResponse(200, "login successfull!", { rest, ...tokens }));
});
