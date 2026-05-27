const { z } = require("zod");

const registerSchema = z.object({
    fullname: z
        .string()
        .trim()
        .min(5, { message: "Fullname must contain at least 5 characters!" })
        .max(50, { message: "Fullname is too long!" }),

    email: z
        .string()
        .trim()
        .email({ message: "Invalid email address!" }),

    password: z
        .string()
        .trim()
        .min(8, { message: "Password must contain at least 8 characters!" })
        .max(50, { message: "Password is too long!" })

}).strict({ message: "Unknown fields are not allowed!" });

const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email({ message: "Invalid email address!" }),

    password: z
        .string()
        .trim()
        .min(1, { message: "Password must contain at least 1 character!" })
        .max(50, { message: "Password is too long!" })

}).strict({ message: "Unknown fields are not allowed!" });

module.exports = { registerSchema, loginSchema };