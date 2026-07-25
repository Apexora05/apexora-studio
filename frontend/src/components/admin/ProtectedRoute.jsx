import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children, requireRole }) {
  const { user, ready } = useAuth();

  if (!ready || user === null) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">
        <div className="animate-pulse font-display text-2xl">Apexora<span className="text-brand">.</span></div>
      </div>
    );
  }
  if (!user) return <Navigate to="/admin" replace />;
  if (requireRole && user.role !== requireRole) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
        <div>
          <h2 className="font-display text-2xl">Access restricted</h2>
          <p className="mt-2 text-muted-foreground">This area requires {requireRole} privileges.</p>
        </div>
      </div>
    );
  }
  return children;
}
