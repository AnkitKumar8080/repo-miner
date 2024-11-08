import { body } from "express-validator";

export const addRepositoryMiddleware = () => {
  return [
    body("url").trim().notEmpty().withMessage("provide a valid git repo url!"),
    body("mineId").trim().notEmpty().withMessage("provide a valid mineId!"),
  ];
};
