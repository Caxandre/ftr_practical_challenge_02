import { useAuth } from "../hooks/useAuth";
import { Shell } from "../components/layout/Shell";
import { Login } from "../pages/Login";
import { Dashboard } from "../pages/Dashboard";

export function Root() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <Login />;

  return (
    <Shell>
      <Dashboard />
    </Shell>
  );
}
