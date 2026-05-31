// Modules
const rateLimit = require("express-rate-limit");

// -----------------------------IMPORTS---------------------------------------

// Rate limiter for server (all routes) (200 requests / 15 min)
const globalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 200,
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
	ipv6Subnet: 56, 
});

module.exports = globalLimiter;