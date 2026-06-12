// Utils
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Models
const Chat = require("../models/chat.model");
const Message = require("../models/message.model");

// -------------------------------IMPORTS---------------------------------------

// Controller to get all chats of the user
const getChats = catchAsync(async (req, res, next) => {
    const chats = await Chat.find({ $or: [
        { seller: req.user._id },
        { buyer: req.user._id }
    ] })
        .populate(["product", "seller", "buyer"])
        .sort({ updatedAt: -1 })
        .lean();

    res.status(200).json({
        status: "success",
        message: "Chats returned successfully!",
        data: {
            chats
        }
    });
});

// Controller to create a new chat
const createChat = catchAsync(async (req, res, next) => {
    const { productId, sellerId } = req.body;

    let chat = await Chat.findOne({ product: productId, seller: sellerId, buyer: req.user._id });

    if (!chat) {
        chat = await Chat.create({
            product: productId,
            seller: sellerId,
            buyer: req.user._id
        });
    };

    await chat.populate(["product", "seller", "buyer"]);

    res.status(201).json({
        status: "success",
        message: "Chat created successfully!",
        data: {
            chat
        }
    });
});

// Controller to delete chat (and all its messages)
const deleteChat = catchAsync(async (req, res, next) => {
    const { chatId } = req.params;
    
    const chat = await Chat.findByIdAndDelete(chatId);

    if (!chat) {
        return next(new AppError("Chat not found!", 404));
    }

    await Message.deleteMany({ chat: chatId });

    res.status(200).json({
        status: "success",
        message: "Chat deleted successfully!"
    });
});

module.exports = { getChats, createChat, deleteChat };