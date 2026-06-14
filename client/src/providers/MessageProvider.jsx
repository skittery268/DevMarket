// React tools
import { useState, useCallback } from "react";

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

            throw err;
        };
    };

    // Function to send a message in a chat
    const sendMessage = async ({ chatId, content }) => {
        try {
            const res = await fetchSendMessage({ chatId, content });

            setMessages(prev => {
                // Avoid duplicates: the socket may also deliver this message back.
                if (prev.some(m => m._id === res.data.data.message._id)) return prev;

                return [...prev, res.data.data.message];
            });

            return res.data.data.message;
        } catch (err) {
            console.log(err);

            throw err;
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

            throw err;
        };
    };

    // Function to delete a message by id
    const deleteMessage = async (messageId) => {
        try {
            await fetchDeleteMessage(messageId);

            setMessages(prev => prev.filter(m => m._id !== messageId));
        } catch (err) {
            console.log(err);

            throw err;
        };
    };

    // ----------------------- Real-time (Socket.io) helpers -----------------------
    // These are additive: they let ChatRoom push socket events into the same
    // messages state, de-duplicating by _id so REST + socket never double up.

    const addIncomingMessage = useCallback((message) => {
        if (!message?._id) return;

        setMessages(prev => {
            if (prev.some(m => m._id === message._id)) return prev;

            return [...prev, message];
        });
    }, []);

    const replaceMessage = useCallback((message) => {
        if (!message?._id) return;

        setMessages(prev => prev.map(m => (m._id === message._id ? message : m)));
    }, []);

    const removeMessage = useCallback((messageId) => {
        setMessages(prev => prev.filter(m => m._id !== messageId));
    }, []);

    const clearMessages = useCallback(() => setMessages([]), []);

    return (
        <MessageContext.Provider
            value={{
                messages,
                loadMessages,
                sendMessage,
                editMessage,
                deleteMessage,
                addIncomingMessage,
                replaceMessage,
                removeMessage,
                clearMessages
            }}
        >
            {children}
        </MessageContext.Provider>
    );
};
