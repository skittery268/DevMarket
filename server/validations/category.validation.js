// Modules
const { z } = require("zod");

// -----------------------------IMPORTS---------------------------------------

// Schema for validate create category requests body
const createCategorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(5, { message: "Category name must contain at least 5 characters!" })
        .max(50, { message: "Category name is too long!" }),

    description: z
        .string()
        .trim()
        .min(10, { message: "Category description must contain at least 10 characters!" })
        .max(500, { message: "Category description is too long!" }),

    allowedAttributes: z
        .array(z.string())
        .min(1, { message: "Allowed attributes must contain at least 1 element!" })
        .max(50, { message: "Allowed attributes is too long!" }),

    parentCategory: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, {
            message: "Invalid parent category ID!"
        })
        .optional()

}).strict({ message: "Unknown fields are not allowed!" });

// Schema for validate edit category requests body
const editCategorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(5, { message: "Category name must contain at least 5 characters!" })
        .max(50, { message: "Category name is too long!" })
        .optional(),

    description: z
        .string()
        .trim()
        .min(10, { message: "Category description must contain at least 10 characters!" })
        .max(500, { message: "Category description is too long!" })
        .optional(),

    allowedAttributes: z
        .array(z.string())
        .min(1, { message: "Allowed attributes must contain at least 1 element!" })
        .max(50, { message: "Allowed attributes is too long!" })
        .optional(),

    parentCategory: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, {
            message: "Invalid parent category ID!"
        })
        .optional()

}).strict({ message: "Unknown fields are not allowed!" });

module.exports = { createCategorySchema, editCategorySchema };