// Axios
import { api } from "../api/Axios";

// ---------------------------------------IMPORTS---------------------------------------

// Service to fetch all messages of a chat (chatId sent as query param)
export const fetchMessages = async (chatId) => {
    return await api.get(`/message/${chatId}`);
};

// Service to send a message in a chat
export const fetchSendMessage = async ({ chatId, content }) => {
    return await api.post(`/message/${chatId}`, { content });
};

// Service to edit a message by id
export const fetchEditMessage = async (messageId, content) => {
    return await api.patch(`/message/${messageId}`, { content });
};

// Service to delete a message by id
export const fetchDeleteMessage = async (messageId) => {
    return await api.delete(`/message/${messageId}`);
};
