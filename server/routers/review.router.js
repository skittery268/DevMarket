// Models
const express = require("express");

// Controllers
const { getProductReviews, createReview, deleteReview, editReview } = require("../controllers/review.controller");

// Middlewares
const protect = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

// Rate limiters
const { createReviewLimiter, deleteReviewLimiter, editReviewLimiter } = require("../middlewares/ratelimiters/review.limiter");

// Validations
const { createReviewSchema, editReviewSchema } = require("../validations/review.validation");

// ----------------------------------------IMPORTS---------------------------------------

const reviewRouter = express.Router();

// Route to get reviews by productId and query (page, limit)
reviewRouter.get("/:productId", getProductReviews);

// Middlewares
reviewRouter.use(protect);

// Route to create new review 
reviewRouter.post(
    "/:productId",
    createReviewLimiter,
    validate(createReviewSchema),
    createReview
);
// Route to delete review by id
reviewRouter.delete(
    "/:reviewId",
    deleteReviewLimiter,
    deleteReview
);
// Route to edit review information by id
reviewRouter.patch(
    "/:reviewId",
    editReviewLimiter,
    validate(editReviewSchema),
    editReview
);

module.exports = reviewRouter;