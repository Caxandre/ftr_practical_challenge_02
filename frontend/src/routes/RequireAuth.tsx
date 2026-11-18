import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PrivateLayout } from "../components/layout/PrivateLayout";

export function RequireAuth() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <Navigate to="/" replace />;

  return <PrivateLayout />;
}
