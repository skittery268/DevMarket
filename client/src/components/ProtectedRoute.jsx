// React router
import { Navigate, useLocation } from "react-router";

// Hooks
import { useAuth } from "../hooks/useAuth"

// Components
import Loader from "./common/Loader";

// ---------------------------------------IMPORTS---------------------------------------

const ProtectedRoute = ({ children }) => {
    const { user, authLoading } = useAuth();
    const location = useLocation();

    // Wait for the auto-login (fetchMe) to resolve before deciding, so a refresh
    // on a protected page does not bounce to /login prematurely.
    if (authLoading) return <Loader full label="Loading your session..." />;

    return user ? children : <Navigate to="/login" replace state={{ from: location.pathname }} />;
};

export default ProtectedRoute;
