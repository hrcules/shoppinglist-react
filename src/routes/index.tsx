import { useAuth } from "../utils/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoutes() {
  const { signed, authLoading } = useAuth();

  if (authLoading) return null;

  return signed ? <Outlet /> : <Navigate to={"/login"} />;
}

export default PrivateRoutes;
