// Modules
const express = require("express");

// Controllers
const { register, login, verificationEmail, getMe } = require("../controllers/auth.controller");

// Middlewares
const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

// Validations
const { registerSchema, loginSchema } = require("../validations/auth.validation");

// Rate limiters
const { registerLimiter, loginLimiter, verifyLimiter } = require("../middlewares/ratelimiters/auth.limiter");

const authRouter = express.Router();

// Route to register new user
authRouter.post("/register", registerLimiter, validate(registerSchema), register);
// Route to login user
authRouter.post("/login", loginLimiter, validate(loginSchema), login);
// Route to verification user account with email
authRouter.get("/verification", verifyLimiter, verificationEmail);
// Route to auto login
authRouter.get("/me", protect, getMe);

module.exports = authRouter;