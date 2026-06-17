// Modules
const express = require("express");

// Controllers
const { getUserOrders, deleteOrder, changeStatus } = require("../controllers/order.controller");

// Middlewares
const allowedTo = require("../middlewares/allowedTo.middleware");
const protect = require("../middlewares/auth.middleware");

// Rate limiters
const { deleteOrderLimiter, editOrderLimiter } = require("../middlewares/ratelimiters/order.limiter");

// ---------------------------------------IMPORTS---------------------------------------

const orderRouter = express.Router();

// Middlewares
orderRouter.use(protect);

// Route to get all user orders
orderRouter.get("/", getUserOrders);

// Route to delete order by id
orderRouter.delete("/:orderId", deleteOrderLimiter, deleteOrder);

// Route to edit order by id
orderRouter.patch("/:orderId", editOrderLimiter, allowedTo("admin"), changeStatus);

module.exports = orderRouter;