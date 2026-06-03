// Models
const cloudinary = require("../configs/cloudinary.config");
const Category = require("../models/category.model");
const Product = require("../models/product.model");

// Utils
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// ---------------------------------------IMPORTS---------------------------------------

// Controller to get all products
const getProducts = catchAsync(async (req, res, next) => {
    const { page, limit } = req.query;

    const products = await Product.find().skip((page - 1) * limit).limit(limit);

    const productCount = await Product.countDocuments();

    res.status(200).json({
        status: "success",
        message: "Products returned successfully!",
        productCount,
        data: {
            products
        }
    })
});

// Controller to create new product
const createProduct = catchAsync(async (req, res, next) => {
    const { categoryId } = req.params;
    const { title, description, price, stock } = req.body;

    const category = await Category.findById(categoryId);

    if (!category) {
        return next(new AppError("Category not found!", 404));
    }
    
    const allowedAttributes = category.allowedAttributes;
    const attributes = Object.keys(req.body.attributes || {});

    const invalidAttributes = attributes.filter(prop => !allowedAttributes.includes(prop));

    if (invalidAttributes.length > 0) {
        return next(new AppError("You passed the wrong properties!", 400));
    }

    if (!category.isActive) {
        return next(new AppError("You cant create new product because this category is disabled!", 400));
    }

    const images = [];

    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const result = await uploadToCloudinary(file.buffer, "productImages");

            images.push({
                url: result.secure_url,
                public_id: result.public_id
            });
        };
    };

    const product = await Product.create({
        universal: {
            title,
            description,
            price,
            stock,
            category: categoryId,
            sellerId: req.user._id,
            images
        },
        attributes: req.body.attributes
    });

    res.status(201).json({
        status: "success",
        message: "Product created successfully!",
        data: {
            product
        }
    })
});

// Controller to delete product
const deleteProduct = catchAsync(async (req, res, next) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
        return next(new AppError("Product not found!", 404));
    }

    if (product.universal.sellerId.toString() != req.user._id.toString() && req.user.role !== "admin") {
        return next(new AppError("You cant delete this product!", 401));
    }

    for (const image of product.universal.images) {
        await cloudinary.uploader.destroy(image.public_id);
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({
        status: "success",
        message: "Product deleted successfully!"
    })
});

// Controller to edit product
const editProduct = catchAsync(async (req, res, next) => {
    const { productId } = req.params;
    const { title, description, price, stock, attributes } = req.body;
    const { files } = req;

    const product = await Product.findById(productId);

    if (!product) {
        return next(new AppError("Product not found!", 404));
    }

    if (product.universal.sellerId.toString() != req.user._id.toString()) {
        return next(new AppError("You cant edit this product!", 401));
    }

    if (title) product.universal.title = title;
    if (description) product.universal.description = description;
    if (price) product.universal.price = price;
    if (stock) product.universal.stock = stock;
    if (attributes) product.attributes = attributes;
    if (files && files.length > 0) {
        for (const image of product.universal.images) {
            await cloudinary.uploader.destroy(image.public_id);
        }

        const images = [];

        for (const file of files) {
            const result = await uploadToCloudinary(file.buffer, "productImages");

            images.push({
                url: result.secure_url,
                public_id: result.public_id
            });
        }

        product.universal.images = images;
    }

    await product.save();

    res.status(200).json({
        status: "success",
        message: "Product edited successfully!",
        data: {
            product
        }
    })
});

module.exports = { getProducts, createProduct, deleteProduct, editProduct };
