// React
import { useContext } from "react";

// Context
import { ProductContext } from "../context/ProductContext";

// ---------------------------------------IMPORTS---------------------------------------

// Hook to use product context
export const useProduct = () => useContext(ProductContext);
