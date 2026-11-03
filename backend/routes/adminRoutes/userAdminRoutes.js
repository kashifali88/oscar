import express from "express";
import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { errorHandler } from "../../utils/errorHandler.js";
import { verifyToken } from "../../middleware/verifyToken.js"
import { verifyAdmin } from "../../middleware/verifyAdmin.js"
import User from "../../models/userModel.js";
import bcrypt from "bcryptjs";
const router = express.Router();


// get all users (admin only)
router.get("/", verifyToken,verifyAdmin, catchAsyncError(async(req, res, next) => {
const users = await User.find();
res.status(200).json({
    success: true,
    users
})
}));

// add new user (admin only)
router.post("/add", verifyToken, verifyAdmin, catchAsyncError(async (req, res, next) => {
    const { username, email, password, role } = req.body;
    if(!username || !email || !password || !role) return next(errorHandler(400, "Please fill all fields"));
    const user = await User.findOne({ email });
    if(user) return next(errorHandler(400, "User already exists"));
    // hash password
    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({ username, email, password: hashPassword, role});
    await newUser.save();
    res.status(201).json({success: true, message: "User created successfully", user: newUser})
}))

// update user (admin only)
router.put("/:id", verifyToken, verifyAdmin, catchAsyncError(async (req, res, next) => {
    const { username, email, password, role } = req.body;
    const user = await User.findById(req.params.id);
    if(!user) return next(errorHandler(404, "User not found"));

    // hash password if it is provided
    let hashPassword;
    if(password) {
        hashPassword = await bcrypt.hash(password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        username: username || user.username,
        email: email || user.email,
        password: hashPassword || user.password,
        role: role || user.role
    }, { new: true });
    res.status(200).json({success: true, message: "User updated successfully", user: updatedUser})

}))

// delete user (admin only)
router.delete("/:id", verifyToken, verifyAdmin, catchAsyncError(async(req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) return next(errorHandler(404, 'user not found'));
    res.status(200).json({success: true, message: "User deleted successfully", deletedUser: user} )
}))


export default router;