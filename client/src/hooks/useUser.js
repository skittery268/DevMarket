// React
import { useContext } from "react";

// Context
import { UserContext } from "../context/UserContext";

// ---------------------------------------IMPORTS---------------------------------------

// Hook to use user context
export const useUser = () => useContext(UserContext);
