// Modules
const rateLimit = require("express-rate-limit");

// -----------------------------IMPORTS---------------------------------------

// Rate limiter for create category route (20 requests / 15 min)
const createCategoryLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    ipv6Subnet: 56, 
});

// Rate limiter for edit category route (50 requests / 15 min)
const editCategoryLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    ipv6Subnet: 56, 
});

// Rate limiter for delete category route (10 requests / 15 min)
const deleteCategoryLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    ipv6Subnet: 56, 
});

module.exports = { createCategoryLimiter, editCategoryLimiter, deleteCategoryLimiter };