const rateLimit = require("express-rate-limit");

// ---------------------------------------IMPORTS---------------------------------------

// Rate limiter for create chat route (10 requests / 1 min)
const createChatLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    ipv6Subnet: 56, 
    message: {
        status: "fail",
        message: "Too many create requests. Please try again later.",
    }
});

// Rate limiter for delete chat route (20 requests / 1 hour)
const deleteChatLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    ipv6Subnet: 56, 
    message: {
        status: "fail",
        message: "Too many edit requests. Please try again later.",
    }
});

module.exports = { createChatLimiter, deleteChatLimiter };