import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token"); // Check if user is logged in

  if (!token || !user) {
    return <Navigate to="/login" />; // Redirect if not logged in
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" />; // Redirect if not an admin
  }

  return <Outlet />;
};

export default ProtectedRoute;
