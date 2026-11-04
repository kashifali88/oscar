import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';  
import authRouter from './routes/authRoute.js';
import cookieParser from 'cookie-parser';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import uploadRouter from './routes/upload.js';
import subscribeRouter from './routes/subscribeRoute.js';
import userAdminRoutes from './routes/adminRoutes/userAdminRoutes.js';
import productAdminRoute from './routes/adminRoutes/productAdminRoute.js';
import orderAdminRoute from './routes/adminRoutes/orderAdminRoute.js';
import checkoutRoute from "./routes/checkoutRoute.js"
import orderRoute from "./routes/orderRoute.js"
import userRouter from './routes/userRoute.js';
import adminDashboardRoute from "./routes/adminRoutes/adminDashboardRoute.js";

dotenv.config();


const server = express();
server.use(
  cors({
    origin: "http://localhost:5173",
    origin: "https://oscar-backend-opal.vercel.app/api",
    credentials: true,
  })
);
server.use(express.json());
server.use(cookieParser());


// API ROUTES
server.use("/api/auth", authRouter);
server.use("/api/products", productRouter);
server.use("/api/cart", cartRouter);
server.use("/api/upload", uploadRouter);
server.use("/api/subscribe", subscribeRouter);
server.use("/api/admin/users", userAdminRoutes);
server.use("/api/user", userRouter);
server.use("/api/admin/products", productAdminRoute);
server.use("/api/admin/orders", orderAdminRoute);
server.use("/api/checkout", checkoutRoute);
server.use("/api/order", orderRoute);
server.use("/api/admin/dashboard", adminDashboardRoute);
// error handler middleware
server.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "internal server error"
    res.status(status).json({
        success:false,
        message,
        ...(process.env.NOD_ENV === "development" && {stack: err.stack})
    })
})


// server port listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`server is running on PORT: ${PORT}`)
    connectDB();
})


