// React tools
import { useState, useEffect, useCallback, useMemo } from "react";

// Wishlist context
import { WishlistContext } from "../context/WishlistContext";

// ---------------------------------------IMPORTS---------------------------------------

const STORAGE_KEY = "devmarket_wishlist";

const readInitial = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

// Provider for a fully client-side wishlist, mirrored into localStorage.
// Stores whole product objects so cards can render without an extra fetch.
export const WishlistProvider = ({ children }) => {
    const [items, setItems] = useState(readInitial);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            /* ignore */
        }
    }, [items]);

    const isInWishlist = useCallback(
        (productId) => items.some(p => p._id === productId),
        [items]
    );

    const removeFromWishlist = useCallback((productId) => {
        setItems(prev => prev.filter(p => p._id !== productId));
    }, []);

    const toggleWishlist = useCallback((product) => {
        if (!product?._id) return;

        setItems(prev => {
            if (prev.some(p => p._id === product._id)) {
                return prev.filter(p => p._id !== product._id);
            }

            return [...prev, product];
        });
    }, []);

    const clearWishlist = useCallback(() => setItems([]), []);

    // Memoize the context value so consumers (e.g. the header wishlist badge)
    // only re-render when the wishlist data actually changes.
    const value = useMemo(
        () => ({
            items,
            toggleWishlist,
            isInWishlist,
            removeFromWishlist,
            clearWishlist
        }),
        [items, toggleWishlist, isInWishlist, removeFromWishlist, clearWishlist]
    );

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};
