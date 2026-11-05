
import { useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import GoogleAuth from "./GoogleAuth";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin" : "/", {
        replace: true,
      });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const identifier = login.trim();

    try {
      const data = await dispatch(
        loginUser({
          login: identifier,
          password,
        })
      ).unwrap();

      toast.success("Logged in successfully!");

      const loggedInUser = data.user;

      const requestedPath = location.state?.from?.pathname;
      const destination =
        requestedPath && requestedPath !== "/login"
          ? requestedPath
          : loggedInUser?.role === "admin"
            ? "/admin"
            : "/";

      navigate(destination, { replace: true });
    } catch (err) {
      toast.error(
        typeof err === "string"
          ? err
          : err?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto my-6 px-4">
      <div className="bg-white border border-gray-200 shadow-md rounded-xl p-5 sm:p-6">

        <h1 className="text-center text-xl font-bold text-[#ea2e0e]">
          Oscar
        </h1>

        <h2 className="text-center text-2xl font-bold mt-2 text-gray-900">
          Welcome Back!
        </h2>

        <p className="text-center text-sm text-gray-500 mt-1">
          Sign in to continue shopping.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 mt-5">

          <div>
            <label
              htmlFor="login"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email or username
            </label>

            <input
              className="w-full px-3 py-2.5 text-sm border border-gray-300 outline-none rounded-lg focus:ring-2 focus:ring-[#ea2e0e]/20 focus:border-[#ea2e0e]"
              type="text"
              id="login"
              autoComplete="username"
              placeholder="Enter your email or username"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-xs text-[#ea2e0e] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <input
              className="w-full px-3 py-2.5 text-sm border border-gray-300 outline-none rounded-lg focus:ring-2 focus:ring-[#ea2e0e]/20 focus:border-[#ea2e0e]"
              type="password"
              id="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p role="alert" className="text-red-600 text-xs">
              {typeof error === "string" ? error : error.message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full py-2.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-[#ea2e0e] transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <GoogleAuth />
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?
          <Link
            to="/register"
            className="ml-1 text-[#ea2e0e] font-medium hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
