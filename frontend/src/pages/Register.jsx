
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../store/slices/authSlice.js";
import { toast } from "react-toastify";
import GoogleAuth from "./GoogleAuth.jsx";

const Register = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error, loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        registerUser({ username, email, password })
      ).unwrap();

      toast.success("User registered successfully");
      navigate("/login");
    } catch (err) {
      toast.error(
        typeof err === "string"
          ? err
          : err?.message || "Registration failed. Please try again."
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
          Create Account
        </h2>

        <p className="text-center text-sm text-gray-500 mt-1">
          Join Oscar and start shopping today.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 mt-5">

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>

            <input
              className="w-full px-3 py-2.5 text-sm border border-gray-300 outline-none rounded-lg focus:ring-2 focus:ring-[#ea2e0e]/20 focus:border-[#ea2e0e]"
              type="text"
              id="username"
              placeholder="Enter your name"
              autoComplete="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>

            <input
              className="w-full px-3 py-2.5 text-sm border border-gray-300 outline-none rounded-lg focus:ring-2 focus:ring-[#ea2e0e]/20 focus:border-[#ea2e0e]"
              type="email"
              id="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>

            <input
              className="w-full px-3 py-2.5 text-sm border border-gray-300 outline-none rounded-lg focus:ring-2 focus:ring-[#ea2e0e]/20 focus:border-[#ea2e0e]"
              type="password"
              id="password"
              placeholder="Create a password"
              autoComplete="new-password"
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
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-3">
          <GoogleAuth />
        </div>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?
          <Link
            to="/login"
            className="ml-1 text-[#ea2e0e] font-medium hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
