import { useAuth } from "../utils/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoutes() {
  const { signed } = useAuth();
  return signed ? <Outlet /> : <Navigate to={"/login"} />;
}

export default PrivateRoutes;
