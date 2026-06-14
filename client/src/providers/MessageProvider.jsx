// React tools
import { useState } from "react";

// Message context
import { MessageContext } from "../context/MessageContext";

// Services
import {
    fetchMessages,
    fetchSendMessage,
    fetchEditMessage,
    fetchDeleteMessage
} from "../services/MessageService";

// ---------------------------------------IMPORTS---------------------------------------

// Function to provide message functions for any components
export const MessageProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);

    // Function to load all messages of a chat
    const loadMessages = async (chatId) => {
        try {
            const res = await fetchMessages(chatId);

            setMessages(res.data.data.messages);

            return res.data.data.messages;
        } catch (err) {
            console.log(err);
        };
    };

    // Function to send a message in a chat
    const sendMessage = async ({ chatId, content }) => {
        try {
            const res = await fetchSendMessage({ chatId, content });

            setMessages(prev => [...prev, res.data.data.message]);

            return res.data.data.message;
        } catch (err) {
            console.log(err);
        };
    };

    // Function to edit a message by id
    const editMessage = async (messageId, content) => {
        try {
            const res = await fetchEditMessage(messageId, content);

            setMessages(prev => prev.map(m => (m._id === messageId ? res.data.data.message : m)));

            return res.data.data.message;
        } catch (err) {
            console.log(err);
        };
    };

    // Function to delete a message by id
    const deleteMessage = async (messageId) => {
        try {
            await fetchDeleteMessage(messageId);

            setMessages(prev => prev.filter(m => m._id !== messageId));
        } catch (err) {
            console.log(err);
        };
    };

    return (
        <MessageContext.Provider value={{ messages, loadMessages, sendMessage, editMessage, deleteMessage }}>
            {children}
        </MessageContext.Provider>
    );
};
