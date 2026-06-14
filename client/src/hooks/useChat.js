// React
import { useContext } from "react";

// Context
import { ChatContext } from "../context/ChatContext";

// ---------------------------------------IMPORTS---------------------------------------

// Hook to use chat context
export const useChat = () => useContext(ChatContext);
