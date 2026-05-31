// Utils
const AppError = require("../utils/appError")

// -----------------------------IMPORTS---------------------------------------

// Middleware function to check user access
const allowedTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError("Access denied!", 401));
        }

        next();
    };
};

module.exports = allowedTo;
