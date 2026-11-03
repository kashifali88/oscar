import { errorHandler } from "../utils/errorHandler.js";
import User from "../models/userModel.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import nodemailer from "nodemailer"

// register

export const Register = catchAsyncError(async (req, res, next) => {
    const { username, email, password, profile } = req.body;

    if (!username || !email || !password) {
        return next(errorHandler(400, "All fields are required"));
    }

    const existingUser = await User.findOne({
        email: email.trim().toLowerCase(),
    });

    if (existingUser) {
        return next(errorHandler(400, "User already exists"));
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: hashPassword,
        profile,
    });

    // Generate JWT using _id
    const token = jwt.sign(
        {
            _id: newUser._id,
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: "7d",
        }
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set authentication cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userInfo = newUser.toObject();
    delete userInfo.password;

    res.status(201).json({
        success: true,
        message: "User created successfully",
        user: userInfo,
    });
});


// login
export const Login = catchAsyncError(async(req, res, next) => {
    const { login, password} = req.body;
    if(!login || !password) {
        return next(errorHandler(400, "Please fill all required fields"))
    }
    const user = await User.findOne({$or: [ {username:login}, {email:login} ]});
    if(!user) {
        return next(errorHandler(404, 'user not found'))
    }
    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        return next(errorHandler(402, 'Invalid credentials'))
    }
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '7d'});
    res.cookie("token", token, {
        httpOnly:true
    });
    const {password:pass, ...userInfo} = user._doc;
    res.status(200).json({success:true, message: "user logged in successfully", user:userInfo})

});

// logout user
export const logoutUser = catchAsyncError(async(req, res, next) => {
res.clearCookie("token");
res.status(200).json({success:true, message:"User logged out successfully"})   
})

// forgot-password
export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    if(!email) return next(errorHandler(400,'Please enter your email to reset your password'));
    const user = await User.findOne({email});
    if(!user) return next(errorHandler(404, 'User not found!'));
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Reset Password",
        text: `Please click on the following link to reset your password ${resetUrl}`
    }
    await transporter.sendMail(mailOptions)
    res.status(200).json({success:true, message: "Password reset link sent successful"})
}

// reset password
export const resetPassword = async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;
    if(!password) return next(errorHandler(400, 'Please enter new Password'))
    if(!token) return next(errorHandler(404, 'Token not found'));
 const user = await User.findOne({resetPasswordToken: token, resetPasswordExpire: {$gt: Date.now()}});
 if(!user) return next(errorHandler(400, 'Invalid token or token expired'))
    user.password = await bcrypt.hash(password, 10);
 user.resetPasswordToken = undefined;
 user.resetPasswordExpire = undefined;
 await user.save();
 res.status(201).json({success: true, message: "Password reset successful"})
}