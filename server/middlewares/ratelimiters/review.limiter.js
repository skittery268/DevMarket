// Modules
const rateLimit = require("express-rate-limit");

// ---------------------------------------IMPORTS---------------------------------------

// Rate limiter for create review route (5 requests / 10 min)
const createReviewLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    ipv6Subnet: 56, 
    message: {
        status: "fail",
        message: "Too many create requests. Please try again later.",
    }
});

// Rate limiter for edit review route (10 requests / 10 min)
const editReviewLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    ipv6Subnet: 56, 
    message: {
        status: "fail",
        message: "Too many edit requests. Please try again later.",
    }
});

// Rate limiter for delete review route (10 requests / 10 min)
const deleteReviewLimiter = rateLimit({
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

module.exports = { createReviewLimiter, editReviewLimiter, deleteReviewLimiter };