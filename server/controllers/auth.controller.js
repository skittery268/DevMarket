// Models
const User = require("../models/user.model");

// Utils
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Modules
const jwt = require("jsonwebtoken");

// ---------------------------------------IMPORTS---------------------------------------

// Function to create and send token to auto login user
const createAndSendToken = (res, user) => {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

    res.cookie("authToken", token, {
        maxAge: process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_MODE === "dev" ? false : true,
        sameSite: process.env.NODE_MODE === "dev" ? "Lax" : "None"
    });

    user.password = undefined;

    res.status(200).json({
        status: "success",
        message: "Login successfully!",
        data: {
            user
        }
    });
};

// Function to capitalize user name
const formatName = (name) => name[0].toUpperCase() + name.slice(1).toLowerCase();

// Controller to register new user
const register = catchAsync(async (req, res, next) => {
    const { fullname, email, password } = req.body;

    const formatedName = formatName(fullname);

    const user = await User.create({ fullname: formatedName, email, password });

    await user.sendVerificationLink();

    res.status(201).json({
        status: "success",
        message: "User registered successfully!"
    });
});

// Controller to login user
const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new AppError("Credentials incorrect!", 400));
    }

    const isValid = await user.comparePassword(password);

    if (!isValid) {
        return next(new AppError("Credentials incorrect!", 400));
    }

    if (user.isDeleted) {
        return next(new AppError("This account has been deleted!", 401));
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

    res.redirect(process.env.CLIENT_URL);
});

// Controller to auto login
const getMe = (req, res) => {
    const { user } = req;

    res.status(200).json({
        status: "success",
        message: "Auto login successfully!",
        data: {
            user
        }
    });
};

// Controller to logout user
const logout = (req, res) => {
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_MODE === "dev" ? false : true,
        sameSite: process.env.NODE_MODE === "dev" ? "Lax" : "Strict"
    });

    res.status(200).json({
        status: "success",
        message: "Logout successfully!"
    });
};

// Controller for Google OAuth callback
const googleCallback = (req, res) => {
    const { user } = req;

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

    res.cookie("authToken", token, {
        maxAge: process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_MODE === "dev" ? false : true,
        sameSite: process.env.NODE_MODE === "dev" ? "Lax" : "None"
    });

    user.password = undefined;

    res.redirect(process.env.CLIENT_URL);
};

module.exports = { register, login, verificationEmail, getMe, logout, googleCallback };