import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minLength:4,                  
        maxLength: 32 
    },
    email: {
        type: String,
        required:true,
        maxLength: 32,
        unique:true,
        trim:true,
        match: [/.+@.+\..+/, "Please enter valid email"]
    },
    profile: {
        type: String,
        default: "img"
    },
    password: {
        type: String,
        required:true,
        minLength: 6,
    },
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer"
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    }

}, {timestamps: true})

const User = mongoose.model("User", userSchema);
export default User;




