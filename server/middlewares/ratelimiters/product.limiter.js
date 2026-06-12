// Modules
const rateLimit = require("express-rate-limit");

// ---------------------------------------IMPORTS---------------------------------------

// Rate limiter for create product route (20 requests / 15 min)
const createProductLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    ipv6Subnet: 56, 
    message: {
        status: "fail",
        message: "Too many create requests. Please try again later.",
    }
});

// Rate limiter for edit product route (50 requests / 15 min)
const editProductLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    ipv6Subnet: 56, 
    message: {
        status: "fail",
        message: "Too many edit requests. Please try again later.",
    }
});

// Rate limiter for delete product route (10 requests / 15 min)
const deleteProductLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    ipv6Subnet: 56, 
    message: {
        status: "fail",
        message: "Too many delete requests. Please try again later.",
    }
});

module.exports = { createProductLimiter, editProductLimiter, deleteProductLimiter };