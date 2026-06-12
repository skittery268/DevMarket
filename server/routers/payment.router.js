// Modules
const express = require('express');

// Controllers
const { createCheckoutSession, stripeWebhook } = require('../controllers/payment.controller');

// Middlewares
const protect = require('../middlewares/auth.middleware');

// Rate limiter
const paymentLimiter = require('../middlewares/ratelimiters/payment.limiter');

// ---------------------------------------IMPORTS---------------------------------------

const paymentRouter = express.Router();

// Create session — paymentLimiter prevents carding attacks and Stripe quota abuse.
// The /webhook route is intentionally excluded; it comes from Stripe, not users.
paymentRouter.post('/checkout', protect, paymentLimiter, createCheckoutSession);

// Route to handle webhook
paymentRouter.post('/webhook', stripeWebhook);

module.exports = paymentRouter;