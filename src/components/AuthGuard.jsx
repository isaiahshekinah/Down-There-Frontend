
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContexts";

export default function AuthGuard() {
  const { loggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F8]">
        <p className="text-rose-600 font-medium">
          Loading Down There...
        </p>
      </div>
    );
  }

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
