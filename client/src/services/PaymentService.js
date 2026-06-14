// Axios
import { api } from "../api/Axios";

// ---------------------------------------IMPORTS---------------------------------------

// Service to create a Stripe checkout session, returns the session url to redirect to
export const fetchCreateCheckoutSession = async (userOrder) => {
    return await api.post("/payment/checkout", { userOrder });
};

// Note: /payment/webhook is called by Stripe (server-to-server), not from the client.
