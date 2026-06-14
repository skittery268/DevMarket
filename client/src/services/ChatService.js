// Axios
import { api } from "../api/Axios";

// ---------------------------------------IMPORTS---------------------------------------

// Service to fetch all chats of the current user
export const fetchChats = async () => {
    return await api.get("/chat");
};

// Service to create a new chat for a product with its seller
export const fetchCreateChat = async ({ productId, sellerId }) => {
    return await api.post("/chat", { productId, sellerId });
};

// Service to delete a chat (and all its messages) by id
export const fetchDeleteChat = async (chatId) => {
    return await api.delete(`/chat/${chatId}`);
};
