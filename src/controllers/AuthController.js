const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs/dist/bcrypt");
const User = require("../models/User");
const { validationResult } = require("../middlewares/auth/validator.js");
require("dotenv").config();

async function handleUserRegister(req, res) {
  try {
    if (!req.body || !req.body.name || !req.body.email || !req.body.password) {
      return res.status(400).json({
        error: "Bad Request",
        message: "One or more fields in the request are invalid or missing.",
        details: "Please provide the required data.",
      });
    }

    const { name, email, password } = req.body;

    // Find if a user with the given email already exists in the system
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({
        error: "Bad Request",
        message: "A user with this email address already exists.",
        details:
          "Please choose a different email or login if you already have an account.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // If no existing user is found, you can proceed with user registration logic here.
    const userData = {
      name: name,
      email: email.toLowerCase(), //sanitize : convert email to lower case
      password: hashedPassword,
    };
    const newUser = await User.create(userData);

    // Payload: This is the data you want to include in the token
    const payload = {
      user_id: newUser._id, // Include user ID or any other user-related information
      email: newUser.email,
    };

    // Secret Key: This is a secret key that should be kept secure and not exposed
    const secretKey = process.env.JSON_WEB_TOKEN;

    // Options: You can set various options, such as the token's expiration time
    const options = {
      expiresIn: "2h", // Token expiration time (e.g., 2 hours)
    };

    //create the JWT
    const token = jwt.sign(payload, secretKey, options);
    newUser.token = token;

    return res.status(200).json({
      id: newUser._id,
      token: newUser.token,
      message: "User registration successful.",
    });
  } catch (error) {
    console.error("Error occurred during user registration:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleUserLogin(req, res) {
  try {
    // Get validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get user input
    const { email, password } = req.body;

    // Validate if user exist in our database
    const user = await User.findOne({ email: email.toLowerCase() })

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.JSON_WEB_TOKEN,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json({user, token});
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  handleUserRegister,
  handleUserLogin,
};
