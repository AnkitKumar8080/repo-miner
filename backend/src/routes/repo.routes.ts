import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import { addRepositoryMiddleware } from "../validators/repo.validator";
import { validate } from "../validators/validate";
import {
  getAllMineRepositories,
  handleGitRepoUploads,
} from "../controllers/repo.controller";

export const repoRouter = Router();

// verify auth on reach request
repoRouter.use(verifyJwt);

repoRouter
  .route("/")
  .post(addRepositoryMiddleware(), validate, handleGitRepoUploads)
  .get(getAllMineRepositories);
