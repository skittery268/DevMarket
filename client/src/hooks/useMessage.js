// React
import { useContext } from "react";

// Context
import { MessageContext } from "../context/MessageContext";

// ---------------------------------------IMPORTS---------------------------------------

// Hook to use message context
export const useMessage = () => useContext(MessageContext);
