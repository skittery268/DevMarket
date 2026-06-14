// React
import { useContext } from "react";

// Context
import { CartContext } from "../context/CartContext";

// ---------------------------------------IMPORTS---------------------------------------

// Hook to use cart context
export const useCart = () => useContext(CartContext);
