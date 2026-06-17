// Modules
const { z } = require("zod");

// ---------------------------------------IMPORTS---------------------------------------

// Schema for validate create review requests body
const createReviewSchema = z.object({
    content: z
        .string()
        .trim()
        .min(5, { message: "Review content must contain at least 5 characters!" })
        .max(100, { message: "Review content is too long!" }),
    rating: z
        .number()
        .min(1, { message: "Rating must be at least 1" })
        .max(5, { message: "Rating is too long!" })

}).strict({ message: "Unknown fields are not allowed!" });

// Schema for validate edit review requests body
const editReviewSchema = z.object({
    content: z
        .string()
        .trim()
        .min(5, { message: "Review content must contain at least 5 characters!" })
        .max(100, { message: "Review content is too long!" })
        .optional(),
    rating: z
        .number()
        .min(1, { message: "Rating must be at least 1" })
        .max(5, { message: "Rating is too long!" })
        .optional()

}).strict({ message: "Unknown fields are not allowed!" });

module.exports = { createReviewSchema, editReviewSchema };
