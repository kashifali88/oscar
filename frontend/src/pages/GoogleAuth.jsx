import React from "react";
import { FcGoogle } from "react-icons/fc";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
} from "firebase/auth";

import { app } from "../../firebase";
import { useDispatch } from "react-redux";
import { googleLogin } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const GoogleAuth = () => {
  const dispatch = useDispatch();

  const handleGoogleAuth = async () => {
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();

      // Open Google login popup
      const result = await signInWithPopup(auth, provider);

      // Get Google user information
      const user = result.user;

      // Send user information to backend through Redux
      await dispatch(
        googleLogin({
          username: user.displayName,
          email: user.email,
          profile: user.photoURL,
          authProvider: "google"
        })
      ).unwrap();

      toast.success("Google authentication successful!");
    } catch (error) {
      console.log("Google authentication error:", error);
      toast.error(error.message || "Google authentication failed");
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleGoogleAuth}
        className="mt-2 px-6 py-4 rounded-lg bg-red-600 text-white w-full hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <FcGoogle size={24} />
        <span>CONTINUE WITH GOOGLE</span>
      </button>
    </div>
  );
};

export default GoogleAuth;