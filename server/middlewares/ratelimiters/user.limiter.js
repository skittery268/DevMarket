// Modules
const rateLimit = require("express-rate-limit");

// ---------------------------------------IMPORTS---------------------------------------

// Rate limiter for delete user route (3 requests / 1 min)
const deleteUserLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 3,
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    ipv6Subnet: 56,
    message: {
        status: "fail",
        message: "Too many delete requests. Please try again later.",
    }
});

// Rate limiter for edit user route (10 requests / 1 min)
const editUserLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    ipv6Subnet: 56, 
    message: {
        status: "fail",
        message: "Too many edit requests. Please try again later.",
    }
});

// Rate Limiter for change role route (5 requests / 1 min)
const changeRoleLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    ipv6Subnet: 56, 
    message: {
        status: "fail",
        message: "Too many change role requests. Please try again later.",
    }
});

module.exports = { deleteUserLimiter, editUserLimiter, changeRoleLimiter };