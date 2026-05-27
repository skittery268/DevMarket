// Modules
const rateLimit = require("express-rate-limit");

// Rate limiter for server (all routes) (120 requests / 15 min)
const globalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 120,
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
	ipv6Subnet: 56, 
});

module.exports = globalLimiter;