// React
import { useContext } from "react";

// Context
import { PaymentContext } from "../context/PaymentContext";

// ---------------------------------------IMPORTS---------------------------------------

// Hook to use payment context
export const usePayment = () => useContext(PaymentContext);
