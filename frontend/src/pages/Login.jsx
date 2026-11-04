
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

  // If already logged in, don't remain on the login page.
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

      // Use the user returned by the backend.
      const loggedInUser = data.user;

      // Don't redirect back to /login.
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
    <div className="w-full my-12 max-w-md md:max-w-xl flex mx-auto py-12 flex-col bg-gray-100 shadow-lg border rounded-xl border-gray-100 justify-center p-6 sm:p-8 md:p-10">
      <h1 className="text-center text-2xl font-semibold">
        Oscar
      </h1>

      <h2 className="font-bold text-center text-3xl mt-2">
        Hey there!
      </h2>

      <h3 className="text-center text-gray-600 mt-6">
        Enter your username or email and password to log in.
      </h3>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 my-4"
      >
        <label htmlFor="login">Email or username</label>

        <input
          className="px-6 py-4 border border-gray-300 outline-none rounded-lg"
          type="text"
          id="login"
          autoComplete="username"
          placeholder="Enter your email or username"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />

<div className="flex justify-between items-center">
  <label htmlFor="password">Password</label>

  <Link
    to="/forgot-password"
    className="text-sm text-sky-600 hover:underline"
  >
    Forgot Password?
  </Link>
</div>
        <input
          className="px-6 py-4 border border-gray-300 outline-none rounded-lg"
          type="password"
          id="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p role="alert" className="text-red-600 text-sm">
            {typeof error === "string" ? error : error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-6 py-4 rounded-lg bg-black text-white disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <GoogleAuth />
          </form>

        <p className="text-center mt-2 text-sm text-gray-600">
          Don't have an account?
          <Link
            to="/register"
            className="ml-2 text-sky-600 text-md"
          >
            Register
          </Link>
        </p>
    </div>
  );
};

export default Login;
