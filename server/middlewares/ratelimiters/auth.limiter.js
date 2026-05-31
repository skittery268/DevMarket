// Modules
const rateLimit = require("express-rate-limit");

// -----------------------------IMPORTS---------------------------------------

// Rate limiter for register route (5 requests / 60 min)
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
	limit: 5,
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
	ipv6Subnet: 56, 
});

// Rate limiter for login route (5 requests / 15 min)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
	limit: 5,
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
	ipv6Subnet: 56, 
});

// Rate limiter for verify route (3 requests / 10 min)
const verifyLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
	limit: 3,
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
	ipv6Subnet: 56, 
});

module.exports = { registerLimiter, loginLimiter, verifyLimiter }