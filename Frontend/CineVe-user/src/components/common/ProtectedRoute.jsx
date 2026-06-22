import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem("cineve_access_token");

  if (!user && !token) {
    return <Navigate to="/dang-nhap" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
