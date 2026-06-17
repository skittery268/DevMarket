// React
import { useContext } from "react";

// Context
import { ReviewContext } from "../context/ReviewContext";

// ---------------------------------------IMPORTS---------------------------------------

// Hook to use review context
export const useReview = () => useContext(ReviewContext);
