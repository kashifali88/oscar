import  { useState } from "react";
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
  const { error, loading } = useSelector((state) => state.auth)

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await dispatch(registerUser({username, email, password})).unwrap();
      toast.success("User registered successfully");
      navigate("/login")
    } catch (error) {
      dispatch(typeof error ===  "string" ? error : error.message || "register failed")
    }
  }


  return (
    <div className="w-full my-12 max-w-md md:max-w-xl bg-gray-100  flex mx-auto py-12 flex-col shadow-lg border rounded-xl border-gray-100 justify-center p-6 sm:p-8 md:p-10">
      <h1 className="text-center text-2xl font-semibold">Oscar</h1>
      <h1 className="font-bold text-center text-3xl mt-2">Welcome!</h1>
      <h3 className="text-center text-gray-600 mt-6">
        Please fill in your details to create an account
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 my-4">
        <p>Username</p>
        <input
          className="px-6 py-4 border border-gray-300 outline-none rounded-lg"
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e)=> setUserName(e.target.value) }
          id=""
        />
        <p>Email</p>
        <input
          className="px-6 py-4 border border-gray-300 outline-none rounded-lg"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id=""
        />
        <p>Password</p>
        <input
          className="px-6 py-4 border border-gray-300 outline-none rounded-lg"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id=""
        />
           {error && (
          <p role="alert" className="text-red-600 text-sm">
            {error}
          </p>
        )}
          <button
          type="submit"
          disabled={loading}
          className="mt-4 px-6 py-4 rounded-lg bg-black text-white disabled:opacity-50"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <GoogleAuth />

        <p className="text-center mt-2 text-sm text-gray-600">
          Already have an account?
          <Link to="/login" className="ml-2 text-sky-600 text-md">Login</Link>
        </p>
    </div>
  );
};

export default Register;
