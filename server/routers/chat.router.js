// Modules
const express = require('express');

// Controllers
const { getChats, createChat, deleteChat } = require('../controllers/chat.controller');

// Middlewares
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createChatLimiter, deleteChatLimiter } = require('../middlewares/ratelimiters/chat.limiter');

// Validations
const { createChatSchema } = require('../validations/chat.validation');

// ---------------------------------------IMPORTS---------------------------------------

const chatRouter = express.Router();

// Route to get all chats of the user
chatRouter.get("/", getChats);

// Middlewares
chatRouter.use(protect);

// Route to create a new chat
chatRouter.post("/", createChatLimiter, validate(createChatSchema), createChat);
// Route to delete chat (and all its messages)
chatRouter.delete("/:chatId", deleteChatLimiter, deleteChat);

module.exports = chatRouter;