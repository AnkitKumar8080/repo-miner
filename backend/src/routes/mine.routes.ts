import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import { mineValidator } from "../validators/mine.validator";
import { validate } from "../validators/validate";
import {
  createMine,
  deleteMine,
  getAllMines,
  handleQueryRequest,
} from "../controllers/mine.controller";

export const mineRouter = Router();

// middleware to verify jwt
mineRouter.use(verifyJwt);

mineRouter
  .route("/")
  .post(mineValidator(), validate, createMine)
  .get(getAllMines)
  .delete(deleteMine);

mineRouter.route("/query").post(handleQueryRequest);
