// React
import { useContext } from "react";

// Context
import { ThemeContext } from "../context/ThemeContext";

// ---------------------------------------IMPORTS---------------------------------------

// Hook to use theme context
export const useTheme = () => useContext(ThemeContext);
