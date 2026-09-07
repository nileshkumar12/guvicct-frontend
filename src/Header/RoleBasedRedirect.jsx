import { Navigate } from "react-router-dom";

const RoleBasedRedirect = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const token = localStorage.getItem("token");

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // Admin
  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Seller
  if (user.role === "seller") {
    return <Navigate to="/admin/dashboard" replace />;
  }


};

export default RoleBasedRedirect;