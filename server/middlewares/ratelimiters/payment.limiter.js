// Modules
const rateLimit = require("express-rate-limit");

// ---------------------------------------IMPORTS---------------------------------------

// Rate limiter for payment request route (20 requests / 15 min)
const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    ipv6Subnet: 56,
    message: {
        status: "fail",
        message: "Too many payment requests. Please try again later.",
    }
});

module.exports = paymentLimiter;