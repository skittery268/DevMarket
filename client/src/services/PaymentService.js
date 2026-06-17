// Axios
import { api } from "../api/Axios";

// ---------------------------------------IMPORTS---------------------------------------

// Service to create a Stripe checkout session, returns the session url to redirect to.
// userInfo holds the delivery details the backend persists on the Payment and later
// copies onto the Order it creates after a successful payment.
export const fetchCreateCheckoutSession = async (userOrder, userInfo) => {
    return await api.post("/payment/checkout", { userOrder, userInfo });
};

// Note: /payment/webhook is called by Stripe (server-to-server), not from the client.
