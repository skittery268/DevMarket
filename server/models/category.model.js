// Modules
const mongoose = require("mongoose");

// -----------------------------IMPORTS---------------------------------------

// Schema for category model
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        url: String,
        public_id: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    parentCategory: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    allowedAttributes: {
        type: [String]
    }
}, { timestamps: true });

// Indexing
categorySchema.index({ isActive: 1 });

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;