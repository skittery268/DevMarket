// Models
const mongoose = require('mongoose');

// ---------------------------------------IMPORTS---------------------------------------

// Schema for message model
const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: [true, "Chat ID is required!"]
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Sender ID is required!"]
    },
    content: {
        type: String,
        required: [true, "Message content is required!"]
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;