import { body } from "express-validator";

export const registerValidator = (): any => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("invalid email address"),

    body("username")
      .trim()
      .notEmpty()
      .withMessage("username is required")
      .isLength({ min: 3, max: 50 })
      .withMessage("username length must min of 3 and max of 50 characters"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("password field must not be empty")
      .isLength({ min: 8 })
      .withMessage("password length must be 8 or greater"),
  ];
};

export const loginValidator = (): any => {
  return [
    body("email").trim().notEmpty().withMessage("email is required"),
    body("password").notEmpty().withMessage("password is required"),
  ];
};
