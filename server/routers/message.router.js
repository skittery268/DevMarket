// Modules
const express = require("express");

// Controllers
const { getMessages, sendMessage, deleteMessage, editMessage } = require("../controllers/message.controller");

// Middlewares
const { protect } = require("../middlewares/auth.middleware");

// ---------------------------------------IMPORTS---------------------------------------

const messageRouter = express.Router();

// Route to get all messages of a chat
messageRouter.get("/", getMessages);

// Middlewares
messageRouter.use(protect);

// Route to send message in a chat
messageRouter.post("/", sendMessage);
// Route to delete a message
messageRouter.delete("/:messageId", deleteMessage);
// Route to edit a message
messageRouter.patch("/:messageId", editMessage);

module.exports = messageRouter;