// React tools
import { useState, useCallback, useMemo } from "react";

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

    // Function to load all chats of the current user.
    // Intentionally NOT cached: chat previews (last message, updatedAt) change in
    // real time, so the list must always reflect the latest server state.
    const loadChats = useCallback(async () => {
        try {
            const res = await fetchChats();

            setChats(res.data.data.chats);

            return res.data.data.chats;
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Function to create a new chat for a product with its seller
    const createChat = useCallback(async ({ productId, sellerId }) => {
        try {
            const res = await fetchCreateChat({ productId, sellerId });

            setChats(prev => [...prev, res.data.data.chat]);

            return res.data.data.chat;
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Function to delete a chat (and all its messages) by id
    const deleteChat = useCallback(async (chatId) => {
        try {
            await fetchDeleteChat(chatId);

            setChats(prev => prev.filter(c => c._id !== chatId));
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Memoize the context value so consumers only re-render when chats change.
    const value = useMemo(
        () => ({ chats, loadChats, createChat, deleteChat }),
        [chats, loadChats, createChat, deleteChat]
    );

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};
