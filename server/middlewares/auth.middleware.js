// Models
const User = require("../models/user.model");

// Utils
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Modules
const jwt = require("jsonwebtoken");

// Middleware function to verification user pre request
const protect = catchAsync(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new AppError("Token not found!", 404));
    }

    const payload = await jwt.verify(token, process.env.JWT_SECRET);

    if (!payload) {
        return next(new AppError("Invalid Token!", 400));
    }

    const user = await User.findById(payload.userId);

    if (!user) {
        return next(new AppError("User not found!", 404));
    }

    req.user = user;

    next();
});

module.exports = { protect };