// React
import { useContext } from "react";

// Context
import { CategoryContext } from "../context/CategoryContext";

// ---------------------------------------IMPORTS---------------------------------------

// Hook to use category context
export const useCategory = () => useContext(CategoryContext);
