
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email.trim() }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send reset link");
      }

      toast.success(data.message || "Password reset link sent to your email!");
      setEmail("");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-12 p-8 bg-gray-100 rounded-xl shadow-lg">
      <h1 className="text-center text-2xl font-semibold">
        Oscar
      </h1>

      <h2 className="text-2xl font-bold text-center mt-4">
        Forgot Password?
      </h2>

      <p className="text-center text-gray-600 mt-3">
        Enter your email address and we'll send you a password reset link.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-5 py-4 border rounded-lg outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-4 rounded-lg disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p className="text-center mt-5">
        <Link to="/login" className="text-sky-600 hover:underline">
          Back to Login
        </Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
