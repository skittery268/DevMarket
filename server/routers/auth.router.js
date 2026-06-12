// Modules
const express = require("express");
const passport = require("passport");

// Controllers
const { register, login, verificationEmail, getMe, logout, googleCallback } = require("../controllers/auth.controller");

// Middlewares
const protect = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

// Validations
const { registerSchema, loginSchema } = require("../validations/auth.validation");

// Rate limiters
const { registerLimiter, loginLimiter, verifyLimiter } = require("../middlewares/ratelimiters/auth.limiter");

// ---------------------------------------IMPORTS---------------------------------------

const authRouter = express.Router();

// Route to register new user
authRouter.post("/register", registerLimiter, validate(registerSchema), register);
// Route to login user
authRouter.post("/login", loginLimiter, validate(loginSchema), login);
// Route to verification user account with email
authRouter.get("/verification", verifyLimiter, verificationEmail);
// Route to auto login
authRouter.get("/me", protect, getMe);
// Route to logout user
authRouter.post("/logout", protect, logout);

// OAuth with Google
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
authRouter.get("/google/callback", passport.authenticate("google", { session: false }), googleCallback);

module.exports = authRouter;