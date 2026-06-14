// Modules
const express = require('express');

// Controllers
const { getProducts, getProduct, getProductsByCategory, createProduct, editProduct, deleteProduct } = require('../controllers/product.controller');

// Middlewares
const protect = require('../middlewares/auth.middleware');
const allowedTo = require('../middlewares/allowedTo.middleware');
const upload = require('../middlewares/upload.middleware');
const parseFields = require('../middlewares/parseFields.middleware');
const validate = require('../middlewares/validate.middleware');

// Validations
const { createProductSchema, editProductSchema } = require('../validations/product.validation');

// Rate limiters
const { createProductLimiter, editProductLimiter, deleteProductLimiter } = require('../middlewares/ratelimiters/product.limiter');

// ----------------------------------------IMPORTS---------------------------------------

const productRouter = express.Router();

// Route to get products by query (page, limit)
productRouter.get("/", getProducts);

// Route to get products of a specific category
productRouter.get("/category/:categoryId", getProductsByCategory);

// Route to get a single product by id
productRouter.get("/:productId", getProduct);

// Middlewares
productRouter.use(protect, allowedTo("seller", "admin"));

// Route to create new product
productRouter.post(
    "/createProduct/:categoryId",
    createProductLimiter,
    upload.array("images", 5),
    parseFields,
    validate(createProductSchema),
    createProduct
);
// Route to edit product information by id
productRouter.patch(
    "/editproduct/:productId",
    editProductLimiter,
    upload.array("images", 5),
    parseFields,
    validate(editProductSchema),
    editProduct
);
// Route to delete product by id
productRouter.delete(
    "/deleteproduct/:productId",
    deleteProductLimiter,
    deleteProduct
);

module.exports = productRouter;