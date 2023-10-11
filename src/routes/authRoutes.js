const express = require("express");
const authRouter = express.Router();
const {
  validateUserRegistration,
  validateUserLogin,
  validationResult,
} = require("../middlewares/auth/validator.js");

const {
  handleUserRegister,
  handleUserLogin,
} = require("../controllers/AuthController");

authRouter.post("/register", validateUserRegistration, handleUserRegister);
authRouter.post("/login", validateUserLogin, handleUserLogin);

module.exports = authRouter;
