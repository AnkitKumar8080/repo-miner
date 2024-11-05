import { Router } from "express";
import {
  loginValidator,
  registerValidator,
} from "../validators/auth.validator";
import { validate } from "../validators/validate";
import { login, register } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/register", registerValidator(), validate, register);
authRouter.post("/login", loginValidator(), validate, login);

export { authRouter };
