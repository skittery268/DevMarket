// React router
import { Navigate } from "react-router";

// Hooks
import { useAuth } from "@/hooks/useAuth";

// Components
import Loader from "@/components/common/Loader";

// ---------------------------------------IMPORTS---------------------------------------

// Guards a route by role. `roles` is an array, e.g. ["admin"] or ["seller", "admin"].
const RoleRoute = ({ roles = [], children }) => {
  const { user, authLoading } = useAuth();

  if (authLoading) return <Loader full label="Checking access..." />;

  if (!user) return <Navigate to="/login" replace />;

  if (!roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
};

export default RoleRoute;
