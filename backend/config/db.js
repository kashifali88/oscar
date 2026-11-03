import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Successfully connected MongoDB");
    } catch (error) {
        console.log("MongoDB connection failed", error);
        process.exit(1);
    }
} 


