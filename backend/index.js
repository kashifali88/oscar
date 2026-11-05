import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";

import authRouter from "./routes/authRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import uploadRouter from "./routes/upload.js";
import subscribeRouter from "./routes/subscribeRoute.js";
import userAdminRoutes from "./routes/adminRoutes/userAdminRoutes.js";
import productAdminRoute from "./routes/adminRoutes/productAdminRoute.js";
import orderAdminRoute from "./routes/adminRoutes/orderAdminRoute.js";
import checkoutRoute from "./routes/checkoutRoute.js";
import orderRoute from "./routes/orderRoute.js";
import userRouter from "./routes/userRoute.js";
import adminDashboardRoute from "./routes/adminRoutes/adminDashboardRoute.js";

dotenv.config();

const server = express();

// CORS must run before database middleware and API routes
server.use(
  cors({
    origin: "https://oscar-frontend-phi.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

server.use(express.json());
server.use(cookieParser());

// Connect to MongoDB before handling API requests
server.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

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

// Error handler
server.use((err, req, res, next) => {
  console.error("BACKEND ERROR:", err);

  const status = err.status || 500;

  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
});

// Export app for Vercel
export default server;

// Run locally only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}