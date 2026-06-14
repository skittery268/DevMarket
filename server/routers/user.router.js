// Modules
const express = require("express");

// Controllers
const { getUsers, deleteUser, editUser, changeRole } = require("../controllers/user.controller");

// Middlewares
const protect = require("../middlewares/auth.middleware");
const allowedTo = require("../middlewares/allowedTo.middleware");
const upload = require("../middlewares/upload.middleware");
const parseFields = require("../middlewares/parseFields.middleware");
const validate = require("../middlewares/validate.middleware");

// Rate limiters
const { editUserLimiter, deleteUserLimiter, changeRoleLimiter } = require("../middlewares/ratelimiters/user.limiter");

// Validations
const { editUserSchema, changeRoleSchema } = require("../validations/user.validation");

// ---------------------------------------IMPORTS---------------------------------------

const userRouter = express.Router();

// Route to get users (page and limit)
userRouter.get("/", getUsers);

// Middlewares
userRouter.use(protect);

// Route to delete user by id
userRouter.delete(
    "/:userId",
    deleteUserLimiter,
    deleteUser
);
// Route to edit user info
userRouter.patch(
    "/edit-user/:userId",
    editUserLimiter,
    upload.single("image"),
    parseFields,
    validate(editUserSchema),
    editUser
);
// Route to change user role
userRouter.patch(
    "/change-role/:userId",
    changeRoleLimiter, 
    allowedTo("admin"),
    validate(changeRoleSchema),
    changeRole
);

module.exports = userRouter;