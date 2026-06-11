// Modules
const express = require("express");

// Controllers
const { searchUsers, searchProducts, searchCategories } = require("../controllers/search.controller");

// ---------------------------------------IMPORTS---------------------------------------

const searchRouter = express.Router();

// Route to get users by fullname
searchRouter.get("/users", searchUsers);
// Route to get products by title or description
searchRouter.get("/products", searchProducts);
// Route to get categories by name or description
searchRouter.get("/categories", searchCategories);

module.exports = searchRouter;