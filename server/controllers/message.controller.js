// Models
const Message = require("../models/message.model");
const Chat = require("../models/chat.model");

// Utils
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// ---------------------------------------IMPORTS---------------------------------------

// Controller to get all messages of a chat
const getMessages = catchAsync(async (req, res, next) => {
    const { chatId } = req.params;

    const messages = await Message.find({ chat: chatId })
        .populate("sender")
        .sort({ createdAt: 1 })
        .lean();

    res.status(200).json({
        status: "success",
        message: "Messages returned successfully!",
        data: {
            messages
        }
    });
});

// Controller to send message in a chat
const sendMessage = catchAsync(async (req, res, next) => {
    const { chatId } = req.params;
    const { content } = req.body;

    const message = await Message.create({
        chat: chatId,
        sender: req.user._id,
        content
    });

    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    await message.populate("sender");

    req.io.to(chatId).emit("newMessage", message);

    res.status(201).json({
        status: "success",
        message: "Message sent successfully!",
        data: {
            message
        }
    });
});

// Controller to delete message
const deleteMessage = catchAsync(async (req, res, next) => {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
        return next(new AppError("Message not found!", 404));
    }

    if (message.sender.toString() !== req.user._id.toString()) {
        return next(new AppError("You can't delete this message!", 401));
    }

    await Message.findByIdAndDelete(messageId);

    req.io.to(message.chat.toString()).emit("deleteMessage", messageId);

    res.status(200).json({
        status: "success",
        message: "Message deleted successfully!"
    });
});

// Controller to edit message by id
const editMessage = catchAsync(async (req, res, next) => {
    const { messageId } = req.params;
    const { content } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
        return next(new AppError("Message not found!", 404));
    }

    if (message.sender.toString() !== req.user._id.toString()) {
        return next(new AppError("You can't edit this message!", 401));
    }

    if (content) {
        message.content = content;
    }

    await message.save();
    await message.populate("sender");

    req.io.to(message.chat.toString()).emit("editMessage", message);

    res.status(200).json({
        status: "success",
        message: "Message updated successfully!",
        data: {
            message
        }
    });
});

module.exports = { getMessages, sendMessage, deleteMessage, editMessage };