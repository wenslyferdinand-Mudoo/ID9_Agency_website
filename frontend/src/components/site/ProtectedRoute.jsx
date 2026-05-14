import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading)
    return (
      <div className="min-h-screen grid place-items-center bg-ink-900 text-white/60 font-ui text-sm">
        Loading…
      </div>
    );
  if (!user) return <Navigate to="/admin/login" state={{ from: loc }} replace />;
  return children;
}
