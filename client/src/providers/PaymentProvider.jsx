// React tools
import { useState, useCallback, useMemo } from "react";

// Payment context
import { PaymentContext } from "../context/PaymentContext";

// Services
import { fetchCreateCheckoutSession } from "../services/PaymentService";

// ---------------------------------------IMPORTS---------------------------------------

// Function to provide payment functions for any components
export const PaymentProvider = ({ children }) => {
    const [payment, setPayment] = useState(null);

    // Function to create a Stripe checkout session and redirect the user to it
    const createCheckoutSession = useCallback(async (userOrder) => {
        try {
            const res = await fetchCreateCheckoutSession(userOrder);

            setPayment(res.data.data.payment);

            // Redirect to Stripe hosted checkout page
            window.location.href = res.data.data.sessionUrl;

            return res.data.data;
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Memoize the context value so consumers only re-render on real changes.
    const value = useMemo(
        () => ({ payment, createCheckoutSession }),
        [payment, createCheckoutSession]
    );

    return (
        <PaymentContext.Provider value={value}>
            {children}
        </PaymentContext.Provider>
    );
};
