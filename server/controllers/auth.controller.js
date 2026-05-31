// Models
const User = require("../models/user.model");

// Utils
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Modules
const jwt = require("jsonwebtoken");

// -----------------------------IMPORTS---------------------------------------

// Function to create and send token to auto login user
const createAndSendToken = catchAsync(async (res, user, next) => {
    const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

    res.cookie("authToken", token, {
        maxAge: process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_MODE === "dev" ? false : true,
        sameSite: process.env.NODE_MODE === "dev" ? "Lax" : "Strict"
    });

    user.password = undefined;

    res.status(200).json({
        status: "success",
        message: "Login successfully!",
        data: {
            user
        }
    });
});

// Controller to register new user
const register = catchAsync(async (req, res, next) => {
    const { fullname, email, password } = req.body;

    const user = await User.create({ fullname, email, password });

    await user.sendVerificationLink();

    res.status(201).json({
        status: "success",
        message: "User registered successfully!"
    });
});

// Controller to login user
const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return next(new AppError("Credentials incorrect!", 400));
    }

    const isValid = await user.comparePassword(password);

    if (!isValid) {
        return next(new AppError("Credentials incorrect!", 400));
    }

    if (!user.isVerified) {
        return next(new AppError("Please complete verification first.", 400));
    }

    createAndSendToken(res, user);
});

// Controller to verification user account with email
const verificationEmail = catchAsync(async (req, res, next) => {
    const { token } = req.query;

    if (!token) {
        return next(new AppError("Token is required!", 400));
    }

    const payload = await jwt.verify(token, process.env.JWT_SECRET);

    if (!payload) {
        return next(new AppError("Invalid token!", 400));
    }

    const user = await User.findById(payload.userId);

    if (!user) {
        return next(new AppError("User not found!", 404));
    }

    if (user.isVerified) {
        return next(new AppError("Your account already varified!", 400));
    }

    user.isVerified = true;

    await user.save();

    res.status(200).send("<h1>Verification successfully, you can come back!</h1>");
});

// Controller to auto login
const getMe = catchAsync(async (req, res, next) => {
    const { user } = req;

    res.status(200).json({
        status: "success",
        message: "Auto login successfully!",
        message: {
            user
        }
    });
});

module.exports = { register, login, verificationEmail, getMe };