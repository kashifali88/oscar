import { forgotPassword, Login, logoutUser, Register, resetPassword } from "../controllers/authController.js";
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { GoogleLogin } from "../controllers/authController.js";

const userRouter = new express.Router();

userRouter.post("/register", Register)
userRouter.post("/login", Login);
userRouter.post("/logout", verifyToken, logoutUser)
userRouter.post("/forgot-password",  forgotPassword);
userRouter.post("/reset-password/:token",  resetPassword);
userRouter.post("/google", GoogleLogin)



export default userRouter;


