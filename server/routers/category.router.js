// Modules
const express = require("express");

// Controllers
const { getCategories, createCategory, editCategory, deleteCategory } = require("../controllers/category.controller");

// Middlewares
const { protect } = require("../middlewares/auth.middleware");
const allowedTo = require("../middlewares/allowedTo.middleware");
const validate = require("../middlewares/validate.middleware");
const upload = require("../middlewares/upload.middleware");
const parseFields = require("../middlewares/parseFields.middleware");

// Validations
const { createCategorySchema, editCategorySchema } = require("../validations/category.validation");

// Rate limiters
const { createCategoryLimiter, editCategoryLimiter, deleteCategoryLimiter } = require("../middlewares/ratelimiters/category.limiter");

// ---------------------------------------IMPORTS---------------------------------------

const categoryRouter = express.Router();

// Route to get categories by query (page, limit)
categoryRouter.get("/", getCategories);

categoryRouter.use(protect, allowedTo("admin"));

// Route to create new category
categoryRouter.post(
    "/createcategory", 
    createCategoryLimiter, 
    upload.single("image"),
    parseFields,
    validate(createCategorySchema),
    createCategory
);
// Route to edit category information by id
categoryRouter.patch(
    "/editcategory/:id",
    editCategoryLimiter,
    upload.single("image"),
    parseFields,
    validate(editCategorySchema),
    editCategory
);
// Route to delete category by id
categoryRouter.delete(
    "/deletecategory/:id",
    deleteCategoryLimiter,
    deleteCategory
);

module.exports = categoryRouter;