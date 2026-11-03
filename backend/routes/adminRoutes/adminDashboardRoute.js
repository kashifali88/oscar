import express from "express";
import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  verifyAdmin,
  catchAsyncError(async (req, res) => {

    // Total orders
    const totalOrders = await Order.countDocuments();

    // Total products
    const totalProducts = await Product.countDocuments();

    // Revenue from successfully paid orders
    const revenueResult = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // Latest 5 orders
    const recentOrders = await Order.find()
      .populate("user", "name username email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      totalOrders,
      totalProducts,
      totalRevenue,
      recentOrders,
    });
  })
);

export default router;