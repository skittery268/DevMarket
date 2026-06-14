// React
import { useContext } from "react";

// Context
import { WishlistContext } from "../context/WishlistContext";

// ---------------------------------------IMPORTS---------------------------------------

// Hook to use wishlist context
export const useWishlist = () => useContext(WishlistContext);
