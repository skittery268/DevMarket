// React
import { useContext } from "react";

// Context
import { AuthContext } from "../context/AuthContext";

// ---------------------------------------IMPORTS---------------------------------------

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

