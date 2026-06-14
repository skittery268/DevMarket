// React tools
import { useState, useEffect, useMemo, useCallback } from "react";

// Cart context
import { CartContext } from "../context/CartContext";

// ---------------------------------------IMPORTS---------------------------------------

const STORAGE_KEY = "devmarket_cart";

// Read the persisted cart once on init (survives reloads)
const readInitial = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

// Provider for a fully client-side cart, mirrored into localStorage.
// Shape: items = [{ product, quantity }]
export const CartProvider = ({ children }) => {
    const [items, setItems] = useState(readInitial);

    // Keep localStorage in sync with state
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            /* ignore quota / serialization errors */
        }
    }, [items]);

    const addToCart = useCallback((product, quantity = 1) => {
        if (!product?._id) return;

        setItems(prev => {
            const existing = prev.find(i => i.product._id === product._id);
            const stock = product?.universal?.stock ?? Infinity;

            if (existing) {
                const nextQty = Math.min(existing.quantity + quantity, stock);

                return prev.map(i =>
                    i.product._id === product._id ? { ...i, quantity: nextQty } : i
                );
            }

            return [...prev, { product, quantity: Math.min(quantity, stock) }];
        });
    }, []);

    const removeFromCart = useCallback((productId) => {
        setItems(prev => prev.filter(i => i.product._id !== productId));
    }, []);

    const updateQuantity = useCallback((productId, quantity) => {
        setItems(prev =>
            prev
                .map(i => (i.product._id === productId ? { ...i, quantity } : i))
                .filter(i => i.quantity > 0)
        );
    }, []);

    const clearCart = useCallback(() => setItems([]), []);

    const totalPrice = useMemo(
        () =>
            items.reduce(
                (sum, i) => sum + (Number(i.product?.universal?.price) || 0) * i.quantity,
                0
            ),
        [items]
    );

    const itemCount = useMemo(
        () => items.reduce((sum, i) => sum + i.quantity, 0),
        [items]
    );

    // Maps the cart into the shape the payment endpoint expects.
    const toUserOrder = useCallback(
        () => items.map(i => ({ id: i.product._id, quantity: i.quantity })),
        [items]
    );

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalPrice,
                itemCount,
                toUserOrder
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
