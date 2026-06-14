// React tools
import { useState } from "react";

// Chat context
import { ChatContext } from "../context/ChatContext";

// Services
import {
    fetchChats,
    fetchCreateChat,
    fetchDeleteChat
} from "../services/ChatService";

// ---------------------------------------IMPORTS---------------------------------------

// Function to provide chat functions for any components
export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState([]);

    // Function to load all chats of the current user
    const loadChats = async () => {
        try {
            const res = await fetchChats();

            setChats(res.data.data.chats);

            return res.data.data.chats;
        } catch (err) {
            console.log(err);

            throw err;
        };
    };

    // Function to create a new chat for a product with its seller
    const createChat = async ({ productId, sellerId }) => {
        try {
            const res = await fetchCreateChat({ productId, sellerId });

            setChats(prev => [...prev, res.data.data.chat]);

            return res.data.data.chat;
        } catch (err) {
            console.log(err);

            throw err;
        };
    };

    // Function to delete a chat (and all its messages) by id
    const deleteChat = async (chatId) => {
        try {
            await fetchDeleteChat(chatId);

            setChats(prev => prev.filter(c => c._id !== chatId));
        } catch (err) {
            console.log(err);

            throw err;
        };
    };

    return (
        <ChatContext.Provider value={{ chats, loadChats, createChat, deleteChat }}>
            {children}
        </ChatContext.Provider>
    );
};
