import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export function AdminRoute({ children }) {
  const { user, isAdmin } = useAppContext();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function ProtectedRoute({ children }) {
  const { user } = useAppContext();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
