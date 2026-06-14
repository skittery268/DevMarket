// React
import { useContext } from "react";

// Context
import { SearchContext } from "../context/SearchContext";

// ---------------------------------------IMPORTS---------------------------------------

// Hook to use search context
export const useSearch = () => useContext(SearchContext);
