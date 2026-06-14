// Utils
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// Models
const User = require("../models/user.model");

// Configs
const cloudinary = require("../configs/cloudinary.config");

// ---------------------------------------IMPORTS---------------------------------------

// Controller to get users by page and limit
const getUsers = catchAsync(async (req, res, next) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;

    const filter = { isDeleted: { $ne: true } };

    const users = await User.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    const userCount = await User.countDocuments(filter);

    res.status(200).json({
        status: "success",
        message: "Users returned successfully!",
        userCount,
        data: {
            users
        }
    });
});

// Controller to delete user
const deleteUser = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
        return next(new AppError("User not found!", 404));
    }

    if (user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return next(new AppError("Access denied!", 401));
    }

    user.isDeleted = true;
    user.deletedAt = new Date();

    await user.save();

    res.status(200).json({
        status: "success",
        message: "User deleted successfully!"
    });
});

// Controller to edit user
const editUser = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const { fullname, email, currentPassword, newPassword } = req.body;
    const { file } = req;

    const user = await User.findById(userId);

    if (!user) {
        return next(new AppError("User not found!", 404));
    }

    if (user._id.toString() !== req.user._id.toString()) {
        return next(new AppError("You can't edit information of this user!", 401));
    }

    if (file && user.avatar.url) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
    };

    if (file) {
        const result = await uploadToCloudinary(file.buffer, "userAvatars");

        const avatar = {
            url: result.secure_url,
            public_id: result.public_id
        };

        user.avatar = avatar;
    };

    if (fullname) user.fullname = fullname;
    if (email && user.isVerified) {
        user.isVerified = false;
        user.email = email;

        await user.sendVerificationLink();
    };
    if (newPassword) {
        const isValid = await user.comparePassword(currentPassword);

        if (!isValid) {
            return next(new AppError("Current password is incorrect!", 400));
        }

        user.password = newPassword;
    };

    await user.save();

    user.password = undefined;

    res.status(200).json({
        status: "success",
        message: "User information edited successfully!",
        data: {
            user
        }
    });
});

// Controller to change user role
const changeRole = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        return next(new AppError("User not found!", 404));
    }

    if (user.role === "admin") {
        return next(new AppError("Access denied!", 401));
    }

    if (!["user", "seller", "admin"].includes(role)) {
        return next(new AppError("Wrong Data!", 400));
    }

    user.role = role;

    await user.save();

    res.status(200).json({
        status: "success",
        message: "User role changed successfully!",
        data: {
            user
        }
    });
});

module.exports = { getUsers, deleteUser, editUser, changeRole };