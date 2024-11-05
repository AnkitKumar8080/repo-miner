import { body } from "express-validator";

export const mineValidator = (): any => {
  return [body("mineName").trim().notEmpty().withMessage("provide a mineName")];
};
