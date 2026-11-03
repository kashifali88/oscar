import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return <div className="p-6 text-center">Checking permissions...</div>;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
