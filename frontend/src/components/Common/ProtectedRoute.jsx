import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return <div className="p-6 text-center">Checking authentication...</div>;
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

  return <Outlet />;
};

export default ProtectedRoute;
