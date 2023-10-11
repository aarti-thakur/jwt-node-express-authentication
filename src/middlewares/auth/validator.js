// validation.js

const { check, validationResult } = require("express-validator");

// Define a function to validate user registration data
const validateUserRegistration = [
  check("name").notEmpty(),
  check("email").notEmpty().isEmail(),
  check("password").notEmpty().isLength({ min: 8 }),
];

const validateUserLogin = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 5 })
    .withMessage("Password should contains 8 charaters"),
];

// Export the validation function and validationResult for use in other parts of your application
module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validationResult,
};
