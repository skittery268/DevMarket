// React
import { useContext } from "react";

// Context
import { SocketContext } from "../context/SocketContext";

// ---------------------------------------IMPORTS---------------------------------------

// Hook to use the shared socket connection
export const useSocket = () => useContext(SocketContext);
