
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/reset-password/${token}`)
    .then((res) => {
      if (!res.ok) navigate("/login", { replace: true });
    });
}, [token, navigate]);

  return (
    <div className="w-full max-w-md mx-auto my-12 p-8 bg-gray-100 rounded-xl shadow-lg">
      <h1 className="text-center text-2xl font-semibold">
        Oscar
      </h1>

      <h2 className="text-2xl font-bold text-center mt-4">
        Reset Password
      </h2>

      <p className="text-center text-gray-600 mt-3">
        Enter your new password below.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 mt-6"
      >
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-5 py-4 border rounded-lg outline-none"
          minLength={8}
          required
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="px-5 py-4 border rounded-lg outline-none"
          minLength={8}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-4 rounded-lg disabled:opacity-50"
        >
          {loading ? "Updating..." : "Reset Password"}
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

export default ResetPassword;
