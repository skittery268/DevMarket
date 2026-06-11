// Modules
const { z } = require("zod");
const mongoose = require("mongoose");

// ---------------------------------------IMPORTS---------------------------------------

const objectId = z
    .string()
    .trim()
    .refine((id) => mongoose.Types.ObjectId.isValid(id), { message: "Invalid ID!" });

// Schema for validate create chat requests body
const createChatSchema = z.object({
    productId: objectId,
    sellerId: objectId

}).strict({ message: "Unknown fields are not allowed!" });

module.exports = { createChatSchema };