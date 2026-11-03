
import User from "../models/userModel.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import { errorHandler } from "../utils/errorHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Fetch logged-in user
export const fetchUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
        return next(errorHandler(404, "User not found"));
    }

    res.status(200).json({
        success: true,
        user,
    });
});

// Update logged-in user
export const updateUser = catchAsyncError(async (req, res, next) => {
    const body = req.body || {};

    const user = await User.findById(req.user._id);

    if (!user) {
        return next(errorHandler(404, "User not found"));
    }

    // Update username
    if (body.username !== undefined) {
        const username = body.username.trim();

        if (username.length < 4 || username.length > 32) {
            return next(
                errorHandler(400, "Username must be between 4 and 32 characters")
            );
        }

        user.username = username;
    }

    // Update email
    if (body.email !== undefined) {
        const email = body.email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return next(errorHandler(400, "Please enter a valid email"));
        }

        const existingUser = await User.findOne({
            email,
            _id: { $ne: user._id },
        });

        if (existingUser) {
            return next(errorHandler(400, "Email is already in use"));
        }

        user.email = email;
    }

    // Update profile image URL
    if (
        typeof body.profile === "string" &&
        body.profile.trim() !== ""
    ) {
        user.profile = body.profile.trim();
    }

    // Update password
    const changingPassword =
        body.currentPassword ||
        body.newPassword ||
        body.confirmPassword;

    if (changingPassword) {
        if (
            !body.currentPassword ||
            !body.newPassword ||
            !body.confirmPassword
        ) {
            return next(
                errorHandler(400, "Please fill all password fields")
            );
        }

        const isMatch = await bcrypt.compare(
            body.currentPassword,
            user.password
        );

        if (!isMatch) {
            return next(
                errorHandler(400, "Current password is incorrect")
            );
        }

        if (body.newPassword !== body.confirmPassword) {
            return next(
                errorHandler(400, "New passwords do not match")
            );
        }

        if (body.newPassword.length < 6) {
            return next(
                errorHandler(400, "Password must be at least 6 characters")
            );
        }

        user.password = await bcrypt.hash(body.newPassword, 10);
    }

    await user.save();

    // Generate new JWT token
  const token = jwt.sign(
    {
        _id: user._id,
        role: user.role,
    },
    process.env.JWT_SECRET_KEY,
    {
        expiresIn: "7d",
    }
);

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userInfo = user.toObject();
    delete userInfo.password;

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: userInfo,
    });
});

// Delete logged-in user
export const deleteUser = catchAsyncError(async (req, res, next) => {
    const { password } = req.body || {};

    if (!password) {
        return next(errorHandler(400, "Please enter your password"));
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        return next(errorHandler(404, "User not found"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return next(errorHandler(401, "Wrong password"));
    }

    await User.findByIdAndDelete(req.user._id);

    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    });

    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
});
