// React router
import { Navigate } from "react-router";

// Hooks
import { useAuth } from "../hooks/useAuth"

// ---------------------------------------IMPORTS---------------------------------------

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    return user ? children : <Navigate to={"/login"} />;
};

export default ProtectedRoute;