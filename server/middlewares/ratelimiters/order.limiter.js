// Modules
const rateLimit = require("express-rate-limit");

// ---------------------------------------IMPORTS---------------------------------------

// Rate limiter for edit order route (15 requests / 10 min)
const editOrderLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 15,
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    ipv6Subnet: 56, 
    message: {
        status: "fail",
        message: "Too many edit requests. Please try again later.",
    }
});

// Rate limiter for delete product route (10 requests / 10 min)
const deleteOrderLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    ipv6Subnet: 56, 
    message: {
        status: "fail",
        message: "Too many delete requests. Please try again later.",
    }
});

module.exports = { editOrderLimiter, deleteOrderLimiter };