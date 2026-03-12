import { Navigate, Outlet, useLocation } from "react-router-dom";
import { hasAnyRole, isAuthenticated } from "../utils/auth";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
