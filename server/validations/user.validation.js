// Modules
const { z } = require("zod");

// ---------------------------------------IMPORTS---------------------------------------

// Schema for validate create user requests body
const editUserSchema = z.object({
    fullname: z
        .string()
        .trim()
        .min(5, { message: "Fullname must contain at least 5 characters!" })
        .max(50, { message: "Fullname is too long!" })
        .optional(),

    email: z
        .string()
        .trim()
        .email({ message: "Invalid email address!" })
        .optional(),

    currentPassword: z
        .string()
        .trim()
        .min(8, { message: "Password must contain at least 8 characters!" })
        .max(50, { message: "Password is too long!" })
        .optional(),

    newPassword: z
        .string()
        .trim()
        .min(8, { message: "Password must contain at least 8 characters!" })
        .max(50, { message: "Password is too long!" })
        .optional()

}).strict({ message: "Unknown fields are not allowed!" });

// Schema for validate change role requests body
const changeRoleSchema = z.object({
    role: z
        .string()
        .trim()

}).strict({ message: "Unknown fields are not allowed!" });

module.exports = { editUserSchema, changeRoleSchema };